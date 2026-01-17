import { useState, type FC } from "react";
import type { PropItem } from "@/interfaces/ui/documents/IDocumentComponents";

import { DocumentComponent } from "../components/DocumentComponent";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";
import { CustomChip } from "@/components/ui/kit/CustomChip";
import type { DocumentChipState } from "@/interfaces/ui/documents/IDocumentChip";
import type { Variant } from "@/shared/design/types";
import type { ChipSize } from "@/interfaces/ui/kit/ICustomChip";

const DocumentChip: FC = () => {
  const [state, setState] = useState<DocumentChipState>({
    label: "Chip activo",
    variant: "primary",
    size: "medium",
    selected: false,
    clickable: true,
    deletable: false,
  });

  const props: PropItem[] = [
    { name: "label", description: "Texto del chip", type: "string", required: true },
    { name: "variant", description: "Variante visual", type: "Variant", defaultValue: `"primary"` },
    { name: "size", description: "Tamaño del chip", type: `"small" | "medium"`, defaultValue: `"medium"` },
    { name: "selected", description: "Estado seleccionado", type: "boolean", defaultValue: "false" },
    { name: "clickable", description: "Habilita interacción", type: "boolean", defaultValue: "true" },
    { name: "onDelete", description: "Acción eliminar", type: "() => void" },
  ];

  return (
    <DocumentComponent
      name="Chip Personalizado"
      description="Chip reutilizable con variantes, estados, selección y soporte outline."
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
          <p className="text-xs font-bold text-gray-500 mb-3">Controles</p>

          <div className="flex flex-col gap-4">
            <CustomInput
              label="Label"
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
                { value: "primary-outline", label: "Primary outline" },
                { value: "secondary-outline", label: "Secondary outline" },
                { value: "terciary-outline", label: "Terciary outline" },
                { value: "warning-outline", label: "Warning outline" },
              ]}
              fullWidth
            />

            <CustomSelected
              label="Size"
              value={state.size}
              onChange={(e) =>
                setState(p => ({ ...p, size: e.target.value as ChipSize }))
              }
              options={[
                { value: "small", label: "Small" },
                { value: "medium", label: "Medium" },
              ]}
              fullWidth
            />

            <CustomSwitch
              label="Selected"
              checked={state.selected}
              onChange={(e) =>
                setState(p => ({ ...p, selected: e.target.checked }))
              }
            />

            <CustomSwitch
              label="Clickable"
              checked={state.clickable}
              onChange={(e) =>
                setState(p => ({ ...p, clickable: e.target.checked }))
              }
            />

            <CustomSwitch
              label="Deletable"
              checked={state.deletable}
              onChange={(e) =>
                setState(p => ({ ...p, deletable: e.target.checked }))
              }
            />
          </div>
        </div>
      }
      preview={
        <CustomChip
          label={state.label}
          variant={state.variant}
          size={state.size}
          selected={state.selected}
          clickable={state.clickable}
          onDelete={state.deletable ? () => {} : undefined}
        />
      }
    />
  );
};

export default DocumentChip;
