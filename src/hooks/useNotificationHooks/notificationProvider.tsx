import { useState, useCallback } from "react";
import { NotificationContext } from "./notificationContext";
import type { PropsNotificationProvider } from "@/interfaces/ui/feedback/ICustomNotification";
import { CustomNotification } from "@/components/ui/feedback/CustomNotification";

export const NotificationProvider = ({ children }: PropsNotificationProvider) => {
  const [messageType, setMessageType] =
    useState<"success" | "error" | "info" | null>(null);

  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const clearMessage = useCallback(() => {
    setOpen(false);   // SOLO cerramos. Nada más.
  }, []);

  const showMessage = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      setApiMessage(message);
      setMessageType(type);
      setOpen(true);
    },
    []
  );

  return (
    <NotificationContext.Provider
      value={{ messageType, apiMessage, showMessage, clearMessage }}
    >
      {children}

      {open && apiMessage && messageType && (
        <CustomNotification
          open={open}
          message={apiMessage}
          type={messageType}
          onClose={clearMessage}
        />
      )}
    </NotificationContext.Provider>
  );
};
