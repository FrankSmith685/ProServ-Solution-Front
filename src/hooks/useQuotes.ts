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
  const { quotes, setQuotes } = useAppState();
  const [loading, setLoading] = useState<boolean>(false);

  const syncQuoteInState = (updatedQuote: Quote): void => {
    setQuotes(
      quotes.some((quote) => quote.id === updatedQuote.id)
        ? quotes.map((quote) => (quote.id === updatedQuote.id ? updatedQuote : quote))
        : [updatedQuote, ...quotes]
    );
  };

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
        fecha_vencimiento: form.fecha_vencimiento || null,
        moneda: form.moneda || "PEN",
        subtotal: form.subtotal ?? null,
        impuestos: form.impuestos ?? null,
        descuento: form.descuento ?? null,
        total: form.total ?? null,
        observaciones: form.observaciones || null,
        motivo_rechazo: form.motivo_rechazo || null,
        estado: form.estado || "pendiente",
      };

      const { data } = await apiWithAuth.post<QuoteResponse>("/quotes", payload);

      if (!data.success) {
        throw new Error(data.message);
      }

      syncQuoteInState(data.data);

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

      syncQuoteInState(data.data);

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

  const sendQuote = async (id: string, callback?: BasicCallback): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.post<QuoteResponse>(`/quotes/${id}/send`);

      if (!data.success) {
        throw new Error(data.message);
      }

      syncQuoteInState(data.data);

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

  const approveQuote = async (id: string, callback?: BasicCallback): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.post<QuoteResponse>(`/quotes/${id}/approve`);

      if (!data.success) {
        throw new Error(data.message);
      }

      syncQuoteInState(data.data);

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

  const rejectQuote = async (
    id: string,
    payload: { motivo_rechazo: string },
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.post<QuoteResponse>(`/quotes/${id}/reject`, payload);

      if (!data.success) {
        throw new Error(data.message);
      }

      syncQuoteInState(data.data);

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

  const addQuoteItem = async (
    id: string,
    payload: { descripcion: string; cantidad: number; precio_unitario: number; orden?: number | null },
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.post<QuoteResponse>(`/quotes/${id}/items`, payload);

      if (!data.success) {
        throw new Error(data.message);
      }

      syncQuoteInState(data.data);

      callback?.({ success: true, message: data.message });
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({ success: false, message: handled.message });
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteItem = async (
    id: string,
    itemId: string,
    payload: Partial<{ descripcion: string; cantidad: number; precio_unitario: number; subtotal: number; orden?: number | null }>,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.put<QuoteResponse>(
        `/quotes/${id}/items/${itemId}`,
        payload
      );

      if (!data.success) {
        throw new Error(data.message);
      }

      syncQuoteInState(data.data);
      callback?.({ success: true, message: data.message });
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({ success: false, message: handled.message });
    } finally {
      setLoading(false);
    }
  };

  const deleteQuoteItem = async (
    id: string,
    itemId: string,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.delete<QuoteResponse>(`/quotes/${id}/items/${itemId}`);

      if (!data.success) {
        throw new Error(data.message);
      }

      syncQuoteInState(data.data);
      callback?.({ success: true, message: data.message });
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({ success: false, message: handled.message });
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
    sendQuote,
    approveQuote,
    rejectQuote,
    addQuoteItem,
    updateQuoteItem,
    deleteQuoteItem,
  };
};
