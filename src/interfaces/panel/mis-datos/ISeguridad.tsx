import type { ElementType } from "react";

export interface PropsCuentaVinculada {
  open: boolean;
  onClose: () => void;
}

export type Proveedor = "correo" | "google";

export interface CuentaVinculada {
  proveedor: Proveedor;
  vinculada: boolean;
}

export const PROVEEDORES: readonly Proveedor[] = [
  "correo",
  "google",
];

export interface UseEliminarCuentaReturn {
  password: string;
  setPassword: (value: string) => void;
  confirm: boolean;
  setConfirm: (value: boolean) => void;
  loading: boolean;
  submitPassword: () => Promise<void>;
  submitGoogle: () => Promise<void>;
  canUsePassword: boolean;
  canUseGoogle: boolean;
}

export interface UseEmailFormReturn {
  form: EmailForm;
  loading: boolean;
  dirty: boolean;
  isValid: boolean;
  update: <K extends keyof EmailForm>(
    key: K,
    value: EmailForm[K]
  ) => void;
  save: () => Promise<void>;
  status: PasswordStatus;
}


export interface UsePasswordFormReturn {
  form: PasswordForm;
  loading: boolean;
  dirty: boolean;
  isValid: boolean;
  update: <K extends keyof PasswordForm>(
    key: K,
    value: PasswordForm[K]
  ) => void;
  save: () => Promise<void>;
  status: PasswordStatus;
}



// HEADER 
export interface SeguridadHeaderProps {
  icon: ElementType;
  title: string;
  description: string;
  status: {
    icon: ElementType;
    text: string;
    color: string;  
  };
}

/* =====================
   FORM
===================== */
export interface PasswordForm {
  actual: string;
  nueva: string;
  confirmar: string;
}

/* =====================
   STATUS
===================== */
export interface PasswordStatus {
  text: string;
  icon: ElementType;
  color: string;
}

/* =====================
   PROPS
===================== */
export interface PasswordFormProps {
  form: PasswordForm;
  onChange: <K extends keyof PasswordForm>(
    key: K,
    value: PasswordForm[K]
  ) => void;
}

export interface PasswordHeaderProps {
  status: PasswordStatus;
}


/* =====================
   EMAIL FORM
===================== */
export interface EmailForm {
  nuevo: string;
}

/* =====================
   EMAIL PROPS
===================== */
export interface EmailFormProps {
  form: EmailForm;
  onChange: <K extends keyof EmailForm>(
    key: K,
    value: EmailForm[K]
  ) => void;
}
