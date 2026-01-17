import { CustomInput } from "@/components/ui/kit/CustomInput";
import { useAppState } from "@/hooks/useAppState";
import type { EmailFormProps } from "@/interfaces/panel/mis-datos/ISeguridad";

export const EmailForm = ({ form, onChange }: EmailFormProps) => {
  const { user } = useAppState();

  return (
    <section className="bg-glass rounded-3xl p-6 space-y-8">
      <div className="space-y-2">
        <h2 className="text-sm sm:text-base font-medium text-secondary">
          Cambiar correo electrónico
        </h2>
        <p className="text-xs sm:text-sm text-terciary">
          Este correo se usará para iniciar sesión y recibir notificaciones.
        </p>
      </div>

      <div className="space-y-6 max-w-md">
        {/* SOLO VISUAL */}
        <CustomInput
          label="Correo actual"
          type="email"
          value={user?.correo ?? ""}
          onChange={() => {}}
          fullWidth
          size="md"
          disabled
        />

        {/* FORM REAL */}
        <CustomInput
          label="Nuevo correo"
          type="email"
          value={form.nuevo}
          error={Boolean(form.nuevo) && form.nuevo === user?.correo}
          helperText="Debe ser diferente al correo actual"
          onChange={e => onChange("nuevo", e.target.value)}
          fullWidth
          size="md"
        />
      </div>
    </section>
  );
};
