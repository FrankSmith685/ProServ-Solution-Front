import React from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomLink } from "@/components/ui/kit/CustomLink";

import { useAuth } from "@/hooks/useAuth";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";
import { useAppState } from "@/hooks/useAppState";
import { useGoogleAuth } from "@/hooks/auth/useGoogleAuth";

import {
  registerSchema,
  type RegisterFormData,
} from "@/interfaces/auth/IRegisterForm";

import { AuthExtras } from "../authExtra";

export const RegisterForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema(z)),
    defaultValues: {
      nombres: "",
      apellidos: "",
      documento: "",
      celular: "",
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const { registerUser } = useAuth();
  const { showMessage } = useNotification();
  const { typeUserAuth, setTypeUserAuth } = useAppState();
  const { handleGoogleLogin, loading } = useGoogleAuth();
  const navigate = useNavigate();

  const redirectAfterSuccess = () => navigate("/");

  // 🔹 Copy dinámico según tipo de usuario
  const isComensal = typeUserAuth === "comensal";

  const headerTitle = "Crear cuenta";

  const headerDescription = isComensal
    ? "descubre huariques increíbles cerca de ti."
    : "digitaliza tu negocio de comida con Mappi.";

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    const payload = {
      nombre: data.nombres,
      apellido: data.apellidos,
      correo: data.email,
      telefono: data.celular,
      dni: data.documento,
      contrasena: data.password,
      proveedor: "correo" as const,
      type_user: isComensal ? 4 : 5,
    };

    await registerUser(payload, (res) => {
      if (res.success) redirectAfterSuccess();
      else showMessage(res.message || "Error inesperado", "error");
    });
  };

  return (
    <div className="max-w-125 w-full flex flex-col gap-4">

      {/* 🔙 Cambiar tipo de usuario */}
      {typeUserAuth && (
        <button
          type="button"
          onClick={() => setTypeUserAuth(null)}
          className="
            flex items-center gap-2 mb-1 text-sm
            text-primary hover:text-primary-dark
            transition-all duration-200 cursor-pointer
          "
        >
          <FaArrowLeft size={14} />
          Cambiar tipo de registro
        </button>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4"
        noValidate
      >
        {/* HEADER */}
        <div className="w-full flex flex-col gap-2">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-gradient text-center">
            {headerTitle}
          </h2>

          <p className="text-gray-800 text-center text-sm sm:text-base">
            <strong>Regístrate</strong> y {headerDescription}
          </p>
        </div>

        {/* FORM */}
        <div className="flex flex-col gap-4">

          {/* Nombres + Apellidos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="nombres"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  label="Nombres"
                  placeholder="Nombres *"
                  fullWidth
                  error={!!errors.nombres}
                  helperText={errors.nombres?.message}
                  variant="primary"
                />
              )}
            />

            <Controller
              name="apellidos"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  label="Apellidos"
                  placeholder="Apellidos *"
                  fullWidth
                  error={!!errors.apellidos}
                  helperText={errors.apellidos?.message}
                  variant="primary"
                />
              )}
            />
          </div>

          {/* DNI + Celular */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="documento"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  label="Documento DNI"
                  placeholder="Documento DNI *"
                  fullWidth
                  error={!!errors.documento}
                  helperText={errors.documento?.message}
                  variant="primary"
                />
              )}
            />

            <Controller
              name="celular"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  label="Celular (+51)"
                  placeholder="Celular *"
                  fullWidth
                  error={!!errors.celular}
                  helperText={errors.celular?.message}
                  variant="primary"
                />
              )}
            />
          </div>

          {/* Email */}
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
                variant="primary"
              />
            )}
          />

          {/* Password */}
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
                variant="primary"
              />
            )}
          />

          {/* TERMS */}
          <p className="text-center text-sm sm:text-base text-gray-600">
            Al registrarte, aceptas nuestros{" "}
            <CustomLink
              to="/terminos"
              text="Términos y Condiciones"
              variant="primary"
              fontWeight="bold"
              fontSize="14px"
            />
          </p>

          {/* BUTTON */}
          <CustomButton
            text="Registrarse"
            type="submit"
            fullWidth
            variant="primary"
            fontSize="14px"
            fontWeight={400}
            loading={isSubmitting}
          />
        </div>
      </form>

      {/* GOOGLE */}
      <AuthExtras
        mode="register"
        onGoogleLogin={handleGoogleLogin}
        loadingGoogle={loading}
      />
    </div>
  );
};
