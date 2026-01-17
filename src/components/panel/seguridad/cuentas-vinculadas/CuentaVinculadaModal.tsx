import { useState } from "react";
import { CustomModal } from "@/components/ui/overlay/CustomModal";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { useUser } from "@/hooks/useUser";
import { FaEnvelope } from "react-icons/fa";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const VincularCorreoModal = ({ open, onClose }: Props) => {
  const { linkAccount } = useUser();
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [loading, setLoading] = useState(false);

  const { showMessage } = useNotification();

const submit = async () => {
    if (!email || !clave || loading) return;

    setLoading(true);

    await linkAccount(
      {
        proveedor: "correo",
        emailProveedor: email,
        clave,
      },
      response => {
        if (response.success) {
          showMessage(
            "Correo vinculado correctamente",
            "success"
          );
          onClose();
        } else {
          showMessage(
            response.message ?? "No se pudo vincular el correo",
            "error"
          );
        }

        setLoading(false);
      }
    );
  };

  return (
    <CustomModal
      isOpen={open}
      onClose={onClose}
      width="460px"
      header={null}
      title=""
      allowBackdropClose={!loading}
      footer={
        <>
            <CustomButton
                text="Cancelar"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
                size="md"
            />

            <CustomButton
                text="Vincular correo"
                loading={loading}
                onClick={submit}
                size="md"
            />

        </>
      }
    >
      <div className="flex flex-col gap-6 py-2">

        {/* Icono */}
        <div className="w-14 h-14 rounded-2xl bg-primary-soft text-primary flex items-center justify-center mx-auto">
          <FaEnvelope size={22} />
        </div>

        {/* Título */}
        <div className="text-center space-y-1">
          <h2 className="text-lg font-semibold text-secondary">
            Vincular correo electrónico
          </h2>
          <p className="text-sm text-terciary">
            Agrega un correo y contraseña para acceder también con email.
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <CustomInput
            label="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            size="md"
            fontSize="14px"
          />

          <CustomInput
            label="Contraseña"
            type="password"
            value={clave}
            onChange={e => setClave(e.target.value)}
            fullWidth
            size="md"
            fontSize="14px"
          />
        </div>
      </div>
    </CustomModal>
  );
};
