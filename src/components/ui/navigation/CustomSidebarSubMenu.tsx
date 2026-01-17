import { NavLink, useLocation } from "react-router-dom";
import type { FC } from "react";
import { FiX } from "react-icons/fi";
import type {
  SidebarSubMenuItem,
  SidebarSubMenuLink,
} from "@/interfaces/ui/navigation/ICustomSidebarSubMenu";

interface Props {
  title: string;
  titleIcon?: React.ComponentType<{ className?: string }>;
  menuData: readonly SidebarSubMenuItem[];
  onItemClick?: () => void;
  onClose?: () => void;
}

export const CustomSidebarSubMenu: FC<Props> = ({
  title,
  titleIcon: TitleIcon,
  menuData,
  onItemClick,
  onClose,
}) => {
  const { pathname } = useLocation();

  const isGroupActive = (children: readonly SidebarSubMenuLink[]) =>
    children.some(child => pathname.startsWith(child.path));

  return (
    <aside className="h-full flex flex-col bg-secondary">
      <div className="px-6 pt-6 pb-5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-alpha-12 text-primary flex items-center justify-center">
              {TitleIcon && <TitleIcon className="text-lg" />}
            </div>
            <h2 className="text-base font-semibold text-on-dark">
              {title}
            </h2>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="xs:hidden w-9 h-9 flex items-center justify-center rounded-lg text-on-dark"
            >
              <FiX />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-3">
        {menuData.map(item => {
          if (item.type === "group") {
            const active = isGroupActive(item.children);

            return (
              <div
                key={item.label}
                className={`
                  rounded-xl
                  border-l-4
                  ${
                    active
                      ? "border-primary bg-primary-alpha-8"
                      : "border-transparent"
                  }
                `}
              >
                <hr className="border-terciary-alpha-12 my-2" />

                <div className="px-4 py-2 text-xs font-semibold uppercase text-on-dark-muted">
                  {item.label}
                </div>

                <div className="pl-3 space-y-1">
                  {item.children.map(child => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      onClick={() => {
                        onItemClick?.();
                        onClose?.();
                      }}
                      className={({ isActive }) =>
                        `
                        flex items-center gap-3 px-4 py-2 rounded-lg text-sm
                        ${
                          isActive
                            ? "text-on-dark bg-primary-alpha-12"
                            : "text-on-dark-muted hover:bg-secondary-alpha-12"
                        }
                      `
                      }
                    >
                      <child.icon className="text-sm" />
                      <span>{child.label}</span>
                    </NavLink>
                  ))}
                </div>

                <hr className="border-terciary-alpha-12 my-2" />
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                onItemClick?.();
                onClose?.();
              }}
              className={({ isActive }) =>
                `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm
                border-l-4
                ${
                  isActive
                    ? "border-primary bg-primary-alpha-16 text-on-dark"
                    : "border-transparent bg-secondary-alpha-8 text-on-dark-muted hover:bg-secondary-alpha-12"
                }
              `
              }
            >
              <item.icon className="text-base" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
