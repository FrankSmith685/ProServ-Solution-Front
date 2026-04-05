import { Loader2 } from "lucide-react";
import type { FC, ReactNode } from "react";

import { CustomButton } from "@/components/ui/kit/CustomButton";

interface AdminMobileSaveBarProps {
  text?: string;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  onClick: () => void;
}

const AdminMobileSaveBar: FC<AdminMobileSaveBarProps> = ({
  text = "Guardar cambios",
  loading = false,
  disabled = false,
  icon,
  onClick,
}) => {
  return (
    <div className="sticky bottom-3 z-10 sm:hidden">
      <div className="rounded-2xl border border-border bg-surface/95 p-3 shadow-lg backdrop-blur">
        <CustomButton
          text={loading ? "Guardando..." : text}
          icon={
            loading ? <Loader2 className="animate-spin" size={16} /> : icon
          }
          type="button"
          onClick={onClick}
          variant="primary"
          size="md"
          fontSize="14px"
          disabled={disabled || loading}
          className="w-full! justify-center px-4! py-3! gap-2!"
        />
      </div>
    </div>
  );
};

export default AdminMobileSaveBar;