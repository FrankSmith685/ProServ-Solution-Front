import type { AlertColor } from "@mui/material";

export interface DocumentAlertState {
  message: string;
  severity: AlertColor;
  variant: "standard" | "outlined" | "filled";
  show: boolean;
}
