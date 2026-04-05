import { useState } from "react";
import { apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";

import type {
  AdminLogsResponse,
  UseAdminLogs,
} from "@/interfaces/hook/IUseAdminLogs";

import type { BasicCallback } from "@/interfaces/helpers/IBasicCallbacks";
import { useAppState } from "./useAppState";

export const useAdminLogs = (): UseAdminLogs => {
  const {logs, setLogs} = useAppState();
  const [loading, setLoading] = useState<boolean>(false);

  const getAdminLogs = async (callback?: BasicCallback): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.get<AdminLogsResponse>("/admin-logs");

      if (!data.success) {
        throw new Error(data.message);
      }

      setLogs(data.data);

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
    logs,
    loading,
    getAdminLogs,
  };
};