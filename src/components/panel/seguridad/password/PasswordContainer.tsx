import { ActionBar } from "@/components/panel/ActionBar";
import { PasswordForm } from "./PasswordForm";
import { PasswordSecurityTips } from "./PasswordSecurityTips";
import { usePasswordForm } from "@/hooks/panel/mis-cuenta/seguridad/usePasswordForm";
import { SeguridadHeader } from "../SeguridadHeader";
import { FaLock } from "react-icons/fa";

export const PasswordContainer = () => {
  const {
    form,
    loading,
    dirty,
    update,
    save,
    status,
  } = usePasswordForm();

  return (
    <div className="w-full space-y-10">
      <SeguridadHeader
        icon={FaLock}
        title="Seguridad de la cuenta"
        description="Actualiza tu contraseña para mantener tu cuenta protegida"
        status={status}
      />

      <PasswordForm
        form={form}
        onChange={update}
      />

      <PasswordSecurityTips />

      <ActionBar
        visible={dirty}
        loading={loading}
        onSave={save}
      />

      
    </div>
  );
};
