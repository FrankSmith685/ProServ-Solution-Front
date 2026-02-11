import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";
import {
  DIAS,
  TIPO_HORARIO,
  type HuariqueInfoFormProps,
  type TipoHorario,
} from "@/interfaces/panel/mis-huariques/IHuariqueInfo";

export const HuariqueHorarioTab = ({
  form,
  onChange,
}: HuariqueInfoFormProps) => {
 
  return (
  <div className="space-y-6">
    <h3 className="text-sm font-semibold text-secondary">
      Horario de atención
    </h3>

    <p className="text-xs text-gray-600">
      Indica los días y horarios en los que tu huarique atiende al público.
    </p>

    <CustomSelected
      label="Tipo de horario"
      value={form.tipoHorario}
      options={TIPO_HORARIO}
      fullWidth
      onChange={e =>
        onChange("tipoHorario", e.target.value as TipoHorario)
      }
      helperText={`${form.tipoHorario === "normal"? "• Mismo horario para todos los días seleccionados"
        : "• Define horarios distintos por día (próximamente)"}
        `}
    />
    <div>
    {form.tipoHorario === "normal" && (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CustomInput
            label="Hora de apertura"
            type="time"
            value={form.horaInicio}
            onChange={e => onChange("horaInicio", e.target.value)}
            fullWidth
          />
          <CustomInput
            label="Hora de cierre"
            type="time"
            value={form.horaFin}
            onChange={e => onChange("horaFin", e.target.value)}
            fullWidth
          />
        </div>

        <p className="text-[11px] text-gray-600 pt-4 pb-2">
          Selecciona los días de atención
        </p>

        <div className="flex flex-wrap gap-2">
          {DIAS.map(dia => {
            const active = form.diasAtencion.includes(dia);

            return (
              <button
                key={dia}
                type="button"
                onClick={() =>
                  onChange(
                    "diasAtencion",
                    active
                      ? form.diasAtencion.filter(d => d !== dia)
                      : [...form.diasAtencion, dia]
                  )
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium
                  ${
                    active
                      ? "bg-secondary text-white"
                      : "bg-white border border-gray-300 text-gray-600"
                  }
                `}
              >
                {dia}
              </button>
            );
          })}
        </div>
      </>
    )}
    </div>
  </div>
);

};
