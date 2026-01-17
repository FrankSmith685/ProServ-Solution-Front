export type AlertSeverity = "success" | "warning" | "error" | "info";


export interface CustomAlertProps {
  message: string;
  severity?: AlertSeverity;
  show?: boolean;
  variant?: "standard" | "outlined" | "filled";
}
