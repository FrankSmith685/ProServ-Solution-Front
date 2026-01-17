import { useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";

import { useUser } from "@/hooks/useUser";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";
import type { PasswordForm, PasswordStatus, UsePasswordFormReturn } from "@/interfaces/panel/mis-datos/ISeguridad";


export const usePasswordForm = (): UsePasswordFormReturn => {
  const { changePassword } = useUser();
  const { showMessage } = useNotification();

  const [form, setForm] = useState<PasswordForm>({
    actual: "",
    nueva: "",
    confirmar: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  const dirty = Object.values(form).some(Boolean);

  const passwordsMatch =
    form.nueva.length > 0 &&
    form.confirmar.length > 0 &&
    form.nueva === form.confirmar;

  const isValid =
    form.actual.length > 0 &&
    form.nueva.length >= 6 &&
    passwordsMatch;

  const update = <K extends keyof PasswordForm>(
    key: K,
    value: PasswordForm[K]
  ): void => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const save = async (): Promise<void> => {
    if (!isValid || loading) return;

    setLoading(true);

    changePassword(
      {
        currentPassword: form.actual,
        newPassword: form.nueva,
      },
      response => {
        if (response.success) {
          showMessage(
            response.message ?? "Contraseña actualizada correctamente",
            "success"
          );
          setForm({
            actual: "",
            nueva: "",
            confirmar: "",
          });
        } else {
          showMessage(
            response.message ?? "No se pudo actualizar la contraseña",
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
        text: "Datos incompletos",
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
