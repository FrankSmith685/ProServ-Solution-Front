import { useMemo, type FC } from "react";
import { Link, useLocation } from "react-router-dom";

import { useAppState } from "@/hooks/useAppState";

const cleanText = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value).trim();
  return "";
};

const getFirstAvailableText = (
  source: Record<string, unknown>,
  keys: string[]
): string => {
  for (const key of keys) {
    const value = cleanText(source[key]);
    if (value) return value;
  }
  return "";
};

const renderMultiline = (text: string): React.ReactNode => {
  return text.split(/\n{2,}/).map((paragraph, index) => {
    const lines = paragraph.split("\n");

    return (
      <p
        key={`paragraph-${index}`}
        className="text-sm leading-7 text-slate-700 sm:text-base"
      >
        {lines.map((line, lineIndex) => (
          <span key={`line-${index}-${lineIndex}`}>
            {line}
            {lineIndex < lines.length - 1 ? <br /> : null}
          </span>
        ))}
      </p>
    );
  });
};

const normalizeLegalContent = (text: string): string => {
  return text.replace(/\\n/g, "\n").trim();
};

const looksLikeHtml = (text: string): boolean => {
  return /<\/?[a-z][\s\S]*>/i.test(text);
};

const LegalContentPage: FC = () => {
  const { siteConfig, company } = useAppState();
  const { pathname } = useLocation();

  const siteConfigSource = (siteConfig ?? {}) as Record<string, unknown>;

  const isPrivacyPage = pathname.includes("politica-privacidad");

  const title = isPrivacyPage
    ? "Política de Privacidad"
    : "Términos y Condiciones";

  const content = useMemo(() => {
    const keys = isPrivacyPage
      ? [
          "privacy_policy",
          "politica_privacidad",
          "privacyPolicy",
          "politica_de_privacidad",
        ]
      : [
          "terms_and_conditions",
          "terminos_condiciones",
          "termsConditions",
          "terminos_y_condiciones",
        ];

    return getFirstAvailableText(siteConfigSource, keys);
  }, [isPrivacyPage, siteConfigSource]);

  const companyName = cleanText(company?.nombre) || "nuestra empresa";

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 md:py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Información legal
        </p>
        <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>

        {content ? (
          <div className="mt-6">
            {(() => {
              const normalizedContent = normalizeLegalContent(content);

              if (looksLikeHtml(normalizedContent)) {
                return (
                  <div
                    className="prose prose-slate max-w-none prose-p:text-slate-700 prose-li:text-slate-700"
                    dangerouslySetInnerHTML={{ __html: normalizedContent }}
                  />
                );
              }

              return <div className="space-y-5">{renderMultiline(normalizedContent)}</div>;
            })()}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
            Aún no se ha configurado el contenido de <strong>{title}</strong>
            para {companyName}. Por favor, vuelve a intentarlo más tarde.
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="text-sm font-semibold text-primary hover:underline"
            to="/"
          >
            Volver al inicio
          </Link>
          <Link
            className="text-sm font-semibold text-primary hover:underline"
            to="/contacto"
          >
            Contactar soporte
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LegalContentPage;
