import type { BasicCallback } from "../helpers/IBasicCallbacks";
import type { Contact } from "./IUseContacts";

export type QuoteStatus =
  | "pendiente"
  | "enviada"
  | "aprobada"
  | "rechazada";

export interface QuoteItem {
  id: string;
  quote_id: string;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  orden?: number | null;
}

export interface QuoteEvent {
  id: string;
  quote_id: string;
  tipo_evento: string;
  metadata?: Record<string, unknown> | null;
  user_id?: string | null;
  user_name?: string | null;
  created_at: string;
}

export type QuoteSendChannel = "email" | "whatsapp" | "manual";

export interface Quote {
  id: string;
  contacto_id: string;
  numero?: string | null;
  fecha_envio?: string | null;
  fecha_vencimiento?: string | null;
  moneda?: string | null;
  subtotal?: number | string | null;
  impuestos?: number | string | null;
  descuento?: number | string | null;
  total: number | string | null;
  observaciones?: string | null;
  motivo_rechazo?: string | null;
  estado: QuoteStatus;
  created_at: string;
  items?: QuoteItem[];
  events?: QuoteEvent[];
  contact?: Contact | null;
}

export interface QuoteResponse {
  success: boolean;
  message: string;
  data: Quote;
}

export interface QuotesResponse {
  success: boolean;
  message: string;
  data: Quote[];
}

export interface QuoteEventsResponse {
  success: boolean;
  message: string;
  data: QuoteEvent[];
}

export interface QuotePdfResult {
  pdfUrl: string | null;
  message?: string;
}

export interface UseQuotes {
  quotes: Quote[];
  loading: boolean;

  getQuotes: (callback?: BasicCallback) => Promise<void>;
  getQuoteById: (
    id: string,
    callback?: (quote: Quote | null) => void
  ) => Promise<void>;

  createQuote: (
    form: Partial<Quote>,
    callback?: BasicCallback
  ) => Promise<void>;

  updateQuote: (
    id: string,
    form: Partial<Quote>,
    callback?: BasicCallback
  ) => Promise<void>;

  sendQuote: (
    id: string,
    payload?: { canal?: QuoteSendChannel },
    callback?: BasicCallback
  ) => Promise<void>;
  approveQuote: (id: string, callback?: BasicCallback) => Promise<void>;
  rejectQuote: (
    id: string,
    payload: { motivo_rechazo: string },
    callback?: BasicCallback
  ) => Promise<void>;
  getQuoteEvents: (
    id: string,
    callback?: (events: QuoteEvent[]) => void
  ) => Promise<void>;
  getQuotePdf: (
    id: string,
    callback?: (result: QuotePdfResult) => void
  ) => Promise<void>;

  addQuoteItem: (
    id: string,
    payload: Omit<QuoteItem, "id" | "quote_id" | "subtotal">,
    callback?: BasicCallback
  ) => Promise<void>;
  updateQuoteItem: (
    id: string,
    itemId: string,
    payload: Partial<Omit<QuoteItem, "id" | "quote_id">>,
    callback?: BasicCallback
  ) => Promise<void>;
  deleteQuoteItem: (
    id: string,
    itemId: string,
    callback?: BasicCallback
  ) => Promise<void>;
} 
