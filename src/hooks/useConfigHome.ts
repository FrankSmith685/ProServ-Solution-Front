import { useState } from "react";
import { api, apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";

import type {
  ConfigHomePayload,
  ConfigHomeResponse,
  UseConfigHome
} from "@/interfaces/hook/IUseConfigHome";

import type { BasicCallback } from "@/interfaces/helpers/IBasicCallbacks";
import { useAppState } from "./useAppState";

export const useConfigHome = (): UseConfigHome => {
  const {setConfigHome} = useAppState();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const getConfigHome = async (callback?: BasicCallback) => {
    setLoading(true);
    try {
      const { data } = await api.get<ConfigHomeResponse>("/config/home");
      if (data.success) {
        setConfigHome(data.data);
        callback?.({
          success: true,
          message: data.message
        });
        return;
      }
      callback?.({
        success: false,
        message: data.message
      });
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({
        success: false,
        message: handled.message
      });
    } finally {
      setLoading(false);
    }
  };

  const updateConfigHome = async (
    payload: ConfigHomePayload,
    callback?: BasicCallback
  ) => {
    setSaving(true);

    try {
      const { data } = await apiWithAuth.put<ConfigHomeResponse>(
        "/config/home",
        payload
      );

      if (data.success) {
        setConfigHome(data.data);
        callback?.({
          success: true,
          message: data.message
        });
        return;
      }

      callback?.({
        success: false,
        message: data.message
      });
    } catch (error) {
      const handled = handleApiError(error);

      callback?.({
        success: false,
        message: handled.message
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    getConfigHome,
    updateConfigHome,
    loading,
    saving
  };
};