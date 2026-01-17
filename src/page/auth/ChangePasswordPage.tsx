import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { AuthLayout } from "@/components/layouts/auth/AuthLayout";
import type { FC } from "react";

const ChangePasswordPage: FC = () => {
  return (
    <AuthLayout>
      <ChangePasswordForm />
    </AuthLayout>
  );
};

export default ChangePasswordPage;
