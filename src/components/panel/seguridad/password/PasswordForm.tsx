import { CustomInput } from "@/components/ui/kit/CustomInput";
import type { PasswordFormProps } from "@/interfaces/panel/mis-datos/ISeguridad";

export const PasswordForm = ({ form, onChange }: PasswordFormProps) => {
  return (
    <section className="bg-glass rounded-3xl p-6 space-y-8">
      <div className="space-y-2">
        <h2 className="text-sm sm:text-base font-medium text-secondary">
          Cambiar contraseña
        </h2>
        <p className="text-xs sm:text-sm text-terciary">
          Usa una contraseña segura que no hayas utilizado antes.
        </p>
      </div>

      <div className="space-y-6 max-w-md">
        <CustomInput
          label="Contraseña actual"
          type="password"
          size="md"
          value={form.actual}
          onChange={e => onChange("actual", e.target.value)}
          fullWidth
        />

        <CustomInput
          label="Nueva contraseña"
          type="password"
          value={form.nueva}
          error={Boolean(form.nueva) && form.nueva.length < 6}
          helperText="Mínimo 6 caracteres"
          onChange={e => onChange("nueva", e.target.value)}
          fullWidth
          size="md"
        />

        <CustomInput
          label="Confirmar contraseña"
          type="password"
          value={form.confirmar}
          error={Boolean(form.confirmar) && form.confirmar !== form.nueva}
          helperText="Debe coincidir con la nueva contraseña"
          onChange={e => onChange("confirmar", e.target.value)}
          fullWidth
          size="md"
        />
      </div>
    </section>
  );
};
