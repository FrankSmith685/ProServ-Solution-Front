import { useState, type FC } from "react";
import type { BaseVariant } from "@/shared/design/types";
import type { PropItem } from "@/interfaces/ui/documents/IDocumentComponents";

import { DocumentComponent } from "../components/DocumentComponent";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";
import CustomSidebarItem from "@/components/ui/kit/CustomSidebarItem";
import type { DocumentSidebarItemState } from "@/interfaces/ui/documents/IDocumentSidebarItem";

const DocumentSidebarItem: FC = () => {
  const [state, setState] = useState<DocumentSidebarItemState>({
    label: "Dashboard",
    variant: "primary",
    size: "md",
    active: false,
    disabled: false,
  });

  const props: PropItem[] = [
    { name: "label", description: "Texto del item del sidebar", type: "string", required: true },
    { name: "active", description: "Indica si el item está activo", type: "boolean", defaultValue: "false" },
    { name: "disabled", description: "Deshabilita la interacción", type: "boolean", defaultValue: "false" },
    { name: "variant", description: "Variante visual", type: "BaseVariant", defaultValue: `"primary"` },
    { name: "size", description: "Tamaño del item", type: `"sm" | "md"`, defaultValue: `"md"` },
    { name: "onClick", description: "Evento click del item", type: "() => void" },
  ];

  return (
    <DocumentComponent
      name="Sidebar Item"
      description="Elemento del sidebar con soporte para estados activos, deshabilitados, tamaños y variantes."
      props={props}
      controls={
        <div
          className="
            rounded-2xl
            border border-white/60
            bg-linear-to-br from-white/95 to-primary/5
            backdrop-blur
            shadow-[0_12px_40px_rgba(0,0,0,.06)]
            p-6
          "
        >
          <p className="text-xs font-bold text-gray-500 mb-3">Controles</p>

          <div className="flex flex-col gap-4">
            <CustomInput
              label="Label"
              value={state.label}
              onChange={(e) =>
                setState(p => ({ ...p, label: e.target.value }))
              }
              fullWidth
            />

            <CustomSelected
              label="Variante"
              value={state.variant}
              onChange={(e) =>
                setState(p => ({
                  ...p,
                  variant: e.target.value as BaseVariant
                }))
              }
              options={[
                { value: "primary", label: "Primary" },
                { value: "secondary", label: "Secondary" },
                { value: "terciary", label: "Terciary" },
                { value: "warning", label: "Warning" },
              ]}
              fullWidth
            />

            <CustomSelected
              label="Size"
              value={state.size}
              onChange={(e) =>
                setState(p => ({
                  ...p,
                  size: e.target.value as "sm" | "md"
                }))
              }
              options={[
                { value: "sm", label: "Small" },
                { value: "md", label: "Medium" },
              ]}
              fullWidth
            />

            <CustomSwitch
              label="Active"
              checked={state.active}
              onChange={(e) =>
                setState(p => ({ ...p, active: e.target.checked }))
              }
            />

            <CustomSwitch
              label="Disabled"
              checked={state.disabled}
              onChange={(e) =>
                setState(p => ({ ...p, disabled: e.target.checked }))
              }
            />
          </div>
        </div>
      }
      preview={
        <ul className="space-y-1 w-full">
          <CustomSidebarItem
            label={state.label}
            variant={state.variant}
            size={state.size}
            active={state.active}
            disabled={state.disabled}
            onClick={() => console.log("Sidebar item clicked")}
          />
        </ul>
      }
    />
  );
};

export default DocumentSidebarItem;
