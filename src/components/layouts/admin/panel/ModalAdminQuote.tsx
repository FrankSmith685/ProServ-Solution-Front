import { type FC, useMemo, useState, type ChangeEvent } from "react";
import { Save, BadgeDollarSign } from "lucide-react";

import { CustomModal } from "@/components/ui/overlay/CustomModal";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";

import type { Quote, QuoteStatus } from "@/interfaces/hook/IUseQuotes";

interface ModalAdminQuoteProps {
  open: boolean;
  onClose: () => void;
  form: Partial<Quote>;
  setForm: React.Dispatch<React.SetStateAction<Partial<Quote>>>;
  onSave: () => void;
  loading?: boolean;
}

const STATUS_OPTIONS: { value: QuoteStatus; label: string }[] = [
  { value: "pendiente", label: "Pendiente" },
  { value: "enviada", label: "Enviada" },
  { value: "aprobada", label: "Aprobada" },
  { value: "rechazada", label: "Rechazada" },
];

export const ModalAdminQuote: FC<ModalAdminQuoteProps> = ({
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
    (key: keyof Quote) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;

      setForm((prev) => ({
        ...prev,
        [key]: key === "total" ? (value === "" ? null : Number(value)) : value,
      }));
    };

  const handleSelectChange =
    (key: "estado") =>
    (
      e:
        | ChangeEvent<HTMLInputElement>
        | (Event & { target: { value: unknown; name: string } })
    ) => {
      const value = String(e.target.value ?? "") as QuoteStatus;

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
    () => {
      const totalValue = form.total;
      const hasTotal =
        totalValue !== null &&
        totalValue !== undefined &&
        totalValue !== "" &&
        !Number.isNaN(Number(totalValue));
      const totalNumber = hasTotal ? Number(totalValue) : null;
      const requiresTotalForStatus =
        form.estado === "enviada" || form.estado === "aprobada";

      return {
        estado: touched.estado && !form.estado,
        total: hasTotal && totalNumber !== null && totalNumber < 0,
        totalRequiredByStatus:
          requiresTotalForStatus && (!hasTotal || Number(totalValue) <= 0),
      };
    },
    [form.estado, form.total, touched.estado]
  );

  const hasValidPositiveTotal =
    form.total !== null &&
    form.total !== undefined &&
    form.total !== "" &&
    !Number.isNaN(Number(form.total)) &&
    Number(form.total) > 0;

  const requiresTotalForStatus =
    form.estado === "enviada" || form.estado === "aprobada";

  return (
    <CustomModal
      isOpen={open}
      onClose={onClose}
      title="Editar cotización"
      width="min(620px, 96vw)"
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
            disabled={
              !form.estado ||
              errors.total ||
              (requiresTotalForStatus && !hasValidPositiveTotal)
            }
            className="w-full! gap-2! px-4! sm:w-auto!"
            fontSize="14px"
          />
        </div>
      }
    >
      <div className="space-y-5 px-0 py-1 sm:space-y-6">
        <div className="rounded-2xl border border-border bg-surface-soft p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-4">
            <CustomInput
              label="Total"
              type="number"
              value={form?.total?.toString() ?? ""}
              onChange={handleChange("total")}
              error={errors.total || errors.totalRequiredByStatus}
              helperText={
                errors.total
                  ? "El total no puede ser negativo"
                  : errors.totalRequiredByStatus
                    ? "Para estados Enviada o Aprobada, el total debe ser mayor a 0."
                    : ""
              }
              icon={<BadgeDollarSign size={18} style={{ color: "var(--color-text-muted)" }} />}
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
