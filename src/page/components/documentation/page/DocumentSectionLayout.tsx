import { useState, type FC } from "react";
import type { PropItem } from "@/interfaces/ui/documents/IDocumentComponents";

import { DocumentComponent } from "../components/DocumentComponent";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { SectionLayout } from "@/components/ui/layout/ComponentSectionLayout";
import type { DocumentSectionLayoutState } from "@/interfaces/ui/documents/IDocumentSectionLayout";

const DocumentSectionLayout: FC = () => {
  const [state, setState] = useState<DocumentSectionLayoutState>({
    title: "Perfil de usuario",
    subTitle: "Configuración y datos personales",
    showSubtitle: true,
    menuOpen: false,
    showMenuControl: true,
    showBack: true,
  });

  const props: PropItem[] = [
    { name: "title", description: "Título principal", type: "string", defaultValue: `"Perfil de usuario"`, required: true },
    { name: "subTitle", description: "Subtítulo opcional", type: "string", defaultValue: `"Configuración y datos personales"` },
    { name: "children", description: "Contenido del layout", type: "ReactNode", defaultValue: "—" },
    { name: "menuOpen", description: "Estado del menú lateral", type: "boolean", defaultValue: "false" },
    { name: "onToggleMenu", description: "Función para abrir/cerrar menú", type: "() => void", defaultValue: "undefined" },
    { name: "onBack", description: "Función para botón Atrás", type: "() => void", defaultValue: "undefined" },
  ];

  return (
    <DocumentComponent
      name="Section Layout"
      description="Layout reutilizable para páginas internas con título, subtítulo, botón de menú y acción de regresar."
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
              label="Título"
              value={state.title}
              onChange={(e) =>
                setState(p => ({ ...p, title: e.target.value }))
              }
              fullWidth
            />

            <CustomSwitch
              label="Mostrar Subtítulo"
              checked={state.showSubtitle}
              onChange={(e) =>
                setState(p => ({ ...p, showSubtitle: e.target.checked }))
              }
            />

            {state.showSubtitle && (
              <CustomInput
                label="Subtítulo"
                value={state.subTitle}
                onChange={(e) =>
                  setState(p => ({ ...p, subTitle: e.target.value }))
                }
                fullWidth
              />
            )}

            <CustomSwitch
              label="Mostrar botón menú"
              checked={state.showMenuControl}
              onChange={(e) =>
                setState(p => ({ ...p, showMenuControl: e.target.checked }))
              }
            />

            <CustomSwitch
              label="Mostrar botón atrás"
              checked={state.showBack}
              onChange={(e) =>
                setState(p => ({ ...p, showBack: e.target.checked }))
              }
            />
          </div>
        </div>
      }
      preview={
        <SectionLayout
          title={state.title}
          subTitle={state.showSubtitle ? state.subTitle : undefined}
          menuOpen={state.menuOpen}
          onToggleMenu={
            state.showMenuControl
              ? () => setState(p => ({ ...p, menuOpen: !p.menuOpen }))
              : undefined
          }
          onBack={
            state.showBack
              ? () => alert("Volver accionado")
              : undefined
          }
        >
          <div className="p-6 rounded-xl bg-white border shadow-sm">
            <p className="text-gray-600 text-sm">
              Aquí iría el contenido de la página dentro del layout.
            </p>
          </div>
        </SectionLayout>
      }
    />
  );
};

export default DocumentSectionLayout;
