import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomButton } from "@/components/ui/kit/CustomButton";

import { useAuth } from "@/hooks/useAuth";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";
import { useAppState } from "@/hooks/useAppState";
import { useNavigate } from "react-router-dom";

import {
  changePasswordSchema,
  type ChangePasswordData,
} from "@/interfaces/auth/IChangePasswordForm";
import type { FC } from "react";

export const ChangePasswordForm: FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onTouched",
  });

  const { resetPassword } = useAuth();
  const { showMessage } = useNotification();
  const { changePasswordToken, setChangePasswordToken } = useAppState();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ChangePasswordData> = async (data) => {
    if (!changePasswordToken) {
      showMessage("Enlace inválido o expirado", "error");
      return;
    }

    await resetPassword(
      changePasswordToken,
      data.password,
      (res): void => {
        if (res.success) {
          setChangePasswordToken(null);
          reset();
          navigate("/iniciar");
        } else {
          showMessage(
            res.message ?? "Error al cambiar la contraseña",
            "error"
          );
        }
      }
    );
  };

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
          Cambiar Contraseña
        </h2>

        <p className="text-terciary text-sm sm:text-base">
          Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5">
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Nueva Contraseña"
              placeholder="Nueva Contraseña *"
              type="password"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Confirmar Contraseña"
              placeholder="Confirmar Contraseña *"
              type="password"
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
          )}
        />

        <CustomButton
          text="Cambiar Contraseña"
          type="submit"
          fullWidth
          variant="primary"
          fontSize="14px"
          fontWeight={400}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
};
