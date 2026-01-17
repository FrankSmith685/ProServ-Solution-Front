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
          padding: 0,          // 🔥 CLAVE
          margin: 0,
          width: "100%",
          height: "100%",
        },
      }}
      PaperProps={{
        className: `
          !overflow-hidden
          bg-linear-to-br from-white/95 to-primary/5
          border border-white/40
          backdrop-blur-2xl
          shadow-[0_40px_90px_rgba(0,0,0,.25)]
          flex flex-col
        `,
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
          className: "bg-black/60 backdrop-blur-xl",
        },
      }}
    >
      {/* HEADER */}
      {header !== undefined && header !== null && (
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-xl border-b border-white/40">
          {header}
        </header>
      )}

      {header === undefined && title && (
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-xl border-b border-white/40">
          <h2 className="text-lg font-bold">{title}</h2>

          {closeButton && (
            <CustomButton
              iconOnly
              ariaLabel="Cerrar modal"
              onClick={onClose}
              variant="secondary-outline"
              icon={<CloseIcon sx={{ fontSize: 20 }} />}
            />
          )}
        </header>
      )}

      {/* BODY */}
      <main
        className={clsx(
          "flex-1 overflow-auto responsive-padding px-5.5!",
          mainClassName
        )}
      >
        <div className={clsx("flex flex-col gap-6", containerClassName)}>
          {children}
        </div>
      </main>

      {/* FOOTER */}
      {footer !== undefined && footer !== null && (
        <footer className="sticky bottom-0 z-20 bg-white/75 backdrop-blur-xl border-t border-white/40 p-5 flex justify-end gap-3">
          {footer}
        </footer>
      )}
    </Dialog>
  );
};

export const CustomModal = memo(CustomModalComponent);
