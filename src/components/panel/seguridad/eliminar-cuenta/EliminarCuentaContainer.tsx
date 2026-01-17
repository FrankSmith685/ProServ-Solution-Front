import { useState } from "react";
import { SeguridadHeader } from "../SeguridadHeader";
import {
  FaTrash,
  FaExclamationTriangle,
  FaGoogle,
  FaLock,
} from "react-icons/fa";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomCheckbox } from "@/components/ui/kit/CustomCheckbox";
import { useEliminarCuenta } from "@/hooks/panel/mis-cuenta/seguridad/useEliminarCuenta";
import { EliminarCuentaInfo } from "./EliminarCuentaInfo";

type Metodo = "password" | "google" | null;

export const EliminarCuentaContainer = () => {
  const {
    password,
    setPassword,
    confirm,
    setConfirm,
    loading,
    submitPassword,
    submitGoogle,
    canUsePassword,
    canUseGoogle,
  } = useEliminarCuenta();

  const [metodo, setMetodo] = useState<Metodo>(null);
  const [confirmText, setConfirmText] = useState("");

  const canFinalDelete =
    confirm && confirmText === "ELIMINAR";

const handleConfirmChange = (checked: boolean) => {
  setConfirm(checked);

  if (!checked) {
    setMetodo(null);
    setConfirmText("");
    setPassword("");
  }
};

  return (
    <div className="w-full space-y-10">
      <SeguridadHeader
        icon={FaTrash}
        title="Eliminar cuenta"
        description="Esta acción es permanente y no se puede deshacer"
        status={{
          icon: FaExclamationTriangle,
          text: "Zona de peligro",
          color: "bg-red-100 text-red-600",
        }}
      />

      <EliminarCuentaInfo />
      <section className="bg-red-50 border border-red-200 rounded-3xl p-6 max-w-md flex gap-6 flex-col">
        <CustomCheckbox
          label="Entiendo que perderé el acceso y los datos asociados"
          checked={confirm}
          onChange={e => handleConfirmChange(e.target.checked)}
          variant="warning"
          fontSize="14px"
        />
        {confirm && (
          <div className="flex flex-col gap-3">
            {canUsePassword && (
              <CustomButton
                icon={<FaLock />}
                variant={metodo === "password" ? "warning" : "secondary"}
                text="Eliminar con contraseña"
                onClick={() => setMetodo("password")}
                fullWidth
                size="md"
                fontSize="14px"
              />
            )}

            {canUseGoogle && (
              <CustomButton
                icon={<FaGoogle />}
                variant={metodo === "google" ? "warning-outline" : "secondary"}
                text="Eliminar con Google"
                onClick={() => setMetodo("google")}
                fullWidth
                size="md"
                fontSize="14px"
              />
            )}
          </div>
        )}

        {metodo && (
          <div className="flex flex-col gap-3">
            <CustomInput
              label='Escribe "ELIMINAR" para confirmar'
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              fullWidth
              size="md"
            />

            {metodo === "password" && (
              <CustomInput
                label="Confirma tu contraseña"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                size="md"
              />
            )}

            <CustomButton
              variant="warning"
              text="Eliminar cuenta definitivamente"
              loading={loading}
              disabled={
                !canFinalDelete ||
                (metodo === "password" && !password)
              }
              onClick={
                metodo === "password"
                  ? submitPassword
                  : submitGoogle
              }
              fullWidth
              size="md"
            fontSize="14px"
            />
          </div>
        )}
      </section>
    </div>
  );
};
