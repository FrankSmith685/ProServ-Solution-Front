import { type FC, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import { CalendarDays, Save, User, Mail } from "lucide-react";

import type { Contact } from "@/interfaces/hook/IUseContacts";
import type { RequestItem, RequestStatus } from "@/interfaces/hook/IUseRequests";

import { CustomModal } from "@/components/ui/overlay/CustomModal";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";
import { CustomButton } from "@/components/ui/kit/CustomButton";

interface ModalCreateRequestProps {
  open: boolean;
  onClose: () => void;
  contact: Contact | null;
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

interface InfoFieldProps {
  label: string;
  value: string;
  icon: ReactNode;
}

const InfoField: FC<InfoFieldProps> = ({ label, value, icon }) => {
  return (
    <div className="rounded-2xl border border-border bg-background px-4 py-3 sm:px-5 sm:py-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <span className="flex items-center justify-center">{icon}</span>
        <span>{label}</span>
      </div>

      <div className="wrap-break-word text-sm font-semibold text-foreground sm:text-[15px]">
        {value || "No disponible"}
      </div>
    </div>
  );
};

export const ModalCreateRequest: FC<ModalCreateRequestProps> = ({
  open,
  onClose,
  contact,
  form,
  setForm,
  onSave,
  loading = false,
}) => {
  const [touched, setTouched] = useState({
    estado: false,
  });

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      fecha_programada: value || null,
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

  const isInvalid = !form.estado || !contact?.id;

  return (
    <CustomModal
      isOpen={open}
      onClose={onClose}
      title="Crear solicitud"
      width="min(720px, 96vw)"
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
            text={loading ? "Guardando..." : "Guardar solicitud"}
            icon={<Save size={16} />}
            onClick={onSave}
            loading={loading}
            disabled={isInvalid}
            className="w-full! gap-2! px-4! sm:w-auto!"
            fontSize="14px"
          />
        </div>
      }
    >
      <div className="space-y-5 px-0 py-1 sm:space-y-6">
        <div className="rounded-2xl border border-border bg-surface-soft p-4 sm:p-5">
          <div className="mb-4 space-y-1">
            <h4 className="text-sm font-semibold sm:text-base">
              Información de la solicitud
            </h4>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Programa una atención para el contacto seleccionado.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoField
                label="Contacto"
                value={contact?.nombre || ""}
                icon={
                  <User
                    size={16}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
              />

              <InfoField
                label="Email"
                value={contact?.email || ""}
                icon={
                  <Mail
                    size={16}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
              />
            </div>

            <CustomInput
              label="Fecha programada"
              value={form.fecha_programada || ""}
              onChange={handleDateChange}
              type="date"
              icon={
                <CalendarDays
                  size={18}
                  style={{ color: "var(--color-text-muted)" }}
                />
              }
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