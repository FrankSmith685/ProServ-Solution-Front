from __future__ import annotations

from pathlib import Path

INPUT_MD = Path('docs/informe-proyecto.md')
OUTPUT_PDF = Path('docs/informe-proyecto.pdf')

PAGE_WIDTH = 595
PAGE_HEIGHT = 842
MARGIN_X = 50
MARGIN_Y = 50
FONT_SIZE = 11
LINE_HEIGHT = 16
MAX_CHARS = 86


def wrap_paragraph(text: str, width: int = MAX_CHARS) -> list[str]:
    words = text.split()
    if not words:
        return [""]

    lines: list[str] = []
    current = words[0]

    for word in words[1:]:
        candidate = f"{current} {word}"
        if len(candidate) <= width:
            current = candidate
        else:
            lines.append(current)
            current = word

    lines.append(current)
    return lines


def normalize_markdown_to_lines(md_text: str) -> list[str]:
    lines: list[str] = []

    for raw in md_text.splitlines():
        stripped = raw.strip()

        if not stripped:
            lines.append("")
            continue

        if stripped.startswith('# '):
            lines.append(stripped[2:].upper())
            lines.append('-' * min(len(stripped) - 2, 60))
            continue

        if stripped.startswith('## '):
            lines.append(stripped[3:])
            continue

        if stripped.startswith('### '):
            lines.append(stripped[4:])
            continue

        if stripped.startswith('- '):
            bullet_text = f"• {stripped[2:]}"
            lines.extend(wrap_paragraph(bullet_text))
            continue

        lines.extend(wrap_paragraph(stripped))

    return lines


def pdf_escape(text: str) -> str:
    return text.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')


def build_pdf_text_stream(lines: list[str]) -> list[str]:
    pages: list[str] = []
    y = PAGE_HEIGHT - MARGIN_Y
    current_page_ops = [f"BT /F1 {FONT_SIZE} Tf 1 0 0 1 {MARGIN_X} {y} Tm"]

    for line in lines:
        if y <= MARGIN_Y + LINE_HEIGHT:
            current_page_ops.append("ET")
            pages.append('\n'.join(current_page_ops))
            y = PAGE_HEIGHT - MARGIN_Y
            current_page_ops = [f"BT /F1 {FONT_SIZE} Tf 1 0 0 1 {MARGIN_X} {y} Tm"]

        safe = pdf_escape(line)
        current_page_ops.append(f"({safe}) Tj")
        current_page_ops.append(f"0 -{LINE_HEIGHT} Td")
        y -= LINE_HEIGHT

    current_page_ops.append("ET")
    pages.append('\n'.join(current_page_ops))
    return pages


def write_simple_pdf(output_path: Path, page_streams: list[str]) -> None:
    objects: list[bytes] = []

    # 1 Catalog
    objects.append(b"<< /Type /Catalog /Pages 2 0 R >>")

    # 2 Pages parent (kids filled later)
    kid_refs = ' '.join(f"{4 + i * 2} 0 R" for i in range(len(page_streams)))
    objects.append(
        f"<< /Type /Pages /Count {len(page_streams)} /Kids [{kid_refs}] >>".encode()
    )

    # 3 Font
    objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")

    # Per page: page object + content object
    for i, stream in enumerate(page_streams):
        page_obj_num = 4 + i * 2
        content_obj_num = page_obj_num + 1

        page_obj = (
            f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {PAGE_WIDTH} {PAGE_HEIGHT}] "
            f"/Resources << /Font << /F1 3 0 R >> >> /Contents {content_obj_num} 0 R >>"
        ).encode()
        objects.append(page_obj)

        stream_bytes = stream.encode('latin-1', errors='replace')
        content_obj = (
            f"<< /Length {len(stream_bytes)} >>\nstream\n".encode()
            + stream_bytes
            + b"\nendstream"
        )
        objects.append(content_obj)

    # Build file
    pdf = bytearray()
    pdf.extend(b"%PDF-1.4\n")
    offsets = [0]

    for idx, obj in enumerate(objects, start=1):
        offsets.append(len(pdf))
        pdf.extend(f"{idx} 0 obj\n".encode())
        pdf.extend(obj)
        pdf.extend(b"\nendobj\n")

    xref_offset = len(pdf)
    pdf.extend(f"xref\n0 {len(objects) + 1}\n".encode())
    pdf.extend(b"0000000000 65535 f \n")
    for off in offsets[1:]:
        pdf.extend(f"{off:010} 00000 n \n".encode())

    trailer = (
        f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\n"
        f"startxref\n{xref_offset}\n%%EOF\n"
    )
    pdf.extend(trailer.encode())

    output_path.write_bytes(pdf)


def main() -> None:
    md_text = INPUT_MD.read_text(encoding='utf-8')
    lines = normalize_markdown_to_lines(md_text)
    streams = build_pdf_text_stream(lines)
    write_simple_pdf(OUTPUT_PDF, streams)
    print(f"PDF generado en: {OUTPUT_PDF}")


if __name__ == '__main__':
    main()
