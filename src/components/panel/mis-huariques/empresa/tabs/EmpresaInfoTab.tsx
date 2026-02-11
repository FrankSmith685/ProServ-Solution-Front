import { CustomInput } from "@/components/ui/kit/CustomInput";
import type { HuariqueEmpresaFormProps } from "@/interfaces/panel/mis-huariques/IHuariqueEmpresa";
import type { ChangeEvent } from "react";

// Tab que maneja la información básica de la empresa
export const EmpresaInfoTab = ({ form, onChange }: HuariqueEmpresaFormProps) => {

  // Handler genérico para actualizar cualquier campo del formulario
  const handleInputChange = (key: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(key, e.target.value);
  };
  // Maneja el cambio del RUC (solo números y máximo 11 dígitos)
  const handleRucChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 11);
    onChange("ruc", value);
  };
  // Restringe las teclas permitidas en el input de RUC
  const handleRucKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab"
    ];
    if (allowedKeys.includes(e.key)) return;
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
      return;
    }
    if (form.ruc.length >= 11) {
      e.preventDefault();
    }
  };
  return (
    <section className="space-y-6 md:space-y-8">
      {/* TÍTULO */}
      <div className="space-y-1">
        <h3 className="text-sm md:text-base font-semibold text-secondary">
          Identidad de la empresa
        </h3>
        <p className="text-xs md:text-sm text-gray-600">
          Define la información de la empresa para continuar publicando tu huarique.
        </p>
      </div>

      {/* NOMBRE */}
      <div className="space-y-1">
        <CustomInput
          label="Nombre de la empresa"
          value={form.nombre}
          onChange={handleInputChange("nombre")}
          fullWidth
          required
        />
        <p className="text-[13px] text-gray-500">
          • Este será el nombre de la empresa
        </p>
      </div>

      {/* RUC */}
      <div className="space-y-1">
        <CustomInput
          label="Ruc de la empresa"
          value={form.ruc}
          onKeyDown={handleRucKeyDown}
          onChange={handleRucChange}
          fullWidth
          required
        />

        <p className="text-[13px] text-gray-500">
          • Este será el ruc de la empresa
        </p>
      </div>
    </section>
  );
};