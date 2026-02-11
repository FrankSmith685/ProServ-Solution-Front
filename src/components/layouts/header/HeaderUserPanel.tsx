import { type FC, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import type { AppUser, UserRole } from "@/interfaces/layouts/header/ITypes";
import { ComensalPanel } from "./menus/ComensalPanel";
import { VendedorPanel } from "./menus/VendedorPanel";

interface Props {
  user: AppUser;
  role: UserRole;
  isTransparent: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const HeaderUserPanel: FC<Props> = ({
  user,
  role,
  isTransparent,
  isOpen,
  onOpen,
  onClose,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const close = (e: MouseEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [isOpen, onClose]);

  const handleMouseLeave = (
    e: React.MouseEvent<HTMLDivElement>
  ): void => {
    const relatedTarget = e.relatedTarget;

    if (
      !ref.current ||
      !(relatedTarget instanceof Node) ||
      !ref.current.contains(relatedTarget)
    ) {
      onClose();
    }
  };


  return (
    <div
      ref={ref}
      className="relative hidden md:block"
      onMouseEnter={onOpen}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={isOpen ? onClose : onOpen}
        className={`
          flex items-center gap-2
          px-3 py-2 rounded-xl transition
          cursor-pointer
          ${
            isTransparent
              ? "text-white hover:bg-white/10"
              : "text-primary bg-primary/90 hover:bg-primary-hover"
          }
        `}
      >
        <div
          className={`
            w-8 h-8 rounded-full overflow-hidden
            flex items-center justify-center 
            font-semibold
            ${
              isTransparent
                ? "bg-white text-primary"
                : "text-white bg-primary"
            }
          `}
        >
          {user.fotoPerfil ? (
            <img
              src={user.fotoPerfil}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            user.nombre?.charAt(0) ?? user.correo?.charAt(0)
          )}

        </div>

        <span className="text-sm font-medium">
          {user.nombre ?? user.correo }
        </span>

        <FaChevronDown
          className={`text-xs transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full pt-4 ">
          <div
            className="
              w-80
              bg-surface
              rounded-3xl
              shadow-2xl
              border border-terciary-alpha-12
              overflow-hidden
              animate-fade-in-up
              z-99999!
            "
          >
            <div
              className="
                px-5 pt-5 pb-6
                bg-primary-soft
                border-b border-terciary-alpha-12
                cursor-pointer
              "
            >
              <div className="flex items-center gap-4">
                <div
                  className="
                    w-14 h-14 rounded-full
                    bg-primary text-white
                    flex items-center justify-center
                    font-semibold text-lg
                    overflow-hidden
                  "
                >
                  {user.fotoPerfil ? (
                    <img
                      src={user.fotoPerfil}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.nombre?.charAt(0) ?? user.correo?.charAt(0)
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-secondary leading-tight">
                    { user.nombre ? user.nombre + ' ' +user.apellido : user.correo}
                  </p>
                  <span
                    className="
                      inline-block mt-1
                      text-xs font-medium
                      px-2 py-0.5 rounded-full
                      bg-white text-primary capitalize
                    "
                  >
                    {role}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-4 py-4 space-y-3">
              {role === "comensal" && <ComensalPanel />}
              {role === "vendedor" && <VendedorPanel />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
