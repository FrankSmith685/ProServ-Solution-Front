import type { FC } from "react";

const COLORS = [
  {
    title: "Primary",
    items: [
      { name: "Primary", className: "bg-primary" },
      { name: "Primary Soft", className: "bg-primary-soft" },
      { name: "Hover", className: "bg-primary-hover" },
      { name: "Alpha 8", className: "bg-primary-alpha-8 border border-primary" },
    ],
  },
  {
    title: "Secondary",
    items: [
      { name: "Secondary", className: "bg-secondary" },
      { name: "Soft", className: "bg-secondary-soft" },
      { name: "Hover", className: "bg-secondary-hover" },
      { name: "Alpha 8", className: "bg-secondary-alpha-8 border border-secondary" },
    ],
  },
  {
    title: "Terciary",
    items: [
      { name: "Terciary", className: "bg-terciary" },
      { name: "Soft", className: "bg-terciary-soft" },
      { name: "Hover", className: "bg-terciary-hover" },
      { name: "Alpha 8", className: "bg-terciary-alpha-8 border border-terciary" },
    ],
  },
  {
    title: "Warning",
    items: [
      { name: "Warning", className: "bg-warning" },
      { name: "Soft", className: "bg-warning-soft" },
      { name: "Hover", className: "bg-warning-hover" },
      { name: "Alpha 8", className: "bg-warning-alpha-8 border border-warning" },
    ],
  },
];

const DocumentColors: FC = () => {
  return (
    <div className="space-y-10">

      {COLORS.map(section => (
        <div key={section.title}>
          <p className="mb-3 text-sm font-semibold text-secondary">
            {section.title}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {section.items.map(color => (
              <div
                key={color.name}
                className="
                  rounded-xl p-4 h-28
                  flex flex-col justify-between
                  shadow-sm border border-primary-alpha-8
                "
              >
                <div className={`h-10 w-full rounded-md ${color.className}`} />

                <span className="text-xs text-terciary">
                  {color.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

    </div>
  );
};

export default DocumentColors;
