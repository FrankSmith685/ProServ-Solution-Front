import { type FC, useMemo, useState, type ChangeEvent } from "react";
import { Save, CalendarDays } from "lucide-react";

import { CustomModal } from "@/components/ui/overlay/CustomModal";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";

import type { RequestItem, RequestStatus } from "@/interfaces/hook/IUseRequests";

interface ModalAdminRequestProps {
  open: boolean;
  onClose: () => void;
  form: Partial<RequestItem>;
  setForm: React.Dispatch<React.SetStateAction<Partial<RequestItem>>>;
  onSave: () => void;
  loading?: boolean;
}

const STATUS_OPTIONS: { value: RequestStatus; label: string }[] = [
  { value: "pendiente", label: "Pendiente" },
  { value: "programada", label: "Programada" },
  { value: "en_proceso", label: "En proceso" },
  { value: "finalizada", label: "Finalizada" },
  { value: "cancelada", label: "Cancelada" },
];

export const ModalAdminRequest: FC<ModalAdminRequestProps> = ({
  open,
  onClose,
  form,
  setForm,
  onSave,
  loading = false,
}) => {
  const [touched, setTouched] = useState({
    estado: false,
  });

  const handleChange =
    (key: keyof RequestItem) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;

      setForm((prev) => ({
        ...prev,
        [key]: value,
      }));
    };

  const handleSelectChange =
    (key: "estado") =>
    (
      e:
        | ChangeEvent<HTMLInputElement>
        | (Event & { target: { value: unknown; name: string } })
    ) => {
      const value = String(e.target.value ?? "") as RequestStatus;

      setForm((prev) => ({
        ...prev,
        [key]: value,
      }));

      setTouched((prev) => ({
        ...prev,
        [key]: true,
      }));
    };

  const errors = useMemo(
    () => ({
      estado: touched.estado && !form.estado,
    }),
    [form.estado, touched.estado]
  );

  return (
    <CustomModal
      isOpen={open}
      onClose={onClose}
      title="Editar solicitud"
      width="min(620px, 96vw)"
      footer={
        <div className="flex w-full flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:justify-end sm:pt-4">
          <CustomButton
            text="Cancelar"
            variant="secondary"
            onClick={onClose}
            className="w-full! px-4! sm:w-auto!"
            fontSize="14px"
          />

          <CustomButton
            text={loading ? "Guardando..." : "Guardar"}
            icon={<Save size={16} />}
            onClick={onSave}
            loading={loading}
            disabled={!form.estado}
            className="w-full! gap-2! px-4! sm:w-auto!"
            fontSize="14px"
          />
        </div>
      }
    >
      <div className="space-y-5 px-0 py-1 sm:space-y-6">
        <div className="rounded-2xl border border-border bg-surface-soft p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-4">
            <CustomInput
              label="Fecha programada"
              type="date"
              value={form.fecha_programada || ""}
              onChange={handleChange("fecha_programada")}
              icon={<CalendarDays size={18} style={{ color: "var(--color-text-muted)" }} />}
              fullWidth
            />

            <CustomSelected
              value={form.estado || ""}
              onChange={handleSelectChange("estado")}
              options={STATUS_OPTIONS}
              label="Estado"
              placeholder="Selecciona un estado"
              error={errors.estado}
              helperText={errors.estado ? "Requerido" : ""}
              fullWidth
              variant="primary"
              size="lg"
            />
          </div>
        </div>
      </div>
    </CustomModal>
  );
};