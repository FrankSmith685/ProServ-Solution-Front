import { useState } from "react";
import { api, apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";

import type {
  ConfigNosotrosPayload,
  ConfigNosotrosResponse,
  UseConfigNosotros,
} from "@/interfaces/hook/IUseConfigNosotros";

import type { BasicCallback } from "@/interfaces/helpers/IBasicCallbacks";
import { useAppState } from "./useAppState";

export const useConfigNosotros = (): UseConfigNosotros => {
  const { configNosotros, setConfigNosotros } = useAppState();
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const getConfigNosotros = async (callback?: BasicCallback): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await api.get<ConfigNosotrosResponse>("/config/nosotros");

      if (data.success) {
        setConfigNosotros(data.data);
        callback?.({
          success: true,
          message: data.message,
        });
        return;
      }

      callback?.({
        success: false,
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

  const updateConfigNosotros = async (
    payload: ConfigNosotrosPayload,
    callback?: BasicCallback
  ): Promise<void> => {
    setSaving(true);

    try {
      const { data } = await apiWithAuth.put<ConfigNosotrosResponse>(
        "/config/nosotros",
        payload
      );

      if (data.success) {
        setConfigNosotros(data.data);
        callback?.({
          success: true,
          message: data.message,
        });
        return;
      }

      callback?.({
        success: false,
        message: data.message,
      });
    } catch (error) {
      const handled = handleApiError(error);

      callback?.({
        success: false,
        message: handled.message,
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    configNosotros,
    getConfigNosotros,
    updateConfigNosotros,
    loading,
    saving,
  };
};