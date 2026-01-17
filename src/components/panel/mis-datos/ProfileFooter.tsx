import { FaClock, FaCheckCircle } from "react-icons/fa";
import type {
  ProfileFooterProps,
  ActivityMetadata,
} from "@/interfaces/panel/mis-datos/IMisDatos";

export const ProfileFooter = ({
  progress,
  lastSaved,
  activity,
}: ProfileFooterProps) => {
  const formatDateTime = (date: string) =>
    new Date(date).toLocaleString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const campoLabels: Record<string, string> = {
    nombre: "Nombre",
    apellido: "Apellido",
    telefono: "Teléfono",
    dni: "DNI",
    ubicacion: "Ubicación",
  };

  const buildActivityText = (a: {
    text: string;
    metadata?: ActivityMetadata;
  }) => {
    if (a.text === "Actualizó perfil" && a.metadata?.campos?.length) {
      const campos = a.metadata.campos
        .map(c => campoLabels[c] ?? c)
        .join(", ");

      return `Actualizó perfil: ${campos}`;
    }

    return a.text;
  };

  return (
    <section className="bg-glass rounded-3xl p-4 sm:p-6 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-secondary">
            Perfil completado
          </p>
          <p className="text-xs text-terciary">
            Completa tu información para una mejor experiencia
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <FaCheckCircle />
          <span>{progress}%</span>
        </div>
      </div>

      <div className="h-2.5 rounded-full bg-terciary-alpha-12 overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-terciary">
          <FaClock />
          <span>
            {lastSaved
              ? `Última actualización local: ${lastSaved}`
              : "Sin cambios pendientes"}
          </span>
        </div>

        {activity.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activity.map((a, i) => (
              <span
                key={i}
                title={formatDateTime(a.date)}
                className="px-3 py-1 rounded-full bg-primary-soft text-primary text-[11px] font-medium flex items-center gap-1"
              >
                {buildActivityText(a)}
                <span className="text-[10px] text-primary/70">
                  · {formatDateTime(a.date)}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
