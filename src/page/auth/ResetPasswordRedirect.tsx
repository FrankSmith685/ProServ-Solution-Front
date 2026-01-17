/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, type FC } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { useAppState } from "@/hooks/useAppState";
import { useAuth } from "@/hooks/useAuth";

import { FaSpinner, FaTimesCircle } from "react-icons/fa";

import type { BasicCallbackResponse } from "@/interfaces/hook/IUseAuth";

const ResetPasswordRedirect: FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const { setChangePasswordToken } = useAppState();
  const { validateResetToken } = useAuth();

  const [status, setStatus] = useState<"checking" | "invalid">("checking");

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      navigate("/recuperar");
      return;
    }

    validateResetToken(token, ({ success }: BasicCallbackResponse) => {
      if (success) {
        setChangePasswordToken(token);
        navigate("/cambiar-contrasena");
      } else {
        setStatus("invalid");
        setTimeout(() => navigate("/recuperar"), 2200);
      }
    });
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center p-6">
      {status === "checking" && (
        <div className="flex flex-col items-center gap-3 text-center">
          <FaSpinner className="text-primary text-4xl animate-spin" />
          <p className="text-gray-600 text-sm">
            Validando enlace de recuperación…
          </p>
        </div>
      )}

      {status === "invalid" && (
        <div className="flex flex-col items-center gap-3 text-center">
          <FaTimesCircle className="text-red-500 text-4xl" />
          <p className="text-red-500 font-semibold">
            Enlace inválido o expirado
          </p>
          <p className="text-gray-600 text-sm">
            Redirigiendo a recuperación…
          </p>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordRedirect