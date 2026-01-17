import { useState, type FC } from "react";
import { DocumentComponent } from "../components/DocumentComponent";
import type { PropItem } from "@/interfaces/ui/documents/IDocumentComponents";

import { CustomSidebarSubMenu } from "@/components/ui/navigation/CustomSidebarSubMenu";
import { FaUser, FaCog, FaBell } from "react-icons/fa";
import type { DocumentSidebarSubMenuState } from "@/interfaces/ui/documents/IDocumentSidebarSubMenu";

const mockMenu = [
  { label: "Perfil", path: "/panel/cuenta", icon: FaUser },
  { label: "Configuración", path: "/panel/config", icon: FaCog },
  { label: "Notificaciones", path: "/panel/notificaciones", icon: FaBell },
];

const DocumentSidebarSubMenu: FC = () => {
  const [state] = useState<DocumentSidebarSubMenuState>({
    title: "Mi Cuenta",
  });

  const props: PropItem[] = [
    { name: "title", description: "Título del menú", type: "string", defaultValue: `"Mi Cuenta"` },
    { name: "titleIcon", description: "Icono del título", type: "IconType" },
    { name: "menuData", description: "Opciones del menú", type: "SidebarSubMenuItem[]", required: true },
    { name: "fixed", description: "Fija el submenú en pantalla", type: "boolean", defaultValue: "false" },
    { name: "onItemClick", description: "Evento al dar click", type: "(path: string) => void" },
  ];

  return (
    <DocumentComponent
      name="Custom Sidebar SubMenu"
      description="Sub menú lateral compacto para navegación dentro del panel del usuario."
      props={props}
      preview={
        <CustomSidebarSubMenu
          title={state.title}
          titleIcon={FaUser}
          menuData={mockMenu}
          onItemClick={() => console.log("Go to:")}
        />
      }
    />
  );
};

export default DocumentSidebarSubMenu;
