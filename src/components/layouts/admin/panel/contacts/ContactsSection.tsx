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
  Trash2,
  Edit2,
  Mail,
  Phone,
  Building2,
  MessageSquare,
  Archive,
  ArchiveRestore,
  FileText,
  MessageCircle,
  CheckCircle2,
  MoreHorizontal,
} from "lucide-react";

import { useContacts } from "@/hooks/useContacts";
import { useQuotes } from "@/hooks/useQuotes";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";

import { CustomTable } from "@/components/ui/kit/CustomTable";
import { CustomModalConfirm } from "@/components/ui/overlay/CustomModalConfirm";

import type { Contact } from "@/interfaces/hook/IUseContacts";
import type { Quote } from "@/interfaces/hook/IUseQuotes";

import { ModalAdminContact } from "../ModalAdminContact";
import { ModalCreateQuote } from "../ModalCreateQuote";

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

const actionTriggerBaseClass =
  "group flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer";

const statusClassMap: Record<string, string> = {
  nuevo: "bg-blue-500 text-white",
  leido: "bg-amber-500 text-white",
  respondido: "bg-emerald-500 text-white",
  eliminado: "bg-red-500 text-white",
};

const INITIAL_FORM: Partial<Contact> = {
  nombre: "",
  email: "",
  telefono: "",
  empresa: "",
  tipo_cliente: null,
  tipo_documento: null,
  numero_documento: "",
  servicio_id: null,
  mensaje: "",
  estado: "nuevo",
  archivado: false,
  notas_admin: "",
};

const INITIAL_QUOTE_FORM: Partial<Quote> = {
  contacto_id: "",
  cliente_nombre: "",
  cliente_empresa: "",
  cliente_ruc: "",
  cliente_email: "",
  cliente_telefono: "",
  numero: "",
  asunto: "",
  area: "",
  moneda: "PEN",
  descuento_tipo: "porcentaje",
  descuento_valor: 0,
  igv_porcentaje: 18,
  aplica_igv: true,
  incluye_igv: false,
  fecha_vencimiento: null,
  observaciones: "",
  items: [
    {
      descripcion: "",
      cantidad: 1,
      precio_unitario: 0,
      subtotal: 0,
      orden: 1,
    },
  ],
};

const ACTIVE_QUOTE_STATUSES: Quote["estado"][] = [
  "pendiente",
  "enviada",
  "aprobada",
];

const buildWhatsAppUrl = (phone?: string | null, message?: string): string => {
  if (!phone) return "";

  const cleanPhone = phone.replace(/\D/g, "");
  if (!cleanPhone) return "";

  const encodedMessage = message ? encodeURIComponent(message) : "";

  return `https://wa.me/${cleanPhone}${
    encodedMessage ? `?text=${encodedMessage}` : ""
  }`;
};

const isDeletedContact = (contact: Contact): boolean => {
  return contact.estado === "eliminado";
};

const getContactStatusLabel = (contact: Contact): string => {
  if (contact.estado === "eliminado") return "Eliminado";
  if (contact.archivado === true) return "Archivado";
  if (contact.estado === "nuevo") return "Nuevo";
  if (contact.estado === "leido") return "Leído";
  if (contact.estado === "respondido") return "Respondido";
  return "No definido";
};

const getContactStatusClass = (contact: Contact): string => {
  if (contact.estado === "eliminado") {
    return "bg-red-500 text-white";
  }

  if (contact.archivado === true) {
    return "bg-muted/70 text-muted-foreground";
  }

  return statusClassMap[contact.estado || ""] || "bg-muted text-foreground";
};

type ContactTab = "activos" | "archivados" | "eliminados";

type MenuPosition = {
  top: number;
  left: number;
  placement: "bottom" | "top";
};

interface ContactActionMenuPortalProps {
  open: boolean;
  position: MenuPosition;
  contact: Contact | null;
  portalThemeClassName: string;
  onClose: () => void;
  onEdit: (contact: Contact) => Promise<void>;
  onWhatsApp: (contact: Contact) => Promise<void>;
  onResponded: (contact: Contact) => Promise<void>;
  onCreateQuote: (contact: Contact) => Promise<void> | void;
  onToggleArchive: (contact: Contact) => Promise<void> | void;
  onDelete: (contact: Contact) => void;
}

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

const ContactActionMenuPortal = ({
  open,
  position,
  contact,
  portalThemeClassName,
  onClose,
  onEdit,
  onWhatsApp,
  onResponded,
  onCreateQuote,
  onToggleArchive,
  onDelete,
}: ContactActionMenuPortalProps) => {
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

    const handleResize = () => onClose();

    document.addEventListener("mousedown", handlePointerDownOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handlePointerDownOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleResize);
    };
  }, [open, onClose]);

  if (!contact) return null;

  const isArchived = contact.archivado === true;
  const isDeleted = isDeletedContact(contact);

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className={portalThemeClassName || "admin-theme theme-light"}>
          <motion.div
            ref={menuRef}
            className="fixed z-[9998] w-[230px]"
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
              <div className="max-h-[min(420px,calc(100vh-32px))] overflow-y-auto">
                <div className="sticky top-0 z-[1] border-b border-border bg-surface-soft px-3 py-2.5 backdrop-blur-sm">
                  <p className="truncate text-sm font-semibold text-(--color-text)">
                    {contact.nombre}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {isDeleted
                      ? "Contacto eliminado"
                      : contact.service?.titulo || "Sin servicio"}
                  </p>
                </div>

                <div className="p-2">
                  <MenuActionButton
                    icon={<Edit2 size={15} />}
                    label="Gestionar contacto"
                    disabled={isDeleted}
                    onClick={() => {
                      void onEdit(contact);
                      onClose();
                    }}
                  />

                  <MenuActionButton
                    icon={<MessageCircle size={15} />}
                    label="Abrir WhatsApp"
                    disabled={isDeleted}
                    onClick={() => {
                      void onWhatsApp(contact);
                      onClose();
                    }}
                  />

                  <MenuActionButton
                    icon={<CheckCircle2 size={15} />}
                    label="Marcar respondido"
                    disabled={isDeleted || contact.estado === "respondido"}
                    onClick={() => {
                      void onResponded(contact);
                      onClose();
                    }}
                  />

                  <MenuActionButton
                    icon={<FileText size={15} />}
                    label="Crear cotización"
                    disabled={isDeleted}
                    onClick={() => {
                      void onCreateQuote(contact);
                      onClose();
                    }}
                  />

                  <MenuActionButton
                    icon={
                      isArchived ? (
                        <ArchiveRestore size={15} />
                      ) : (
                        <Archive size={15} />
                      )
                    }
                    label={isArchived ? "Desarchivar" : "Archivar"}
                    disabled={isDeleted}
                    onClick={() => {
                      void onToggleArchive(contact);
                      onClose();
                    }}
                  />

                  <div className="my-2 h-px bg-border" />

                  <MenuActionButton
                    icon={<Trash2 size={15} />}
                    label="Eliminar contacto"
                    danger
                    disabled={isDeleted}
                    onClick={() => {
                      onDelete(contact);
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

const ContactsSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { contacts, loading, getContacts, updateContact } = useContacts();

  const { createQuote, getQuotesByContact } = useQuotes();
  const { showMessage } = useNotification();

  const [activeTab, setActiveTab] = useState<ContactTab>("activos");

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [form, setForm] = useState<Partial<Contact>>(INITIAL_FORM);
  const [saving, setSaving] = useState<boolean>(false);

  const [deleteContactTarget, setDeleteContactTarget] =
    useState<Contact | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const [quoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [quoteForm, setQuoteForm] = useState<Partial<Quote>>(INITIAL_QUOTE_FORM);
  const [creatingQuote, setCreatingQuote] = useState<boolean>(false);

  const [openedMenuContact, setOpenedMenuContact] =
    useState<Contact | null>(null);

  const [portalThemeClassName, setPortalThemeClassName] = useState<string>(
    "admin-theme theme-light"
  );

  const [menuPosition, setMenuPosition] = useState<MenuPosition>({
    top: 0,
    left: 0,
    placement: "bottom",
  });

  const activeContacts = useMemo(() => {
    return contacts.filter(
      (contact) => contact.archivado !== true && contact.estado !== "eliminado"
    );
  }, [contacts]);

  const archivedContacts = useMemo(() => {
    return contacts.filter(
      (contact) => contact.archivado === true && contact.estado !== "eliminado"
    );
  }, [contacts]);

  const deletedContacts = useMemo(() => {
    return contacts.filter((contact) => contact.estado === "eliminado");
  }, [contacts]);

  const visibleContacts = useMemo(() => {
    if (activeTab === "archivados") return archivedContacts;
    if (activeTab === "eliminados") return deletedContacts;
    return activeContacts;
  }, [activeTab, activeContacts, archivedContacts, deletedContacts]);

  useEffect(() => {
    void getContacts();
  }, []);

  const resetForm = (): void => {
    setForm(INITIAL_FORM);
    setEditingContact(null);
  };

  const resetQuoteForm = (): void => {
    setQuoteForm(INITIAL_QUOTE_FORM);
    setSelectedContact(null);
  };

  const closeActionMenu = (): void => {
    setOpenedMenuContact(null);
  };

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
    contact: Contact
  ): void => {
    if (isDeletedContact(contact)) {
      showMessage("Este contacto está eliminado y no permite acciones.", "info");
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 230;
    const estimatedMenuHeight = 420;
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
    setOpenedMenuContact(contact);
  };

  const openEdit = async (contact: Contact): Promise<void> => {
    if (isDeletedContact(contact)) {
      showMessage("No puedes gestionar un contacto eliminado.", "info");
      return;
    }

    let nextStatus = contact.estado;

    if (contact.archivado !== true && contact.estado === "nuevo") {
      nextStatus = "leido";

      await updateContact(contact.id, {
        estado: "leido",
      });
    }

    const nextContact: Contact = {
      ...contact,
      estado: nextStatus,
      archivado: contact.archivado === true,
    };

    setEditingContact(nextContact);

    setForm({
      id: contact.id,
      nombre: contact.nombre,
      email: contact.email,
      telefono: contact.telefono,
      empresa: contact.empresa,
      tipo_cliente: contact.tipo_cliente ?? null,
      tipo_documento: contact.tipo_documento ?? null,
      numero_documento: contact.numero_documento ?? "",
      servicio_id: contact.servicio_id,
      mensaje: contact.mensaje,
      estado: nextStatus,
      archivado: contact.archivado === true,
      notas_admin: contact.notas_admin,
      ip: contact.ip,
      created_at: contact.created_at,
      updated_at: contact.updated_at,
      service: contact.service ?? null,
    });

    setModalOpen(true);
  };

  const openCreateQuote = async (contact: Contact): Promise<void> => {
    if (isDeletedContact(contact)) {
      showMessage("No puedes crear cotización para un contacto eliminado.", "info");
      return;
    }

    getQuotesByContact(contact.id, (contactQuotes) => {
      const enabledQuote = contactQuotes.find((quote) =>
        ACTIVE_QUOTE_STATUSES.includes(quote.estado)
      );

      if (enabledQuote) {
        showMessage(
          "Este contacto ya tiene una cotización activa. No es necesario crear otra.",
          "info"
        );
        return;
      }

      setSelectedContact(contact);

      setQuoteForm({
        contacto_id: contact.id,
        cliente_nombre: contact.nombre || "",
        cliente_empresa: contact.empresa || "",
        cliente_ruc: contact.numero_documento || "",
        cliente_email: contact.email || "",
        cliente_telefono: contact.telefono || "",
        numero: "",
        asunto: "",
        area: "",
        moneda: "PEN",
        descuento_tipo: "porcentaje",
        descuento_valor: 0,
        igv_porcentaje: 18,
        aplica_igv: true,
        incluye_igv: false,
        fecha_vencimiento: null,
        observaciones: "",
        items: [
          {
            descripcion: contact.service?.titulo || "",
            cantidad: 1,
            precio_unitario: 0,
            subtotal: 0,
            orden: 1,
          },
        ],
      });

      setQuoteModalOpen(true);
    });
  };

  const handleWhatsApp = async (contact: Contact): Promise<void> => {
    if (isDeletedContact(contact)) {
      showMessage("No puedes contactar por WhatsApp a un contacto eliminado.", "info");
      return;
    }

    if (!contact.telefono) {
      showMessage("El contacto no tiene teléfono registrado", "info");
      return;
    }

    const message = `Hola ${contact.nombre}, te escribimos de ServicioPro sobre tu solicitud${
      contact.service?.titulo ? ` de ${contact.service.titulo}` : ""
    }.`;

    const url = buildWhatsAppUrl(contact.telefono, message);

    if (!url) {
      showMessage("No se pudo generar el enlace de WhatsApp", "error");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");

    if (contact.estado !== "respondido") {
      await updateContact(contact.id, {
        estado: "respondido",
      });

      await getContacts();
    }
  };

  const handleMarkAsResponded = async (contact: Contact): Promise<void> => {
    if (isDeletedContact(contact)) {
      showMessage("No puedes responder un contacto eliminado.", "info");
      return;
    }

    if (contact.estado === "respondido") {
      showMessage("El contacto ya está marcado como respondido", "info");
      return;
    }

    await updateContact(contact.id, {
      estado: "respondido",
    });

    showMessage("Contacto marcado como respondido", "success");
    await getContacts();
  };

  const handleToggleArchive = async (contact: Contact): Promise<void> => {
    if (isDeletedContact(contact)) {
      showMessage("No puedes archivar o desarchivar un contacto eliminado.", "info");
      return;
    }

    const nextArchived = contact.archivado !== true;

    await updateContact(contact.id, {
      archivado: nextArchived,
    });

    if (editingContact?.id === contact.id) {
      setEditingContact((prev) =>
        prev
          ? {
              ...prev,
              archivado: nextArchived,
            }
          : prev
      );

      setForm((prev) => ({
        ...prev,
        archivado: nextArchived,
      }));
    }

    showMessage(
      nextArchived ? "Contacto archivado" : "Contacto desarchivado",
      "success"
    );

    await getContacts();
  };

  const handleSave = async (): Promise<void> => {
    if (!editingContact?.id) return;

    if (isDeletedContact(editingContact)) {
      showMessage("No puedes actualizar un contacto eliminado.", "info");
      return;
    }

    setSaving(true);

    try {
      await updateContact(editingContact.id, {
        notas_admin: form.notas_admin ?? "",
        estado: form.estado ?? editingContact.estado,
        archivado: form.archivado === true,
      });

      showMessage("Contacto actualizado correctamente", "success");
      setModalOpen(false);
      resetForm();
      await getContacts();
    } catch (error) {
      console.error(error);
      showMessage("No se pudo actualizar el contacto", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateQuote = async (): Promise<void> => {
    if (!selectedContact?.id) {
      showMessage("No se encontró el contacto seleccionado", "error");
      return;
    }

    if (isDeletedContact(selectedContact)) {
      showMessage("No puedes crear cotización para un contacto eliminado.", "info");
      return;
    }

    const items = (quoteForm.items || [])
      .filter((item) => String(item.descripcion ?? "").trim())
      .map((item, index) => {
        const cantidad = Number(item.cantidad || 0);
        const precioUnitario = Number(item.precio_unitario || 0);

        return {
          descripcion: String(item.descripcion ?? "").trim(),
          cantidad,
          precio_unitario: precioUnitario,
          subtotal: cantidad * precioUnitario,
          orden: index + 1,
        };
      });

    if (!items.length) {
      showMessage("Agrega al menos un item a la cotización", "info");
      return;
    }

    const hasInvalidItem = items.some(
      (item) =>
        !item.descripcion ||
        Number(item.cantidad) <= 0 ||
        Number(item.precio_unitario) < 0
    );

    if (hasInvalidItem) {
      showMessage(
        "Revisa los items: la descripción es obligatoria, la cantidad debe ser mayor a 0 y el precio no puede ser negativo",
        "info"
      );
      return;
    }

    setCreatingQuote(true);

    try {
      const payload: Partial<Quote> = {
        contacto_id: selectedContact.id,
        cliente_nombre:
          String(quoteForm.cliente_nombre ?? "").trim() || undefined,
        cliente_empresa:
          String(quoteForm.cliente_empresa ?? "").trim() || undefined,
        cliente_ruc: String(quoteForm.cliente_ruc ?? "").trim() || undefined,
        cliente_email:
          String(quoteForm.cliente_email ?? "").trim() || undefined,
        cliente_telefono:
          String(quoteForm.cliente_telefono ?? "").trim() || undefined,
        numero: String(quoteForm.numero ?? "").trim() || undefined,
        asunto: String(quoteForm.asunto ?? "").trim() || undefined,
        area: String(quoteForm.area ?? "").trim() || undefined,
        moneda: String(quoteForm.moneda ?? "PEN").trim() || "PEN",
        descuento_tipo:
          quoteForm.descuento_tipo === "monto" ? "monto" : "porcentaje",
        descuento_valor: Number(quoteForm.descuento_valor ?? 0),
        igv_porcentaje: Number(quoteForm.igv_porcentaje ?? 18),
        aplica_igv: quoteForm.aplica_igv === true,
        incluye_igv: quoteForm.incluye_igv === true,
        fecha_vencimiento: quoteForm.fecha_vencimiento || undefined,
        observaciones:
          String(quoteForm.observaciones ?? "").trim() || undefined,
        items,
      };

      await createQuote(payload);

      if (selectedContact.estado !== "respondido") {
        await updateContact(selectedContact.id, {
          estado: "respondido",
        });
      }

      showMessage("Cotización creada correctamente", "success");
      setQuoteModalOpen(false);
      resetQuoteForm();
      await getContacts();
    } catch (error) {
      console.error(error);
      showMessage("Ocurrió un error al crear la cotización", "error");
    } finally {
      setCreatingQuote(false);
    }
  };

  const handlePrepareDelete = (contact: Contact): void => {
    if (isDeletedContact(contact)) {
      showMessage("Este contacto ya está eliminado.", "info");
      return;
    }

    getQuotesByContact(contact.id, (contactQuotes) => {
      const activeQuote = contactQuotes.find((quote) =>
        ACTIVE_QUOTE_STATUSES.includes(quote.estado)
      );

      if (activeQuote) {
        showMessage(
          "No puedes eliminar este contacto porque tiene una cotización pendiente, enviada o aprobada.",
          "info"
        );
        return;
      }

      setDeleteContactTarget(contact);
    });
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!deleteContactTarget?.id) return;

    setDeleting(true);

    try {
      await updateContact(deleteContactTarget.id, {
        estado: "eliminado",
        archivado: true,
      });

      showMessage("Contacto marcado como eliminado", "success");
      setDeleteContactTarget(null);
      await getContacts();
    } catch (error) {
      console.error(error);
      showMessage("No se pudo eliminar el contacto", "error");
    } finally {
      setDeleting(false);
    }
  };

  const tableRows = useMemo(() => {
    return visibleContacts.map((contact) => {
      const deleted = isDeletedContact(contact);

      return [
        contact.nombre || "-",
        <div className="flex items-center gap-2" key={`email-${contact.id}`}>
          <Mail size={15} className="text-muted-foreground" />
          <span className="truncate">{contact.email || "-"}</span>
        </div>,
        <div className="flex items-center gap-2" key={`phone-${contact.id}`}>
          <Phone size={15} className="text-muted-foreground" />
          <span>{contact.telefono || "-"}</span>
        </div>,
        <div className="flex items-center gap-2" key={`company-${contact.id}`}>
          <Building2 size={15} className="text-muted-foreground" />
          <span className="truncate">{contact.empresa || "-"}</span>
        </div>,
        contact.service?.titulo || "-",
        <div className="flex items-start gap-2" key={`message-${contact.id}`}>
          <MessageSquare
            size={15}
            className="mt-0.5 shrink-0 text-muted-foreground"
          />
          <span className="line-clamp-2 text-left">
            {contact.mensaje || "-"}
          </span>
        </div>,
        <span
          key={`status-${contact.id}`}
          className={`inline-flex min-w-[110px] justify-center rounded-full px-3 py-1 text-xs font-semibold ${getContactStatusClass(
            contact
          )}`}
        >
          {getContactStatusLabel(contact)}
        </span>,
        <div className="flex justify-center" key={`actions-${contact.id}`}>
          {deleted ? (
            <span className="text-xs font-medium text-muted-foreground">
              Sin acciones
            </span>
          ) : (
            <button
              type="button"
              aria-label="Abrir acciones"
              onClick={(event) => openActionMenu(event, contact)}
              className={[
                actionTriggerBaseClass,
                openedMenuContact?.id === contact.id
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border bg-surface text-(--color-text) hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
              ].join(" ")}
            >
              <MoreHorizontal
                size={18}
                className={`transition-transform duration-200 ${
                  openedMenuContact?.id === contact.id
                    ? "scale-105"
                    : "group-hover:scale-105"
                }`}
              />
            </button>
          )}
        </div>,
      ];
    });
  }, [visibleContacts, openedMenuContact]);

  return (
    <>
      <section ref={sectionRef} className="space-y-6">
        <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm sm:p-5 lg:p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold sm:text-xl">Contactos</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Administra los mensajes recibidos desde el sitio web y crea
              cotizaciones desde cada contacto.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("activos")}
                className={[
                  "rounded-full border px-4 py-2 text-sm font-semibold transition",
                  activeTab === "activos"
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-surface-soft text-(--color-text) hover:bg-muted/60",
                ].join(" ")}
              >
                Activos ({activeContacts.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("archivados")}
                className={[
                  "rounded-full border px-4 py-2 text-sm font-semibold transition",
                  activeTab === "archivados"
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-surface-soft text-(--color-text) hover:bg-muted/60",
                ].join(" ")}
              >
                Archivados ({archivedContacts.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("eliminados")}
                className={[
                  "rounded-full border px-4 py-2 text-sm font-semibold transition",
                  activeTab === "eliminados"
                    ? "border-red-500 bg-red-500 text-white"
                    : "border-border bg-surface-soft text-(--color-text) hover:bg-red-500/10 hover:text-red-500",
                ].join(" ")}
              >
                Eliminados ({deletedContacts.length})
              </button>
            </div>
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
                emptyText={
                  activeTab === "activos"
                    ? "No hay contactos activos"
                    : activeTab === "archivados"
                      ? "No hay contactos archivados"
                      : "No hay contactos eliminados"
                }
                columnWidths={[
                  "220px",
                  "280px",
                  "170px",
                  "180px",
                  "180px",
                  "360px",
                  "140px",
                  "110px",
                ]}
                columnAlignments={[
                  "left",
                  "left",
                  "left",
                  "left",
                  "left",
                  "left",
                  "center",
                  "center",
                ]}
                minWidth={1620}
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

        <CustomModalConfirm
          isOpen={deleteContactTarget !== null}
          onClose={() => setDeleteContactTarget(null)}
          onConfirm={handleDeleteConfirm}
          loading={deleting}
          title="Eliminar contacto"
          message="Este contacto se marcará como eliminado y quedará sin acciones. No se eliminará físicamente de la base de datos."
          confirmText="Eliminar"
          cancelText="Cancelar"
        />
      </section>

      <ContactActionMenuPortal
        open={openedMenuContact !== null}
        position={menuPosition}
        contact={openedMenuContact}
        portalThemeClassName={portalThemeClassName}
        onClose={closeActionMenu}
        onEdit={openEdit}
        onWhatsApp={handleWhatsApp}
        onResponded={handleMarkAsResponded}
        onCreateQuote={openCreateQuote}
        onToggleArchive={handleToggleArchive}
        onDelete={handlePrepareDelete}
      />
    </>
  );
};

export default ContactsSection;