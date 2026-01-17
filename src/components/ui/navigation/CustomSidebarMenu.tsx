import { useMemo, type FC } from "react";
import { NavLink } from "react-router-dom";
import {
  FaChevronRight,
  FaClipboardList,
  FaRegEdit,
} from "react-icons/fa";

import type {
  CustomSidebarMenuProps,
  SidebarMenuItems,
} from "@/interfaces/ui/navigation/ICustomSidebarMenu";

export const CustomSidebarMenu: FC<CustomSidebarMenuProps> = ({
  items,
  currentPath,
  isUserMenuOpen = false,
  userType,
  hasService,
  hasPlan,
}) => {
  const canViewMenus = userType !== 4;

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const label = item.label.toLowerCase();

      if (userType === 4) {
        if (
          label.includes("avisos") ||
          label.includes("capacitaciones") ||
          label.includes("planes")
        ) {
          return false;
        }
      }

      if (hasService === false && label.includes("planes")) {
        return false;
      }

      return (
        item.isActive !== false ||
        label.includes("actividad") ||
        label.includes("cuenta")
      );
    });
  }, [items, userType, hasService]);

  const grouped = useMemo(() => {
    const groups: Record<string, SidebarMenuItems[]> = {};

    filtered.forEach((item) => {
      const match = item.path.match(/^\/panel\/[^/]+/);
      const base = match?.[0] ?? "otros";

      if (!groups[base]) groups[base] = [];
      groups[base].push(item);
    });

    if (canViewMenus) {
      if (!groups["/panel/avisos"]) {
        groups["/panel/avisos"] = [
          {
            label: "Mis Avisos",
            path: "/panel/avisos",
            icon: FaClipboardList,
          },
        ];
      }

      if (hasPlan && !groups["/panel/capacitaciones"]) {
        groups["/panel/capacitaciones"] = [
          {
            label: "Mi Capacitación",
            path: "/panel/capacitaciones",
            icon: FaClipboardList,
          },
        ];
      }

      if (hasService && !groups["/panel/planes"]) {
        groups["/panel/planes"] = [
          {
            label: "Mis Planes",
            path: "/panel/planes",
            icon: FaClipboardList,
          },
        ];
      }
    }

    if (currentPath.startsWith("/panel/publicador")) {
      if (!groups["/panel/publicador"]) groups["/panel/publicador"] = [];
      groups["/panel/publicador"].push({
        label: "Mi Publicación",
        path: "/panel/publicador",
        icon: FaRegEdit,
      });
    }

    return groups;
  }, [filtered, currentPath, canViewMenus, hasPlan, hasService]);

  const mainItems = useMemo(() => {
    return Object.values(grouped).map((list) => {
      return (
        list.find((i) =>
          [
            "cuenta",
            "actividad",
            "avisos",
            "capacitaciones",
            "planes",
            "publicación",
          ].some((t) => i.label.toLowerCase().includes(t))
        ) || list[0]
      );
    });
  }, [grouped]);

  return (
    <aside
      className={`
        ${isUserMenuOpen ? "ml-0 sm:ml-30" : ""}
        w-full max-w-full md:w-[320px]
        md:sticky top-24
        bg-white border rounded-xl shadow-md p-4
      `}
    >
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Menú de navegación del usuario
      </h2>

      <ul className="space-y-2">
        {mainItems.map(({ path, label, icon: Icon }) => (
          <li key={path}>
            <NavLink
              to={path}
              end={false}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 px-4 py-3 rounded-lg border transition-all text-sm font-medium group
                ${
                  isActive
                    ? "bg-primary text-white border-primary shadow"
                    : "bg-gray-50 hover:bg-primary/10 text-gray-700"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <Icon
                        className={`text-lg ${
                          isActive ? "text-white" : "text-primary"
                        }`}
                      />
                    )}
                    <span>{label}</span>
                  </div>

                  <FaChevronRight
                    className={`text-xs transition-transform ${
                      isActive ? "text-white translate-x-1" : "text-gray-600"
                    }`}
                  />
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};