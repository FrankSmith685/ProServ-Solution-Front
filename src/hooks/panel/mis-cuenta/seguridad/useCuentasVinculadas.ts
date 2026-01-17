import { useMemo, useState } from "react";
import { signInWithPopup, type UserCredential } from "firebase/auth";

import { auth, googleProvider } from "@/config/firebase";
import { useAppState } from "@/hooks/useAppState";
import { useUser } from "@/hooks/useUser";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";
import { PROVEEDORES, type CuentaVinculada, type Proveedor } from "@/interfaces/panel/mis-datos/ISeguridad";

interface UseCuentasVinculadasReturn {
  cuentas: CuentaVinculada[];
  loading: Proveedor | null;
  onToggle: (proveedor: Proveedor) => Promise<void>;
  modalCorreoOpen: boolean;
  closeCorreoModal: () => void;
}

export const useCuentasVinculadas = (): UseCuentasVinculadasReturn => {
  const { user } = useAppState();
  const { linkAccount, unlinkAccount } = useUser();
  const { showMessage } = useNotification();

  const [loading, setLoading] = useState<Proveedor | null>(null);
  const [modalCorreoOpen, setModalCorreoOpen] = useState<boolean>(false);

  const cuentas = useMemo<CuentaVinculada[]>(() => {
    if (!user) return [];

    return PROVEEDORES.map(proveedor => ({
      proveedor,
      vinculada: user.metodosLogin.includes(proveedor),
    }));
  }, [user]);

  const onToggle = async (proveedor: Proveedor): Promise<void> => {
    if (!user || loading) return;

    const estaVinculada = user.metodosLogin.includes(proveedor);

    if (estaVinculada) {
      setLoading(proveedor);

      await unlinkAccount(
        { proveedor },
        response => {
          showMessage(
            response.success
              ? `Cuenta ${proveedor} desvinculada correctamente`
              : response.message ?? "No se pudo desvincular la cuenta",
            response.success ? "success" : "error"
          );
        }
      );

      setLoading(null);
      return;
    }

    if (proveedor === "correo") {
      setModalCorreoOpen(true);
      return;
    }

    try {
      setLoading("google");

      const result: UserCredential = await signInWithPopup(
        auth,
        googleProvider
      );

      const email = result.user.email;

      if (!email) {
        showMessage("No se pudo obtener el correo de Google", "error");
        setLoading(null);
        return;
      }

      await linkAccount(
        {
          proveedor: "google",
          emailProveedor: email,
          clave: null,
        },
        response => {
          showMessage(
            response.success
              ? "Cuenta Google vinculada correctamente"
              : response.message ?? "No se pudo vincular Google",
            response.success ? "success" : "error"
          );
        }
      );
    } catch {
      showMessage("No se pudo seleccionar la cuenta de Google", "error");
    } finally {
      setLoading(null);
    }
  };

  return {
    cuentas,
    loading,
    onToggle,
    modalCorreoOpen,
    closeCorreoModal: () => setModalCorreoOpen(false),
  };
};
