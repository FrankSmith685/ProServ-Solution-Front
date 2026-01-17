import type { AppUser, UserRole } from "@/interfaces/layouts/header/ITypes";
import type { JSX } from "react";
import { ComensalPanel } from "./menus/ComensalPanel";
import { VendedorPanel } from "./menus/VendedorPanel";
import { FaTimes } from "react-icons/fa";

interface Props {
  user: AppUser;
  role: UserRole;
  onClose: () => void;
}

export const MobileUserPanel = ({
  user,
  role,
  onClose,
}: Props): JSX.Element => {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm">
      <div
        className="
          w-full max-h-[92vh]
          rounded-t-3xl
          bg-surface
          shadow-2xl
          animate-slide-up
          overflow-hidden
        "
      >
        <div
          className="
            relative px-5 pt-5 pb-6
            bg-primary-soft
            border-b border-terciary-alpha-12
          "
        >
          <button
            onClick={onClose}
            className="
              absolute top-4 right-4
              w-8 h-8 rounded-full
              flex items-center justify-center
              bg-white/70
              text-terciary
              hover:bg-white
              transition
            "
          >
            <FaTimes />
          </button>

          <div className="flex items-center gap-4">
            <div
              className="
                relative w-14 h-14 rounded-full
                bg-primary
                text-white
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
                user?.nombre?.charAt(0) ?? user?.correo
              )}
            </div>

            <div className="flex-1">
              <p className="font-semibold text-secondary leading-tight">
                {user.nombre} {user.apellido}
              </p>
              <span
                className="
                  inline-block mt-1
                  text-xs font-medium
                  px-2 py-0.5 rounded-full
                  bg-white text-primary
                  capitalize
                "
              >
                {role}
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 space-y-3 overflow-y-auto">
          {role === "comensal" && <ComensalPanel />}
          {role === "vendedor" && <VendedorPanel />}
        </div>
      </div>
    </div>
  );
};
