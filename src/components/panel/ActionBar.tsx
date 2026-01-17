import type { FC } from "react";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { FaSave } from "react-icons/fa";
import type { ActionBarProps } from "@/interfaces/panel/IMiPanel";

export const ActionBar: FC<ActionBarProps> = ({
  visible,
  loading,
  onSave,
}) => {
  if (!visible) return null;

  return (
    <div className="sticky bottom-0 z-20">
      <div className="bg-glass backdrop-blur shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-end">
          <CustomButton
            variant="primary"
            icon={<FaSave />}
            text={loading ? "Guardando..." : "Guardar cambios"}
            loading={loading}
            onClick={onSave}
            fontSize="14px"
          />
        </div>
      </div>
    </div>
  );
};
