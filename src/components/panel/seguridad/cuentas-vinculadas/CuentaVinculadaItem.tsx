import { FaGoogle, FaEnvelope, FaLink, FaUnlink } from "react-icons/fa";
import type { CuentaVinculada } from "@/hooks/panel/mis-datos/seguridad/useCuentasVinculadas";

interface Props {
  cuenta: CuentaVinculada;
  loadingProveedor: CuentaVinculada["proveedor"] | null;
  onToggle: (proveedor: CuentaVinculada["proveedor"]) => void;
}

const PROVIDER_META = {
  correo: {
    label: "Correo electrónico",
    icon: FaEnvelope,
  },
  google: {
    label: "Google",
    icon: FaGoogle,
  },
};

export const CuentaVinculadaItem = ({
  cuenta,
  loadingProveedor,
  onToggle,
}: Props) => {
  const isLoading = loadingProveedor === cuenta.proveedor;
  const meta = PROVIDER_META[cuenta.proveedor];
  const Icon = meta.icon;

  return (
    <div
      className="
        bg-glass rounded-2xl
        px-4 py-4
        border border-white/20
        transition
        hover:border-primary/30
      "
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div
            className={`
              w-10 h-10 sm:w-11 sm:h-11
              rounded-xl flex items-center justify-center
              ${
                cuenta.vinculada
                  ? "bg-primary-soft text-primary"
                  : "bg-gray-200 text-gray-500"
              }
            `}
          >
            <Icon size={16} />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-secondary">
              {meta.label}
            </span>

            <span
              className={`
                text-xs font-medium
                ${
                  cuenta.vinculada  
                    ? "text-emerald-600"
                    : "text-gray-400"
                }
              `}
            >
              {cuenta.vinculada ? "Vinculada" : "No vinculada"}
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <button
          disabled={isLoading}
          onClick={() => onToggle(cuenta.proveedor)}
          className={`
            w-full sm:w-auto
            flex items-center justify-center gap-2
            px-4 py-2
            rounded-lg
            text-sm font-medium
            transition
            hover:cursor-pointer
            ${
              cuenta.vinculada
                ? "text-red-500 border border-red-200 hover:bg-red-50"
                : "text-primary border border-primary/30 hover:bg-primary-soft"
            }
            ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
          `}
        >
          {isLoading ? (
            <span className="animate-pulse">Procesando…</span>
          ) : (
            <>
              {cuenta.vinculada ? <FaUnlink size={12} /> : <FaLink size={12} />}
              {cuenta.vinculada ? "Desvincular" : "Vincular"}
            </>
          )}
        </button>

      </div>
    </div>
  );
};
