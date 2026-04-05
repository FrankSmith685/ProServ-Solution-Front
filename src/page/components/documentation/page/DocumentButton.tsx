import { useState, type FC } from "react";
import type { PropItem } from "@/interfaces/ui/documents/IDocumentComponents";

import { DocumentComponent } from "../components/DocumentComponent";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import {
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  FONT_FAMILIES,
} from "@/constant/font";
import { FiSave } from "react-icons/fi";
import type { DocumentButtonState } from "@/interfaces/ui/documents/IDocumentButton";
import type { Variant } from "@/shared/design/types";
import type { ButtonSize } from "@/interfaces/ui/kit/ICustomButton";

const DocumentButton: FC = () => {
  const [state, setState] = useState<DocumentButtonState>({
    text: "Guardar cambios",
    variant: "primary",
    size: "lg",
    fullWidth: false,
    uppercase: false,
    disabled: false,
    loading: false,
    fontSize: DEFAULT_FONT_SIZE,
    fontFamily: DEFAULT_FONT_FAMILY,
    fontWeight: 600,
    withIcon: false,
  });

  const props: PropItem[] = [
    { name: "text", description: "Texto del botón", type: "string", defaultValue: `"Guardar cambios"`, required: true },
    { name: "variant", description: "Variante visual", type: "Variant", defaultValue: `"primary"` },
    { name: "size", description: "Tamaño del botón", type: `"sm" | "md" | "lg"`, defaultValue: `"lg"` },
    { name: "fullWidth", description: "Ocupa todo el ancho", type: "boolean", defaultValue: "false" },
    { name: "uppercase", description: "Texto en mayúsculas", type: "boolean", defaultValue: "false" },
    { name: "disabled", description: "Deshabilita el botón", type: "boolean", defaultValue: "false" },
    { name: "loading", description: "Estado de carga", type: "boolean", defaultValue: "false" },
    { name: "fontSize", description: "Tamaño de fuente", type: "string", defaultValue: `"auto"` },
    { name: "fontFamily", description: "Fuente del texto", type: "string", defaultValue: `"Inter"` },
    { name: "fontWeight", description: "Peso de fuente", type: "number", defaultValue: "600" },
    { name: "icon", description: "Ícono opcional", type: "ReactNode", defaultValue: "undefined" },
  ];

  return (
    <DocumentComponent
      name="Button Personalizado"
      description="Botón reutilizable con variantes modernas, estados y tipografía flexible."
      props={props}
      controls={
        <div
          className="
            rounded-2xl
            border border-border
            bg-surface-glass
            backdrop-blur-xl
            shadow-sm
            p-6
          "
        >
          <p className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
            Controles
          </p>

          <div className="flex flex-col gap-4">
            <CustomInput
              label="Texto del botón"
              value={state.text}
              onChange={(e) =>
                setState((p) => ({ ...p, text: e.target.value }))
              }
              fullWidth
            />

            <CustomSelected
              label="Variante"
              value={state.variant}
              onChange={(e) =>
                setState((p) => ({
                  ...p,
                  variant: e.target.value as Variant,
                }))
              }
              options={[
                { value: "primary", label: "Primary" },
                { value: "secondary", label: "Secondary" },
                { value: "terciary", label: "Terciary" },
                { value: "warning", label: "Warning" },
                { value: "error", label: "Error" },

                { value: "primary-outline", label: "Primary outline" },
                { value: "secondary-outline", label: "Secondary outline" },
                { value: "terciary-outline", label: "Terciary outline" },
                { value: "warning-outline", label: "Warning outline" },
                { value: "error-outline", label: "Error outline" },

                { value: "primary-outline-white", label: "White outline" },
              ]}
              fullWidth
            />

            <CustomSelected
              label="Tamaño"
              value={state.size}
              onChange={(e) =>
                setState((p) => ({
                  ...p,
                  size: e.target.value as ButtonSize,
                }))
              }
              options={[
                { value: "sm", label: "Small" },
                { value: "md", label: "Medium" },
                { value: "lg", label: "Large" },
              ]}
              fullWidth
            />

            <CustomInput
              label="Font size (ej: 14px)"
              value={state.fontSize === "default" ? "" : state.fontSize}
              onChange={(e) =>
                setState((p) => ({
                  ...p,
                  fontSize: e.target.value || "default",
                }))
              }
              placeholder="Default"
              fullWidth
            />

            <CustomSelected
              label="Font family"
              value={state.fontFamily}
              onChange={(e) =>
                setState((p) => ({
                  ...p,
                  fontFamily: String(e.target.value),
                }))
              }
              options={FONT_FAMILIES}
              fullWidth
            />

            <CustomInput
              label="Font weight"
              type="number"
              value={String(state.fontWeight)}
              onChange={(e) =>
                setState((p) => ({
                  ...p,
                  fontWeight: Number(e.target.value),
                }))
              }
              fullWidth
            />

            <CustomSwitch
              label="Full width"
              checked={state.fullWidth}
              onChange={(e) =>
                setState((p) => ({ ...p, fullWidth: e.target.checked }))
              }
            />

            <CustomSwitch
              label="Uppercase"
              checked={state.uppercase}
              onChange={(e) =>
                setState((p) => ({ ...p, uppercase: e.target.checked }))
              }
            />

            <CustomSwitch
              label="Loading"
              checked={state.loading}
              onChange={(e) =>
                setState((p) => ({ ...p, loading: e.target.checked }))
              }
            />

            <CustomSwitch
              label="Disabled"
              checked={state.disabled}
              onChange={(e) =>
                setState((p) => ({ ...p, disabled: e.target.checked }))
              }
            />

            <CustomSwitch
              label="Icono"
              checked={state.withIcon}
              onChange={(e) =>
                setState((p) => ({ ...p, withIcon: e.target.checked }))
              }
            />
          </div>
        </div>
      }
      preview={
        <div className="w-full p-6 rounded-xl">
          <div className="w-full max-w-md mx-auto">
            <CustomButton
              text={state.text}
              variant={state.variant}
              size={state.size}
              fullWidth={state.fullWidth}
              uppercase={state.uppercase}
              disabled={state.disabled}
              loading={state.loading}
              fontSize={
                state.fontSize === "default" ? undefined : state.fontSize
              }
              fontFamily={
                state.fontFamily === "default"
                  ? undefined
                  : state.fontFamily
              }
              fontWeight={state.fontWeight}
              icon={state.withIcon ? <FiSave size={18} /> : undefined}
            />
          </div>
        </div>
      }
    />
  );
};

export default DocumentButton;