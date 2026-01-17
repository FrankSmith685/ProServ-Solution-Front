import type { AppUser, UserRole } from "@/interfaces/layouts/header/ITypes";
import type { JSX } from "react";

interface Props {
  user: AppUser;
  role: UserRole;
}

export const UserPanelHeader = ({ user, role }: Props): JSX.Element => {
  return (
    <div className="px-4 py-4 border-b border-terciary-alpha-12 bg-gray-50">
      <div className="flex items-center gap-3">
        {user.fotoPerfil ? (
          <img
            src={user.fotoPerfil}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary-soft flex items-center justify-center text-primary font-semibold">
            {user.nombre.charAt(0)}
          </div>
        )}

        <div>
          <p className="font-semibold text-secondary leading-tight">
            {user.nombre} {user.apellido}
          </p>
          <p className="text-xs text-terciary capitalize">
            {role}
          </p>
        </div>
      </div>
    </div>
  );
};
