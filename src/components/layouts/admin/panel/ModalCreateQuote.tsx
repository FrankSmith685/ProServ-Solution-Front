import { type FC, useMemo, useState, type ChangeEvent } from "react";
import { Save, User, Mail, BadgeDollarSign } from "lucide-react";

import type { Contact } from "@/interfaces/hook/IUseContacts";
import type { Quote, QuoteStatus } from "@/interfaces/hook/IUseQuotes";

import { CustomModal } from "@/components/ui/overlay/CustomModal";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";
import { CustomButton } from "@/components/ui/kit/CustomButton";

interface ModalCreateQuoteProps {
  open: boolean;
  onClose: () => void;
  contact: Contact | null;
  form: Partial<Quote>;
  setForm: React.Dispatch<React.SetStateAction<Partial<Quote>>>;
  onSave: () => void;
  loading?: boolean;
}

const STATUS_OPTIONS: { value: QuoteStatus; label: string }[] = [
  { value: "pendiente", label: "Pendiente" },
  { value: "enviada", label: "Enviada" },
  { value: "aprobada", label: "Aprobada" },
  { value: "rechazada", label: "Rechazada" },
];

interface InfoFieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
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

export const ModalCreateQuote: FC<ModalCreateQuoteProps> = ({
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
    total: false,
  });

  const handleTotalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      total: value,
    }));

    setTouched((prev) => ({
      ...prev,
      total: true,
    }));
  };

  const handleSelectChange =
    (key: "estado") =>
    (
      e:
        | ChangeEvent<HTMLInputElement>
        | (Event & { target: { value: unknown; name: string } })
    ) => {
      const value = String(e.target.value ?? "") as QuoteStatus;

      setForm((prev) => ({
        ...prev,
        [key]: value,
      }));

      setTouched((prev) => ({
        ...prev,
        [key]: true,
      }));
    };

  const errors = useMemo(() => {
    const totalValue = form.total;

    return {
      estado: touched.estado && !form.estado,
      total:
        touched.total &&
        totalValue !== null &&
        totalValue !== undefined &&
        totalValue !== "" &&
        Number(totalValue) < 0,
    };
  }, [form.estado, form.total, touched.estado, touched.total]);

  const isInvalid =
    !form.estado ||
    !contact?.id ||
    (form.total !== null &&
      form.total !== undefined &&
      form.total !== "" &&
      Number(form.total) < 0);

  return (
    <CustomModal
      isOpen={open}
      onClose={onClose}
      title="Crear cotización"
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
            text={loading ? "Guardando..." : "Guardar cotización"}
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
              Información de la cotización
            </h4>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Genera una cotización rápida para el contacto seleccionado.
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
              label="Total"
              placeholder="Ej: 150.00"
              value={form.total?.toString() ?? ""}
              onChange={handleTotalChange}
              type="number"
              error={errors.total}
              helperText={errors.total ? "El total no puede ser negativo" : ""}
              icon={
                <BadgeDollarSign
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