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
  Save,
  CalendarClock,
  Mail,
  User,
  ShieldCheck,
  Phone,
  Building2,
  IdCard,
  FileText,
  ReceiptText,
  BadgePercent,
  Landmark,
  Plus,
  Trash2,
  Package,
  MessageSquare,
  BriefcaseBusiness,
} from "lucide-react";

import { CustomModal } from "@/components/ui/overlay/CustomModal";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";

import type { Contact } from "@/interfaces/hook/IUseContacts";
import type { Quote, QuoteItem } from "@/interfaces/hook/IUseQuotes";

interface ModalCreateQuoteProps {
  open: boolean;
  onClose: () => void;
  contact: Contact | null;
  form: Partial<Quote>;
  setForm: React.Dispatch<React.SetStateAction<Partial<Quote>>>;
  onSave: () => void;
  loading?: boolean;
}

const DISCOUNT_TYPE_OPTIONS = [
  { value: "porcentaje", label: "Porcentaje" },
  { value: "monto", label: "Monto fijo" },
];

const IGV_BOOLEAN_OPTIONS = [
  { value: "true", label: "Sí" },
  { value: "false", label: "No" },
];

const CURRENCY_OPTIONS = [
  { value: "PEN", label: "Soles (PEN)" },
  { value: "USD", label: "Dólares (USD)" },
];

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

const safeNumber = (value: unknown): number => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const getDefaultDueDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 7);

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const createEmptyItem = (orden: number): QuoteItem => ({
  descripcion: "",
  cantidad: 1,
  precio_unitario: 0,
  subtotal: 0,
  orden,
});

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
    fecha_vencimiento: false,
    items: false,
  });

  const noopInputChange = () => undefined;

  useEffect(() => {
    if (!open) return;

    setTouched({
      fecha_vencimiento: false,
      items: false,
    });

    setForm((prev) => ({
      ...prev,
      contacto_id: contact?.id || prev.contacto_id || "",
      cliente_nombre: contact?.nombre || prev.cliente_nombre || "",
      cliente_empresa: contact?.empresa || prev.cliente_empresa || "",
      cliente_ruc:
        contact?.tipo_documento === "ruc"
          ? contact?.numero_documento || prev.cliente_ruc || ""
          : prev.cliente_ruc || "",
      cliente_email: contact?.email || prev.cliente_email || "",
      cliente_telefono: contact?.telefono || prev.cliente_telefono || "",
      moneda: prev.moneda || "PEN",
      descuento_tipo: prev.descuento_tipo || "porcentaje",
      descuento_valor:
        prev.descuento_valor === undefined || prev.descuento_valor === null
          ? 0
          : prev.descuento_valor,
      igv_porcentaje:
        prev.igv_porcentaje === undefined || prev.igv_porcentaje === null
          ? 18
          : prev.igv_porcentaje,
      aplica_igv:
        typeof prev.aplica_igv === "boolean" ? prev.aplica_igv : true,
      incluye_igv:
        typeof prev.incluye_igv === "boolean" ? prev.incluye_igv : false,
      fecha_vencimiento: prev.fecha_vencimiento || getDefaultDueDate(),
      items:
        prev.items && prev.items.length
          ? prev.items
          : [
              {
                descripcion: contact?.service?.titulo || "",
                cantidad: 1,
                precio_unitario: 0,
                subtotal: 0,
                orden: 1,
              },
            ],
    }));
  }, [open, setForm, contact]);

  const handleInputChange =
    (
      key:
        | "asunto"
        | "area"
        | "descuento_valor"
        | "igv_porcentaje"
        | "fecha_vencimiento"
        | "observaciones"
    ) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;

      setForm((prev) => ({
        ...prev,
        [key]:
          key === "descuento_valor" || key === "igv_porcentaje"
            ? value === ""
              ? ""
              : Number(value)
            : value,
      }));
    };

  const handleSelectChange =
    (key: "moneda" | "descuento_tipo" | "aplica_igv" | "incluye_igv") =>
    (
      e:
        | ChangeEvent<HTMLInputElement>
        | (Event & { target: { value: unknown; name: string } })
    ) => {
      const rawValue = String(e.target.value ?? "");

      setForm((prev) => ({
        ...prev,
        [key]:
          key === "aplica_igv" || key === "incluye_igv"
            ? rawValue === "true"
            : rawValue,
      }));
    };

  const updateItem = (
    index: number,
    key: "descripcion" | "cantidad" | "precio_unitario",
    value: string | number
  ): void => {
    setTouched((prev) => ({ ...prev, items: true }));

    setForm((prev) => {
      const currentItems = prev.items && prev.items.length ? prev.items : [];

      const nextItems = currentItems.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        const nextItem = {
          ...item,
          [key]:
            key === "descripcion"
              ? String(value)
              : value === ""
                ? 0
                : Number(value),
        };

        const cantidad = safeNumber(nextItem.cantidad);
        const precioUnitario = safeNumber(nextItem.precio_unitario);

        return {
          ...nextItem,
          subtotal: cantidad * precioUnitario,
        };
      });

      return {
        ...prev,
        items: nextItems,
      };
    });
  };

  const addItem = (): void => {
    setTouched((prev) => ({ ...prev, items: true }));

    setForm((prev) => {
      const currentItems = prev.items && prev.items.length ? prev.items : [];

      return {
        ...prev,
        items: [...currentItems, createEmptyItem(currentItems.length + 1)],
      };
    });
  };

  const removeItem = (index: number): void => {
    setTouched((prev) => ({ ...prev, items: true }));

    setForm((prev) => {
      const currentItems = prev.items && prev.items.length ? prev.items : [];

      const nextItems = currentItems
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item, itemIndex) => ({
          ...item,
          orden: itemIndex + 1,
        }));

      return {
        ...prev,
        items: nextItems.length ? nextItems : [createEmptyItem(1)],
      };
    });
  };

  const documentLabel = useMemo(() => {
    if (contact?.tipo_documento === "dni") return "DNI";
    if (contact?.tipo_documento === "ruc") return "RUC";
    return "Documento";
  }, [contact?.tipo_documento]);

  const clientTypeLabel = useMemo(() => {
    if (contact?.tipo_cliente === "empresa") return "Empresa";
    if (contact?.tipo_cliente === "persona") return "Persona natural";
    return "No definido";
  }, [contact?.tipo_cliente]);

  const documentValue = useMemo(() => {
    return safeString(contact?.numero_documento).trim() || "No registrado";
  }, [contact?.numero_documento]);

  const organizationLabel = useMemo(() => {
    return contact?.tipo_cliente === "empresa"
      ? "Empresa"
      : "Empresa / Organización";
  }, [contact?.tipo_cliente]);

  const organizationValue = useMemo(() => {
    return safeString(contact?.empresa).trim() || "No registrada";
  }, [contact?.empresa]);

  const items = useMemo(() => {
    return form.items && form.items.length ? form.items : [];
  }, [form.items]);

  const itemsSubtotal = useMemo(() => {
    return items.reduce((total, item) => {
      return total + safeNumber(item.cantidad) * safeNumber(item.precio_unitario);
    }, 0);
  }, [items]);

  const quotePreview = useMemo(() => {
    const subtotal = itemsSubtotal;

    const descuentoValor = safeNumber(form.descuento_valor);
    const igvPorcentaje = safeNumber(form.igv_porcentaje ?? 18);
    const aplicaIgv = Boolean(form.aplica_igv);
    const incluyeIgv = Boolean(form.incluye_igv);
    const descuentoTipo =
      form.descuento_tipo === "monto" ? "monto" : "porcentaje";

    let descuento =
      descuentoTipo === "porcentaje"
        ? subtotal * (descuentoValor / 100)
        : descuentoValor;

    if (descuento < 0) descuento = 0;
    if (descuento > subtotal) descuento = subtotal;

    const base = subtotal - descuento;
    const factor = igvPorcentaje / 100;

    let impuestos = 0;
    let total = base;

    if (aplicaIgv) {
      if (incluyeIgv) {
        impuestos = base * (factor / (1 + factor));
        total = base;
      } else {
        impuestos = base * factor;
        total = base + impuestos;
      }
    }

    return {
      subtotal: Number(subtotal.toFixed(2)),
      descuento: Number(descuento.toFixed(2)),
      impuestos: Number(impuestos.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  }, [
    itemsSubtotal,
    form.descuento_tipo,
    form.descuento_valor,
    form.igv_porcentaje,
    form.aplica_igv,
    form.incluye_igv,
  ]);

  const hasInvalidItems = useMemo(() => {
    if (!items.length) return true;

    return items.some((item) => {
      const descripcion = safeString(item.descripcion).trim();
      const cantidad = safeNumber(item.cantidad);
      const precioUnitario = safeNumber(item.precio_unitario);

      return !descripcion || cantidad <= 0 || precioUnitario < 0;
    });
  }, [items]);

  const errors = useMemo(() => {
    return {
      fechaVencimiento:
        touched.fecha_vencimiento &&
        !String(form.fecha_vencimiento ?? "").trim(),
      igvRange:
        Number(form.igv_porcentaje ?? 0) < 0 ||
        Number(form.igv_porcentaje ?? 0) > 100,
      discountValueRange:
        form.descuento_tipo === "porcentaje" &&
        (Number(form.descuento_valor ?? 0) < 0 ||
          Number(form.descuento_valor ?? 0) > 100),
      discountAmountNegative:
        form.descuento_tipo === "monto" &&
        Number(form.descuento_valor ?? 0) < 0,
      includesWithoutTax: Boolean(form.incluye_igv && !form.aplica_igv),
      items: touched.items && hasInvalidItems,
    };
  }, [
    form.fecha_vencimiento,
    form.igv_porcentaje,
    form.descuento_tipo,
    form.descuento_valor,
    form.incluye_igv,
    form.aplica_igv,
    touched,
    hasInvalidItems,
  ]);

  const disableSave =
    !contact?.id ||
    !String(form.fecha_vencimiento ?? "").trim() ||
    errors.fechaVencimiento ||
    errors.igvRange ||
    errors.discountValueRange ||
    errors.discountAmountNegative ||
    errors.includesWithoutTax ||
    hasInvalidItems;

  return (
    <CustomModal
      isOpen={open}
      onClose={onClose}
      title="Crear cotización"
      width="min(1080px, 96vw)"
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
            text={loading ? "Guardando..." : "Crear cotización"}
            icon={<Save size={16} />}
            onClick={onSave}
            loading={loading}
            disabled={disableSave}
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
              Estos datos son de solo lectura para crear la cotización sin
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
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold sm:text-base">
                Items de cotización
              </h4>
              <p className="max-w-2xl text-xs text-muted-foreground sm:text-sm">
                Agrega conceptos, cantidades y precios. El resumen es
                referencial; el backend recalcula y guarda el total final.
              </p>
            </div>

            <button
              type="button"
              onClick={addItem}
              className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-(--color-text) transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary sm:w-auto"
            >
              <Plus size={16} />
              Agregar item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => {
              const cantidad = safeNumber(item.cantidad);
              const precioUnitario = safeNumber(item.precio_unitario);
              const subtotal = cantidad * precioUnitario;

              return (
                <div
                  key={`quote-item-${index}`}
                  className="rounded-2xl border border-border bg-surface p-3"
                >
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-start">
                    <div className="md:col-span-5">
                      <CustomInput
                        label="Descripción"
                        placeholder="Descripción"
                        value={safeString(item.descripcion)}
                        onChange={(e) =>
                          updateItem(index, "descripcion", e.target.value)
                        }
                        error={
                          touched.items && !safeString(item.descripcion).trim()
                        }
                        helperText={
                          touched.items && !safeString(item.descripcion).trim()
                            ? "La descripción es requerida."
                            : ""
                        }
                        icon={
                          <Package
                            size={18}
                            style={{ color: "var(--color-text-muted)" }}
                          />
                        }
                        fullWidth
                      />
                    </div>

                    <div className="md:col-span-2">
                      <CustomInput
                        label="Cantidad"
                        type="number"
                        value={String(item.cantidad ?? 1)}
                        onChange={(e) =>
                          updateItem(index, "cantidad", e.target.value)
                        }
                        error={touched.items && cantidad <= 0}
                        helperText={
                          touched.items && cantidad <= 0
                            ? "Debe ser mayor a 0."
                            : ""
                        }
                        fullWidth
                      />
                    </div>

                    <div className="md:col-span-2">
                      <CustomInput
                        label="Precio unitario"
                        type="number"
                        value={String(item.precio_unitario ?? 0)}
                        onChange={(e) =>
                          updateItem(index, "precio_unitario", e.target.value)
                        }
                        error={touched.items && precioUnitario < 0}
                        helperText={
                          touched.items && precioUnitario < 0
                            ? "No puede ser negativo."
                            : ""
                        }
                        fullWidth
                      />
                    </div>

                    <div className="md:col-span-2">
                      <CustomInput
                        label="Subtotal"
                        value={subtotal.toFixed(2)}
                        disabled
                        onChange={noopInputChange}
                        fullWidth
                      />
                    </div>

                    <div className="flex h-full items-center justify-center md:col-span-1">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 transition hover:bg-red-500/15 md:w-11"
                        aria-label="Eliminar item"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-primary/10 bg-primary/5 p-4">
            <div className="mb-3 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ReceiptText size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold text-(--color-text)">
                  Resumen económico referencial
                </p>
                <p className="text-xs text-muted-foreground">
                  El backend recalcula y guarda subtotal, descuento, IGV y total
                  real.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Subtotal</span>
                <strong>
                  {String(form.moneda || "PEN")}{" "}
                  {quotePreview.subtotal.toFixed(2)}
                </strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Descuento</span>
                <strong>
                  - {String(form.moneda || "PEN")}{" "}
                  {quotePreview.descuento.toFixed(2)}
                </strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">
                  IGV{" "}
                  {form.aplica_igv
                    ? `(${form.igv_porcentaje || 18}%)`
                    : "(No aplica)"}
                </span>
                <strong>
                  {String(form.moneda || "PEN")}{" "}
                  {quotePreview.impuestos.toFixed(2)}
                </strong>
              </div>

              <div className="mt-3 flex justify-between gap-4 border-t border-border pt-3 text-base">
                <span className="font-semibold text-(--color-text)">
                  Total estimado
                </span>
                <strong className="text-primary">
                  {String(form.moneda || "PEN")} {quotePreview.total.toFixed(2)}
                </strong>
              </div>
            </div>
          </div>

          {errors.items ? (
            <p className="mt-3 text-xs font-medium text-red-500">
              Revisa los items antes de crear la cotización.
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-border bg-surface-soft p-4 sm:p-5">
          <div className="mb-4 space-y-1">
            <h4 className="text-sm font-semibold sm:text-base">
              Configuración de la cotización
            </h4>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Aquí defines las reglas comerciales y tributarias.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CustomInput
                label="Asunto"
                placeholder="Asunto de la cotización"
                value={form.asunto?.toString() ?? ""}
                onChange={handleInputChange("asunto")}
                fullWidth
                icon={
                  <ReceiptText
                    size={18}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
              />

              <CustomInput
                label="Área"
                placeholder="Área o unidad solicitante"
                value={form.area?.toString() ?? ""}
                onChange={handleInputChange("area")}
                fullWidth
                icon={
                  <Building2
                    size={18}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
              />
            </div>

            <CustomSelected
              value={String(form.moneda || "PEN")}
              onChange={handleSelectChange("moneda")}
              options={CURRENCY_OPTIONS}
              label="Moneda"
              helperText="Selecciona la moneda con la que se mostrará la cotización."
              fullWidth
              variant="primary"
              size="lg"
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CustomSelected
                value={String(form.descuento_tipo || "porcentaje")}
                onChange={handleSelectChange("descuento_tipo")}
                options={DISCOUNT_TYPE_OPTIONS}
                label="Tipo de descuento"
                helperText="Porcentaje aplica un % sobre la base. Monto fijo descuenta una cantidad exacta."
                fullWidth
                variant="primary"
                size="lg"
              />

              <CustomInput
                label="Valor de descuento"
                type="number"
                value={form.descuento_valor?.toString() ?? "0"}
                onChange={handleInputChange("descuento_valor")}
                error={
                  errors.discountValueRange || errors.discountAmountNegative
                }
                helperText={
                  errors.discountValueRange
                    ? "Si el tipo es porcentaje, el valor debe estar entre 0 y 100."
                    : errors.discountAmountNegative
                      ? "Si el tipo es monto fijo, no puede ser negativo."
                      : "Este valor se interpreta según el tipo de descuento seleccionado."
                }
                fullWidth
                icon={
                  <BadgePercent
                    size={18}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
              />
            </div>

            <CustomInput
              label="% IGV"
              type="number"
              value={form.igv_porcentaje?.toString() ?? "18"}
              onChange={handleInputChange("igv_porcentaje")}
              error={errors.igvRange}
              helperText={
                errors.igvRange
                  ? "El IGV debe estar entre 0 y 100."
                  : "Por defecto en Perú suele ser 18. El backend usa este porcentaje para calcular el impuesto."
              }
              fullWidth
              icon={
                <Landmark
                  size={18}
                  style={{ color: "var(--color-text-muted)" }}
                />
              }
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CustomSelected
                value={String(Boolean(form.aplica_igv))}
                onChange={handleSelectChange("aplica_igv")}
                options={IGV_BOOLEAN_OPTIONS}
                label="¿Aplica IGV?"
                helperText="Indica si esta cotización debe calcular impuesto."
                fullWidth
                variant="primary"
                size="lg"
              />

              <CustomSelected
                value={String(Boolean(form.incluye_igv))}
                onChange={handleSelectChange("incluye_igv")}
                options={IGV_BOOLEAN_OPTIONS}
                label="¿Los precios incluyen IGV?"
                error={errors.includesWithoutTax}
                helperText={
                  errors.includesWithoutTax
                    ? "No puedes indicar que incluye IGV si la cotización no aplica IGV."
                    : "Si eliges Sí, el precio ya viene con IGV incluido. Si eliges No, el IGV se suma al final."
                }
                fullWidth
                variant="primary"
                size="lg"
              />
            </div>

            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText size={18} />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-(--color-text)">
                    Cómo se calcula
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    El frontend muestra una vista previa. El backend toma los
                    items, moneda, descuento, IGV, “aplica IGV” e “incluye IGV”
                    para calcular automáticamente subtotal, impuestos,
                    descuento y total real.
                  </p>
                </div>
              </div>
            </div>

            <CustomInput
              label="Fecha de vencimiento"
              value={form.fecha_vencimiento?.toString() ?? ""}
              onChange={(e) => {
                handleInputChange("fecha_vencimiento")(e);
                setTouched((prev) => ({ ...prev, fecha_vencimiento: true }));
              }}
              type="date"
              icon={
                <CalendarClock
                  size={18}
                  style={{ color: "var(--color-text-muted)" }}
                />
              }
              error={errors.fechaVencimiento}
              helperText={
                errors.fechaVencimiento
                  ? "La fecha de vencimiento es requerida."
                  : "Se carga por defecto con 7 días desde hoy, pero la puedes cambiar."
              }
              fullWidth
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
          </div>
        </div>

        {!contact?.id ? (
          <p className="text-xs font-medium text-red-500">
            No se encontró el contacto seleccionado.
          </p>
        ) : null}
      </div>
    </CustomModal>
  );
};