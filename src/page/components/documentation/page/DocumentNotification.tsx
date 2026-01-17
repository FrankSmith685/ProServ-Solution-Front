import { useState, type FC } from "react";
import { DocumentComponent } from "../components/DocumentComponent";
import type { PropItem } from "@/interfaces/ui/documents/IDocumentComponents";

import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomNotification } from "@/components/ui/feedback/CustomNotification";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";
import type { DocumentNotificationState } from "@/interfaces/ui/documents/IDocumentNotification";
import type { NotificationType } from "@/interfaces/ui/feedback/ICustomNotification";

const DocumentNotification: FC = () => {
  const [state, setState] = useState<DocumentNotificationState>({
    open: false,
    message: "Notificación de ejemplo",
    type: "success",
    duration: "4000",
  });

  const props: PropItem[] = [
    { name: "open", description: "Muestra la notificación", type: "boolean", required: true },
    { name: "message", description: "Texto a mostrar", type: "string", required: true },
    { name: "type", description: "Tipo de alerta", type: `"success" | "error" | "warning" | "info"`, defaultValue: `"info"` },
    { name: "duration", description: "Tiempo de cierre automático", type: "number", defaultValue: "4000" },
    { name: "onClose", description: "Evento al cerrar", type: "() => void", required: true },
    {
      name: "position",
      description: "Posición del snackbar",
      type: `{ vertical: "top" | "bottom"; horizontal: "left" | "center" | "right" }`,
      defaultValue: `{ top, center }`,
    },
  ];

  return (
    <DocumentComponent
      name="Custom Notification"
      description="Sistema de notificaciones moderno basado en MUI con Glass UI, animación suave y control total."
      props={props}
      controls={
        <div className="rounded-2xl border border-white/60 bg-linear-to-br from-white/95 to-primary/5 backdrop-blur shadow p-6">
          <p className="text-xs font-bold text-gray-500 mb-3">Controles</p>

          <div className="flex flex-col gap-4">
            <CustomInput
              label="Mensaje"
              value={state.message}
              onChange={(e) =>
                setState(p => ({ ...p, message: e.target.value }))
              }
              fullWidth
            />

            <CustomSelected
              label="Tipo de notificación"
              fullWidth
              value={state.type}
              onChange={(e) =>
                setState(p => ({ ...p, type: e.target.value as NotificationType }))
              }
              options={[
                { label: "Success", value: "success" },
                { label: "Error", value: "error" },
                { label: "Info", value: "info" },
                { label: "Warning", value: "warning" },
              ]}
            />

            <CustomInput
              label="Duración (ms)"
              value={state.duration}
              onChange={(e) =>
                setState(p => ({ ...p, duration: e.target.value }))
              }
              fullWidth
            />
          </div>
        </div>
      }
      preview={
        <>
          <CustomButton
            text="Mostrar Notificación"
            onClick={() => setState(p => ({ ...p, open: true }))}
          />

          <CustomNotification
            open={state.open}
            message={state.message}
            type={state.type}
            duration={Number(state.duration)}
            onClose={() => setState(p => ({ ...p, open: false }))}
          />
        </>
      }
    />
  );
};

export default DocumentNotification;
