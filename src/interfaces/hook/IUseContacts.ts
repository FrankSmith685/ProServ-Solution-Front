import type { BasicCallback } from "../helpers/IBasicCallbacks";

/* ================= SERVICE ================= */
export interface ContactService {
  id: string;
  titulo: string;
  descripcion: string | null;
  descripcion_larga: string | null;
  icono: string | null;
  media_id: string | null;
  orden: number | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

/* ================= CONTACT ================= */
export type ContactStatus =
  | "nuevo"
  | "leido"
  | "respondido"
  | "eliminado";

export interface Contact {
  id: string;
  nombre: string;
  email: string;
  telefono?: string | null;
  empresa?: string | null;

  tipo_cliente?: "persona" | "empresa" | null;
  tipo_documento?: "dni" | "ruc" | null;
  numero_documento?: string | null;

  servicio_id?: string | null;
  mensaje: string;

  estado: ContactStatus;
  archivado?: boolean;

  notas_admin?: string | null;
  ip?: string | null;
  created_at: string;
  updated_at: string;

  service?: {
    id: string;
    titulo: string;
  } | null;
}

export type ContactClientType = "persona" | "empresa";
export type ContactDocumentType = "dni" | "ruc";

export interface ContactResponse {
  success: boolean;
  message: string;
  data: Contact;
}

export interface ContactsResponse {
  success: boolean;
  message: string;
  data: Contact[];
}

export interface UseContacts {
  contacts: Contact[];
  loading: boolean;

  getContacts: (callback?: BasicCallback) => Promise<void>;

  getContactById: (
    id: string,
    callback?: (contact: Contact | null) => void
  ) => Promise<void>;

  createContact: (
    form: Partial<Contact>,
    callback?: BasicCallback
  ) => Promise<void>;

  updateContact: (
    id: string,
    form: Partial<Contact>,
    callback?: BasicCallback
  ) => Promise<void>;

  deleteContact: (
    id: string,
    callback?: BasicCallback
  ) => Promise<void>;

  toggleArchivedContact: (
    id: string,
    callback?: BasicCallback
  ) => Promise<void>;
}