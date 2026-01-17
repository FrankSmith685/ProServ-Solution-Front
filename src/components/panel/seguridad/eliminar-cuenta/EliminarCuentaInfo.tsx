import type { FC } from "react";

export const EliminarCuentaInfo: FC = () => {
  return (
    <section className="bg-surface-soft rounded-3xl p-6 space-y-3 max-w-md">
      <h3 className="text-sm sm:text-base font-medium text-secondary">
        Información importante
      </h3>

      <ul className="text-xs sm:text-sm text-terciary space-y-1 list-disc pl-4">
        <li>La eliminación de la cuenta es permanente</li>
        <li>No podrás recuperar tu información ni historial</li>
        <li>Se cerrarán todas tus sesiones activas</li>
        <li>Algunas cuentas requieren reautenticación</li>
      </ul>
    </section>
  );
};
