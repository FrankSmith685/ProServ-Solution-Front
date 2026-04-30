/* eslint-disable react-hooks/set-state-in-effect */
import {
  type FC,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import {
  CalendarDays,
  Save,
  User,
  Mail,
  Phone,
  Building2,
  IdCard,
  MessageSquare,
  ShieldCheck,
  BriefcaseBusiness,
  Info,
} from "lucide-react";

import type { Contact } from "@/interfaces/hook/IUseContacts";
import type { RequestItem } from "@/interfaces/hook/IUseRequests";

import { CustomModal } from "@/components/ui/overlay/CustomModal";
import { CustomInput } from "@/components/ui/kit/CustomInput";
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

interface InfoFieldProps {
  label: string;
  value: string;
  icon: ReactNode;
}

const safeString = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
};

const getTodayDate = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

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
    fecha_programada: false,
  });

  useEffect(() => {
    if (!open) return;

    setTouched({
      fecha_programada: false,
    });

    setForm((prev) => ({
      ...prev,
      contacto_id: contact?.id || prev.contacto_id || "",
      fecha_programada: prev.fecha_programada || getTodayDate(),
      estado: "programada",
    }));
  }, [open, contact?.id, setForm]);

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      fecha_programada: value || null,
      estado: "programada",
    }));

    setTouched({
      fecha_programada: true,
    });
  };

  const documentLabel = useMemo(() => {
    if (contact?.tipo_documento === "ruc") return "RUC";
    if (contact?.tipo_documento === "dni") return "DNI";
    return "Documento";
  }, [contact?.tipo_documento]);

  const documentValue = useMemo(() => {
    return safeString(contact?.numero_documento).trim() || "No registrado";
  }, [contact?.numero_documento]);

  const clientTypeLabel = useMemo(() => {
    if (contact?.tipo_cliente === "empresa") return "Empresa";
    if (contact?.tipo_cliente === "persona") return "Persona natural";
    return "No definido";
  }, [contact?.tipo_cliente]);

  const organizationLabel = useMemo(() => {
    return contact?.tipo_cliente === "empresa"
      ? "Empresa"
      : "Empresa / Organización";
  }, [contact?.tipo_cliente]);

  const organizationValue = useMemo(() => {
    return safeString(contact?.empresa).trim() || "No registrada";
  }, [contact?.empresa]);

  const errors = useMemo(
    () => ({
      fecha_programada:
        touched.fecha_programada && !String(form.fecha_programada ?? "").trim(),
    }),
    [form.fecha_programada, touched.fecha_programada]
  );

  const isInvalid =
    !contact?.id ||
    !String(form.fecha_programada ?? "").trim() ||
    errors.fecha_programada;

  return (
    <CustomModal
      isOpen={open}
      onClose={onClose}
      title="Crear solicitud"
      width="min(920px, 96vw)"
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
            text={loading ? "Guardando..." : "Crear solicitud"}
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
              Información enviada por el contacto
            </h4>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Estos datos son de solo lectura para crear la solicitud sin
              modificar el contacto original.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoField
                label="Contacto"
                value={safeString(contact?.nombre) || "No registrado"}
                icon={
                  <User
                    size={16}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
              />

              <InfoField
                label="Correo"
                value={safeString(contact?.email) || "No registrado"}
                icon={
                  <Mail
                    size={16}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoField
                label="Teléfono"
                value={safeString(contact?.telefono) || "No registrado"}
                icon={
                  <Phone
                    size={16}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
              />

              <InfoField
                label={organizationLabel}
                value={organizationValue}
                icon={
                  <Building2
                    size={16}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoField
                label="Tipo de cliente"
                value={clientTypeLabel}
                icon={
                  <ShieldCheck
                    size={16}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
              />

              <InfoField
                label={documentLabel}
                value={documentValue}
                icon={
                  <IdCard
                    size={16}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
              />
            </div>

            <InfoField
              label="Servicio solicitado"
              value={safeString(contact?.service?.titulo) || "Sin servicio"}
              icon={
                <BriefcaseBusiness
                  size={16}
                  style={{ color: "var(--color-text-muted)" }}
                />
              }
            />

            <div className="rounded-2xl border border-border bg-background px-4 py-3 sm:px-5 sm:py-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <MessageSquare
                  size={16}
                  style={{ color: "var(--color-text-muted)" }}
                />
                <span>Mensaje del contacto</span>
              </div>

              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                {safeString(contact?.mensaje) || "Sin mensaje registrado"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface-soft p-4 sm:p-5">
          <div className="mb-4 space-y-1">
            <h4 className="text-sm font-semibold sm:text-base">
              Programación de la solicitud
            </h4>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Define cuándo se atenderá. La solicitud iniciará automáticamente
              como programada.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <CustomInput
              label="Fecha programada"
              value={form.fecha_programada?.toString() ?? ""}
              onChange={handleDateChange}
              type="date"
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
                  : "Se carga por defecto con la fecha de hoy, pero puedes cambiarla."
              }
              fullWidth
            />

            <div className="rounded-2xl border border-border bg-background px-4 py-3 sm:px-5 sm:py-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Info size={16} style={{ color: "var(--color-text-muted)" }} />
                <span>Estado inicial</span>
              </div>

              <div className="inline-flex rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                Programada
              </div>

              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                El estado ya no se elige manualmente al crear. Luego podrás
                cambiarlo en el seguimiento de solicitudes.
              </p>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Info size={18} />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-(--color-text)">
                    Qué se guardará
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Actualmente la solicitud guarda el contacto, fecha
                    programada y estado. En este flujo el estado se envía fijo
                    como programada.
                  </p>
                </div>
              </div>
            </div>

            {!contact?.id ? (
              <p className="text-xs font-medium text-red-500">
                No se encontró el contacto seleccionado.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </CustomModal>
  );
};