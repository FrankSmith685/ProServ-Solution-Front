import {
  FaUser,
  FaCamera,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTrash,
} from "react-icons/fa";
import type { ProfileHeaderProps } from "@/interfaces/panel/mis-datos/IMisDatos";

export const ProfileHeader = ({
  form,
  dirty,
  complete,
  onAvatarChange,
  onAvatarRemove,
  avatarError,
}: ProfileHeaderProps) => {
  const status = dirty
    ? {
        text: "Cambios pendientes",
        variant: "warning",
        icon: FaExclamationCircle,
      }
    : complete
    ? {
        text: "Perfil completo",
        variant: "success",
        icon: FaCheckCircle,
      }
    : {
        text: "Perfil incompleto",
        variant: "info",
        icon: FaInfoCircle,
      };

  const StatusIcon = status.icon;

  return (
    <header className="rounded-3xl bg-surface-soft p-4 sm:p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-4 min-w-0">
        <div className="relative shrink-0 flex flex-col items-center gap-2">
          <div className="relative group">
            <div
              className="
                w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28
                rounded-full overflow-hidden
                bg-terciary-soft
                flex items-center justify-center
                ring-2 ring-transparent
                md:group-hover:ring-primary/40
                transition
              "
            >
              {form.fotoPerfil ? (
                <img
                  src={form.fotoPerfil}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className="text-terciary text-2xl" />
              )}
            </div>
            <div
              className="
                hidden md:flex
                absolute inset-0 rounded-full
                bg-black/40
                items-center justify-center gap-3
                opacity-0 md:group-hover:opacity-100
                transition
              "
            >
              <label
                className="
                  w-9 h-9 rounded-full
                  bg-primary text-white
                  flex items-center justify-center
                  cursor-pointer
                  hover:scale-105 transition
                "
              >
                <FaCamera size={14} />
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  hidden
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    onAvatarChange(file);
                    e.currentTarget.value = "";
                  }}
                />
              </label>

              {form.fotoPerfil && (
                <button
                  type="button"
                  onClick={onAvatarRemove}
                  className="
                    w-9 h-9 rounded-full
                    bg-danger text-white
                    flex items-center justify-center
                    hover:scale-105 transition
                  "
                >
                  <FaTrash size={13} />
                </button>
              )}
            </div>
          </div>
          <div className="flex md:hidden gap-2">
            <label
              className="
                px-3 py-1.5 rounded-full
                bg-primary-soft text-primary
                text-xs font-medium
                flex items-center gap-1
                cursor-pointer
              "
            >
              <FaCamera size={12} />
              Editar
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                hidden
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  onAvatarChange(file);
                  e.currentTarget.value = "";
                }}
              />
            </label>

            {form.fotoPerfil && (
              <button
                type="button"
                onClick={onAvatarRemove}
                className="
                  px-3 py-1.5 rounded-full
                  bg-danger-soft text-danger
                  text-xs font-medium
                  flex items-center gap-1
                "
              >
                <FaTrash size={12} />
                Eliminar
              </button>
            )}
          </div>
        </div>
        <div className="min-w-0 text-center sm:text-left">
          <h1 className="text-base sm:text-lg lg:text-xl font-medium text-secondary truncate">
            {form.nombre} {form.apellido}
          </h1>

          <p className="text-sm text-terciary truncate">{form.email}</p>

          <p className="text-xs text-terciary mt-1">
            JPG, PNG o WEBP · Máx. 2MB
          </p>


          {avatarError && (
            <p className="text-xs text-danger mt-1">
              {avatarError === "size" && "La imagen supera los 2MB"}
              {avatarError === "type" && "Formato no permitido"}
            </p>
          )}
        </div>
      </div>
      <div
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium
          self-center lg:self-auto
          whitespace-normal lg:whitespace-nowrap
          ${
            status.variant === "warning"
              ? "bg-warning-soft text-warning"
              : status.variant === "success"
              ? "bg-primary-soft text-primary"
              : "bg-terciary-soft text-terciary"
          }`}
      >
        <StatusIcon className="text-sm shrink-0" />
        <span>{status.text}</span>
      </div>
    </header>
  );
};
