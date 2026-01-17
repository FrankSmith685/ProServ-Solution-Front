import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .nonempty("El correo electrónico es obligatorio")
    .email("Ingresa un correo electrónico válido"),
});

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;



export interface ResetResponse {
  success: boolean;
  message?: string;
}