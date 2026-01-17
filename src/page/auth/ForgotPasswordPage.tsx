import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { AuthLayout } from "@/components/layouts/auth/AuthLayout";

const ForgotPasswordPage = () => {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
