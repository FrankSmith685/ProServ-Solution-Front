export interface DocumentModalConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  width: string;
  allowBackdropClose: boolean;
  loading: boolean;
}
