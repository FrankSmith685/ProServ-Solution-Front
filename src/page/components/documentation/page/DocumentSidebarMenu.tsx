import { useState, type FC } from "react";
import { DocumentComponent } from "../components/DocumentComponent";
import type { PropItem } from "@/interfaces/ui/documents/IDocumentComponents";

import { CustomSidebarMenu } from "@/components/ui/navigation/CustomSidebarMenu";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";
import type { DocumentSidebarMenuState } from "@/interfaces/ui/documents/IDocumentSidebarMenu";

const mockItems = [
  { label: "Mi cuenta", path: "/panel/cuenta" },
  { label: "Actividad", path: "/panel/actividad" },
  { label: "Avisos", path: "/panel/avisos" },
];

const DocumentSidebarMenu: FC = () => {
  const [state, setState] = useState<DocumentSidebarMenuState>({
    open: true,
  });

  const props: PropItem[] = [
    { name: "items", description: "Items del menú", type: "SidebarMenuItem[]", required: true },
    { name: "currentPath", description: "Ruta activa", type: "string", required: true },
    { name: "isUserMenuOpen", description: "Estado apertura", type: "boolean", defaultValue: "false" },
    { name: "userType", description: "Código tipo usuario", type: "number" },
    { name: "hasService", description: "Tiene servicio", type: "boolean" },
    { name: "hasPlan", description: "Tiene plan", type: "boolean" },
  ];

  return (
    <DocumentComponent
      name="Custom Sidebar Menu"
      description="Menú inteligente de usuario con agrupación automática, acceso dinámico y UI moderna."
      props={props}
      controls={
        <CustomSwitch
          label="Menu abierto"
          checked={state.open}
          onChange={(e) =>
            setState(p => ({ ...p, open: e.target.checked }))
          }
        />
      }
      preview={
        <CustomSidebarMenu
          items={mockItems}
          currentPath="/panel/actividad"
          isUserMenuOpen={state.open}
        />
      }
    />
  );
};

export default DocumentSidebarMenu;
