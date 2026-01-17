import { z } from "zod";

export const changePasswordSchema = z
  .object({
    password: z
      .string()
      .nonempty("La contraseña es obligatoria")
      .min(6, "Debe tener al menos 6 caracteres")
      .max(50, "No puede exceder los 50 caracteres"),
    confirmPassword: z
      .string()
      .nonempty("Debes confirmar la contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
