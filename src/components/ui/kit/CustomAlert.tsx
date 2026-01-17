import { Alert } from "@mui/material";
import { memo, type FC } from "react";
import type { CustomAlertProps } from "@/interfaces/ui/kit/ICustomAlert";

const CustomAlertComponent: FC<CustomAlertProps> = ({
  message,
  severity = "info",
  variant = "outlined",
  show = true,
}) => {
  if (!show) return null;

  return (
    <Alert
      severity={severity}
      variant={variant}
      sx={{
        borderRadius: "8px",
        fontSize: "0.95rem",
        py: 1,
        px: 2,
      }}
    >
      {message}
    </Alert>
  );
};

export const CustomAlert = memo(CustomAlertComponent);
