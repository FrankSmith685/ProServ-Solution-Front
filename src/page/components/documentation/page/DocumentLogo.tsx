import { useState, type FC } from "react";
import type { PropItem } from "@/interfaces/ui/documents/IDocumentComponents";

import { DocumentComponent } from "../components/DocumentComponent";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { Logo } from "@/components/ui/media/CustomLogo";
import type { DocumentLogoState } from "@/interfaces/ui/documents/IDocumentLogo";

const DocumentLogo: FC = () => {
  const [state, setState] = useState<DocumentLogoState>({
    isActive: false,
    width: "150px",
    navigateTo: "/",
  });

  const props: PropItem[] = [
    { name: "isActive", description: "Cambia logo principal / activo", type: "boolean", defaultValue: "false" },
    { name: "width", description: "Ancho del logo", type: "number | string", defaultValue: `"150px"` },
    { name: "height", description: "Alto del logo", type: "number | string", defaultValue: `"auto"` },
    { name: "navigateTo", description: "Ruta de navegación al hacer click", type: "string", defaultValue: `"/"` },
    { name: "clickable", description: "Habilita navegación", type: "boolean", defaultValue: "true" },
  ];

  return (
    <DocumentComponent
      name="Logo"
      description="Componente de logo reutilizable con estado activo, navegación, tema visual y accesibilidad."
      props={props}
      controls={
        <div className="rounded-2xl border border-white/60 bg-linear-to-br from-white/95 to-primary/5 backdrop-blur p-6 shadow-[0_10px_30px_rgba(0,0,0,.06)]">
          <p className="text-xs font-bold text-gray-500 mb-3">Controles</p>

          <div className="flex flex-col gap-4">
            <CustomSwitch
              label="Activo"
              checked={state.isActive}
              onChange={(e) =>
                setState(p => ({ ...p, isActive: e.target.checked }))
              }
            />

            <CustomInput
              label="Width"
              value={state.width}
              onChange={(e) =>
                setState(p => ({ ...p, width: e.target.value }))
              }
              fullWidth
            />

            <CustomInput
              label="Navigate to"
              value={state.navigateTo}
              onChange={(e) =>
                setState(p => ({ ...p, navigateTo: e.target.value }))
              }
              fullWidth
            />
          </div>
        </div>
      }
      preview={
        <Logo
          isActive={state.isActive}
          width={state.width}
          navigateTo={state.navigateTo}
        />
      }
    />
  );
};

export default DocumentLogo;
