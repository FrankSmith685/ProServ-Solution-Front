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
  Clock3,
  Send,
  TrendingUp,
} from "lucide-react";

import { useQuotes } from "@/hooks/useQuotes";
import { useContacts } from "@/hooks/useContacts";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";

import { CustomTable } from "@/components/ui/kit/CustomTable";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";

import type { Quote } from "@/interfaces/hook/IUseQuotes";
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
  const { quotes, loading, getQuotes, updateQuote } = useQuotes();
  const { updateContact } = useContacts();
  const { showMessage } = useNotification();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [form, setForm] = useState<Partial<Quote>>({});
  const [saving, setSaving] = useState<boolean>(false);
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
      await updateQuote(quote.id, { estado: "enviada" });
    }

    await updateContact(contact.id, {
      estado: "respondido",
      notas_admin: contact.notas_admin
        ? `${contact.notas_admin}\nSeguimiento por WhatsApp desde cotizaciones.`
        : "Seguimiento por WhatsApp desde cotizaciones.",
    });
  };

  const handleSave = async (): Promise<void> => {
    if (!editingQuote?.id) return;

    setSaving(true);

    await updateQuote(editingQuote.id, form, ({ success, message }) => {
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
        <span className="break-all text-sm text-muted-foreground">
          {quote.contact?.email || "-"}
        </span>
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
        {new Date(quote.created_at).toLocaleDateString()}
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
    </section>
  );
};

export default QuotesSection;
