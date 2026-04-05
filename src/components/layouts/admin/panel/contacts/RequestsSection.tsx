/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Loader2,
  Edit2,
  CalendarDays,
  User,
  MessageCircle,
} from "lucide-react";

import { useRequests } from "@/hooks/useRequests";
import { useContacts } from "@/hooks/useContacts";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";

import { CustomTable } from "@/components/ui/kit/CustomTable";
import { CustomButton } from "@/components/ui/kit/CustomButton";

import type { RequestItem } from "@/interfaces/hook/IUseRequests";
import { ModalAdminRequest } from "../ModalAdminRequest";

const TABLE_HEADERS: string[] = [
  "Contacto",
  "Email",
  "Fecha programada",
  "Estado",
  "Fecha de registro",
  "Acciones",
];

const actionBtnClass =
  "flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface transition-all duration-200 hover:bg-muted/60";

const actionBtnWhatsappClass =
  "flex h-9 w-9 items-center justify-center rounded-xl border border-green-500/20 bg-green-500/8 text-green-600 transition-all duration-200 hover:bg-green-500/15";

const statusClassMap: Record<string, string> = {
  pendiente: "bg-amber-500 text-white",
  programada: "bg-blue-500 text-white",
  en_proceso: "bg-violet-500 text-white",
  finalizada: "bg-emerald-500 text-white",
  cancelada: "bg-red-500 text-white",
};

const buildWhatsAppUrl = (phone?: string | null, message?: string): string => {
  if (!phone) return "";

  const cleanPhone = phone.replace(/\D/g, "");
  if (!cleanPhone) return "";

  const encodedMessage = message ? encodeURIComponent(message) : "";

  return `https://wa.me/${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
};

const RequestsSection = () => {
  const { requests, loading, getRequests, updateRequest } = useRequests();
  const { updateContact } = useContacts();
  const { showMessage } = useNotification();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingRequest, setEditingRequest] = useState<RequestItem | null>(null);
  const [form, setForm] = useState<Partial<RequestItem>>({});
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    getRequests();
  }, []);

  const openEdit = (request: RequestItem): void => {
    setEditingRequest(request);
    setForm({
      id: request.id,
      contacto_id: request.contacto_id,
      fecha_programada: request.fecha_programada,
      estado: request.estado,
    });
    setModalOpen(true);
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

  const handleSave = async (): Promise<void> => {
    if (!editingRequest?.id) return;

    setSaving(true);

    await updateRequest(editingRequest.id, form, ({ success, message }) => {
      if (success) {
        showMessage(message || "Solicitud actualizada correctamente", "success");
        setModalOpen(false);
        setEditingRequest(null);
        setForm({});
      } else {
        showMessage(message || "Error al actualizar solicitud", "error");
      }
    });

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

      <div className="min-w-44 text-sm text-(--color-text)" key={`${request.id}-scheduled`}>
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
          {request.estado}
        </span>
      </div>,

      <div className="min-w-36 text-sm text-muted-foreground" key={`${request.id}-date`}>
        {new Date(request.created_at).toLocaleDateString()}
      </div>,

      <div className="flex min-w-24 items-center gap-2" key={`${request.id}-actions`}>
        <button
          type="button"
          aria-label="WhatsApp solicitud"
          onClick={() => void handleWhatsApp(request)}
          className={actionBtnWhatsappClass}
        >
          <MessageCircle size={15} />
        </button>

        <button
          type="button"
          aria-label="Editar solicitud"
          onClick={() => openEdit(request)}
          className={actionBtnClass}
        >
          <Edit2 size={15} />
        </button>
      </div>,
    ]);
  }, [requests]);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm sm:p-5 lg:p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold sm:text-xl">Solicitudes</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Gestiona programaciones y atenciones derivadas de contactos.
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
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-soft">
            <CustomTable
              headers={TABLE_HEADERS}
              data={tableRows}
              loading={loading}
              rows={6}
              columns={TABLE_HEADERS.length}
              emptyText="No hay solicitudes registradas"
              columnWidths={["220px", "260px", "220px", "140px", "140px", "120px"]}
              minWidth={1120}
              maxHeight={560}
            />
          </div>
        )}
      </div>

      <ModalAdminRequest
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingRequest(null);
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

export default RequestsSection;