import { FaGoogle } from "react-icons/fa";
import { CustomButton } from "../ui/kit/CustomButton";
import { CustomLink } from "../ui/kit/CustomLink";
import type { AuthExtrasProps } from "@/interfaces/auth/IAuthExtras";

export const AuthExtras = ({
  mode = "login",
  onGoogleLogin,
  showForgotPassword = true,
  loadingGoogle = false,
}: AuthExtrasProps) => {
  const isLogin = mode === "login";

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Divider */}
      <div className="flex items-center justify-center">
        <span className="w-full h-px bg-secondary-soft" />
        <span className="mx-2 text-terciary">ó</span>
        <span className="w-full h-px bg-secondary-soft" />
      </div>

      <CustomButton
        text={loadingGoogle ? "Conectando..." : "Continuar con Google"}
        type="button"
        fullWidth
        variant="warning"
        fontSize="14px"
        fontWeight={400}
        icon={<FaGoogle />}
        onClick={onGoogleLogin}
        disabled={loadingGoogle}
      />

      {isLogin && showForgotPassword && (
        <div className="text-center">
          <CustomLink
            to="/recuperar"
            text="¿Olvidaste tu contraseña?"
            variant="primary"
            fontWeight="medium"
          />
        </div>
      )}

      <div className="text-center text-secondary">
        {isLogin ? (
          <>
            ¿No tienes una cuenta?{" "}
            <CustomLink
              to="/registrar"
              text="Regístrate"
              variant="primary"
              fontWeight="bold"
            />
          </>
        ) : (
          <>
            ¿Ya tienes una cuenta?{" "}
            <CustomLink
              to="/iniciar"
              text="Inicia Sesión"
              variant="primary"
              fontWeight="bold"
            />
          </>
        )}
      </div>
    </div>
  );
};
