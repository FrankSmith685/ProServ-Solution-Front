import type { ChangeEvent } from "react";

export interface LoginAdminForm {
  email: string;
  password: string;
}

export interface LoginAdminResponse {
  success: boolean;
  message?: string;
}

export type LoginAdminInputChange = ChangeEvent<HTMLInputElement>;