import type { BasicCallback } from "../helpers/IBasicCallbacks";
import type { Contact } from "./IUseContacts";

export type QuoteStatus =
  | "pendiente"
  | "enviada"
  | "aprobada"
  | "rechazada";

export interface Quote {
  id: string;
  contacto_id: string;
  total: number | string | null;
  estado: QuoteStatus;
  created_at: string;
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
}