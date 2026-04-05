import {
  FaKey,
  FaEnvelope,
  FaTrash,
  FaLink,
} from "react-icons/fa";
import type { SidebarSubMenuLink } from "@/interfaces/ui/navigation/ICustomSidebarSubMenu";
import type { LoginProvider } from "@/interfaces/hook/IUseRequests";

export const getSecurityMenu = (
  metodosLogin: LoginProvider[]
): readonly SidebarSubMenuLink[] => {
  const items: SidebarSubMenuLink[] = [];

  const hasCorreo = metodosLogin.includes("correo");

  if (hasCorreo) {
    items.push(
      {
        type: "link",
        label: "Contraseña",
        path: "/panel/mi-cuenta/seguridad/password",
        icon: FaKey,
      },
      {
        type: "link",
        label: "Correo",
        path: "/panel/mi-cuenta/seguridad/correo",
        icon: FaEnvelope,
      }
    );
  }

  items.push(
    {
      type: "link",
      label: "Cuentas vinculadas",
      path: "/panel/mi-cuenta/seguridad/cuentas",
      icon: FaLink,
    },
    {
      type: "link",
      label: "Eliminar cuenta",
      path: "/panel/mi-cuenta/seguridad/eliminar",
      icon: FaTrash,
    }
  );

  return items;
};
