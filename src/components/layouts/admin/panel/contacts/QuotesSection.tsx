/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState, type ReactNode } from "react";
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
} from "lucide-react";

import { useQuotes } from "@/hooks/useQuotes";
import { useContacts } from "@/hooks/useContacts";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";

import { CustomTable } from "@/components/ui/kit/CustomTable";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";
import { CustomModal } from "@/components/ui/overlay/CustomModal";

import type { Quote, QuoteEvent } from "@/interfaces/hook/IUseQuotes";
import { ModalAdminQuote } from "../ModalAdminQuote";

const TABLE_HEADERS: string[] = [
  "Contacto",
  "Email",
  "Total",
  "Estado",
  "Fecha",
  "Acciones",
];

const actionBtnClass =
  "flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface transition-all duration-200 hover:bg-muted/60";

const actionBtnWhatsappClass =
  "flex h-9 w-9 items-center justify-center rounded-xl border border-green-500/20 bg-green-500/8 text-green-600 transition-all duration-200 hover:bg-green-500/15";

const actionBtnApproveClass =
  "flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/8 text-emerald-600 transition-all duration-200 hover:bg-emerald-500/15";

const actionBtnRejectClass =
  "flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/8 text-red-500 transition-all duration-200 hover:bg-red-500/15";

const statusClassMap: Record<string, string> = {
  pendiente: "bg-amber-500 text-white",
  enviada: "bg-blue-500 text-white",
  aprobada: "bg-emerald-500 text-white",
  rechazada: "bg-red-500 text-white",
};

const buildWhatsAppUrl = (phone?: string | null, message?: string): string => {
  if (!phone) return "";

  const cleanPhone = phone.replace(/\D/g, "");
  if (!cleanPhone) return "";

  const encodedMessage = message ? encodeURIComponent(message) : "";

  return `https://wa.me/${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
};

const QuotesSection = () => {
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
  } = useQuotes();
  const { updateContact } = useContacts();
  const { showMessage } = useNotification();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [form, setForm] = useState<Partial<Quote>>({});
  const [saving, setSaving] = useState<boolean>(false);
  const [timelineOpen, setTimelineOpen] = useState<boolean>(false);
  const [timelineEvents, setTimelineEvents] = useState<QuoteEvent[]>([]);
  const [timelineLoading, setTimelineLoading] = useState<boolean>(false);
  const [timelineQuoteNumber, setTimelineQuoteNumber] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    getQuotes();
  }, []);

  const openEdit = (quote: Quote): void => {
    setEditingQuote(quote);
    setForm({
      id: quote.id,
      contacto_id: quote.contacto_id,
      numero: quote.numero || "",
      moneda: quote.moneda || "PEN",
      subtotal: quote.subtotal ?? 0,
      impuestos: quote.impuestos ?? 0,
      descuento: quote.descuento ?? 0,
      fecha_envio: quote.fecha_envio || null,
      fecha_vencimiento: quote.fecha_vencimiento || null,
      observaciones: quote.observaciones || "",
      motivo_rechazo: quote.motivo_rechazo || "",
      total: quote.total,
      estado: quote.estado,
    });
    setModalOpen(true);
  };

  const handleWhatsApp = async (quote: Quote): Promise<void> => {
    const contact = quote.contact;

    if (!contact?.telefono) {
      showMessage("El contacto no tiene teléfono registrado", "info");
      return;
    }

    const message = `Hola ${contact.nombre}, te escribimos de ServicioPro sobre tu cotización${quote.total !== null && quote.total !== undefined ? ` por S/ ${Number(quote.total).toFixed(2)}` : ""}.`;
    const url = buildWhatsAppUrl(contact.telefono, message);

    if (!url) {
      showMessage("No se pudo generar el enlace de WhatsApp", "error");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");

    if (quote.estado === "pendiente") {
      await sendQuote(quote.id, { canal: "whatsapp" }, ({ success, message }) => {
        showMessage(
          message || (success ? "Cotización enviada por WhatsApp." : "No se pudo enviar la cotización."),
          success ? "success" : "error"
        );
      });
    }

    await updateContact(contact.id, {
      estado: "respondido",
      notas_admin: contact.notas_admin
        ? `${contact.notas_admin}\nSeguimiento por WhatsApp desde cotizaciones.`
        : "Seguimiento por WhatsApp desde cotizaciones.",
    });
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
    const previewWindow = window.open("", "_blank", "noopener,noreferrer");

    await getQuotePdf(quote.id, ({ pdfUrl, message }) => {
      if (!pdfUrl) {
        previewWindow?.close();
        showMessage(
          message || "El backend aún no devolvió un PDF real para esta cotización.",
          "info"
        );
        return;
      }

      if (previewWindow) {
        previewWindow.location.href = pdfUrl;
      } else {
        window.open(pdfUrl, "_blank", "noopener,noreferrer");
      }

      window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 60_000);
    });
  };

  const handleApprove = async (quote: Quote): Promise<void> => {
    await approveQuote(quote.id, ({ success, message }) => {
      showMessage(
        message || (success ? "Cotización aprobada." : "No se pudo aprobar."),
        success ? "success" : "error"
      );
    });
  };

  const handleReject = async (quote: Quote): Promise<void> => {
    const reason =
      (window.prompt("Motivo de rechazo de la cotización:") || "").trim();

    if (!reason) {
      showMessage("Debes indicar un motivo para rechazar.", "info");
      return;
    }

    await rejectQuote(quote.id, { motivo_rechazo: reason }, ({ success, message }) => {
      showMessage(
        message || (success ? "Cotización rechazada." : "No se pudo rechazar."),
        success ? "success" : "error"
      );
    });
  };

  const handleSave = async (): Promise<void> => {
    if (!editingQuote?.id) return;

    setSaving(true);

    const payload: Partial<Quote> = {
      ...form,
      fecha_envio:
        form.estado === "enviada"
          ? (form.fecha_envio || new Date().toISOString())
          : null,
    };

    await updateQuote(editingQuote.id, payload, ({ success, message }) => {
      if (success) {
        showMessage(message || "Cotización actualizada correctamente", "success");
        setModalOpen(false);
        setEditingQuote(null);
        setForm({});
      } else {
        showMessage(message || "Error al actualizar cotización", "error");
      }
    });

    setSaving(false);
  };

  const filteredQuotes = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return quotes.filter((quote) => {
      const matchesStatus =
        statusFilter === "all" ? true : quote.estado === statusFilter;

      if (!matchesStatus) return false;
      if (!normalizedSearch) return true;

      const name = quote.contact?.nombre?.toLowerCase() || "";
      const email = quote.contact?.email?.toLowerCase() || "";

      return (
        name.includes(normalizedSearch) ||
        email.includes(normalizedSearch) ||
        quote.estado.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [quotes, search, statusFilter]);

  const tableRows: ReactNode[][] = useMemo(() => {
    return filteredQuotes.map((quote) => [
      <div className="min-w-44 max-w-56" key={`${quote.id}-nombre`}>
        <div className="inline-flex items-center gap-2 text-sm text-(--color-text)">
          <User size={14} />
          <span>{quote.contact?.nombre || "-"}</span>
        </div>
      </div>,

      <div className="min-w-52 max-w-72" key={`${quote.id}-email`}>
        <div className="space-y-1">
          <span className="break-all text-sm text-muted-foreground">
            {quote.contact?.email || "-"}
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
              ? `S/ ${Number(quote.total).toFixed(2)}`
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

      <div className="min-w-36 text-sm text-muted-foreground" key={`${quote.id}-date`}>
        <div className="space-y-1">
          <p>{new Date(quote.created_at).toLocaleDateString()}</p>
          <p className="text-[11px]">
            Vence:{" "}
            {quote.fecha_vencimiento
              ? new Date(quote.fecha_vencimiento).toLocaleDateString()
              : "-"}
          </p>
        </div>
      </div>,

      <div className="flex min-w-24 items-center gap-2" key={`${quote.id}-actions`}>
        <button
          type="button"
          aria-label="WhatsApp cotización"
          onClick={() => void handleWhatsApp(quote)}
          className={actionBtnWhatsappClass}
        >
          <MessageCircle size={15} />
        </button>

        {quote.estado === "enviada" ? (
          <button
            type="button"
            aria-label="Aprobar cotización"
            onClick={() => void handleApprove(quote)}
            className={actionBtnApproveClass}
          >
            <CheckCircle2 size={15} />
          </button>
        ) : null}

        {quote.estado === "enviada" ? (
          <button
            type="button"
            aria-label="Rechazar cotización"
            onClick={() => void handleReject(quote)}
            className={actionBtnRejectClass}
          >
            <XCircle size={15} />
          </button>
        ) : null}

        <button
          type="button"
          aria-label="Ver timeline de cotización"
          onClick={() => void handleOpenTimeline(quote)}
          className={actionBtnClass}
        >
          <History size={15} />
        </button>

        <button
          type="button"
          aria-label="Descargar PDF de cotización"
          onClick={() => void handleDownloadPdf(quote)}
          className={actionBtnClass}
        >
          <FileDown size={15} />
        </button>

        <button
          type="button"
          aria-label="Editar cotización"
          onClick={() => openEdit(quote)}
          className={actionBtnClass}
        >
          <Edit2 size={15} />
        </button>
      </div>,
    ]);
  }, [filteredQuotes]);

  return (
    <section className="space-y-6">
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
            placeholder="Buscar por contacto, correo o estado..."
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
            size="md"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-14">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-soft">
            <CustomTable
              headers={TABLE_HEADERS}
              data={tableRows}
              loading={loading}
              rows={6}
              columns={TABLE_HEADERS.length}
              emptyText="No hay cotizaciones registradas"
              columnWidths={["220px", "260px", "140px", "140px", "140px", "120px"]}
              minWidth={1040}
              maxHeight={560}
            />
          </div>
        )}
      </div>

      <ModalAdminQuote
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingQuote(null);
          setForm({});
        }}
        form={form}
        setForm={setForm}
        onSave={handleSave}
        loading={saving}
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
  );
};

export default QuotesSection;
