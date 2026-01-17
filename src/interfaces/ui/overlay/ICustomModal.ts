export type ModalVariant = "default" | "auth";

export interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;

  title?: string;

  header?: React.ReactNode | null;
  footer?: React.ReactNode;

  variant?: "default" | "auth";
  width?: string;
  height?: string;

  closeButton?: boolean;
  allowBackdropClose?: boolean;

  mainClassName?: string;
  containerClassName?: string;
}
