import { useMemo, useState } from "react";
import { useAppState } from "@/hooks/useAppState";
import { useUser } from "@/hooks/useUser";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";
import { signInWithPopup, type UserCredential } from "firebase/auth";
import { auth, googleProvider } from "@/config/firebase";

export type Proveedor = "correo" | "google";

export interface CuentaVinculada {
  proveedor: Proveedor;
  vinculada: boolean;
}

const PROVEEDORES: readonly Proveedor[] = ["correo", "google"];

export const useCuentasVinculadas = () => {
  const { user } = useAppState();
  const { linkAccount, unlinkAccount } = useUser();
  const { showMessage } = useNotification();

  const [loading, setLoading] = useState<Proveedor | null>(null);
  const [modalCorreoOpen, setModalCorreoOpen] = useState(false);

  const cuentas = useMemo<CuentaVinculada[]>(() => {
    if (!user) return [];

    return PROVEEDORES.map(proveedor => ({
      proveedor,
      vinculada: user.metodosLogin.includes(proveedor),
    }));
  }, [user]);

  const onToggle = async (proveedor: Proveedor) => {
    if (!user || loading) return;

    const estaVinculada = user.metodosLogin.includes(proveedor);
    if (estaVinculada) {
      setLoading(proveedor);

      await unlinkAccount(
        { proveedor },
        response => {
          if (response.success) {
            showMessage(
              `Cuenta ${proveedor} desvinculada correctamente`,
              "success"
            );
          } else {
            showMessage(
              response.message ?? "No se pudo desvincular la cuenta",
              "error"
            );
          }
        }
      );

      setLoading(null);
      return;
    }

    if (proveedor === "correo") {
      setModalCorreoOpen(true);
      return;
    }

    if (proveedor === "google") {
      try {
        setLoading("google");

        const result: UserCredential = await signInWithPopup(
          auth,
          googleProvider
        );

        const googleUser = result.user;

        if (!googleUser.email) {
          showMessage(
            "No se pudo obtener el correo de Google",
            "error"
          );
          setLoading(null);
          return;
        }

        await linkAccount(
          {
            proveedor: "google",
            emailProveedor: googleUser.email,
            clave: null,
          },
          response => {
            if (response.success) {
              showMessage(
                "Cuenta Google vinculada correctamente",
                "success"
              );
            } else {
              showMessage(
                response.message ?? "No se pudo vincular Google",
                "error"
              );
            }
          }
        );
      } catch {
        showMessage(
          "No se pudo seleccionar la cuenta de Google",
          "error"
        );
      } finally {
        setLoading(null);
      }
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
