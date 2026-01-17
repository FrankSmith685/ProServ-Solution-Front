import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, type UserCredential } from "firebase/auth";

import { auth, googleProvider } from "@/config/firebase";
import { useUser } from "@/hooks/useUser";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";
import { useAuth } from "@/hooks/useAuth";
import { useAppState } from "@/hooks/useAppState";
import type { UseEliminarCuentaReturn } from "@/interfaces/panel/mis-datos/ISeguridad";


export const useEliminarCuenta = (): UseEliminarCuentaReturn => {
  const { deleteAccount, deleteAccountGoogle } = useUser();
  const { logout } = useAuth();
  const { showMessage } = useNotification();
  const navigate = useNavigate();
  const { user } = useAppState();

  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const canUsePassword = Boolean(user?.metodosLogin.includes("correo"));
  const canUseGoogle = Boolean(user?.metodosLogin.includes("google"));

  const submitPassword = async (): Promise<void> => {
    if (!password || !confirm || loading) return;

    setLoading(true);

    deleteAccount(
      { password },
      response => {
        if (response.success) {
          showMessage("Cuenta eliminada correctamente", "success");
          logout();
          navigate("/");
        } else {
          showMessage(
            response.message ?? "No se pudo eliminar la cuenta",
            "error"
          );
        }
        setLoading(false);
      }
    );
  };

  const submitGoogle = async (): Promise<void> => {
    if (!confirm || loading || !user?.correo) return;

    try {
      setLoading(true);

      const result: UserCredential = await signInWithPopup(
        auth,
        googleProvider
      );

      const email = result.user.email;

      if (!email) {
        showMessage("No se pudo obtener el correo de Google", "error");
        setLoading(false);
        return;
      }

      if (email !== user.correo) {
        showMessage(
          "El correo de Google no coincide con tu cuenta",
          "error"
        );
        setLoading(false);
        return;
      }

      deleteAccountGoogle(email, response => {
        if (response.success) {
          showMessage("Cuenta eliminada correctamente", "success");
          logout();
          navigate("/");
        } else {
          showMessage(
            response.message ?? "No se pudo eliminar la cuenta",
            "error"
          );
        }
        setLoading(false);
      });
    } catch {
      showMessage(
        "No se pudo completar la autenticación con Google",
        "error"
      );
      setLoading(false);
    }
  };

  return {
    password,
    setPassword,
    confirm,
    setConfirm,
    loading,
    submitPassword,
    submitGoogle,
    canUsePassword,
    canUseGoogle,
  };
};
