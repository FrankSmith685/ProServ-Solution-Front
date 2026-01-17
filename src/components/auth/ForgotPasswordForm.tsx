import React, { useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomLink } from "@/components/ui/kit/CustomLink";

import { useAuth } from "@/hooks/useAuth";
import { FaEnvelopeOpenText } from "react-icons/fa";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";

import {
  forgotPasswordSchema,
  type ForgotPasswordData,
} from "@/interfaces/auth/IForgotPasswordForm";
import type { BasicCallbackResponse } from "@/interfaces/hook/IUseAuth";

export const ForgotPasswordForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onTouched",
  });

  const { sendResetEmail } = useAuth();
  const { showMessage } = useNotification();

  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [savedEmail, setSavedEmail] = useState<string>("");

  const onSubmit: SubmitHandler<ForgotPasswordData> = async (data) => {
    setSavedEmail(data.email);

    await sendResetEmail(data.email, (res: BasicCallbackResponse): void => {
      if (res.success) {
        setEmailSent(true);
      } else {
        showMessage(
          res.message ?? "Error al enviar el correo de recuperación",
          "error"
        );
      }
    });
  };

  if (emailSent) {
    return (
      <div className="flex flex-col gap-4 sm:gap-5 text-center items-center max-w-125 mx-auto">
        <FaEnvelopeOpenText size={64} className="text-primary" />

        <h2 className="text-2xl sm:text-3xl font-bold text-primary-gradient">
          Revisa tu correo
        </h2>

        <p className="text-gray-700 text-sm sm:text-base">
          Te hemos enviado un enlace de recuperación a:
        </p>

        <p className="font-semibold break-all">{savedEmail}</p>

        <CustomButton
          text="Continuar"
          type="button"
          fullWidth
          variant="primary"
          fontSize="14px"
          fontWeight={400}
          onClick={() => window.location.replace("/iniciar")}
        />

        <CustomLink
          to="/recuperar"
          text="No recibí el correo"
          variant="primary"
          fontWeight="medium"
          onClick={() => {
            setEmailSent(false);
            reset({ email: savedEmail });
          }}
        />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        w-full 
        max-w-125 
        flex flex-col 
        gap-6
        sm:gap-7
        lg:gap-8
        mx-auto
      "
      noValidate
    >
      <div className="w-full flex flex-col gap-2 text-center">
        <h2
          className="
          text-2xl 
          sm:text-3xl 
          lg:text-4xl 
          font-bold 
          text-primary-gradient
        "
        >
          Recuperar Contraseña
        </h2>

        <p className="text-terciary text-sm sm:text-base">
          Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Correo Electrónico"
              placeholder="Correo Electrónico *"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />

        <CustomButton
          text="Continuar"
          type="submit"
          fullWidth
          variant="primary"
          fontSize="14px"
          fontWeight={400}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      </div>

      <div className="text-center">
        <CustomLink
          to="/iniciar"
          text="Volver al inicio de sesión"
          variant="primary"
        />
      </div>
    </form>
  );
};
