import type z from "zod";

export const loginSchema = (z: typeof import("zod").z) =>
  z.object({
    email: z
      .string()
      .nonempty("El correo electrónico es obligatorio")
      .email("Correo inválido"),
    password: z
      .string()
      .nonempty("La contraseña es obligatoria")
      .min(6, "Mínimo 6 caracteres"),
  });

export type LoginFormData = z.infer<ReturnType<typeof loginSchema>>;
