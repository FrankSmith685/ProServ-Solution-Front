import { AuthLayout } from "@/components/layouts/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthExtras } from "@/components/auth/authExtra";
import { useGoogleAuth } from "@/hooks/auth/useGoogleAuth";
import type { FC } from "react";

const LoginPage: FC = () => {
  const { handleGoogleLogin, loading } = useGoogleAuth();

  return (
    <AuthLayout>
      <LoginForm />
      <AuthExtras
        mode="login"
        onGoogleLogin={handleGoogleLogin}
        loadingGoogle={loading}
      />
    </AuthLayout>
  );
};

export default LoginPage;
