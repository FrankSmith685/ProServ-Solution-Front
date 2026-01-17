import type { FC } from "react";

export const PasswordSecurityTips: FC = () => {
  return (
    <section className="bg-surface-soft rounded-3xl p-6 space-y-3 max-w-md">
      <h3 className="text-sm sm:text-base font-medium text-secondary">
        Recomendaciones de seguridad
      </h3>

      <ul className="text-xs sm:text-sm text-terciary space-y-1 list-disc pl-4">
        <li>No compartas tu contraseña con nadie</li>
        <li>Usa letras mayúsculas, minúsculas y números</li>
        <li>Evita datos personales fáciles de adivinar</li>
        <li>Cambia tu contraseña periódicamente</li>
      </ul>
    </section>
  );
};
