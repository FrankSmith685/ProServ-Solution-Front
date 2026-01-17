import { ActionBar } from "@/components/panel/ActionBar";
import { EmailForm } from "./EmailForm";
import { useEmailForm } from "@/hooks/panel/mis-cuenta/seguridad/useEmailForm";
import { SeguridadHeader } from "../SeguridadHeader";
import { FaEnvelope } from "react-icons/fa";

export const EmailContainer = () => {
  const {
    form,
    loading,
    dirty,
    save,
    update,
    status,
  } = useEmailForm();

  return (
    <div className="w-full space-y-10">
      <SeguridadHeader
        icon={FaEnvelope}
        title="Correo de la cuenta"
        description="Actualiza el correo usado para iniciar sesión"
        status={status}
    />

      <EmailForm
        form={form}
        onChange={update}
      />

      <ActionBar
        visible={dirty}
        loading={loading}
        onSave={save}
      />
    </div>
  );
};
