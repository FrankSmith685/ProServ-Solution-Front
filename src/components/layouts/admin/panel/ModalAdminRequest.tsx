/* eslint-disable react-hooks/set-state-in-effect */
import {
  type FC,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import {
  Save,
  CalendarDays,
  ShieldCheck,
  PlayCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { CustomModal } from "@/components/ui/overlay/CustomModal";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomButton } from "@/components/ui/kit/CustomButton";

import type { RequestItem, RequestStatus } from "@/interfaces/hook/IUseRequests";

interface ModalAdminRequestProps {
  open: boolean;
  onClose: () => void;
  form: Partial<RequestItem>;
  setForm: React.Dispatch<React.SetStateAction<Partial<RequestItem>>>;
  onSave: () => void;
  loading?: boolean;
}

const STATUS_FLOW: {
  value: RequestStatus;
  label: string;
  icon: React.ReactNode;
  className: string;
}[] = [
  {
    value: "programada",
    label: "Programada",
    icon: <CalendarDays size={15} />,
    className: "border-blue-500/20 bg-blue-500/10 text-blue-600",
  },
  {
    value: "en_proceso",
    label: "En proceso",
    icon: <PlayCircle size={15} />,
    className: "border-violet-500/20 bg-violet-500/10 text-violet-600",
  },
  {
    value: "finalizada",
    label: "Finalizada",
    icon: <CheckCircle2 size={15} />,
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
  },
  {
    value: "cancelada",
    label: "Cancelada",
    icon: <XCircle size={15} />,
    className: "border-red-500/20 bg-red-500/10 text-red-600",
  },
];

const getTodayDate = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getStatusLabel = (status?: string | null): string => {
  if (status === "pendiente") return "Pendiente";
  if (status === "programada") return "Programada";
  if (status === "en_proceso") return "En proceso";
  if (status === "finalizada") return "Finalizada";
  if (status === "cancelada") return "Cancelada";
  return "No definido";
};

export const ModalAdminRequest: FC<ModalAdminRequestProps> = ({
  open,
  onClose,
  form,
  setForm,
  onSave,
  loading = false,
}) => {
  const [touched, setTouched] = useState({
    fecha_programada: false,
  });

  useEffect(() => {
    if (!open) return;

    setTouched({
      fecha_programada: false,
    });

    setForm((prev) => ({
      ...prev,
      fecha_programada: prev.fecha_programada || getTodayDate(),
      estado: prev.estado || "programada",
    }));
  }, [open, setForm]);

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      fecha_programada: value || getTodayDate(),
    }));

    setTouched((prev) => ({
      ...prev,
      fecha_programada: true,
    }));
  };

  const handleStatusChange = (estado: RequestStatus): void => {
    setForm((prev) => ({
      ...prev,
      estado,
    }));
  };

  const errors = useMemo(
    () => ({
      fecha_programada:
        touched.fecha_programada && !String(form.fecha_programada ?? "").trim(),
    }),
    [form.fecha_programada, touched.fecha_programada]
  );

  const isClosed =
    form.estado === "finalizada" || form.estado === "cancelada";

  const isInvalid =
    !form.id ||
    !form.estado ||
    !String(form.fecha_programada ?? "").trim() ||
    errors.fecha_programada;

  return (
    <CustomModal
      isOpen={open}
      onClose={onClose}
      title="Seguimiento de solicitud"
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
            text={loading ? "Guardando..." : "Guardar cambios"}
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
              Programación
            </h4>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Aquí puedes ajustar la fecha programada de atención.
            </p>
          </div>

          <CustomInput
            label="Fecha programada"
            type="date"
            value={form.fecha_programada?.toString() || getTodayDate()}
            onChange={handleDateChange}
            onBlur={() =>
              setTouched((prev) => ({ ...prev, fecha_programada: true }))
            }
            icon={
              <CalendarDays
                size={18}
                style={{ color: "var(--color-text-muted)" }}
              />
            }
            error={errors.fecha_programada}
            helperText={
              errors.fecha_programada
                ? "La fecha programada es requerida."
                : "Por defecto se carga con la fecha de hoy."
            }
            fullWidth
            disabled={isClosed}
          />
        </div>

        <div className="rounded-2xl border border-border bg-surface-soft p-4 sm:p-5">
          <div className="mb-4 space-y-1">
            <h4 className="text-sm font-semibold sm:text-base">
              Estado de atención
            </h4>
            <p className="text-xs text-muted-foreground sm:text-sm">
              El estado se cambia desde el seguimiento, no al crear la solicitud.
            </p>
          </div>

          <div className="mb-4 rounded-2xl border border-border bg-background px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <ShieldCheck
                size={16}
                style={{ color: "var(--color-text-muted)" }}
              />
              <span>Estado actual</span>
            </div>

            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {getStatusLabel(form.estado)}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {STATUS_FLOW.map((status) => {
              const active = form.estado === status.value;

              return (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => handleStatusChange(status.value)}
                  disabled={active}
                  className={[
                    "flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition disabled:cursor-default",
                    active
                      ? status.className
                      : "border-border bg-background text-(--color-text) hover:border-primary/30 hover:bg-primary/5",
                  ].join(" ")}
                >
                  <span>{status.icon}</span>
                  <span>{status.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-primary/10 bg-primary/5 p-4">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Flujo recomendado: Programada → En proceso → Finalizada. Usa
              Cancelada solo si la atención ya no se realizará.
            </p>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};