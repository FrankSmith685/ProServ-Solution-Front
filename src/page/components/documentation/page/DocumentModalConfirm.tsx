import { useState, type FC } from "react";
import type { PropItem } from "@/interfaces/ui/documents/IDocumentComponents";

import { DocumentComponent } from "../components/DocumentComponent";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomModalConfirm } from "@/components/ui/overlay/CustomModalConfirm";
import type { DocumentModalConfirmState } from "@/interfaces/ui/documents/IDocumentModalConfirm";

const DocumentModalConfirm: FC = () => {
  const [state, setState] = useState<DocumentModalConfirmState>({
    isOpen: false,
    title: "¿Estás seguro?",
    message: "Esta acción no se puede deshacer.",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    width: "420px",
    allowBackdropClose: true,
    loading: false,
  });

  const props: PropItem[] = [
    { name: "isOpen", description: "Controla la visibilidad del modal", type: "boolean", required: true },
    { name: "onClose", description: "Función al cerrar", type: "() => void", required: true },
    { name: "onConfirm", description: "Función al confirmar", type: "() => void", required: true },
    { name: "title", description: "Título del modal", type: "string", defaultValue: `"¿Estás seguro?"` },
    { name: "message", description: "Mensaje del modal", type: "string", defaultValue: `"Esta acción no se puede deshacer."` },
    { name: "confirmText", description: "Texto botón confirmar", type: "string", defaultValue: `"Confirmar"` },
    { name: "cancelText", description: "Texto botón cancelar", type: "string", defaultValue: `"Cancelar"` },
    { name: "loading", description: "Estado de carga del botón confirmar", type: "boolean", defaultValue: "false" },
    { name: "children", description: "Contenido opcional extra", type: "ReactNode" },
    { name: "width", description: "Ancho del modal", type: "string", defaultValue: `"420px"` },
    { name: "allowBackdropClose", description: "Permite cerrar con backdrop", type: "boolean", defaultValue: `"true"` },
  ];

  return (
    <DocumentComponent
      name="Custom Modal Confirm"
      description="Modal de confirmación basado en el nuevo CustomModal. Incluye header sticky, Glass UI y footer configurable."
      props={props}
      controls={
        <div className="rounded-2xl border border-white/60 bg-linear-to-br from-white/95 to-primary/5 backdrop-blur shadow p-6">
          <p className="text-xs font-bold text-gray-500 mb-3">Controles</p>

          <div className="flex flex-col gap-4">
            <CustomInput
              label="Título"
              value={state.title}
              onChange={(e) =>
                setState(p => ({ ...p, title: e.target.value }))
              }
              fullWidth
            />

            <CustomInput
              label="Mensaje"
              value={state.message}
              onChange={(e) =>
                setState(p => ({ ...p, message: e.target.value }))
              }
              fullWidth
            />

            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                fullWidth
                label="Confirm Text"
                value={state.confirmText}
                onChange={(e) =>
                  setState(p => ({ ...p, confirmText: e.target.value }))
                }
              />

              <CustomInput
                fullWidth
                label="Cancel Text"
                value={state.cancelText}
                onChange={(e) =>
                  setState(p => ({ ...p, cancelText: e.target.value }))
                }
              />
            </div>

            <CustomInput
              fullWidth
              label="Width"
              value={state.width}
              onChange={(e) =>
                setState(p => ({ ...p, width: e.target.value }))
              }
            />

            <CustomSwitch
              label="Permitir cerrar con backdrop"
              checked={state.allowBackdropClose}
              onChange={(e) =>
                setState(p => ({
                  ...p,
                  allowBackdropClose: e.target.checked,
                }))
              }
            />

            <CustomSwitch
              label="Loading confirmar"
              checked={state.loading}
              onChange={(e) =>
                setState(p => ({ ...p, loading: e.target.checked }))
              }
            />
          </div>
        </div>
      }
      preview={
        <>
          <CustomButton
            text="Abrir Modal Confirm"
            onClick={() => setState(p => ({ ...p, isOpen: true }))}
          />

          <CustomModalConfirm
            isOpen={state.isOpen}
            onClose={() => setState(p => ({ ...p, isOpen: false }))}
            onConfirm={() => alert("Confirmado")}
            title={state.title}
            message={state.message}
            confirmText={state.confirmText}
            cancelText={state.cancelText}
            width={state.width}
            loading={state.loading}
            allowBackdropClose={state.allowBackdropClose}
          />
        </>
      }
    />
  );
};

export default DocumentModalConfirm;
