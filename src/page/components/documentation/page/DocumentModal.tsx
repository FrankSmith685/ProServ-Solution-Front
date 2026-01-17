import { useState, type FC } from "react";
import type { PropItem } from "@/interfaces/ui/documents/IDocumentComponents";

import { DocumentComponent } from "../components/DocumentComponent";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomModal } from "@/components/ui/overlay/CustomModal";
import type { DocumentModalState } from "@/interfaces/ui/documents/IDocumentModal";

const DocumentModal: FC = () => {
  const [state, setState] = useState<DocumentModalState>({
    isOpen: false,
    title: "Modal Demo",
    width: "820px",
    height: "auto",
    closeButton: true,
    allowBackdropClose: true,
  });

  const props: PropItem[] = [
    { name: "isOpen", description: "Controla la visibilidad del modal", type: "boolean", required: true },
    { name: "onClose", description: "Función al cerrar", type: "() => void", required: true },
    { name: "title", description: "Título del modal", type: "string", defaultValue: `"Modal"` },
    { name: "children", description: "Contenido del modal", type: "ReactNode" },
    { name: "footer", description: "Footer personalizado", type: "ReactNode" },
    { name: "width", description: "Ancho del modal", type: "string", defaultValue: `"820px"` },
    { name: "height", description: "Alto del modal", type: "string", defaultValue: `"auto"` },
    { name: "closeButton", description: "Muestra el botón cerrar del header", type: "boolean", defaultValue: "true" },
    { name: "allowBackdropClose", description: "Permite cerrar con backdrop o ESC", type: "boolean", defaultValue: "true" },
    { name: "mainClassName", description: "Clase extra para el wrapper principal", type: "string" },
    { name: "containerClassName", description: "Clase extra para el contenedor interno", type: "string" },
  ];

  return (
    <DocumentComponent
      name="Custom Modal"
      description="Modal reutilizable con Glass UI, header sticky, footer configurable, animación Slide y comportamiento responsive inteligente."
      props={props}
      controls={
        <div className="rounded-2xl border border-white/60 bg-linear-to-br from-white/95 to-primary/5 backdrop-blur shadow-[0_10px_30px_rgba(0,0,0,.06)] p-6">
          <p className="text-xs font-bold text-gray-500 mb-3">Controles</p>

          <div className="flex flex-col gap-4">
            <CustomInput
              label="Título"
              value={state.title}
              onChange={(e) => setState(p => ({ ...p, title: e.target.value }))}
              fullWidth
            />

            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Width"
                value={state.width}
                onChange={(e) => setState(p => ({ ...p, width: e.target.value }))}
                fullWidth
              />

              <CustomInput
                label="Height"
                value={state.height}
                onChange={(e) => setState(p => ({ ...p, height: e.target.value }))}
                fullWidth
              />
            </div>

            <CustomSwitch
              label="Mostrar botón cerrar"
              checked={state.closeButton}
              onChange={(e) =>
                setState(p => ({ ...p, closeButton: e.target.checked }))
              }
            />

            <CustomSwitch
              label="Permitir cerrar con backdrop"
              checked={state.allowBackdropClose}
              onChange={(e) =>
                setState(p => ({ ...p, allowBackdropClose: e.target.checked }))
              }
            />
          </div>
        </div>
      }
      preview={
        <>
          <CustomButton text="Abrir Modal" onClick={() => setState(p => ({ ...p, isOpen: true }))} />

          <CustomModal
            isOpen={state.isOpen}
            onClose={() => setState(p => ({ ...p, isOpen: false }))}
            title={state.title}
            width={state.width || undefined}
            height={state.height || undefined}
            closeButton={state.closeButton}
            allowBackdropClose={state.allowBackdropClose}
            footer={
              <div className="flex justify-end gap-3">
                <CustomButton
                  text="Cancelar"
                  variant="secondary-outline"
                  onClick={() => setState(p => ({ ...p, isOpen: false }))}
                />
                <CustomButton
                  text="Confirmar"
                  variant="primary"
                  onClick={() => alert("Acción confirmada")}
                />
              </div>
            }
          >
            <p className="text-sm text-gray-700">
              Este es un modal con diseño moderno, header sticky, footer fijo y comportamiento totalmente responsivo.
              En pantallas pequeñas se convierte en fullscreen estilo aplicación móvil.
            </p>
          </CustomModal>
        </>
      }
    />
  );
};

export default DocumentModal;
