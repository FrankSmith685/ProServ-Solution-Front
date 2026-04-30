import { useState } from "react";
import { api, apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";

import type {
  Contact,
  ContactResponse,
  ContactsResponse,
  UseContacts,
} from "@/interfaces/hook/IUseContacts";

import type { BasicCallback } from "@/interfaces/helpers/IBasicCallbacks";

import { useAppState } from "./useAppState";

export const useContacts = (): UseContacts => {
  const { contacts, setContacts } = useAppState();
  const [loading, setLoading] = useState<boolean>(false);

  const getContacts = async (callback?: BasicCallback): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.get<ContactsResponse>("/contacts");

      if (!data.success) {
        throw new Error(data.message);
      }

      setContacts(data.data);

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

  const getContactById = async (
    id: string,
    callback?: (contact: Contact | null) => void
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.get<ContactResponse>(`/contacts/${id}`);

      if (!data.success) {
        throw new Error(data.message);
      }

      callback?.(data.data);
    } catch (error) {
      const handled = handleApiError(error);
      console.error("Error obteniendo contacto:", handled.message);
      callback?.(null);
    } finally {
      setLoading(false);
    }
  };

  const createContact = async (
    form: Partial<Contact>,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      const payload = {
        nombre: form.nombre?.trim() || "",
        email: form.email?.trim() || "",
        telefono: form.telefono?.trim() || null,
        empresa: form.empresa?.trim() || null,
        tipo_cliente: form.tipo_cliente || "persona",
        tipo_documento: form.tipo_documento || (form.empresa ? "ruc" : "dni"),
        numero_documento: form.numero_documento?.trim() || null,
        servicio_id: form.servicio_id || null,
        mensaje: form.mensaje?.trim() || "",
      };

      const { data } = await api.post<ContactResponse>("/contacts", payload);

      if (!data.success) {
        throw new Error(data.message);
      }

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

  const updateContact = async (
    id: string,
    form: Partial<Contact>,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.put<ContactResponse>(
        `/contacts/${id}`,
        form
      );

      if (!data.success) {
        throw new Error(data.message);
      }

      setContacts(
        contacts.map((contact) => (contact.id === id ? data.data : contact))
      );

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

  const deleteContact = async (
    id: string,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.delete<{
        success: boolean;
        message: string;
      }>(`/contacts/${id}`);

      if (!data.success) {
        throw new Error(data.message);
      }

      setContacts(contacts.filter((contact) => contact.id !== id));

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

  const toggleArchivedContact = async (
    id: string,
    callback?: BasicCallback
  ): Promise<void> => {
    const contact = contacts.find((item) => item.id === id);

    if (!contact) {
      callback?.({
        success: false,
        message: "Contacto no encontrado",
      });
      return;
    }

    await updateContact(
      id,
      {
        archivado: contact.archivado !== true,
      },
      callback
    );
  };

  return {
    contacts,
    loading,
    getContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
    toggleArchivedContact,
  };
};