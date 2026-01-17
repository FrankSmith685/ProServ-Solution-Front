import { useState, type FC } from "react";
import type { PropItem } from "@/interfaces/ui/documents/IDocumentComponents";

import { DocumentComponent } from "../components/DocumentComponent";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";
import { CustomCheckbox } from "@/components/ui/kit/CustomCheckbox";
import {
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  FONT_FAMILIES,
} from "@/constant/font";
import type { DocumentCheckboxState } from "@/interfaces/ui/documents/IDocumentCheckBox";
import type { Variant } from "@/shared/design/types";
import type { CheckboxSize } from "@/interfaces/ui/kit/ICustomCheckbox";

const DocumentCheckbox: FC = () => {
  const [state, setState] = useState<DocumentCheckboxState>({
    label: "Acepto los términos",
    checked: false,
    variant: "primary",
    disabled: false,
    size: "lg",
    fontSize: DEFAULT_FONT_SIZE,
    fontFamily: DEFAULT_FONT_FAMILY,
  });

  const props: PropItem[] = [
    { name: "label", description: "Texto del checkbox", type: "string", defaultValue: `"Acepto los términos"`, required: true },
    { name: "checked", description: "Estado del checkbox", type: "boolean", defaultValue: "false", required: true },
    { name: "variant", description: "Variante visual", type: "Variant", defaultValue: `"primary"` },
    { name: "size", description: "Tamaño del checkbox", type: `"md" | "lg"`, defaultValue: `"lg"` },
    { name: "fontSize", description: "Tamaño de fuente", type: "string", defaultValue: `"auto"` },
    { name: "fontFamily", description: "Familia tipográfica", type: "string", defaultValue: `"Arial"` },
    { name: "disabled", description: "Deshabilita el checkbox", type: "boolean", defaultValue: "false" },
    { name: "onChange", description: "Evento al cambiar estado", type: "(event: React.ChangeEvent<HTMLInputElement>) => void", required: true },
  ];

  return (
    <DocumentComponent
      name="Checkbox Personalizado"
      description="Checkbox reutilizable con variantes, tipografía y tamaño responsive."
      props={props}
      controls={
        <div className="
          rounded-2xl
          border border-white/60
          bg-linear-to-br from-white/95 to-primary/5
          backdrop-blur
          shadow-[0_10px_30px_rgba(0,0,0,.06)]
          p-6
        ">
          <p className="text-xs font-bold text-gray-500 mb-3">
            Controles
          </p>

          <div className="flex flex-col gap-4">
            <CustomInput
              label="Texto del checkbox"
              value={state.label}
              onChange={(e) => setState(p => ({ ...p, label: e.target.value }))}
              fullWidth
            />

            <CustomSelected
              label="Variante"
              value={state.variant}
              onChange={(e) =>
                setState(p => ({ ...p, variant: e.target.value as Variant }))
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
              label="Tamaño"
              value={state.size}
              onChange={(e) =>
                setState(p => ({ ...p, size: e.target.value as CheckboxSize }))
              }
              options={[
                { value: "md", label: "Medium" },
                { value: "lg", label: "Large" },
              ]}
              fullWidth
            />

            <CustomInput
              label="Font size (ej: 14px)"
              value={state.fontSize === "default" ? "" : state.fontSize}
              onChange={(e) =>
                setState(p => ({ ...p, fontSize: e.target.value || "default" }))
              }
              placeholder="Default"
              fullWidth
            />

            <CustomSelected
              label="Font family"
              value={state.fontFamily}
              onChange={(e) =>
                setState(p => ({ ...p, fontFamily: String(e.target.value) }))
              }
              options={FONT_FAMILIES}
              fullWidth
            />

            <CustomSwitch
              label="Checked"
              checked={state.checked}
              onChange={(e) =>
                setState(p => ({ ...p, checked: e.target.checked }))
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
        <CustomCheckbox
          label={state.label}
          checked={state.checked}
          onChange={(e) =>
            setState(p => ({ ...p, checked: e.target.checked }))
          }
          variant={state.variant}
          size={state.size}
          disabled={state.disabled}
          fontSize={state.fontSize === "default" ? undefined : state.fontSize}
          fontFamily={state.fontFamily === "default" ? undefined : state.fontFamily}
        />
      }
    />
  );
};

export default DocumentCheckbox;
