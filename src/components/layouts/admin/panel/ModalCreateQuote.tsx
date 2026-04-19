import { type FC, useMemo, useState, type ChangeEvent } from "react";
import { Save, User, Mail, BadgeDollarSign, CalendarClock } from "lucide-react";

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
  { value: "rechazada", label: "Rechazada" },
];

const DISCOUNT_TYPE_OPTIONS = [
  { value: "porcentaje", label: "Porcentaje" },
  { value: "monto", label: "Monto" },
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
    fecha_vencimiento: false,
    motivo_rechazo: false,
    cliente_ruc: false,
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
        motivo_rechazo: value === "rechazada" ? true : prev.motivo_rechazo,
      }));
    };

  const handleInputChange =
    (key: keyof Quote) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((prev) => ({
        ...prev,
        [key]: value,
      }));

      if (key === "motivo_rechazo") {
        setTouched((prev) => ({
          ...prev,
          motivo_rechazo: true,
        }));
      }

      if (key === "fecha_vencimiento") {
        setTouched((prev) => ({
          ...prev,
          fecha_vencimiento: true,
        }));
      }
    };

  const errors = useMemo(() => {
    const totalValue = form.total;
    const hasTotal =
      totalValue !== null &&
      totalValue !== undefined &&
      totalValue !== "" &&
      !Number.isNaN(Number(totalValue));
    const totalNumber = hasTotal ? Number(totalValue) : null;
    const requiresTotalForStatus =
      form.estado === "enviada" || form.estado === "aprobada";

    const ruc = String(form.cliente_ruc ?? "").trim();
    const discountType = form.descuento_tipo;
    const discountValue = Number(form.descuento_valor ?? 0);
    const igv = Number(form.igv_porcentaje ?? 0);

    return {
      estado: touched.estado && !form.estado,
      fechaVencimiento:
        touched.fecha_vencimiento && !String(form.fecha_vencimiento ?? "").trim(),
      total:
        touched.total &&
        hasTotal &&
        totalNumber !== null &&
        totalNumber < 0,
      totalRequiredByStatus: requiresTotalForStatus && (!hasTotal || Number(totalValue) <= 0),
      motivoRechazo:
        form.estado === "rechazada" &&
        touched.motivo_rechazo &&
        !String(form.motivo_rechazo ?? "").trim(),
      clienteRuc:
        touched.cliente_ruc && (!/^\d{11}$/.test(ruc)),
      fechaEnvio:
        form.estado === "enviada" && !String(form.fecha_envio ?? "").trim(),
      discountType: Boolean(discountType && discountType !== "porcentaje" && discountType !== "monto"),
      discountValueRange:
        discountType === "porcentaje" && (discountValue < 0 || discountValue > 100),
      igvRange: igv < 0 || igv > 100,
      includesWithoutTax: Boolean(form.incluye_igv && !form.aplica_igv),
    };
  }, [form.estado, form.total, form.fecha_vencimiento, form.motivo_rechazo, form.cliente_ruc, form.fecha_envio, form.descuento_tipo, form.descuento_valor, form.igv_porcentaje, form.incluye_igv, form.aplica_igv, touched.estado, touched.total, touched.fecha_vencimiento, touched.motivo_rechazo, touched.cliente_ruc]);

  const hasValidPositiveTotal =
    form.total !== null &&
    form.total !== undefined &&
    form.total !== "" &&
    !Number.isNaN(Number(form.total)) &&
    Number(form.total) > 0;

  // const requiresTotalForStatus =
  //   form.estado === "enviada" || form.estado === "aprobada";

  // const hasValidPositiveTotal =
  //   form.total !== null &&
  //   form.total !== undefined &&
  //   form.total !== "" &&
  //   !Number.isNaN(Number(form.total)) &&
  //   Number(form.total) > 0;

  const requiresTotalForStatus =
    form.estado === "enviada" || form.estado === "aprobada";

  const isInvalid =
    !form.estado ||
    !contact?.id ||
    !String(form.fecha_vencimiento ?? "").trim() ||
    errors.motivoRechazo ||
    errors.clienteRuc ||
    errors.fechaEnvio ||
    errors.discountType ||
    errors.discountValueRange ||
    errors.igvRange ||
    errors.includesWithoutTax ||
    (form.total !== null &&
      form.total !== undefined &&
      form.total !== "" &&
      Number(form.total) < 0) ||
    (requiresTotalForStatus && !hasValidPositiveTotal);

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
              label="Cliente (nombre)"
              placeholder="Nombre del cliente"
              value={form.cliente_nombre?.toString() ?? ""}
              onChange={handleInputChange("cliente_nombre")}
              fullWidth
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CustomInput
                label="Empresa"
                placeholder="Empresa del cliente"
                value={form.cliente_empresa?.toString() ?? ""}
                onChange={handleInputChange("cliente_empresa")}
                fullWidth
              />

              <CustomInput
                label="RUC"
                placeholder="11 dígitos"
                value={form.cliente_ruc?.toString() ?? ""}
                onChange={(e) => {
                  handleInputChange("cliente_ruc")(e);
                  setTouched((prev) => ({ ...prev, cliente_ruc: true }));
                }}
                error={errors.clienteRuc}
                helperText={errors.clienteRuc ? "RUC inválido: deben ser 11 dígitos numéricos." : ""}
                fullWidth
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CustomInput
                label="Email cliente"
                placeholder="cliente@correo.com"
                value={form.cliente_email?.toString() ?? ""}
                onChange={handleInputChange("cliente_email")}
                fullWidth
              />

              <CustomInput
                label="Teléfono cliente"
                placeholder="+51..."
                value={form.cliente_telefono?.toString() ?? ""}
                onChange={handleInputChange("cliente_telefono")}
                fullWidth
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CustomInput
                label="Asunto"
                value={form.asunto?.toString() ?? ""}
                onChange={handleInputChange("asunto")}
                fullWidth
              />

              <CustomInput
                label="Área"
                value={form.area?.toString() ?? ""}
                onChange={handleInputChange("area")}
                fullWidth
              />
            </div>

            <CustomInput
              label="Número (opcional)"
              placeholder="COT-2026-000123"
              value={form.numero?.toString() ?? ""}
              onChange={handleInputChange("numero")}
              fullWidth
            />

            <CustomInput
              label="Moneda"
              placeholder="PEN"
              value={form.moneda?.toString() ?? "PEN"}
              onChange={handleInputChange("moneda")}
              fullWidth
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <CustomSelected
                value={form.descuento_tipo || "porcentaje"}
                onChange={(e) => handleInputChange("descuento_tipo")(e as ChangeEvent<HTMLInputElement>)}
                options={DISCOUNT_TYPE_OPTIONS}
                label="Tipo descuento"
                fullWidth
                variant="primary"
                size="md"
              />

              <CustomInput
                label="Valor descuento"
                type="number"
                value={form.descuento_valor?.toString() ?? "0"}
                onChange={handleInputChange("descuento_valor")}
                error={errors.discountValueRange}
                helperText={errors.discountValueRange ? "Si es porcentaje, debe estar entre 0 y 100." : ""}
                fullWidth
              />

              <CustomInput
                label="% IGV"
                type="number"
                value={form.igv_porcentaje?.toString() ?? "18"}
                onChange={handleInputChange("igv_porcentaje")}
                error={errors.igvRange}
                helperText={errors.igvRange ? "El IGV debe estar entre 0 y 100." : ""}
                fullWidth
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CustomSelected
                value={String(Boolean(form.aplica_igv))}
                onChange={(e) => {
                  const value = String(e.target.value || "false") === "true";
                  setForm((prev) => ({ ...prev, aplica_igv: value }));
                }}
                options={[{ value: "true", label: "Aplica IGV: Sí" }, { value: "false", label: "Aplica IGV: No" }]}
                label="Regla IGV"
                fullWidth
                variant="primary"
                size="md"
              />

              <CustomSelected
                value={String(Boolean(form.incluye_igv))}
                onChange={(e) => {
                  const value = String(e.target.value || "false") === "true";
                  setForm((prev) => ({ ...prev, incluye_igv: value }));
                }}
                options={[{ value: "false", label: "Incluye IGV: No" }, { value: "true", label: "Incluye IGV: Sí" }]}
                label="Incluye IGV"
                error={errors.includesWithoutTax}
                helperText={errors.includesWithoutTax ? "No puede incluir IGV si no aplica IGV." : ""}
                fullWidth
                variant="primary"
                size="md"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <CustomInput label="Subtotal" type="number" value={form.subtotal?.toString() ?? "0"} onChange={handleInputChange("subtotal")} fullWidth />
              <CustomInput label="Impuestos" type="number" value={form.impuestos?.toString() ?? "0"} onChange={handleInputChange("impuestos")} fullWidth />
              <CustomInput label="Descuento" type="number" value={form.descuento?.toString() ?? "0"} onChange={handleInputChange("descuento")} fullWidth />
            </div>

            <CustomInput
              label="Fecha de envío"
              value={form.fecha_envio?.toString() ?? ""}
              onChange={handleInputChange("fecha_envio")}
              type="date"
              error={errors.fechaEnvio}
              helperText={errors.fechaEnvio ? "Si está enviada, la fecha de envío es obligatoria." : ""}
              fullWidth
            />

            <CustomInput
              label="Fecha de vencimiento"
              value={form.fecha_vencimiento?.toString() ?? ""}
              onChange={handleInputChange("fecha_vencimiento")}
              type="date"
              icon={
                <CalendarClock
                  size={18}
                  style={{ color: "var(--color-text-muted)" }}
                />
              }
              error={errors.fechaVencimiento}
              helperText={errors.fechaVencimiento ? "La fecha de vencimiento es requerida." : ""}
              fullWidth
            />

            <CustomInput
              label="Total"
              placeholder="Ej: 150.00"
              value={form.total?.toString() ?? ""}
              onChange={handleTotalChange}
              type="number"
              error={errors.total}
              helperText={
                errors.total
                  ? "El total no puede ser negativo"
                  : errors.totalRequiredByStatus
                    ? "Para estados Enviada o Aprobada, el total debe ser mayor a 0."
                    : ""
              }
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

            <CustomInput
              label="Observaciones"
              placeholder="Notas visibles o internas de la cotización"
              value={form.observaciones?.toString() ?? ""}
              onChange={handleInputChange("observaciones")}
              multiline
              rows={3}
              fullWidth
            />

            <CustomInput
              label="Motivo de rechazo"
              placeholder="Obligatorio si el estado es Rechazada"
              value={form.motivo_rechazo?.toString() ?? ""}
              onChange={handleInputChange("motivo_rechazo")}
              error={errors.motivoRechazo}
              helperText={
                errors.motivoRechazo
                  ? "Debes indicar el motivo cuando la cotización está rechazada."
                  : ""
              }
              multiline
              rows={2}
              fullWidth
            />
          </div>
        </div>
      </div>
    </CustomModal>
  );
};
