import { useState, type FC } from "react";
import type { PropItem } from "@/interfaces/ui/documents/IDocumentComponents";
import { DocumentComponent } from "../components/DocumentComponent";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";
import { CustomAlert } from "@/components/ui/kit/CustomAlert";
import type { DocumentAlertState } from "@/interfaces/ui/documents/IDocumentAlert";

const DocumentAlert: FC = () => {
  const [state, setState] = useState<DocumentAlertState>({
    message: "Este es un mensaje de alerta",
    severity: "info",
    variant: "outlined",
    show: true,
  });

  const props: PropItem[] = [
    { name: "message", description: "Mensaje de la alerta", type: "string", defaultValue: `"Este es un mensaje de alerta"`, required: true },
    { name: "severity", description: "Tipo de alerta", type: `"success" | "warning" | "error" | "info"`, defaultValue: `"info"` },
    { name: "variant", description: "Estilo visual", type: `"standard" | "outlined" | "filled"`, defaultValue: `"outlined"` },
    { name: "show", description: "Mostrar / ocultar alerta", type: "boolean", defaultValue: "true" },
  ];

  return (
    <DocumentComponent
      name="Alert Personalizado"
      description="Componente de alerta reutilizable con variantes de estilo y severidad."
      props={props}
      controls={
        <div className="flex flex-col gap-4">
          <CustomInput
            label="Mensaje"
            value={state.message}
            onChange={(e) =>
              setState((p) => ({ ...p, message: e.target.value }))
            }
            fullWidth
          />

          <CustomSelected
            label="Severity"
            value={state.severity}
            onChange={(e) =>
              setState((p) => ({ ...p, severity: e.target.value as DocumentAlertState["severity"] }))
            }
            options={[
              { value: "success", label: "Success" },
              { value: "info", label: "Info" },
              { value: "warning", label: "Warning" },
              { value: "error", label: "Error" },
            ]}
            fullWidth
          />

          <CustomSelected
            label="Variant"
            value={state.variant}
            onChange={(e) =>
              setState((p) => ({ ...p, variant: e.target.value as DocumentAlertState["variant"] }))
            }
            options={[
              { value: "standard", label: "Standard" },
              { value: "outlined", label: "Outlined" },
              { value: "filled", label: "Filled" },
            ]}
            fullWidth
          />

          <CustomSwitch
            label="Mostrar alerta"
            checked={state.show}
            onChange={(e) =>
              setState((p) => ({ ...p, show: e.target.checked }))
            }
          />
        </div>
      }
      preview={<CustomAlert {...state} />}
    />
  );
};

export default DocumentAlert;
