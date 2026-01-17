import { useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";

import { useUser } from "@/hooks/useUser";
import { useAppState } from "@/hooks/useAppState";
import type { EmailForm, PasswordStatus } from "@/interfaces/panel/mis-datos/ISeguridad";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const useEmailForm = () => {
  const { changeEmail } = useUser();
  const { logout } = useAuth();
  const { user } = useAppState();
  const { showMessage } = useNotification();
  const navigate = useNavigate();

  const [form, setForm] = useState<EmailForm>({
    nuevo: "",
  });

  const [loading, setLoading] = useState(false);

  const dirty = Boolean(form.nuevo);

  const isValid =
    form.nuevo.length > 0 &&
    form.nuevo !== user?.correo;

  const update = <K extends keyof EmailForm>(
    key: K,
    value: EmailForm[K]
  ) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    if (!isValid || loading || !user?.correo) return;

    setLoading(true);

    changeEmail(
      {
        currentEmail: user.correo,
        newEmail: form.nuevo,
      },
      response => {
        if (response.success) {
          showMessage(
            response.message ?? "Correo actualizado correctamente",
            "success"
          );

          setForm({ nuevo: "" });
          logout();
          navigate("/");
        }
        else {
          showMessage(
            response.message ?? "No se pudo actualizar el correo",
            "error"
          );
        }

        setLoading(false);
      }
    );
  };

  const status: PasswordStatus = useMemo(() => {
    if (!dirty) {
      return {
        text: "Sin cambios",
        icon: FaInfoCircle,
        color: "bg-terciary-soft text-terciary",
      };
    }

    if (!isValid) {
      return {
        text: "Correo inválido",
        icon: FaExclamationTriangle,
        color: "bg-warning-soft text-warning",
      };
    }

    return {
      text: "Listo para guardar",
      icon: FaCheckCircle,
      color: "bg-primary-soft text-primary",
    };
  }, [dirty, isValid]);

  return {
    form,
    loading,
    dirty,
    isValid,
    update,
    save,
    status,
  };
};
