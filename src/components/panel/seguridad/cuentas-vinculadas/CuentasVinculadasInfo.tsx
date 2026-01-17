import type { FC } from "react";

export const CuentaVinculadaInfo: FC = () => {
  return (
    <section className="bg-surface-soft rounded-3xl p-6 space-y-3 max-w-md">
      <h3 className="text-sm sm:text-base font-medium text-secondary">
        Información sobre cuentas vinculadas
      </h3>

      <ul className="text-xs sm:text-sm text-terciary space-y-1 list-disc pl-4">
        <li>Puedes vincular varios métodos para iniciar sesión</li>
        <li>El correo electrónico es necesario como método principal</li>
        <li>Vincular Google permite acceso más rápido y seguro</li>
        <li>Algunas cuentas no pueden desvincularse si están en uso</li>
      </ul>
    </section>
  );
};
