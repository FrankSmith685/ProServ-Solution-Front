import type { ReactNode } from "react";

export interface CustomModalConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  children?: ReactNode;
  width?: string;
  allowBackdropClose?: boolean;
}

export type ModalConfirmVariant = "default" | "danger" | "success";
