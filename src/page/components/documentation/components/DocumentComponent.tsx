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

const Section: FC<SectionProps> = ({ title, open, toggle, children }) => (
  <div className="rounded-2xl bg-white/90 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,.06)]">
    <button
      onClick={toggle}
      className="w-full flex items-center justify-between px-5 py-4"
    >
      <span className="text-sm font-semibold tracking-wide text-gray-700">
        {title}
      </span>

      <HiChevronDown
        size={20}
        className={`transition-transform duration-300 text-primary ${
          open ? "rotate-180" : ""
        }`}
      />
    </button>

    {open && (
      <div
        className="
          px-6 pb-6
          animate-[accordion_0.25s_ease-out]
          max-h-105
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
    <div className="flex flex-col gap-8">

      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_rgba(0,0,0,.1)]" />
          <h2 className="text-xl font-bold tracking-tight">
            {name}
          </h2>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed">
          {description}
        </p>
      </div>

      {/* CONTROLS */}
      {controls && (
        <Section
          title="Controles"
          open={showControls}
          toggle={() => setShowControls(v => !v)}
        >
          {controls}
        </Section>
      )}

      {/* PROPS */}
      <Section
        title="Props"
        open={showProps}
        toggle={() => setShowProps(v => !v)}
      >
        <CustomTable
          headers={["Prop", "Tipo", "Default", "Descripción"]}
          columnWidths={["22%", "26%", "14%", "38%"]}
          loading={false}
          data={props.map(prop => [
            <div key={prop.name} className="flex items-center gap-2">
              <span className="font-semibold text-sm">{prop.name}</span>

              {prop.required && (
                <CustomChip
                  label="required"
                  variant="warning"
                  size="small"
                  selected
                />
              )}
            </div>,

            <span className="font-mono text-xs text-gray-700">
              {prop.type}
            </span>,

            <span className="font-mono text-xs text-gray-700">
              {prop.defaultValue ?? "-"}
            </span>,

            <span className="text-sm text-gray-700">
              {prop.description}
            </span>,
          ])}
        />
      </Section>

      {/* PREVIEW */}
      <Section
        title="Vista previa"
        open={showPreview}
        toggle={() => setShowPreview(v => !v)}
      >
        <div
          className="
            rounded-xl
            bg-gray-50
            border border-gray-200/60
            p-10
            flex
            items-center
            justify-center
            min-h-36
            max-h-105
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
