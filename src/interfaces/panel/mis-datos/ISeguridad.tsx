import type { ElementType } from "react";

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
