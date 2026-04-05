import { type FC, useMemo, useState, type ChangeEvent } from "react";
import { Save, Mail, Phone, Building2, MessageSquare, StickyNote } from "lucide-react";

import { CustomModal } from "@/components/ui/overlay/CustomModal";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";

import type { Contact, ContactStatus } from "@/interfaces/hook/IUseContacts";

interface ModalAdminContactProps {
  open: boolean;
  onClose: () => void;
  form: Partial<Contact>;
  setForm: React.Dispatch<React.SetStateAction<Partial<Contact>>>;
  onSave: () => void;
  loading?: boolean;
}

const STATUS_OPTIONS: { value: ContactStatus; label: string }[] = [
  { value: "nuevo", label: "Nuevo" },
  { value: "leido", label: "Leído" },
  { value: "respondido", label: "Respondido" },
  { value: "archivado", label: "Archivado" },
];

export const ModalAdminContact: FC<ModalAdminContactProps> = ({
  open,
  onClose,
  form,
  setForm,
  onSave,
  loading = false,
}) => {
  const [touched, setTouched] = useState({
    estado: false,
  });

  const handleChange =
    (key: keyof Contact) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;

      setForm((prev) => ({
        ...prev,
        [key]: value,
      }));
    };

  const handleSelectChange =
    (key: "estado") =>
    (
      e:
        | ChangeEvent<HTMLInputElement>
        | (Event & { target: { value: unknown; name: string } })
    ) => {
      const value = String(e.target.value ?? "") as ContactStatus;

      setForm((prev) => ({
        ...prev,
        [key]: value,
      }));

      setTouched((prev) => ({
        ...prev,
        [key]: true,
      }));
    };

  const errors = useMemo(
    () => ({
      estado: touched.estado && !form.estado,
    }),
    [form.estado, touched.estado]
  );

  const isInvalid = !form.estado;

  return (
    <CustomModal
      isOpen={open}
      onClose={onClose}
      title="Editar contacto"
      width="min(820px, 96vw)"
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
            text={loading ? "Guardando..." : "Guardar"}
            icon={<Save size={16} />}
            onClick={onSave}
            loading={loading}
            disabled={isInvalid}
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
              Información del contacto
            </h4>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Revisa el mensaje y actualiza su estado.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <CustomInput
              label="Nombre"
              value={form.nombre || ""}
              onChange={handleChange("nombre")}
              icon={<MessageSquare size={18} style={{ color: "var(--color-text-muted)" }} />}
              fullWidth
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CustomInput
                label="Email"
                value={form.email || ""}
                onChange={handleChange("email")}
                icon={<Mail size={18} style={{ color: "var(--color-text-muted)" }} />}
                fullWidth
              />

              <CustomInput
                label="Teléfono"
                value={form.telefono || ""}
                onChange={handleChange("telefono")}
                icon={<Phone size={18} style={{ color: "var(--color-text-muted)" }} />}
                fullWidth
              />
            </div>

            <CustomInput
              label="Empresa"
              value={form.empresa || ""}
              onChange={handleChange("empresa")}
              icon={<Building2 size={18} style={{ color: "var(--color-text-muted)" }} />}
              fullWidth
            />

            <CustomInput
              label="Mensaje"
              value={form.mensaje || ""}
              onChange={handleChange("mensaje")}
              multiline
              rows={5}
              icon={<MessageSquare size={18} style={{ color: "var(--color-text-muted)" }} />}
              fullWidth
            />

            <CustomInput
              label="Notas internas"
              value={form.notas_admin || ""}
              onChange={handleChange("notas_admin")}
              multiline
              rows={4}
              icon={<StickyNote size={18} style={{ color: "var(--color-text-muted)" }} />}
              fullWidth
            />

            <CustomSelected
              value={form.estado || ""}
              onChange={handleSelectChange("estado")}
              options={STATUS_OPTIONS}
              label="Estado"
              placeholder="Selecciona un estado"
              error={errors.estado}
              helperText={errors.estado ? "Requerido" : ""}
              fullWidth
              variant="primary"
              size="lg"
            />
          </div>
        </div>
      </div>
    </CustomModal>
  );
};