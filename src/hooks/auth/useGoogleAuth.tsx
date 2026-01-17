import { signInWithPopup, type UserCredential } from "firebase/auth";
import { auth, googleProvider } from "@/config/firebase";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { SocialLoginPayload } from "@/interfaces/hook/IUseAuth";
import { useAppState } from "../useAppState";

export const useGoogleAuth = () => {
  const { loginOrRegisterUser } = useAuth();
  const { showMessage } = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const {typeUserAuth} = useAppState();

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setLoading(true);

      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const data: SocialLoginPayload  = {
        correo: String(user.email),
        proveedor: "google",
        type_user: typeUserAuth
        ? typeUserAuth === "comensal"
          ? 4
          : 5
        : 2,
      };

      await loginOrRegisterUser(data, (res) => {
        if (!res.success) {
          showMessage(res.message ?? "Error al autenticar con Google", "error");
          return;
        }

        navigate("/");
      });

    } catch {
      showMessage("No se pudo iniciar sesión con Google", "error");
    } finally {
      setLoading(false);
    }
  };

  return { handleGoogleLogin, loading };
};
