import { type FC, useMemo, type ChangeEvent } from "react";
import {
  Save,
  Mail,
  Phone,
  Building2,
  MessageSquare,
  StickyNote,
  UserRound,
  IdCard,
  FileText,
  ShieldCheck,
  Archive,
  ArchiveRestore,
} from "lucide-react";

import { CustomModal } from "@/components/ui/overlay/CustomModal";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomButton } from "@/components/ui/kit/CustomButton";

import type { Contact } from "@/interfaces/hook/IUseContacts";

interface ModalAdminContactProps {
  open: boolean;
  onClose: () => void;
  form: Partial<Contact>;
  setForm: React.Dispatch<React.SetStateAction<Partial<Contact>>>;
  onSave: () => void;
  loading?: boolean;
}

const safeString = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
};

export const ModalAdminContact: FC<ModalAdminContactProps> = ({
  open,
  onClose,
  form,
  setForm,
  onSave,
  loading = false,
}) => {
  const noopInputChange = () => undefined;

  const handleTextChange =
    (key: "notas_admin") =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;

      setForm((prev) => ({
        ...prev,
        [key]: value,
      }));
    };

  const documentLabel = useMemo(() => {
    if (form.tipo_documento === "ruc") return "RUC";
    if (form.tipo_documento === "dni") return "DNI";
    return "Documento";
  }, [form.tipo_documento]);

  const clientTypeLabel = useMemo(() => {
    if (form.tipo_cliente === "empresa") return "Empresa";
    if (form.tipo_cliente === "persona") return "Persona natural";
    return "No definido";
  }, [form.tipo_cliente]);

  const organizationLabel = useMemo(() => {
    return form.tipo_cliente === "empresa"
      ? "Empresa"
      : "Empresa / Organización";
  }, [form.tipo_cliente]);

  const organizationValue = useMemo(() => {
    const value = safeString(form.empresa).trim();
    return value || "No registrada";
  }, [form.empresa]);

  const documentValue = useMemo(() => {
    const value = safeString(form.numero_documento).trim();
    return value || "No registrado";
  }, [form.numero_documento]);

  const currentStatusLabel = useMemo(() => {
    if (form.archivado === true) return "Archivado";
    if (form.estado === "nuevo") return "Nuevo";
    if (form.estado === "leido") return "Leído";
    if (form.estado === "respondido") return "Respondido";
    if (form.estado === "eliminado") return "Eliminado";
    return "No definido";
  }, [form.estado, form.archivado]);

  const currentFlowStatusLabel = useMemo(() => {
    if (form.estado === "nuevo") return "Nuevo";
    if (form.estado === "leido") return "Leído";
    if (form.estado === "respondido") return "Respondido";
    if (form.estado === "eliminado") return "Eliminado";
    return "No definido";
  }, [form.estado]);

  const isArchived = form.archivado === true;

  const handleToggleArchive = (): void => {
    setForm((prev) => ({
      ...prev,
      archivado: prev.archivado !== true,
    }));
  };

  return (
    <CustomModal
      isOpen={open}
      onClose={onClose}
      title="Seguimiento de contacto"
      width="min(920px, 96vw)"
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
            text={isArchived ? "Quitar de archivo" : "Archivar"}
            icon={
              isArchived ? <ArchiveRestore size={16} /> : <Archive size={16} />
            }
            variant="secondary"
            onClick={handleToggleArchive}
            className="w-full! gap-2! px-4! sm:w-auto!"
            fontSize="14px"
          />

          <CustomButton
            text={loading ? "Guardando..." : "Guardar cambios"}
            icon={<Save size={16} />}
            onClick={onSave}
            loading={loading}
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
              Información enviada por el cliente
            </h4>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Estos datos son de solo lectura para mantener la integridad del
              registro original.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CustomInput
                label="Nombre"
                value={safeString(form.nombre) || "No registrado"}
                icon={
                  <UserRound
                    size={18}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
                fullWidth
                disabled
                onChange={noopInputChange}
              />

              <CustomInput
                label="Correo"
                value={safeString(form.email) || "No registrado"}
                icon={
                  <Mail
                    size={18}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
                fullWidth
                disabled
                onChange={noopInputChange}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CustomInput
                label="Teléfono"
                value={safeString(form.telefono) || "No registrado"}
                icon={
                  <Phone
                    size={18}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
                fullWidth
                disabled
                onChange={noopInputChange}
              />

              <CustomInput
                label={organizationLabel}
                value={organizationValue}
                icon={
                  <Building2
                    size={18}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
                fullWidth
                disabled
                onChange={noopInputChange}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CustomInput
                label="Tipo de cliente"
                value={clientTypeLabel}
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

              <CustomInput
                label={documentLabel}
                value={documentValue}
                icon={
                  <IdCard
                    size={18}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
                fullWidth
                disabled
                onChange={noopInputChange}
              />
            </div>

            <CustomInput
              label="Mensaje"
              value={safeString(form.mensaje) || "Sin mensaje"}
              multiline
              rows={5}
              icon={
                <MessageSquare
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

        <div className="rounded-2xl border border-border bg-surface-soft p-4 sm:p-5">
          <div className="mb-4 space-y-1">
            <h4 className="text-sm font-semibold sm:text-base">
              Gestión interna
            </h4>
            <p className="text-xs text-muted-foreground sm:text-sm">
              El estado se actualiza automáticamente según las acciones
              realizadas. Aquí solo registras notas internas y decides si el
              contacto queda archivado.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <CustomInput
              label="Estado visible"
              value={currentStatusLabel}
              icon={
                <FileText
                  size={18}
                  style={{ color: "var(--color-text-muted)" }}
                />
              }
              fullWidth
              disabled
              onChange={noopInputChange}
            />

            <CustomInput
              label="Estado del flujo"
              value={currentFlowStatusLabel}
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

            <CustomInput
              label="Notas internas"
              value={safeString(form.notas_admin)}
              onChange={handleTextChange("notas_admin")}
              multiline
              rows={4}
              icon={
                <StickyNote
                  size={18}
                  style={{ color: "var(--color-text-muted)" }}
                />
              }
              fullWidth
            />

            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText size={18} />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-(--color-text)">
                    Lógica del estado
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    <strong>Nuevo</strong> se crea automáticamente.{" "}
                    <strong>Leído</strong> se marca al abrir el contacto.{" "}
                    <strong>Respondido</strong> se marca cuando haces una acción
                    real como WhatsApp, cotización o solicitud.{" "}
                    <strong>Archivado</strong> ya no reemplaza el estado del
                    flujo; solo oculta o separa el contacto sin perder si estaba
                    nuevo, leído o respondido.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};