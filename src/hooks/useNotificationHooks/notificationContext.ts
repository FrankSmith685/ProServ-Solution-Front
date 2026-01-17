import type { NotificationContextProps } from "@/interfaces/ui/feedback/ICustomNotification";
import { createContext } from "react";

export const NotificationContext =
  createContext<NotificationContextProps | undefined>(undefined);
