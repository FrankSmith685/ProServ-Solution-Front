import type { ReactNode } from "react";

export type NotificationType = "success" | "error" | "warning" | "info";
export interface NotificationPosition {
  vertical: "top" | "bottom";
  horizontal: "left" | "center" | "right";
}

export interface CustomNotificationProps {
  open: boolean;
  message: string;
  type?: NotificationType;
  duration?: number;
  onClose: () => void;
  position?: NotificationPosition;
}


export interface NotificationContextProps {
  messageType: "success" | "error" | "info" | null;
  apiMessage: string | null;
  showMessage: (message: string, type?: "success" | "error" | "info") => void;
  clearMessage: () => void;
}

export interface PropsNotificationProvider {
  children: ReactNode;
}

