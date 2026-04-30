/* eslint-disable react-hooks/exhaustive-deps */
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Loader2,
  Edit2,
  FileText,
  User,
  BadgeDollarSign,
  MessageCircle,
  CheckCircle2,
  XCircle,
  History,
  FileDown,
  Send,
  MoreHorizontal,
  CalendarPlus,
} from "lucide-react";

import { useQuotes } from "@/hooks/useQuotes";
import { useContacts } from "@/hooks/useContacts";
import { useRequests } from "@/hooks/useRequests";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";

import { CustomTable } from "@/components/ui/kit/CustomTable";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";
import { CustomModal } from "@/components/ui/overlay/CustomModal";

import type { Quote, QuoteEvent, QuoteItem } from "@/interfaces/hook/IUseQuotes";
import type { RequestItem } from "@/interfaces/hook/IUseRequests";

import { ModalAdminQuote } from "../ModalAdminQuote";
import { ModalCreateRequest } from "../ModalCreateRequest";

const TABLE_HEADERS: string[] = [
  "Contacto",
  "Email",
  "Total",
  "Estado",
  "Fecha",
  "Acciones",
];

const actionTriggerBaseClass =
  "group flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer";

const statusClassMap: Record<string, string> = {
  pendiente: "bg-amber-500 text-white",
  enviada: "bg-blue-500 text-white",
  aprobada: "bg-emerald-500 text-white",
  rechazada: "bg-red-500 text-white",
};

const INITIAL_REQUEST_FORM: Partial<RequestItem> = {
  contacto_id: "",
  fecha_programada: null,
  estado: "programada",
};

type MenuPosition = {
  top: number;
  left: number;
  placement: "bottom" | "top";
};

interface MenuActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

const MenuActionButton = ({
  icon,
  label,
  onClick,
  danger = false,
  disabled = false,
}: MenuActionButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50",
        danger
          ? "text-red-500 hover:bg-red-500/10"
          : "text-(--color-text) hover:bg-muted/60",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
          danger
            ? "border-red-500/20 bg-red-500/10 text-red-500"
            : "border-border bg-surface-soft text-(--color-text)",
        ].join(" ")}
      >
        {icon}
      </span>

      <span className="truncate font-medium">{label}</span>
    </button>
  );
};

interface QuoteActionMenuPortalProps {
  open: boolean;
  position: MenuPosition;
  quote: Quote | null;
  portalThemeClassName: string;
  onClose: () => void;
  onWhatsApp: (quote: Quote) => Promise<void>;
  onSend: (quote: Quote) => Promise<void>;
  onApprove: (quote: Quote) => Promise<void>;
  onReject: (quote: Quote) => Promise<void>;
  onTimeline: (quote: Quote) => Promise<void>;
  onDownloadPdf: (quote: Quote) => Promise<void>;
  onEdit: (quote: Quote) => void;
  onCreateRequest: (quote: Quote) => void;
}

const QuoteActionMenuPortal = ({
  open,
  position,
  quote,
  portalThemeClassName,
  onClose,
  onWhatsApp,
  onSend,
  onApprove,
  onReject,
  onTimeline,
  onDownloadPdf,
  onEdit,
  onCreateRequest,
}: QuoteActionMenuPortalProps) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDownOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;

      const target = event.target as Node | null;
      if (!target) return;

      if (!menuRef.current.contains(target)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const handleResize = () => {
      onClose();
    };

    document.addEventListener("mousedown", handlePointerDownOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handlePointerDownOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleResize);
    };
  }, [open, onClose]);

  if (!quote) return null;

  const canSend = quote.estado === "pendiente";
  const canResolve = quote.estado === "enviada";
  const canEdit = quote.estado !== "aprobada" && quote.estado !== "rechazada";
  const canCreateRequest = quote.estado === "aprobada";

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className={portalThemeClassName || "admin-theme theme-light"}>
          <motion.div
            ref={menuRef}
            className="fixed z-[9998] w-[250px]"
            style={{ top: position.top, left: position.left }}
            initial={{
              opacity: 0,
              scale: 0.98,
              y: position.placement === "bottom" ? -4 : 4,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.98,
              y: position.placement === "bottom" ? -2 : 2,
            }}
            transition={{ duration: 0.14, ease: "easeOut" }}
          >
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_14px_34px_rgba(0,0,0,0.22)]">
              <div className="max-h-[min(500px,calc(100vh-32px))] overflow-y-auto">
                <div className="sticky top-0 z-[1] border-b border-border bg-surface-soft px-3 py-2.5 backdrop-blur-sm">
                  <p className="truncate text-sm font-semibold text-(--color-text)">
                    {quote.numero || "Sin número"}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {quote.contact?.nombre ||
                      quote.cliente_nombre ||
                      "Sin cliente"}
                  </p>
                </div>

                <div className="p-2">
                  <MenuActionButton
                    icon={<MessageCircle size={15} />}
                    label="Enviar por WhatsApp"
                    onClick={() => {
                      void onWhatsApp(quote);
                      onClose();
                    }}
                  />

                  <MenuActionButton
                    icon={<Send size={15} />}
                    label="Marcar como enviada"
                    disabled={!canSend}
                    onClick={() => {
                      void onSend(quote);
                      onClose();
                    }}
                  />

                  <MenuActionButton
                    icon={<CheckCircle2 size={15} />}
                    label="Aprobar cotización"
                    disabled={!canResolve}
                    onClick={() => {
                      void onApprove(quote);
                      onClose();
                    }}
                  />

                  <MenuActionButton
                    icon={<XCircle size={15} />}
                    label="Rechazar cotización"
                    disabled={!canResolve}
                    danger
                    onClick={() => {
                      void onReject(quote);
                      onClose();
                    }}
                  />

                  <MenuActionButton
                    icon={<CalendarPlus size={15} />}
                    label="Crear solicitud"
                    disabled={!canCreateRequest}
                    onClick={() => {
                      onCreateRequest(quote);
                      onClose();
                    }}
                  />

                  <div className="my-2 h-px bg-border" />

                  <MenuActionButton
                    icon={<History size={15} />}
                    label="Ver timeline"
                    onClick={() => {
                      void onTimeline(quote);
                      onClose();
                    }}
                  />

                  <MenuActionButton
                    icon={<FileDown size={15} />}
                    label="Descargar PDF"
                    onClick={() => {
                      void onDownloadPdf(quote);
                      onClose();
                    }}
                  />

                  <MenuActionButton
                    icon={<Edit2 size={15} />}
                    label="Editar cotización"
                    disabled={!canEdit}
                    onClick={() => {
                      onEdit(quote);
                      onClose();
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
};

const buildWhatsAppUrl = (phone?: string | null, message?: string): string => {
  if (!phone) return "";

  const cleanPhone = phone.replace(/\D/g, "");
  if (!cleanPhone) return "";

  const encodedMessage = message ? encodeURIComponent(message) : "";

  return `https://wa.me/${cleanPhone}${
    encodedMessage ? `?text=${encodedMessage}` : ""
  }`;
};

const normalizeEditableItems = (items?: QuoteItem[]): QuoteItem[] => {
  return (items || []).map((item, index) => ({
    id: item.id,
    quote_id: item.quote_id,
    descripcion: item.descripcion || "",
    cantidad: Number(item.cantidad || 0),
    precio_unitario: Number(item.precio_unitario || 0),
    subtotal:
      Number(item.subtotal) ||
      Number(item.cantidad || 0) * Number(item.precio_unitario || 0),
    orden: item.orden || index + 1,
  }));
};

const onlyDigits = (value: unknown): string => {
  return String(value ?? "").replace(/\D/g, "");
};

const isValidEmail = (value: unknown): boolean => {
  const email = String(value ?? "").trim();
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const QuotesSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const {
    quotes,
    loading,
    getQuotes,
    sendQuote,
    updateQuote,
    approveQuote,
    rejectQuote,
    getQuoteEvents,
    getQuotePdf,
    addQuoteItem,
    updateQuoteItem,
    deleteQuoteItem,
  } = useQuotes();

  const { updateContact } = useContacts();
  const { createRequest } = useRequests();
  const { showMessage } = useNotification();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [form, setForm] = useState<Partial<Quote>>({});
  const [originalItems, setOriginalItems] = useState<QuoteItem[]>([]);
  const [saving, setSaving] = useState<boolean>(false);

  const [requestModalOpen, setRequestModalOpen] = useState<boolean>(false);
  const [requestQuote, setRequestQuote] = useState<Quote | null>(null);
  const [requestForm, setRequestForm] =
    useState<Partial<RequestItem>>(INITIAL_REQUEST_FORM);
  const [creatingRequest, setCreatingRequest] = useState<boolean>(false);

  const [timelineOpen, setTimelineOpen] = useState<boolean>(false);
  const [timelineEvents, setTimelineEvents] = useState<QuoteEvent[]>([]);
  const [timelineLoading, setTimelineLoading] = useState<boolean>(false);
  const [timelineQuoteNumber, setTimelineQuoteNumber] = useState<string>("");

  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [openedMenuQuote, setOpenedMenuQuote] = useState<Quote | null>(null);
  const [portalThemeClassName, setPortalThemeClassName] = useState<string>(
    "admin-theme theme-light"
  );
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({
    top: 0,
    left: 0,
    placement: "bottom",
  });

  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);

  const getQuotePdfUrl = (quoteId: string): string => {
    return `${window.location.origin}/quotes/${quoteId}/pdf`;
  };

  const handleSendEmailFromModal = async (payload: {
    to: string;
    message: string;
  }): Promise<void> => {
    if (!editingQuote?.id) return;

    setSendingEmail(true);

    await sendQuote(
      editingQuote.id,
      {
        canal: "email",
        to: payload.to,
        message: payload.message,
        attachPdf: true,
      },
      async ({ success, message }) => {
        showMessage(
          message ||
            (success
              ? "Correo enviado con PDF adjunto."
              : "No se pudo enviar correo."),
          success ? "success" : "error"
        );

        if (success) await getQuotes();
      }
    );

    setSendingEmail(false);
  };

  const handleSendWhatsAppFromModal = async (payload: {
    phone: string;
    message: string;
  }): Promise<void> => {
    if (!editingQuote?.id) return;

    setSendingWhatsApp(true);

    const cleanPhone = payload.phone.replace(/\D/g, "");
    const pdfUrl = getQuotePdfUrl(editingQuote.id);

    const finalMessage = `${payload.message}

Ver PDF de cotización:
${pdfUrl}`;

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
      finalMessage
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");

    await sendQuote(
      editingQuote.id,
      {
        canal: "whatsapp",
        phone: payload.phone,
        message: finalMessage,
        attachPdf: true,
      },
      async ({ success, message }) => {
        showMessage(
          message ||
            (success
              ? "Cotización enviada por WhatsApp con link PDF."
              : "No se pudo enviar por WhatsApp."),
          success ? "success" : "error"
        );

        if (success) await getQuotes();
      }
    );

    setSendingWhatsApp(false);
  };

  useEffect(() => {
    void getQuotes();
  }, []);

  const resolveThemeClassName = (): string => {
    const themeRoot = sectionRef.current?.closest(".admin-theme");
    if (!themeRoot) return "admin-theme theme-light";

    const classList = Array.from(themeRoot.classList);
    const filtered = classList.filter(
      (item) => item === "admin-theme" || item.startsWith("theme-")
    );

    return filtered.join(" ") || "admin-theme theme-light";
  };

  const openActionMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    quote: Quote
  ): void => {
    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 250;
    const estimatedMenuHeight = 500;
    const gap = 6;

    let left = rect.right - menuWidth;
    let top = rect.bottom + gap;
    let placement: "bottom" | "top" = "bottom";

    if (left < 12) left = 12;

    if (left + menuWidth > window.innerWidth - 12) {
      left = window.innerWidth - menuWidth - 12;
    }

    if (top + estimatedMenuHeight > window.innerHeight - 12) {
      top = rect.top - estimatedMenuHeight - gap;
      placement = "top";
    }

    if (top < 12) top = 12;

    setPortalThemeClassName(resolveThemeClassName());
    setMenuPosition({ top, left, placement });
    setOpenedMenuQuote(quote);
  };

  const closeActionMenu = (): void => {
    setOpenedMenuQuote(null);
  };

  const openCreateRequest = (quote: Quote): void => {
    if (quote.estado !== "aprobada") {
      showMessage(
        "Solo puedes crear solicitud desde una cotización aprobada.",
        "info"
      );
      return;
    }

    const contactoId = quote.contacto_id || quote.contact?.id;

    if (!contactoId) {
      showMessage("No se encontró el contacto de la cotización.", "error");
      return;
    }

    setRequestQuote(quote);
    setRequestForm({
      contacto_id: contactoId,
      fecha_programada: null,
      estado: "programada",
    });
    setRequestModalOpen(true);
  };

  const closeCreateRequest = (): void => {
    setRequestModalOpen(false);
    setRequestQuote(null);
    setRequestForm(INITIAL_REQUEST_FORM);
  };

  const handleCreateRequest = async (): Promise<void> => {
    if (!requestQuote) return;

    const contactoId = requestQuote.contacto_id || requestQuote.contact?.id;

    if (!contactoId) {
      showMessage("No se encontró el contacto de la cotización.", "error");
      return;
    }

    setCreatingRequest(true);

    try {
      await createRequest({
        contacto_id: contactoId,
        fecha_programada: requestForm.fecha_programada || undefined,
        estado: requestForm.estado || "programada",
      });

      showMessage("Solicitud creada correctamente", "success");
      closeCreateRequest();
    } catch (error) {
      console.error(error);
      showMessage("Ocurrió un error al crear la solicitud", "error");
    } finally {
      setCreatingRequest(false);
    }
  };

  const openEdit = (quote: Quote): void => {
    if (quote.estado === "aprobada" || quote.estado === "rechazada") {
      showMessage("No puedes editar una cotización aprobada o rechazada.", "info");
      return;
    }

    const editableItems = normalizeEditableItems(quote.items);

    setEditingQuote(quote);
    setOriginalItems(editableItems);

    setForm({
      id: quote.id,
      contacto_id: quote.contacto_id,
      numero: quote.numero || "",
      cliente_nombre: quote.cliente_nombre || quote.contact?.nombre || "",
      cliente_empresa: quote.cliente_empresa || quote.contact?.empresa || "",
      cliente_ruc: quote.cliente_ruc || quote.contact?.numero_documento || "",
      cliente_email: quote.cliente_email || quote.contact?.email || "",
      cliente_telefono: quote.cliente_telefono || quote.contact?.telefono || "",
      asunto: quote.asunto || "",
      area: quote.area || "",
      moneda: quote.moneda || "PEN",
      descuento_tipo: quote.descuento_tipo || "porcentaje",
      descuento_valor: quote.descuento_valor ?? 0,
      igv_porcentaje: quote.igv_porcentaje ?? 18,
      aplica_igv:
        typeof quote.aplica_igv === "boolean" ? quote.aplica_igv : true,
      incluye_igv:
        typeof quote.incluye_igv === "boolean" ? quote.incluye_igv : false,
      subtotal: quote.subtotal ?? 0,
      impuestos: quote.impuestos ?? 0,
      descuento: quote.descuento ?? 0,
      fecha_envio: quote.fecha_envio || null,
      fecha_vencimiento: quote.fecha_vencimiento || null,
      observaciones: quote.observaciones || "",
      motivo_rechazo: quote.motivo_rechazo || "",
      total: quote.total,
      estado: quote.estado,
      items: editableItems.length
        ? editableItems
        : [
            {
              descripcion: "",
              cantidad: 1,
              precio_unitario: 0,
              subtotal: 0,
              orden: 1,
            },
          ],
    });

    setModalOpen(true);
  };

  const closeEdit = (): void => {
    setModalOpen(false);
    setEditingQuote(null);
    setForm({});
    setOriginalItems([]);
  };

  const validateQuoteClient = (): string | null => {
    const nombre = String(form.cliente_nombre ?? "").trim();
    const email = String(form.cliente_email ?? "").trim();
    const telefono = onlyDigits(form.cliente_telefono);
    const documento = onlyDigits(form.cliente_ruc);

    if (!nombre) return "El nombre del cliente es requerido.";
    if (!isValidEmail(email)) return "Ingresa un correo válido.";
    if (telefono.length < 7) return "Ingresa un teléfono válido.";
    if (documento && ![8, 11].includes(documento.length)) {
      return "El documento debe tener 8 dígitos para DNI o 11 para RUC.";
    }

    return null;
  };

  const validateItems = (items: QuoteItem[]): string | null => {
    if (!items.length) return "Debes agregar al menos un item.";

    const invalid = items.find((item) => {
      const descripcion = String(item.descripcion || "").trim();
      const cantidad = Number(item.cantidad || 0);
      const precioUnitario = Number(item.precio_unitario || 0);

      return !descripcion || cantidad <= 0 || precioUnitario < 0;
    });

    if (invalid) {
      return "Revisa los items: descripción obligatoria, cantidad mayor a 0 y precio unitario válido.";
    }

    return null;
  };

  const saveQuoteItems = async (
    quoteId: string,
    previousItems: QuoteItem[],
    currentItems: QuoteItem[]
  ): Promise<boolean> => {
    const normalizedCurrentItems = currentItems
      .filter((item) => String(item.descripcion || "").trim())
      .map((item, index) => ({
        ...item,
        descripcion: String(item.descripcion || "").trim(),
        cantidad: Number(item.cantidad || 0),
        precio_unitario: Number(item.precio_unitario || 0),
        subtotal: Number(item.cantidad || 0) * Number(item.precio_unitario || 0),
        orden: index + 1,
      }));

    const validationMessage = validateItems(normalizedCurrentItems);
    if (validationMessage) {
      showMessage(validationMessage, "info");
      return false;
    }

    const previousIds = previousItems
      .map((item) => item.id)
      .filter(Boolean) as string[];

    const currentIds = normalizedCurrentItems
      .map((item) => item.id)
      .filter(Boolean) as string[];

    const deletedItems = previousItems.filter(
      (item) => item.id && !currentIds.includes(item.id)
    );

    for (const item of deletedItems) {
      if (!item.id) continue;

      let ok = true;

      await deleteQuoteItem(quoteId, item.id, ({ success, message }) => {
        ok = success;

        if (!success) {
          showMessage(message || "No se pudo eliminar un item.", "error");
        }
      });

      if (!ok) return false;
    }

    for (const item of normalizedCurrentItems) {
      let ok = true;

      const payload = {
        descripcion: item.descripcion,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        orden: item.orden,
      };

      if (item.id && previousIds.includes(item.id)) {
        await updateQuoteItem(quoteId, item.id, payload, ({ success, message }) => {
          ok = success;

          if (!success) {
            showMessage(message || "No se pudo actualizar un item.", "error");
          }
        });
      } else {
        await addQuoteItem(quoteId, payload, ({ success, message }) => {
          ok = success;

          if (!success) {
            showMessage(message || "No se pudo agregar un item.", "error");
          }
        });
      }

      if (!ok) return false;
    }

    return true;
  };

  const handleSave = async (): Promise<void> => {
    if (!editingQuote?.id) return;

    if (editingQuote.estado === "aprobada" || editingQuote.estado === "rechazada") {
      showMessage("No puedes editar una cotización aprobada o rechazada.", "info");
      return;
    }

    const clientError = validateQuoteClient();
    if (clientError) {
      showMessage(clientError, "info");
      return;
    }

    const currentItems = form.items || [];
    const itemError = validateItems(currentItems);

    if (itemError) {
      showMessage(itemError, "info");
      return;
    }

    setSaving(true);

    try {
      const payload: Partial<Quote> = {
        cliente_nombre: String(form.cliente_nombre ?? "").trim() || undefined,
        cliente_empresa: String(form.cliente_empresa ?? "").trim() || undefined,
        cliente_ruc: String(form.cliente_ruc ?? "").trim() || undefined,
        cliente_email: String(form.cliente_email ?? "").trim() || undefined,
        cliente_telefono:
          String(form.cliente_telefono ?? "").trim() || undefined,
        asunto: String(form.asunto ?? "").trim() || undefined,
        area: String(form.area ?? "").trim() || undefined,
        moneda: String(form.moneda ?? "PEN").trim() || "PEN",
        descuento_tipo:
          form.descuento_tipo === "monto" ? "monto" : "porcentaje",
        descuento_valor: Number(form.descuento_valor ?? 0),
        igv_porcentaje: Number(form.igv_porcentaje ?? 18),
        aplica_igv: Boolean(form.aplica_igv),
        incluye_igv: Boolean(form.incluye_igv),
        fecha_vencimiento: form.fecha_vencimiento || null,
        observaciones: String(form.observaciones ?? "").trim() || undefined,
      };

      let updateOk = true;

      await updateQuote(editingQuote.id, payload, ({ success, message }) => {
        updateOk = success;

        if (!success) {
          showMessage(message || "Error al actualizar cotización", "error");
        }
      });

      if (!updateOk) return;

      const itemsOk = await saveQuoteItems(
        editingQuote.id,
        originalItems,
        currentItems
      );

      if (!itemsOk) return;

      showMessage("Cotización actualizada correctamente", "success");
      closeEdit();
      await getQuotes();
    } catch (error) {
      console.error(error);
      showMessage("No se pudo actualizar la cotización", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleWhatsApp = async (quote: Quote): Promise<void> => {
    const contact = quote.contact;
    const phone = quote.cliente_telefono || contact?.telefono;
    const name = quote.cliente_nombre || contact?.nombre || "";

    if (!phone) {
      showMessage("La cotización no tiene teléfono registrado", "info");
      return;
    }

    const message = `Hola ${name}, te escribimos de ServicioPro sobre tu cotización${
      quote.total !== null && quote.total !== undefined
        ? ` por ${quote.moneda || "PEN"} ${Number(quote.total).toFixed(2)}`
        : ""
    }.`;

    const url = buildWhatsAppUrl(phone, message);

    if (!url) {
      showMessage("No se pudo generar el enlace de WhatsApp", "error");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");

    if (quote.estado === "pendiente") {
      let sentOk = false;

      await sendQuote(quote.id, { canal: "whatsapp" }, ({ success, message }) => {
        sentOk = success;

        showMessage(
          message ||
            (success
              ? "Cotización enviada por WhatsApp."
              : "No se pudo enviar la cotización."),
          success ? "success" : "error"
        );
      });

      if (sentOk) await getQuotes();
    }

    if (contact?.id) {
      await updateContact(contact.id, {
        estado: "respondido",
        notas_admin: contact.notas_admin
          ? `${contact.notas_admin}\nSeguimiento por WhatsApp desde cotizaciones.`
          : "Seguimiento por WhatsApp desde cotizaciones.",
      });
    }
  };

  const handleOpenTimeline = async (quote: Quote): Promise<void> => {
    setTimelineOpen(true);
    setTimelineLoading(true);
    setTimelineEvents([]);
    setTimelineQuoteNumber(quote.numero || quote.id);

    await getQuoteEvents(quote.id, (events) => {
      setTimelineEvents(events);
    });

    setTimelineLoading(false);
  };

  const handleDownloadPdf = async (quote: Quote): Promise<void> => {
    await getQuotePdf(quote.id, ({ pdfUrl, message }) => {
      if (!pdfUrl) {
        showMessage(
          message ||
            "El backend aún no devolvió un PDF real para esta cotización.",
          "info"
        );
        return;
      }

      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `${quote.numero || `cotizacion-${quote.id}`}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 60_000);
    });
  };

  const handleApprove = async (quote: Quote): Promise<void> => {
    if (quote.estado !== "enviada") {
      showMessage("Solo puedes aprobar cotizaciones enviadas.", "info");
      return;
    }

    await approveQuote(quote.id, async ({ success, message }) => {
      showMessage(
        message || (success ? "Cotización aprobada." : "No se pudo aprobar."),
        success ? "success" : "error"
      );

      if (success) await getQuotes();
    });
  };

  const handleReject = async (quote: Quote): Promise<void> => {
    if (quote.estado !== "enviada") {
      showMessage("Solo puedes rechazar cotizaciones enviadas.", "info");
      return;
    }

    const reason =
      (window.prompt("Motivo de rechazo de la cotización:") || "").trim();

    if (!reason) {
      showMessage("Debes indicar un motivo para rechazar.", "info");
      return;
    }

    await rejectQuote(
      quote.id,
      { motivo_rechazo: reason },
      async ({ success, message }) => {
        showMessage(
          message ||
            (success ? "Cotización rechazada." : "No se pudo rechazar."),
          success ? "success" : "error"
        );

        if (success) await getQuotes();
      }
    );
  };

  const handleSend = async (quote: Quote): Promise<void> => {
    if (quote.estado !== "pendiente") {
      showMessage("Solo puedes enviar cotizaciones pendientes.", "info");
      return;
    }

    await sendQuote(quote.id, { canal: "manual" }, async ({ success, message }) => {
      showMessage(
        message || (success ? "Cotización enviada." : "No se pudo enviar."),
        success ? "success" : "error"
      );

      if (success) await getQuotes();
    });
  };

  const filteredQuotes = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return quotes.filter((quote) => {
      const matchesStatus =
        statusFilter === "all" ? true : quote.estado === statusFilter;

      if (!matchesStatus) return false;
      if (!normalizedSearch) return true;

      const name =
        quote.contact?.nombre?.toLowerCase() ||
        quote.cliente_nombre?.toLowerCase() ||
        "";
      const email =
        quote.contact?.email?.toLowerCase() ||
        quote.cliente_email?.toLowerCase() ||
        "";
      const number = quote.numero?.toLowerCase() || "";

      return (
        name.includes(normalizedSearch) ||
        email.includes(normalizedSearch) ||
        number.includes(normalizedSearch) ||
        quote.estado.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [quotes, search, statusFilter]);

  const tableRows: ReactNode[][] = useMemo(() => {
    return filteredQuotes.map((quote) => [
      <div className="min-w-44 max-w-56" key={`${quote.id}-nombre`}>
        <div className="inline-flex items-center gap-2 text-sm text-(--color-text)">
          <User size={14} />
          <span>{quote.contact?.nombre || quote.cliente_nombre || "-"}</span>
        </div>
      </div>,

      <div className="min-w-52 max-w-72" key={`${quote.id}-email`}>
        <div className="space-y-1">
          <span className="break-all text-sm text-muted-foreground">
            {quote.contact?.email || quote.cliente_email || "-"}
          </span>
          <p className="text-[11px] text-muted-foreground">
            {quote.numero || "Sin número"}
          </p>
        </div>
      </div>,

      <div className="min-w-32" key={`${quote.id}-total`}>
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-(--color-text)">
          <BadgeDollarSign size={14} />
          <span>
            {quote.total !== null && quote.total !== undefined
              ? `${quote.moneda || "PEN"} ${Number(quote.total).toFixed(2)}`
              : "-"}
          </span>
        </div>
      </div>,

      <div className="min-w-32" key={`${quote.id}-estado`}>
        <span
          className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide ${
            statusClassMap[quote.estado] || "bg-muted text-muted-foreground"
          }`}
        >
          {quote.estado}
        </span>
      </div>,

      <div
        className="min-w-36 text-sm text-muted-foreground"
        key={`${quote.id}-date`}
      >
        <div className="space-y-1">
          <p>
            {quote.created_at
              ? new Date(quote.created_at).toLocaleDateString()
              : "-"}
          </p>
          <p className="text-[11px]">
            Vence:{" "}
            {quote.fecha_vencimiento
              ? new Date(quote.fecha_vencimiento).toLocaleDateString()
              : "-"}
          </p>
        </div>
      </div>,

      <div className="flex justify-center" key={`${quote.id}-actions`}>
        <button
          type="button"
          aria-label="Abrir acciones"
          onClick={(event) => openActionMenu(event, quote)}
          className={[
            actionTriggerBaseClass,
            openedMenuQuote?.id === quote.id
              ? "border-primary bg-primary/10 text-primary shadow-sm"
              : "border-border bg-surface text-(--color-text) hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
          ].join(" ")}
        >
          <MoreHorizontal
            size={18}
            className={`transition-transform duration-200 ${
              openedMenuQuote?.id === quote.id
                ? "scale-105"
                : "group-hover:scale-105"
            }`}
          />
        </button>
      </div>,
    ]);
  }, [filteredQuotes, openedMenuQuote]);

  return (
    <>
      <section ref={sectionRef} className="space-y-6">
        <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm sm:p-5 lg:p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold sm:text-xl">Cotizaciones</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Gestiona presupuestos generados a partir de contactos.
              </p>
            </div>

            <div className="w-full md:w-auto">
              <CustomButton
                text={`${filteredQuotes.length} registros`}
                size="md"
                fontSize="14px"
                variant="secondary"
                className="w-full justify-center px-4! md:w-auto"
                icon={<FileText size={16} />}
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
            <CustomInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por contacto, correo, número o estado..."
              fullWidth
            />

            <CustomSelected
              value={statusFilter}
              onChange={(e) => setStatusFilter(String(e.target.value || "all"))}
              label="Filtrar por estado"
              options={[
                { value: "all", label: "Todos" },
                { value: "pendiente", label: "Pendiente" },
                { value: "enviada", label: "Enviada" },
                { value: "aprobada", label: "Aprobada" },
                { value: "rechazada", label: "Rechazada" },
              ]}
              fullWidth
              variant="primary"
              size="lg"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-14">
              <Loader2 className="animate-spin text-primary" size={28} />
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-surface-soft">
              <CustomTable
                headers={TABLE_HEADERS}
                data={tableRows}
                loading={loading}
                rows={6}
                columns={TABLE_HEADERS.length}
                emptyText="No hay cotizaciones registradas"
                columnWidths={[
                  "220px",
                  "280px",
                  "160px",
                  "150px",
                  "160px",
                  "96px",
                ]}
                columnAlignments={[
                  "left",
                  "left",
                  "left",
                  "center",
                  "left",
                  "center",
                ]}
                minWidth={1120}
                maxHeight={560}
                stickyHeader
                stickyLastColumn
                stickyLastColumnRight={0}
                allowCellOverflow
                containerOverflowX="auto"
                containerOverflowY="auto"
              />
            </div>
          )}
        </div>

        <ModalAdminQuote
          open={modalOpen}
          onClose={closeEdit}
          form={form}
          setForm={setForm}
          onSave={handleSave}
          loading={saving}
          sendingEmail={sendingEmail}
          sendingWhatsApp={sendingWhatsApp}
          onSendEmail={handleSendEmailFromModal}
          onSendWhatsApp={handleSendWhatsAppFromModal}
        />

        <ModalCreateRequest
          open={requestModalOpen}
          onClose={closeCreateRequest}
          contact={requestQuote?.contact || null}
          form={requestForm}
          setForm={setRequestForm}
          onSave={handleCreateRequest}
          loading={creatingRequest}
        />

        <CustomModal
          isOpen={timelineOpen}
          onClose={() => setTimelineOpen(false)}
          title={`Timeline: ${timelineQuoteNumber}`}
          width="min(760px, 96vw)"
          height="min(80dvh, 900px)"
        >
          <section className="space-y-3">
            {timelineLoading ? (
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface p-4 text-sm text-muted-foreground">
                <Loader2 size={16} className="animate-spin" />
                <span>Cargando eventos...</span>
              </div>
            ) : timelineEvents.length === 0 ? (
              <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted-foreground">
                No hay eventos registrados para esta cotización.
              </div>
            ) : (
              <ul className="space-y-3">
                {timelineEvents.map((event) => (
                  <li
                    key={event.id}
                    className="rounded-2xl border border-border bg-surface p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold capitalize text-(--color-text)">
                        {event.tipo_evento.replaceAll("_", " ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.created_at).toLocaleString()}
                      </p>
                    </div>

                    {event.user_name || event.user_id ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Usuario: {event.user_name || event.user_id}
                      </p>
                    ) : null}

                    {event.metadata ? (
                      <pre className="mt-3 overflow-auto rounded-xl bg-muted/30 p-3 text-xs text-(--color-text)">
                        {JSON.stringify(event.metadata, null, 2)}
                      </pre>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </CustomModal>
      </section>

      <QuoteActionMenuPortal
        open={Boolean(openedMenuQuote)}
        position={menuPosition}
        quote={openedMenuQuote}
        portalThemeClassName={portalThemeClassName}
        onClose={closeActionMenu}
        onWhatsApp={handleWhatsApp}
        onSend={handleSend}
        onApprove={handleApprove}
        onReject={handleReject}
        onTimeline={handleOpenTimeline}
        onDownloadPdf={handleDownloadPdf}
        onEdit={openEdit}
        onCreateRequest={openCreateRequest}
      />
    </>
  );
};

export default QuotesSection;