import type z from "zod";

export const registerSchema = (z: typeof import("zod").z) =>
  z.object({
    nombres: z
      .string()
      .nonempty("El nombre es obligatorio")
      .min(2, "Mínimo 2 caracteres")
      .max(50, "Máximo 50 caracteres"),

    apellidos: z
      .string()
      .nonempty("El apellido es obligatorio")
      .min(2, "Mínimo 2 caracteres")
      .max(50, "Máximo 50 caracteres"),

    documento: z
      .string()
      .nonempty("El documento es obligatorio")
      .regex(/^\d+$/, "Solo números")
      .min(6, "Mínimo 6 dígitos")
      .max(15, "Máximo 15 dígitos"),

    celular: z
      .string()
      .nonempty("El celular es obligatorio")
      .regex(/^\d+$/, "Solo números")
      .min(9, "Mínimo 9 dígitos")
      .max(15, "Máximo 15 dígitos"),

    email: z
      .string()
      .nonempty("El correo electrónico es obligatorio")
      .email("Correo inválido"),

    password: z
      .string()
      .nonempty("La contraseña es obligatoria")
      .min(6, "Mínimo 6 caracteres")
      .max(50, "Máximo 50 caracteres"),
  });

export type RegisterFormData = z.infer<ReturnType<typeof registerSchema>>;
