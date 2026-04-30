/* eslint-disable react-hooks/exhaustive-deps */
import { type FC, useMemo, useState, type ChangeEvent } from "react";
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
  Send,
  MessageCircle,
} from "lucide-react";

import { CustomModal } from "@/components/ui/overlay/CustomModal";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";

import type { Quote, QuoteItem } from "@/interfaces/hook/IUseQuotes";

interface ModalAdminQuoteProps {
  open: boolean;
  onClose: () => void;
  form: Partial<Quote>;
  setForm: React.Dispatch<React.SetStateAction<Partial<Quote>>>;
  onSave: () => void;
  loading?: boolean;

  sendingEmail?: boolean;
  sendingWhatsApp?: boolean;
  onSendEmail?: (payload: { to: string; message: string }) => Promise<void>;
  onSendWhatsApp?: (payload: { phone: string; message: string }) => Promise<void>;
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

const safeString = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
};

const safeNumber = (value: unknown): number => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const onlyDigits = (value: unknown): string => {
  return safeString(value).replace(/\D/g, "");
};

const isValidEmail = (value: unknown): boolean => {
  const email = safeString(value).trim();
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const createEmptyItem = (orden: number): QuoteItem => ({
  descripcion: "",
  cantidad: 1,
  precio_unitario: 0,
  subtotal: 0,
  orden,
});

export const ModalAdminQuote: FC<ModalAdminQuoteProps> = ({
  open,
  onClose,
  form,
  setForm,
  onSave,
  loading = false,
  sendingEmail = false,
  sendingWhatsApp = false,
  onSendEmail,
  onSendWhatsApp,
}) => {
  const [touched, setTouched] = useState({
    cliente_nombre: false,
    cliente_email: false,
    cliente_telefono: false,
    cliente_ruc: false,
    fecha_vencimiento: false,
    items: false,
  });

  const noopInputChange = () => undefined;

  const markTouched = (key: keyof typeof touched): void => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handleInputChange =
    (
      key:
        | "cliente_nombre"
        | "cliente_empresa"
        | "cliente_ruc"
        | "cliente_email"
        | "cliente_telefono"
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

      if (
        key === "cliente_nombre" ||
        key === "cliente_email" ||
        key === "cliente_telefono" ||
        key === "cliente_ruc" ||
        key === "fecha_vencimiento"
      ) {
        markTouched(key);
      }
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
    const documentDigits = onlyDigits(form.cliente_ruc);

    return {
      clienteNombre: !safeString(form.cliente_nombre).trim(),
      clienteEmail: !isValidEmail(form.cliente_email),
      clienteTelefono: onlyDigits(form.cliente_telefono).length < 7,
      clienteDocumento:
        documentDigits.length > 0 && ![8, 11].includes(documentDigits.length),
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
    form.cliente_nombre,
    form.cliente_email,
    form.cliente_telefono,
    form.cliente_ruc,
    form.fecha_vencimiento,
    form.igv_porcentaje,
    form.descuento_tipo,
    form.descuento_valor,
    form.incluye_igv,
    form.aplica_igv,
    touched,
    hasInvalidItems,
  ]);

  const isClosedQuote =
    form.estado === "aprobada" || form.estado === "rechazada";

  const defaultSendMessage = useMemo(() => {
    const name = safeString(form.cliente_nombre).trim() || "cliente";
    const total = quotePreview.total.toFixed(2);
    const moneda = safeString(form.moneda) || "PEN";

    return `Hola ${name}, te compartimos tu cotización${
      form.numero ? ` ${form.numero}` : ""
    } por ${moneda} ${total}.`;
  }, [form.cliente_nombre, form.numero, form.moneda, quotePreview.total]);

  const canSendEmail =
    Boolean(onSendEmail) && isValidEmail(form.cliente_email) && !isClosedQuote;

  const canSendWhatsApp =
    Boolean(onSendWhatsApp) &&
    onlyDigits(form.cliente_telefono).length >= 7 &&
    !isClosedQuote;

  const handleSendEmail = async (): Promise<void> => {
    if (!onSendEmail || !canSendEmail) return;

    await onSendEmail({
      to: safeString(form.cliente_email).trim(),
      message: defaultSendMessage,
    });
  };

  const handleSendWhatsApp = async (): Promise<void> => {
    if (!onSendWhatsApp || !canSendWhatsApp) return;

    await onSendWhatsApp({
      phone: safeString(form.cliente_telefono).trim(),
      message: defaultSendMessage,
    });
  };

  const disableSave =
    isClosedQuote ||
    !form.id ||
    errors.clienteNombre ||
    errors.clienteEmail ||
    errors.clienteTelefono ||
    errors.clienteDocumento ||
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
      title={`Editar cotización${form.numero ? ` - ${form.numero}` : ""}`}
      width="min(1080px, 96vw)"
      footer={
        <div className="flex w-full flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:flex-wrap sm:justify-end sm:pt-4">
          <CustomButton
            text="Cancelar"
            variant="secondary"
            onClick={onClose}
            className="w-full! leading-4! gap-1! px-3! sm:w-auto!"
            fontSize="14px"
            size="lg"
          />

          {onSendEmail ? (
            <CustomButton
              text={sendingEmail ? "Enviando correo..." : "Enviar correo"}
              icon={<Send size={16} />}
              variant="secondary"
              onClick={handleSendEmail}
              loading={sendingEmail}
              disabled={!canSendEmail || sendingEmail || sendingWhatsApp}
              className="w-full! leading-4! gap-1! px-3! sm:w-auto!"
              fontSize="14px"
              size="lg"
            />
          ) : null}

          {onSendWhatsApp ? (
            <CustomButton
              text={
                sendingWhatsApp ? "Abriendo WhatsApp..." : "Enviar WhatsApp"
              }
              icon={<MessageCircle size={16} />}
              variant="secondary"
              onClick={handleSendWhatsApp}
              loading={sendingWhatsApp}
              disabled={!canSendWhatsApp || sendingEmail || sendingWhatsApp}
              className="w-full! leading-4! gap-1! px-3! sm:w-auto!"
              fontSize="14px"
              size="lg"
            />
          ) : null}

          <CustomButton
            text={loading ? "Guardando..." : "Guardar cambios"}
            icon={<Save size={16} />}
            onClick={onSave}
            loading={loading}
            disabled={disableSave}
            className="w-full! leading-4! gap-1! px-3! sm:w-auto!"
            fontSize="14px"
            size="lg"
          />
        </div>
      }
    >
      <div className="space-y-5 px-0 py-1 sm:space-y-6">
        {isClosedQuote ? (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-600">
            Esta cotización está {form.estado}. No se recomienda editarla; los
            cambios de estado se hacen desde las acciones de la tabla.
          </div>
        ) : null}

        <div className="rounded-2xl border border-border bg-surface-soft p-4 sm:p-5">
          <div className="mb-4 space-y-1">
            <h4 className="text-sm font-semibold sm:text-base">
              Información de la cotización
            </h4>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Estos datos pertenecen a la cotización. Puedes corregirlos sin
              modificar el contacto original.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CustomInput
                label="Nombre"
                value={safeString(form.cliente_nombre)}
                onChange={handleInputChange("cliente_nombre")}
                onBlur={() => markTouched("cliente_nombre")}
                error={touched.cliente_nombre && errors.clienteNombre}
                helperText={
                  touched.cliente_nombre && errors.clienteNombre
                    ? "El nombre del cliente es requerido."
                    : ""
                }
                icon={
                  <User
                    size={18}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
                fullWidth
                disabled={isClosedQuote}
              />

              <CustomInput
                label="Correo"
                value={safeString(form.cliente_email)}
                onChange={handleInputChange("cliente_email")}
                onBlur={() => markTouched("cliente_email")}
                error={touched.cliente_email && errors.clienteEmail}
                helperText={
                  touched.cliente_email && errors.clienteEmail
                    ? "Ingresa un correo válido."
                    : ""
                }
                icon={
                  <Mail
                    size={18}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
                fullWidth
                disabled={isClosedQuote}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CustomInput
                label="Teléfono"
                value={safeString(form.cliente_telefono)}
                onChange={handleInputChange("cliente_telefono")}
                onBlur={() => markTouched("cliente_telefono")}
                error={touched.cliente_telefono && errors.clienteTelefono}
                helperText={
                  touched.cliente_telefono && errors.clienteTelefono
                    ? "Ingresa un teléfono válido."
                    : ""
                }
                icon={
                  <Phone
                    size={18}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
                fullWidth
                disabled={isClosedQuote}
              />

              <CustomInput
                label="Empresa / Organización"
                value={safeString(form.cliente_empresa)}
                onChange={handleInputChange("cliente_empresa")}
                icon={
                  <Building2
                    size={18}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
                fullWidth
                disabled={isClosedQuote}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CustomInput
                label="Documento"
                value={safeString(form.cliente_ruc)}
                onChange={handleInputChange("cliente_ruc")}
                onBlur={() => markTouched("cliente_ruc")}
                error={touched.cliente_ruc && errors.clienteDocumento}
                helperText={
                  touched.cliente_ruc && errors.clienteDocumento
                    ? "El documento debe tener 8 dígitos para DNI o 11 para RUC."
                    : ""
                }
                icon={
                  <IdCard
                    size={18}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
                fullWidth
                disabled={isClosedQuote}
              />

              <CustomInput
                label="Estado actual"
                value={safeString(form.estado) || "pendiente"}
                icon={
                  <ShieldCheck
                    size={18}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
                fullWidth
                disabled
                onChange={noopInputChange}
              />
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
                Edita conceptos, cantidades y precios. El resumen es
                referencial; el backend recalcula y guarda el total final.
              </p>
            </div>

            <button
              type="button"
              onClick={addItem}
              disabled={isClosedQuote}
              className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-(--color-text) transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
                  key={item.id || `quote-item-${index}`}
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
                        disabled={isClosedQuote}
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
                        disabled={isClosedQuote}
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
                        disabled={isClosedQuote}
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
                        disabled={isClosedQuote}
                        className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50 md:w-11"
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
              Revisa los items antes de guardar la cotización.
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-border bg-surface-soft p-4 sm:p-5">
          <div className="mb-4 space-y-1">
            <h4 className="text-sm font-semibold sm:text-base">
              Configuración de la cotización
            </h4>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Aquí defines las reglas comerciales y tributarias. Los estados se
              cambian desde las acciones de la tabla.
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
                disabled={isClosedQuote}
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
                disabled={isClosedQuote}
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
              disabled={isClosedQuote}
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
                disabled={isClosedQuote}
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
                disabled={isClosedQuote}
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
              disabled={isClosedQuote}
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
                disabled={isClosedQuote}
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
                disabled={isClosedQuote}
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
                    para calcular automáticamente subtotal, impuestos, descuento
                    y total real.
                  </p>
                </div>
              </div>
            </div>

            <CustomInput
              label="Fecha de vencimiento"
              value={form.fecha_vencimiento?.toString() ?? ""}
              onChange={handleInputChange("fecha_vencimiento")}
              onBlur={() => markTouched("fecha_vencimiento")}
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
                  : "Puedes cambiar la fecha de vencimiento de esta cotización."
              }
              fullWidth
              disabled={isClosedQuote}
            />

            <CustomInput
              label="Observaciones"
              placeholder="Notas visibles o internas de la cotización"
              value={form.observaciones?.toString() ?? ""}
              onChange={handleInputChange("observaciones")}
              multiline
              rows={3}
              fullWidth
              disabled={isClosedQuote}
            />
          </div>
        </div>
      </div>
    </CustomModal>
  );
};