/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Loader2,
  Trash2,
  Edit2,
  Mail,
  Phone,
  Building2,
  MessageSquare,
  Archive,
  FileText,
  CalendarPlus,
  MessageCircle,
} from "lucide-react";

import { useContacts } from "@/hooks/useContacts";
import { useQuotes } from "@/hooks/useQuotes";
import { useRequests } from "@/hooks/useRequests";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";

import { CustomTable } from "@/components/ui/kit/CustomTable";
import { CustomModalConfirm } from "@/components/ui/overlay/CustomModalConfirm";

import type { Contact } from "@/interfaces/hook/IUseContacts";
import type { Quote } from "@/interfaces/hook/IUseQuotes";
import type { RequestItem } from "@/interfaces/hook/IUseRequests";

import { ModalAdminContact } from "../ModalAdminContact";
import { ModalCreateQuote } from "../ModalCreateQuote";
import { ModalCreateRequest } from "../ModalCreateRequest";

const TABLE_HEADERS: string[] = [
  "Nombre",
  "Email",
  "Teléfono",
  "Empresa",
  "Servicio",
  "Mensaje",
  "Estado",
  "Acciones",
];

const actionBtnClass =
  "flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-(--color-text) transition-all duration-200 hover:bg-muted/60";

const actionBtnDangerClass =
  "flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/8 text-red-500 transition-all duration-200 hover:bg-red-500/15";

const actionBtnSuccessClass =
  "flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/8 text-emerald-600 transition-all duration-200 hover:bg-emerald-500/15";

const actionBtnInfoClass =
  "flex h-9 w-9 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/8 text-sky-600 transition-all duration-200 hover:bg-sky-500/15";

const actionBtnWhatsappClass =
  "flex h-9 w-9 items-center justify-center rounded-xl border border-green-500/20 bg-green-500/8 text-green-600 transition-all duration-200 hover:bg-green-500/15";

const statusClassMap: Record<string, string> = {
  nuevo: "bg-blue-500 text-white",
  leido: "bg-amber-500 text-white",
  respondido: "bg-emerald-500 text-white",
  archivado: "bg-muted/70 text-muted-foreground",
  eliminado: "bg-red-500 text-white",
};

const INITIAL_FORM: Partial<Contact> = {
  nombre: "",
  email: "",
  telefono: "",
  empresa: "",
  servicio_id: null,
  mensaje: "",
  estado: "nuevo",
  notas_admin: "",
};

const INITIAL_QUOTE_FORM: Partial<Quote> = {
  contacto_id: "",
  total: null,
  estado: "pendiente",
};

const INITIAL_REQUEST_FORM: Partial<RequestItem> = {
  contacto_id: "",
  fecha_programada: null,
  estado: "pendiente",
};

const buildWhatsAppUrl = (phone?: string | null, message?: string): string => {
  if (!phone) return "";

  const cleanPhone = phone.replace(/\D/g, "");
  if (!cleanPhone) return "";

  const encodedMessage = message ? encodeURIComponent(message) : "";

  return `https://wa.me/${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
};

const ContactsSection = () => {
  const {
    contacts,
    loading,
    getContacts,
    updateContact,
    deleteContact,
    toggleArchivedContact,
  } = useContacts();

  const { createQuote } = useQuotes();
  const { createRequest } = useRequests();
  const { showMessage } = useNotification();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [form, setForm] = useState<Partial<Contact>>(INITIAL_FORM);
  const [saving, setSaving] = useState<boolean>(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const [quoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);
  const [requestModalOpen, setRequestModalOpen] = useState<boolean>(false);

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [quoteForm, setQuoteForm] = useState<Partial<Quote>>(INITIAL_QUOTE_FORM);
  const [requestForm, setRequestForm] =
    useState<Partial<RequestItem>>(INITIAL_REQUEST_FORM);

  const [creatingQuote, setCreatingQuote] = useState<boolean>(false);
  const [creatingRequest, setCreatingRequest] = useState<boolean>(false);

  useEffect(() => {
    getContacts();
  }, []);

  const resetForm = (): void => {
    setForm(INITIAL_FORM);
    setEditingContact(null);
  };

  const resetQuoteForm = (): void => {
    setQuoteForm(INITIAL_QUOTE_FORM);
    setSelectedContact(null);
  };

  const resetRequestForm = (): void => {
    setRequestForm(INITIAL_REQUEST_FORM);
    setSelectedContact(null);
  };

  const openEdit = (contact: Contact): void => {
    setEditingContact(contact);
    setForm({
      id: contact.id,
      nombre: contact.nombre,
      email: contact.email,
      telefono: contact.telefono,
      empresa: contact.empresa,
      servicio_id: contact.servicio_id,
      mensaje: contact.mensaje,
      estado: contact.estado,
      notas_admin: contact.notas_admin,
    });
    setModalOpen(true);
  };

  const openCreateQuote = (contact: Contact): void => {
    setSelectedContact(contact);
    setQuoteForm({
      contacto_id: contact.id,
      total: null,
      estado: "pendiente",
    });
    setQuoteModalOpen(true);
  };

  const openCreateRequest = (contact: Contact): void => {
    setSelectedContact(contact);
    setRequestForm({
      contacto_id: contact.id,
      fecha_programada: null,
      estado: "pendiente",
    });
    setRequestModalOpen(true);
  };

  const handleWhatsApp = async (contact: Contact): Promise<void> => {
    if (!contact.telefono) {
      showMessage("El contacto no tiene teléfono registrado", "info");
      return;
    }

    const message = `Hola ${contact.nombre}, te escribimos de ServicioPro sobre tu solicitud${contact.service?.titulo ? ` de ${contact.service.titulo}` : ""}.`;
    const url = buildWhatsAppUrl(contact.telefono, message);

    if (!url) {
      showMessage("No se pudo generar el enlace de WhatsApp", "error");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");

    if (contact.estado === "nuevo") {
      await updateContact(contact.id, { estado: "respondido" });
    }
  };

  const handleSave = async (): Promise<void> => {
    if (!editingContact?.id) return;

    setSaving(true);

    await updateContact(editingContact.id, form, ({ success, message }) => {
      if (success) {
        showMessage(message || "Contacto actualizado correctamente", "success");
        setModalOpen(false);
        resetForm();
      } else {
        showMessage(message || "Error al actualizar contacto", "error");
      }
    });

    setSaving(false);
  };

  const handleCreateQuote = async (): Promise<void> => {
    if (!selectedContact?.id) return;

    setCreatingQuote(true);

    await createQuote(
      {
        contacto_id: selectedContact.id,
        total:
          quoteForm.total === "" || quoteForm.total === undefined
            ? null
            : Number(quoteForm.total),
        estado: quoteForm.estado || "pendiente",
      },
      async ({ success, message }) => {
        if (success) {
          await updateContact(selectedContact.id, {
            estado: "respondido",
            notas_admin: selectedContact.notas_admin
              ? `${selectedContact.notas_admin}\nCotización creada desde el panel.`
              : "Cotización creada desde el panel.",
          });

          showMessage(message || "Cotización creada correctamente", "success");
          setQuoteModalOpen(false);
          resetQuoteForm();
        } else {
          showMessage(message || "Error al crear cotización", "error");
        }
      }
    );

    setCreatingQuote(false);
  };

  const handleCreateRequest = async (): Promise<void> => {
    if (!selectedContact?.id) return;

    setCreatingRequest(true);

    await createRequest(
      {
        contacto_id: selectedContact.id,
        fecha_programada: requestForm.fecha_programada || null,
        estado: requestForm.estado || "pendiente",
      },
      async ({ success, message }) => {
        if (success) {
          await updateContact(selectedContact.id, {
            estado: "respondido",
            notas_admin: selectedContact.notas_admin
              ? `${selectedContact.notas_admin}\nSolicitud creada desde el panel.`
              : "Solicitud creada desde el panel.",
          });

          showMessage(message || "Solicitud creada correctamente", "success");
          setRequestModalOpen(false);
          resetRequestForm();
        } else {
          showMessage(message || "Error al crear solicitud", "error");
        }
      }
    );

    setCreatingRequest(false);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!deleteId) return;

    setDeleting(true);

    await deleteContact(deleteId, ({ success, message }) => {
      if (success) {
        showMessage(message || "Contacto eliminado correctamente", "success");
        setDeleteId(null);
      } else {
        showMessage(message || "Error al eliminar contacto", "error");
      }
    });

    setDeleting(false);
  };

  const tableRows: ReactNode[][] = useMemo(() => {
    return contacts.map((contact) => [
      <div className="min-w-44 max-w-56" key={`${contact.id}-nombre`}>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-(--color-text)">
            {contact.nombre}
          </p>
        </div>
      </div>,

      <div className="min-w-56 max-w-72" key={`${contact.id}-email`}>
        <div className="inline-flex items-center gap-2 text-sm text-(--color-text)">
          <Mail size={14} />
          <span className="break-all">{contact.email}</span>
        </div>
      </div>,

      <div className="min-w-36" key={`${contact.id}-telefono`}>
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Phone size={14} />
          <span>{contact.telefono || "-"}</span>
        </div>
      </div>,

      <div className="min-w-40" key={`${contact.id}-empresa`}>
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 size={14} />
          <span>{contact.empresa || "-"}</span>
        </div>
      </div>,

      <div className="min-w-40" key={`${contact.id}-service`}>
        <span className="inline-flex rounded-full border border-border bg-muted/30 px-3 py-1 text-[11px] font-medium text-(--color-text)">
          {contact.service?.titulo || "-"}
        </span>
      </div>,

      <div className="min-w-72 max-w-96" key={`${contact.id}-mensaje`}>
        <div className="inline-flex items-start gap-2 text-sm text-(--color-text)">
          <MessageSquare size={14} className="mt-0.5 shrink-0" />
          <p className="line-clamp-3">{contact.mensaje}</p>
        </div>
      </div>,

      <div className="min-w-32" key={`${contact.id}-estado`}>
        <span
          className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide ${
            statusClassMap[contact.estado] || "bg-muted text-muted-foreground"
          }`}
        >
          {contact.estado}
        </span>
      </div>,

      <div
        className="flex min-w-75 items-center gap-2"
        key={`${contact.id}-actions`}
      >
        <button
          type="button"
          aria-label="Editar contacto"
          onClick={() => openEdit(contact)}
          className={actionBtnClass}
        >
          <Edit2 size={15} />
        </button>

        <button
          type="button"
          aria-label="WhatsApp contacto"
          onClick={() => void handleWhatsApp(contact)}
          className={actionBtnWhatsappClass}
        >
          <MessageCircle size={15} />
        </button>

        <button
          type="button"
          aria-label="Crear cotización"
          onClick={() => openCreateQuote(contact)}
          className={actionBtnSuccessClass}
        >
          <FileText size={15} />
        </button>

        <button
          type="button"
          aria-label="Crear solicitud"
          onClick={() => openCreateRequest(contact)}
          className={actionBtnInfoClass}
        >
          <CalendarPlus size={15} />
        </button>

        <button
          type="button"
          aria-label="Archivar contacto"
          onClick={() => void toggleArchivedContact(contact)}
          className={actionBtnClass}
        >
          <Archive size={15} />
        </button>

        <button
          type="button"
          aria-label="Eliminar contacto"
          onClick={() => setDeleteId(contact.id)}
          className={actionBtnDangerClass}
        >
          <Trash2 size={15} />
        </button>
      </div>,
    ]);
  }, [contacts, toggleArchivedContact]);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm sm:p-5 lg:p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold sm:text-xl">Contactos</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Administra los mensajes recibidos desde el sitio web y crea
              cotizaciones o solicitudes directamente desde cada contacto.
            </p>
          </div>

          <div className="w-full md:w-auto">
            <div className="flex w-full flex-wrap gap-2 md:w-auto">
              <span className="inline-flex items-center rounded-full border border-border bg-muted/30 px-3 py-2 text-xs font-medium text-(--color-text)">
                <MessageCircle size={14} className="mr-2" />
                WhatsApp
              </span>

              <span className="inline-flex items-center rounded-full border border-border bg-muted/30 px-3 py-2 text-xs font-medium text-(--color-text)">
                <FileText size={14} className="mr-2" />
                Crear cotización
              </span>

              <span className="inline-flex items-center rounded-full border border-border bg-muted/30 px-3 py-2 text-xs font-medium text-(--color-text)">
                <CalendarPlus size={14} className="mr-2" />
                Crear solicitud
              </span>
            </div>
          </div>
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
              emptyText="No hay contactos registrados"
              columnWidths={[
                "220px",
                "280px",
                "170px",
                "180px",
                "180px",
                "360px",
                "140px",
                "300px",
              ]}
              minWidth={1830}
              maxHeight={560}
            />
          </div>
        )}
      </div>

      <ModalAdminContact
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        form={form}
        setForm={setForm}
        onSave={handleSave}
        loading={saving}
      />

      <ModalCreateQuote
        open={quoteModalOpen}
        onClose={() => {
          setQuoteModalOpen(false);
          resetQuoteForm();
        }}
        contact={selectedContact}
        form={quoteForm}
        setForm={setQuoteForm}
        onSave={handleCreateQuote}
        loading={creatingQuote}
      />

      <ModalCreateRequest
        open={requestModalOpen}
        onClose={() => {
          setRequestModalOpen(false);
          resetRequestForm();
        }}
        contact={selectedContact}
        form={requestForm}
        setForm={setRequestForm}
        onSave={handleCreateRequest}
        loading={creatingRequest}
      />

      <CustomModalConfirm
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Eliminar contacto"
        message="¿Seguro que deseas eliminar este contacto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </section>
  );
};

export default ContactsSection;