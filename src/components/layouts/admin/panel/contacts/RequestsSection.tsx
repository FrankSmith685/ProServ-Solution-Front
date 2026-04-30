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
  CalendarDays,
  User,
  MessageCircle,
  PlayCircle,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
} from "lucide-react";

import { useRequests } from "@/hooks/useRequests";
import { useContacts } from "@/hooks/useContacts";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";

import { CustomTable } from "@/components/ui/kit/CustomTable";
import { CustomButton } from "@/components/ui/kit/CustomButton";

import type { RequestItem, RequestStatus } from "@/interfaces/hook/IUseRequests";
import { ModalAdminRequest } from "../ModalAdminRequest";

const TABLE_HEADERS: string[] = [
  "Contacto",
  "Email",
  "Fecha programada",
  "Estado",
  "Fecha de registro",
  "Acciones",
];

const actionTriggerBaseClass =
  "group flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer";

const statusClassMap: Record<string, string> = {
  pendiente: "bg-amber-500 text-white",
  programada: "bg-blue-500 text-white",
  en_proceso: "bg-violet-500 text-white",
  finalizada: "bg-emerald-500 text-white",
  cancelada: "bg-red-500 text-white",
};

const statusLabelMap: Record<string, string> = {
  pendiente: "Pendiente",
  programada: "Programada",
  en_proceso: "En proceso",
  finalizada: "Finalizada",
  cancelada: "Cancelada",
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

interface RequestActionMenuPortalProps {
  open: boolean;
  position: MenuPosition;
  request: RequestItem | null;
  portalThemeClassName: string;
  onClose: () => void;
  onWhatsApp: (request: RequestItem) => Promise<void>;
  onStart: (request: RequestItem) => Promise<void>;
  onFinish: (request: RequestItem) => Promise<void>;
  onCancel: (request: RequestItem) => Promise<void>;
  onEdit: (request: RequestItem) => void;
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

const RequestActionMenuPortal = ({
  open,
  position,
  request,
  portalThemeClassName,
  onClose,
  onWhatsApp,
  onStart,
  onFinish,
  onCancel,
  onEdit,
}: RequestActionMenuPortalProps) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDownOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;

      const target = event.target as Node | null;
      if (!target) return;

      if (!menuRef.current.contains(target)) onClose();
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

  if (!request) return null;

  const isClosed =
    request.estado === "finalizada" || request.estado === "cancelada";

  const canStart = !isClosed && request.estado !== "en_proceso";
  const canFinish = !isClosed;
  const canCancel = !isClosed;

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
              <div className="max-h-[min(360px,calc(100vh-32px))] overflow-y-auto">
                <div className="sticky top-0 z-[1] border-b border-border bg-surface-soft px-3 py-2.5 backdrop-blur-sm">
                  <p className="truncate text-sm font-semibold text-(--color-text)">
                    {request.contact?.nombre || "Sin contacto"}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {statusLabelMap[request.estado] || request.estado}
                  </p>
                </div>

                <div className="p-2">
                  <MenuActionButton
                    icon={<MessageCircle size={15} />}
                    label="Abrir WhatsApp"
                    onClick={() => {
                      void onWhatsApp(request);
                      onClose();
                    }}
                  />

                  <MenuActionButton
                    icon={<PlayCircle size={15} />}
                    label="Iniciar atención"
                    disabled={!canStart}
                    onClick={() => {
                      void onStart(request);
                      onClose();
                    }}
                  />

                  <MenuActionButton
                    icon={<CheckCircle2 size={15} />}
                    label="Finalizar atención"
                    disabled={!canFinish}
                    onClick={() => {
                      void onFinish(request);
                      onClose();
                    }}
                  />

                  <MenuActionButton
                    icon={<XCircle size={15} />}
                    label="Cancelar solicitud"
                    danger
                    disabled={!canCancel}
                    onClick={() => {
                      void onCancel(request);
                      onClose();
                    }}
                  />

                  <div className="my-2 h-px bg-border" />

                  <MenuActionButton
                    icon={<Edit2 size={15} />}
                    label="Editar solicitud"
                    onClick={() => {
                      onEdit(request);
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

const RequestsSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { requests, loading, getRequests, updateRequest } = useRequests();
  const { updateContact } = useContacts();
  const { showMessage } = useNotification();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingRequest, setEditingRequest] = useState<RequestItem | null>(null);
  const [form, setForm] = useState<Partial<RequestItem>>({});
  const [saving, setSaving] = useState<boolean>(false);

  const [openedMenuRequest, setOpenedMenuRequest] =
    useState<RequestItem | null>(null);

  const [portalThemeClassName, setPortalThemeClassName] = useState<string>(
    "admin-theme theme-light"
  );

  const [menuPosition, setMenuPosition] = useState<MenuPosition>({
    top: 0,
    left: 0,
    placement: "bottom",
  });

  useEffect(() => {
    void getRequests();
  }, []);

  const closeActionMenu = (): void => {
    setOpenedMenuRequest(null);
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
    request: RequestItem
  ): void => {
    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 230;
    const estimatedMenuHeight = 360;
    const gap = 8;
    const margin = 12;

    let left = rect.right - menuWidth;
    let top = rect.bottom + gap;
    let placement: "bottom" | "top" = "bottom";

    if (left < margin) left = margin;

    if (left + menuWidth > window.innerWidth - margin) {
      left = window.innerWidth - menuWidth - margin;
    }

    if (top + estimatedMenuHeight > window.innerHeight - margin) {
      top = rect.top - estimatedMenuHeight - gap;
      placement = "top";
    }

    if (top < margin) {
      top = Math.max(margin, window.innerHeight - estimatedMenuHeight - margin);
    }

    setPortalThemeClassName(resolveThemeClassName());
    setMenuPosition({ top, left, placement });
    setOpenedMenuRequest(request);
  };

  const openEdit = (request: RequestItem): void => {
    setEditingRequest(request);

    setForm({
      id: request.id,
      contacto_id: request.contacto_id,
      fecha_programada: request.fecha_programada,
      estado: request.estado || "programada",
    });

    setModalOpen(true);
  };

  const closeEdit = (): void => {
    setModalOpen(false);
    setEditingRequest(null);
    setForm({});
  };

  const handleWhatsApp = async (request: RequestItem): Promise<void> => {
    const contact = request.contact;

    if (!contact?.telefono) {
      showMessage("El contacto no tiene teléfono registrado", "info");
      return;
    }

    const scheduledText = request.fecha_programada
      ? ` para el ${new Date(request.fecha_programada).toLocaleString()}`
      : "";

    const message = `Hola ${contact.nombre}, te escribimos de ServicioPro sobre tu solicitud${scheduledText}.`;
    const url = buildWhatsAppUrl(contact.telefono, message);

    if (!url) {
      showMessage("No se pudo generar el enlace de WhatsApp", "error");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");

    await updateContact(contact.id, {
      estado: "respondido",
      notas_admin: contact.notas_admin
        ? `${contact.notas_admin}\nSeguimiento por WhatsApp desde solicitudes.`
        : "Seguimiento por WhatsApp desde solicitudes.",
    });
  };

  const quickUpdateStatus = async (
    request: RequestItem,
    estado: RequestStatus
  ): Promise<void> => {
    if (request.estado === estado) return;

    await updateRequest(
      request.id,
      {
        estado,
        fecha_programada: request.fecha_programada,
      },
      async ({ success, message }) => {
        showMessage(
          message ||
            (success
              ? "Estado de solicitud actualizado"
              : "No se pudo actualizar la solicitud"),
          success ? "success" : "error"
        );

        if (success) await getRequests();
      }
    );
  };

  const handleSave = async (): Promise<void> => {
    if (!editingRequest?.id) return;

    if (!form.estado) {
      showMessage("Selecciona un estado para la solicitud", "info");
      return;
    }

    if (!String(form.fecha_programada ?? "").trim()) {
      showMessage("La fecha programada es requerida", "info");
      return;
    }

    setSaving(true);

    await updateRequest(
      editingRequest.id,
      {
        fecha_programada: form.fecha_programada,
        estado: form.estado,
      },
      async ({ success, message }) => {
        if (success) {
          showMessage(
            message || "Solicitud actualizada correctamente",
            "success"
          );
          closeEdit();
          await getRequests();
        } else {
          showMessage(message || "Error al actualizar solicitud", "error");
        }
      }
    );

    setSaving(false);
  };

  const tableRows: ReactNode[][] = useMemo(() => {
    return requests.map((request) => [
      <div className="min-w-44 max-w-56" key={`${request.id}-nombre`}>
        <div className="inline-flex items-center gap-2 text-sm text-(--color-text)">
          <User size={14} />
          <span>{request.contact?.nombre || "-"}</span>
        </div>
      </div>,

      <div className="min-w-52 max-w-72" key={`${request.id}-email`}>
        <span className="break-all text-sm text-muted-foreground">
          {request.contact?.email || "-"}
        </span>
      </div>,

      <div
        className="min-w-44 text-sm text-(--color-text)"
        key={`${request.id}-scheduled`}
      >
        {request.fecha_programada
          ? new Date(request.fecha_programada).toLocaleString()
          : "-"}
      </div>,

      <div className="min-w-32" key={`${request.id}-estado`}>
        <span
          className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide ${
            statusClassMap[request.estado] || "bg-muted text-muted-foreground"
          }`}
        >
          {statusLabelMap[request.estado] || request.estado}
        </span>
      </div>,

      <div
        className="min-w-36 text-sm text-muted-foreground"
        key={`${request.id}-date`}
      >
        {new Date(request.created_at).toLocaleDateString()}
      </div>,

      <div className="flex justify-center" key={`${request.id}-actions`}>
        <button
          type="button"
          aria-label="Abrir acciones"
          onClick={(event) => openActionMenu(event, request)}
          className={[
            actionTriggerBaseClass,
            openedMenuRequest?.id === request.id
              ? "border-primary bg-primary/10 text-primary shadow-sm"
              : "border-border bg-surface text-(--color-text) hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
          ].join(" ")}
        >
          <MoreHorizontal
            size={18}
            className={`transition-transform duration-200 ${
              openedMenuRequest?.id === request.id
                ? "scale-105"
                : "group-hover:scale-105"
            }`}
          />
        </button>
      </div>,
    ]);
  }, [requests, openedMenuRequest]);

  return (
    <>
      <section ref={sectionRef} className="space-y-6">
        <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm sm:p-5 lg:p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold sm:text-xl">
                Solicitudes
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Gestiona programaciones y atenciones derivadas de cotizaciones
                aprobadas.
              </p>
            </div>

            <div className="w-full md:w-auto">
              <CustomButton
                text={`${requests.length} registros`}
                size="md"
                fontSize="14px"
                variant="secondary"
                className="w-full justify-center px-4! md:w-auto"
                icon={<CalendarDays size={16} />}
              />
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
                emptyText="No hay solicitudes registradas"
                columnWidths={[
                  "220px",
                  "260px",
                  "220px",
                  "140px",
                  "140px",
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

          <ModalAdminRequest
            open={modalOpen}
            onClose={closeEdit}
            form={form}
            setForm={setForm}
            onSave={handleSave}
            loading={saving}
          />
        </div>
      </section>

      <RequestActionMenuPortal
        open={openedMenuRequest !== null}
        position={menuPosition}
        request={openedMenuRequest}
        portalThemeClassName={portalThemeClassName}
        onClose={closeActionMenu}
        onWhatsApp={handleWhatsApp}
        onStart={(request) => quickUpdateStatus(request, "en_proceso")}
        onFinish={(request) => quickUpdateStatus(request, "finalizada")}
        onCancel={(request) => quickUpdateStatus(request, "cancelada")}
        onEdit={openEdit}
      />
    </>
  );
};

export default RequestsSection;