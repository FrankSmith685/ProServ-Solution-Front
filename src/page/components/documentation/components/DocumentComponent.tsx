import { useState, type FC } from "react";
import type { DocumentComponentProps } from "@/interfaces/ui/documents/IDocumentComponents";
import { CustomChip } from "@/components/ui/kit/CustomChip";
import { CustomTable } from "@/components/ui/kit/CustomTable";
import { HiChevronDown } from "react-icons/hi2";

interface SectionProps {
  title: string;
  open: boolean;
  toggle: () => void;
  children: React.ReactNode;
}

const Section: FC<SectionProps> = ({
  title,
  open,
  toggle,
  children,
}) => (
  <div
    className="
      rounded-2xl
      border border-border
      bg-surface-glass
      backdrop-blur-xl
      shadow-sm
      min-w-0
    "
  >
    <button
      onClick={toggle}
      className="
        w-full flex items-center justify-between
        px-5 py-4
        text-left
        hover:bg-muted
        transition
      "
    >
      <span className="text-sm font-semibold tracking-wide text-foreground">
        {title}
      </span>

      <HiChevronDown
        size={18}
        className={`
          transition-transform duration-200
          ${open ? "rotate-180 text-primary" : "text-muted-foreground"}
        `}
      />
    </button>

    {open && (
      <div
        className="
          px-6 pb-6
          animate-slide-in
          min-w-0 
          overflow-x-auto
        "
      >
        {children}
      </div>
    )}
  </div>
);

export const DocumentComponent: FC<DocumentComponentProps> = ({
  name,
  description,
  props,
  controls,
  preview,
}) => {
  const [showControls, setShowControls] = useState<boolean>(false);
  const [showProps, setShowProps] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(true);

  return (
    <div className="flex flex-col gap-8 min-w-0">

      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">

          <div className="h-2 w-2 rounded-full bg-primary shadow-orange" />

          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {name}
          </h2>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>

      {/* CONTROLS */}
      {controls && (
        <Section
          title="Controles"
          open={showControls}
          toggle={() => setShowControls((v) => !v)}
        >
          {controls}
        </Section>
      )}

      {/* PROPS */}
      <Section
        title="Props"
        open={showProps}
        toggle={() => setShowProps((v) => !v)}
      >
        {/* <div className="w-full overflow-x-auto"> */}
          <CustomTable
            headers={["Prop", "Tipo", "Default", "Descripción"]}
            // columnWidths={["22%", "26%", "14%", "38%"]}
            columnWidths={["200px", "150px", "150px", "300px"]}
            // columnWidths={["200px", "200px", "150px", "400px"]}
            // columnWidths={["max-content", "max-content", "150px", "400px"]}
            loading={false}
            data={props.map((prop) => [
              <div key={prop.name} className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground">
                  {prop.name}
                </span>

                {prop.required && (
                  <CustomChip
                    label="required"
                    variant="warning"
                    size="small"
                    selected
                  />
                )}
              </div>,

              <span className="font-mono text-xs text-muted-foreground">
                {prop.type}
              </span>,

              <span className="font-mono text-xs text-muted-foreground">
                {prop.defaultValue ?? "-"}
              </span>,

              <span className="text-sm text-muted-foreground">
                {prop.description}
              </span>,
            ])}
          />
        {/* </div> */}
      </Section>

      {/* PREVIEW */}
      <Section
        title="Vista previa"
        open={showPreview}
        toggle={() => setShowPreview((v) => !v)}
      >
        <div
          className="
            rounded-xl
            bg-surface
            border border-border

            p-10

            flex items-center justify-center

            min-h-[140px]
            max-h-[420px]
            overflow-auto

            relative
          "
        >
          {preview}
        </div>
      </Section>
    </div>
  );
};