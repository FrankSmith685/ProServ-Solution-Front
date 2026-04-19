import { useState } from "react";
import { apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";

import type {
  Quote,
  QuoteEvent,
  QuoteEventsResponse,
  QuotePdfResult,
  QuoteResponse,
  QuoteSendChannel,
  QuotesResponse,
  UseQuotes,
} from "@/interfaces/hook/IUseQuotes";
import type { BasicCallback } from "@/interfaces/helpers/IBasicCallbacks";
import { useAppState } from "./useAppState";

export const useQuotes = (): UseQuotes => {
  const { quotes, setQuotes } = useAppState();
  const [loading, setLoading] = useState<boolean>(false);

  const normalizeAmount = (value?: number | string | null): number => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const normalizeNullableAmount = (value?: number | string | null): number | null => {
    if (value === "" || value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const syncQuoteInState = (updatedQuote: Quote): void => {
    setQuotes(
      quotes.some((quote) => quote.id === updatedQuote.id)
        ? quotes.map((quote) => (quote.id === updatedQuote.id ? updatedQuote : quote))
        : [updatedQuote, ...quotes]
    );
  };

  const syncQuoteFromApi = async (id: string): Promise<void> => {
    const { data } = await apiWithAuth.get<QuoteResponse>(`/quotes/${id}`);
    if (data.success && data.data) {
      syncQuoteInState(data.data);
    }
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

  const getQuotesByContact = async (
    contactoId: string,
    callback?: (quotes: Quote[]) => void
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.get<QuotesResponse>(`/quotes/contact/${contactoId}`);

      if (!data.success) {
        throw new Error(data.message);
      }

      callback?.(data.data);
    } catch (error) {
      const handled = handleApiError(error);
      console.error("Error obteniendo cotizaciones por contacto:", handled.message);
      callback?.([]);
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
        cliente_nombre: form.cliente_nombre || undefined,
        cliente_empresa: form.cliente_empresa || undefined,
        cliente_ruc: form.cliente_ruc || undefined,
        cliente_email: form.cliente_email || undefined,
        cliente_telefono: form.cliente_telefono || undefined,
        numero: form.numero || undefined,
        asunto: form.asunto || undefined,
        area: form.area || undefined,
        fecha_envio: form.fecha_envio || null,
        fecha_vencimiento: form.fecha_vencimiento || null,
        moneda: form.moneda || "PEN",
        descuento_tipo: form.descuento_tipo || undefined,
        descuento_valor: normalizeNullableAmount(form.descuento_valor),
        igv_porcentaje: normalizeNullableAmount(form.igv_porcentaje),
        aplica_igv: Boolean(form.aplica_igv),
        incluye_igv: Boolean(form.incluye_igv),
        subtotal: normalizeAmount(form.subtotal),
        impuestos: normalizeAmount(form.impuestos),
        descuento: normalizeAmount(form.descuento),
        total: normalizeAmount(form.total),
        observaciones: form.observaciones || null,
        motivo_rechazo: form.motivo_rechazo || null,
        estado: form.estado || "pendiente",
      };

      const { data } = await apiWithAuth.post<QuoteResponse>("/quotes", payload);

      if (!data.success) {
        throw new Error(data.message);
      }

      syncQuoteInState(data.data);
      await syncQuoteFromApi(data.data.id);

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
      const payload = {
        ...form,
        cliente_nombre: form.cliente_nombre || undefined,
        cliente_empresa: form.cliente_empresa || undefined,
        cliente_ruc: form.cliente_ruc || undefined,
        cliente_email: form.cliente_email || undefined,
        cliente_telefono: form.cliente_telefono || undefined,
        numero: form.numero || undefined,
        asunto: form.asunto || undefined,
        area: form.area || undefined,
        fecha_envio: form.fecha_envio || null,
        fecha_vencimiento: form.fecha_vencimiento || null,
        moneda: form.moneda || "PEN",
        descuento_tipo: form.descuento_tipo || undefined,
        descuento_valor: normalizeNullableAmount(form.descuento_valor),
        igv_porcentaje: normalizeNullableAmount(form.igv_porcentaje),
        aplica_igv: Boolean(form.aplica_igv),
        incluye_igv: Boolean(form.incluye_igv),
        subtotal: normalizeAmount(form.subtotal),
        impuestos: normalizeAmount(form.impuestos),
        descuento: normalizeAmount(form.descuento),
        total: normalizeAmount(form.total),
        observaciones: form.observaciones || null,
        motivo_rechazo: form.motivo_rechazo || null,
      };

      const { data } = await apiWithAuth.put<QuoteResponse>(`/quotes/${id}`, payload);

      if (!data.success) {
        throw new Error(data.message);
      }

      syncQuoteInState(data.data);
      await syncQuoteFromApi(id);

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

  const sendQuote = async (
    id: string,
    payload?: { canal?: QuoteSendChannel },
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.post<QuoteResponse>(`/quotes/${id}/send`, payload || {});

      if (!data.success) {
        throw new Error(data.message);
      }

      syncQuoteInState(data.data);
      await syncQuoteFromApi(id);

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

  const getQuoteEvents = async (
    id: string,
    callback?: (events: QuoteEvent[]) => void
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.get<QuoteEventsResponse>(`/quotes/${id}/events`);

      if (!data.success) {
        throw new Error(data.message);
      }

      callback?.(data.data);
    } catch (error) {
      const handled = handleApiError(error);
      console.error("Error obteniendo timeline de cotización:", handled.message);
      callback?.([]);
    } finally {
      setLoading(false);
    }
  };

  const getQuotePdf = async (
    id: string,
    callback?: (result: QuotePdfResult) => void
  ): Promise<void> => {
    setLoading(true);

    try {
      const response = await apiWithAuth.get(`/quotes/${id}/pdf`, {
        responseType: "blob",
      });

      const contentType = response.headers["content-type"] || "";
      const isPdf = contentType.includes("application/pdf");

      if (!isPdf) {
        const rawText = await response.data.text();

        try {
          const parsed = JSON.parse(rawText) as {
            message?: string;
            data?: { pdfUrl?: string; url?: string };
          };

          const maybePdfUrl =
            parsed.data?.pdfUrl ||
            parsed.data?.url ||
            null;

          callback?.({
            pdfUrl: maybePdfUrl,
            message:
              parsed.message ||
              "El endpoint respondió sin PDF binario. Verifica si aún está en modo placeholder.",
          });
        } catch {
          callback?.({
            pdfUrl: null,
            message: "El endpoint respondió sin PDF binario y no se pudo interpretar la respuesta.",
          });
        }
        return;
      }

      const file = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(file);
      callback?.({ pdfUrl });
    } catch (error) {
      const handled = handleApiError(error);
      console.error("Error obteniendo PDF de cotización:", handled.message);
      callback?.({
        pdfUrl: null,
        message: handled.message || "No se pudo obtener el PDF de la cotización.",
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
      await syncQuoteFromApi(id);

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
      await syncQuoteFromApi(id);

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
      await syncQuoteFromApi(id);

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
      await syncQuoteFromApi(id);
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
      await syncQuoteFromApi(id);
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
    getQuotesByContact,
    createQuote,
    updateQuote,
    sendQuote,
    approveQuote,
    rejectQuote,
    getQuoteEvents,
    getQuotePdf,
    addQuoteItem,
    updateQuoteItem,
    deleteQuoteItem,
  };
};
