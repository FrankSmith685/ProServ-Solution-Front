import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/hooks/useAppState";
import { signInWithPopup, type UserCredential } from "firebase/auth";
import { auth, googleProvider } from "@/config/firebase";

export const useEliminarCuenta = () => {
  const { deleteAccount, deleteAccountGoogle } = useUser();
  const { logout } = useAuth();
  const { showMessage } = useNotification();
  const navigate = useNavigate();
  const { user } = useAppState();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const canUsePassword = user?.metodosLogin.includes("correo");
  const canUseGoogle = user?.metodosLogin.includes("google");

  const submitPassword = async () => {
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

  const submitGoogle = async () => {
  if (!confirm || loading || !user?.correo) return;

  try {
    setLoading(true);

    const result: UserCredential = await signInWithPopup(
      auth,
      googleProvider
    );

    const googleUser = result.user;
    const googleEmail = googleUser.email;

    if (!googleEmail) {
      showMessage(
        "No se pudo obtener el correo de Google",
        "error"
      );
      setLoading(false);
      return;
    }

    if (googleEmail !== user.correo) {
      showMessage(
        "El correo de Google no coincide con tu cuenta",
        "error"
      );
      setLoading(false);
      return;
    }

    deleteAccountGoogle(googleEmail,response => {
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