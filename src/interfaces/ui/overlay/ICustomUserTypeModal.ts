export type UserType = "comensal" | "vendedor";

export interface UserTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: UserType) => void;
}
