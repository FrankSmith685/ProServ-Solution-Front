import type {
  NotificationType,
} from "@/interfaces/ui/feedback/ICustomNotification";

export interface DocumentNotificationState {
  open: boolean;
  message: string;
  type: NotificationType;
  duration: string;
}
