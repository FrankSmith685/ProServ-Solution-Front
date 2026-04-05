import { useState } from "react";
import { apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";

import type {
  Quote,
  QuoteResponse,
  QuotesResponse,
  UseQuotes,
} from "@/interfaces/hook/IUseQuotes";
import type { BasicCallback } from "@/interfaces/helpers/IBasicCallbacks";
import { useAppState } from "./useAppState";

export const useQuotes = (): UseQuotes => {
  const {quotes, setQuotes} = useAppState();
  const [loading, setLoading] = useState<boolean>(false);

  const getQuotes = async (callback?: BasicCallback): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.get<QuotesResponse>("/quotes");

      if (!data.success) {
        throw new Error(data.message);
      }

      setQuotes(data.data);

      callback?.({
        success: true,
        message: data.message,
      });
    } catch (error) {
      const handled = handleApiError(error);

      callback?.({
        success: false,
        message: handled.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const getQuoteById = async (
    id: string,
    callback?: (quote: Quote | null) => void
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.get<QuoteResponse>(`/quotes/${id}`);

      if (!data.success) {
        throw new Error(data.message);
      }

      callback?.(data.data);
    } catch (error) {
      const handled = handleApiError(error);
      console.error("Error obteniendo cotización:", handled.message);
      callback?.(null);
    } finally {
      setLoading(false);
    }
  };

  const createQuote = async (
    form: Partial<Quote>,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      const payload = {
        contacto_id: form.contacto_id || "",
        total: form.total ?? null,
        estado: form.estado || "pendiente",
      };

      const { data } = await apiWithAuth.post<QuoteResponse>("/quotes", payload);

      if (!data.success) {
        throw new Error(data.message);
      }

      setQuotes([data.data, ...quotes]);

      callback?.({
        success: true,
        message: data.message,
      });
    } catch (error) {
      const handled = handleApiError(error);

      callback?.({
        success: false,
        message: handled.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuote = async (
    id: string,
    form: Partial<Quote>,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.put<QuoteResponse>(`/quotes/${id}`, form);

      if (!data.success) {
        throw new Error(data.message);
      }

      setQuotes(quotes.map((quote) => (quote.id === id ? data.data : quote)));

      callback?.({
        success: true,
        message: data.message,
      });
    } catch (error) {
      const handled = handleApiError(error);

      callback?.({
        success: false,
        message: handled.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    quotes,
    loading,
    getQuotes,
    getQuoteById,
    createQuote,
    updateQuote,
  };
};