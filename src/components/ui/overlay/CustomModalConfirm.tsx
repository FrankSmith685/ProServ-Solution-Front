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

  width = "min(420px, 95vw)", // ✅ responsive width
  allowBackdropClose = true,
}) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      width={width}
      allowBackdropClose={allowBackdropClose}
      mainClassName="flex items-center justify-center px-3 sm:px-0"
      containerClassName="!p-0 w-full text-center "
      footer={
        // ✅ RESPONSIVE FOOTER
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end w-full">
          <CustomButton
            text={cancelText}
            variant="secondary-outline"
            onClick={onClose}
            className="w-full! sm:w-auto! px-4!"
            fontSize="14px"
          />

          <CustomButton
            text={confirmText}
            variant="primary"
            onClick={onConfirm}
            loading={loading}
            className="w-full! sm:w-auto! px-4!"
            fontSize="14px"
          />
        </div>
      }
    >
      {/* ✅ CONTENT RESPONSIVE */}
      <div className="flex flex-col gap-4 items-start w-full px-1 sm:px-0">
        <p className="text-sm text-muted-foreground text-left">
          {message}
        </p>

        {children}
      </div>
    </CustomModal>
  );
};