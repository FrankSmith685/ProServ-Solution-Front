import type { FC } from "react";
import type { UserInfo } from "@/interfaces/hook/IUseUser";

export type MisDatosTab = "general" | "perfil" | "documentos" | "ubicacion";

export interface MisDatosFormState {
  fotoPerfil: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: string;
  ubigeo: string;
}

export type EditableField = Exclude<keyof MisDatosFormState, "fotoPerfil">;


export type PerfilTabProps = {
  form: MisDatosFormState;
  onChange: <K extends EditableField>(
    key: K,
    value: MisDatosFormState[K]
  ) => void;
};

export type DocumentosTabProps = PerfilTabProps;

export type GeneralTabProps = {
  form: MisDatosFormState;
  ubicacionLabel: string;
  onNavigate: (tab: MisDatosTab) => void;
};

export type InfoItem = {
  key: keyof MisDatosFormState;
  label: string;
  value?: string;
  icon: FC<{ className?: string }>;
};

export interface ActivityMetadata {
  campos?: string[];
}

export interface ProfileFooterActivityItem {
  text: string;
  date: string;
  metadata?: ActivityMetadata;
}

export type ProfileFooterProps = {
  progress: number;
  lastSaved: string | null;
  activity: ProfileFooterActivityItem[];
};

export type AvatarError = "size" | "type" | "dimensions" | null;

export type ProfileHeaderProps = {
  form: MisDatosFormState;
  dirty: boolean;
  complete: boolean;
  onAvatarChange: (file: File) => void;
  onAvatarRemove: () => void;
  avatarError: AvatarError;
};

export type TabItem = {
  key: MisDatosTab;
  label: string;
  icon: FC<{ className?: string }>;
};

export type ProfileTabsProps = {
  tab: MisDatosTab;
  onChange: (tab: MisDatosTab) => void;
};

export interface UbicacionTabProps {
  departamento: string;
  provincia: string;
  distrito: string;
  onChange: (value: {
    departamento?: string;
    provincia?: string;
    distrito?: string;
  }) => void;
}

export interface MisDatosContainerProps {
  user: UserInfo;
}
