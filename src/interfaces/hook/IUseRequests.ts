import type { BasicCallback } from "../helpers/IBasicCallbacks";
import type { Contact } from "./IUseContacts";

export type RequestStatus =
  | "pendiente"
  | "programada"
  | "en_proceso"
  | "finalizada"
  | "cancelada";

export interface RequestItem {
  id: string;
  contacto_id: string;
  fecha_programada: string | null;
  estado: RequestStatus;
  created_at: string;
  contact?: Contact | null;
}

export interface RequestResponse {
  success: boolean;
  message: string;
  data: RequestItem;
}

export interface RequestsResponse {
  success: boolean;
  message: string;
  data: RequestItem[];
}

export interface UseRequests {
  requests: RequestItem[];
  loading: boolean;

  getRequests: (callback?: BasicCallback) => Promise<void>;
  getRequestById: (
    id: string,
    callback?: (request: RequestItem | null) => void
  ) => Promise<void>;

  createRequest: (
    form: Partial<RequestItem>,
    callback?: BasicCallback
  ) => Promise<void>;

  updateRequest: (
    id: string,
    form: Partial<RequestItem>,
    callback?: BasicCallback
  ) => Promise<void>;
}