/* eslint-disable @typescript-eslint/no-explicit-any */
import { Snackbar, Alert, Slide } from "@mui/material";
import type { FC } from "react";
import type { CustomNotificationProps } from "@/interfaces/ui/feedback/ICustomNotification";

const SlideDown = (props: any) => <Slide {...props} direction="down" />;

export const CustomNotification: FC<CustomNotificationProps> = ({
  open,
  message,
  type,
  duration = 4000,
  onClose,
  position = { vertical: "top", horizontal: "center" },
}) => {
  const handleClose = (_: unknown, reason?: string) => {
    if (reason === "clickaway") return;
    onClose?.();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={position}
      TransitionComponent={SlideDown}
      disableWindowBlurListener
    >
      <Alert
        onClose={handleClose}
        severity={type}
        variant="filled"
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 420,
          mx: "auto",
          borderRadius: "14px",
          outline: "none",
          "& .MuiAlert-message": { width: "100%" },
          "&:focus": { outline: "none" },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
