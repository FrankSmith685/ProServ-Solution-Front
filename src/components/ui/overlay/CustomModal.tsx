import { memo, forwardRef, type FC, type JSX } from "react";
import { Dialog, Slide } from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import clsx from "clsx";

import type { CustomModalProps } from "@/interfaces/ui/overlay/ICustomModal";
import { CustomButton } from "../kit/CustomButton";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CustomModalComponent: FC<CustomModalProps> = ({
  isOpen,
  onClose,
  children,
  title = "Modal",
  header,
  footer,
  width,
  height,
  closeButton = true,
  allowBackdropClose = true,
  mainClassName = "",
  containerClassName = "",
}): JSX.Element => {
  const handleClose = (_: object, reason: string) => {
    if (!allowBackdropClose && reason === "backdropClick") return;
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth={false}
      TransitionComponent={Transition}
      disableScrollLock={false}
      sx={{
        "& .MuiDialog-container": {
          padding: 0,
          margin: 0,
          width: "100%",
          height: "100%",
        },
      }}
      PaperProps={{
        className: clsx(
          "!overflow-hidden flex flex-col",
          "bg-surface-soft",
          "border border-border",
          "backdrop-blur-2xl",
          "text-[var(--color-text)]",
          "shadow-[0_40px_90px_rgba(0,0,0,.25)]",
          "dark:shadow-[0_40px_90px_rgba(0,0,0,.6)]"
        ),
        sx: {
          width: width ?? "100%",
          maxWidth: "100%",
          height: height ?? "100dvh",
          maxHeight: "100dvh",
          margin: 0,
          borderRadius: 0,
        },
      }}
      slotProps={{
        backdrop: {
          className: "bg-black/50 backdrop-blur-md",
        },
      }}
    >
      {/* ================= HEADER ================= */}
      {(header !== undefined || title) && (
        <header
          className="
            sticky top-0 z-20
            flex items-center justify-between
            px-6 py-4
            bg-surface-soft
            backdrop-blur-xl
            border-b border-border
          "
        >
          {header ?? (
            <h2 className="text-lg font-bold text-(--color-text)">
              {title}
            </h2>
          )}

          {closeButton && (
            <CustomButton
              iconOnly
              ariaLabel="Cerrar modal"
              onClick={onClose}
              variant="secondary-outline"
              className="text-(--color-text)! hover:bg-muted!"
              icon={<CloseIcon sx={{ fontSize: 20 }} className="text-inherit" />}
            />
          )}
        </header>
      )}

      {/* ================= BODY ================= */}
      <main
        className={clsx(
          "flex-1 overflow-auto responsive-padding",
          "bg-surface-soft-light",
          "text-(--color-text)",
          mainClassName
        )}
      >
        <div className={clsx("flex flex-col gap-6", containerClassName)}>
          {children}
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      {footer && (
        <footer
          className="
            sticky bottom-0 z-20
            bg-surface-soft
            backdrop-blur-xl
            border-t border-border
            p-5 flex justify-end gap-3
          "
        >
          {footer}
        </footer>
      )}
    </Dialog>
  );
};

export const CustomModal = memo(CustomModalComponent);