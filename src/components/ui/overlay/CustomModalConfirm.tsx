import type { FC } from "react";
import { CustomModal } from "@/components/ui/overlay/CustomModal";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import type { CustomModalConfirmProps } from "@/interfaces/ui/overlay/ICustomModalConfirm";

export const CustomModalConfirm: FC<CustomModalConfirmProps> = ({
  isOpen,
  onClose,
  onConfirm,

  title = "¿Estás seguro?",
  message = "Esta acción no se puede deshacer.",

  confirmText = "Confirmar",
  cancelText = "Cancelar",

  loading = false,
  children,

  width = "420px",
  allowBackdropClose = true,
}) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      width={width}
      allowBackdropClose={allowBackdropClose}
      mainClassName="flex items-center justify-center"
      containerClassName="!p-0 w-full text-center"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <CustomButton
            text={cancelText}
            variant="secondary-outline"
            onClick={onClose}
          />

          <CustomButton
            text={confirmText}
            variant="primary"
            onClick={onConfirm}
            loading={loading}
          />
        </div>
      }
    >
      <div className="flex flex-col gap-4 items-start w-full">
        <p className="text-sm text-gray-700">{message}</p>
        {children}
      </div>
    </CustomModal>
  );
};
