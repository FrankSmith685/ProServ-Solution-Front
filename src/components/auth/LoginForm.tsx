import { useEffect, type FC } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { CustomInput } from "../ui/kit/CustomInput";
import { CustomButton } from "../ui/kit/CustomButton";

import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

import type { LoginFormData } from "@/interfaces/auth/ILoginForm";
import { loginSchema } from "@/interfaces/auth/ILoginForm";

const schema = loginSchema(z);

export const LoginForm: FC = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(
    () => () => reset(),
    [reset]
  );

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    await loginUser(
      {
        correo: data.email,
        contraseña: data.password,
        proveedor: "correo",
      },
      (res) => {
        if (res.success) {
          navigate("/");
          return;
        }

        clearErrors();

        if (res.field === "email") {
          setError("email", { type: "server", message: res.message });
          return;
        }

        if (res.field === "password") {
          setError("password", { type: "server", message: res.message });
          return;
        }

        setError("email", {
          type: "server",
          message: res.message ?? "Credenciales incorrectas",
        });
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        w-full max-w-125
        flex flex-col gap-6
        sm:gap-7 lg:gap-8
        mx-auto
      "
      noValidate
    >
      <div className="w-full flex flex-col gap-2 text-center">
        <h2
          className="
            text-2xl sm:text-3xl lg:text-4xl
            font-bold text-primary-gradient
          "
        >
          Iniciar Sesión
        </h2>

        <p className="text-terciary text-sm sm:text-base">
          Inicia sesión para disfrutar los beneficios que tiene Mappi
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

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Contraseña"
              placeholder="Contraseña *"
              type="password"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
        />

        <CustomButton
          text="Iniciar Sesión"
          type="submit"
          fullWidth
          variant="primary"
          loading={isSubmitting}
          disabled={isSubmitting}
          fontSize="14px"
        />
      </div>
    </form>
  );
};
