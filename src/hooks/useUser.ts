import { useCallback } from "react";
import { apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";
import { useAppState } from "./useAppState";

import type {
  UpdateUserApiResponse,
  UpdateUserPayload,
  UseUser,
  UserActivity,
  UserActivityResponse,
  UserInfo,
  UserInfoCallback,
  ChangePasswordPayload,
  ChangeEmailPayload,
  LinkAccountPayload,
  UnlinkAccountPayload,
  UpdateUserLoginMethodsResponse,
  DeleteAccountPayload,
} from "@/interfaces/hook/IUseUser";


export const useUser = (): UseUser => {
  const { setUser, user } = useAppState();

  const getUserInfo = async (): Promise<void> => {
    try {
      const response = await apiWithAuth.get<UserInfo>("/user/user-info");
      setUser(response.data);
    } catch (error) {
      console.error(handleApiError(error).message);
    }
  };

  const updateUser = async (
    payload: UpdateUserPayload,
    callback?: UserInfoCallback
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.put<UpdateUserApiResponse>(
        "/user/update-user",
        payload
      );

      const updatedUser = response.data.data;

      if (updatedUser) {
        setUser(updatedUser);
      }
      callback?.({
        success: response.data.success,
        message: response.data.message,
        user: updatedUser,
      });
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({
        success: false,
        message: handled.message,
      });
    }
  };

  const changePassword = async (
    payload: ChangePasswordPayload,
    callback?: UserInfoCallback
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.put<UpdateUserApiResponse>(
        "/user/change-password",
        payload
      );

      callback?.({
        success: response.data.success,
        message: response.data.message,
        user: response.data.data,
      });
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({
        success: false,
        message: handled.message,
      });
    }
  };

  const changeEmail = async (
    payload: ChangeEmailPayload,
    callback?: UserInfoCallback
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.put<UpdateUserApiResponse>(
        "/user/change-email",
        payload
      );

      callback?.({
        success: response.data.success,
        message: response.data.message,
        user: response.data.data,
      });
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({
        success: false,
        message: handled.message,
      });
    }
  };

  const linkAccount = async (
    payload: LinkAccountPayload,
    callback?: UserInfoCallback
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.put<UpdateUserLoginMethodsResponse>(
        "/user/link-account",
        payload
      );

      // 🔥 Backend solo devuelve metodosLogin
      if (response.data.data && user) {
        const updatedUser: UserInfo = {
          ...user,
          metodosLogin: response.data.data.metodosLogin,
        };

        setUser(updatedUser);

        callback?.({
          success: response.data.success,
          message: response.data.message,
          user: updatedUser,
        });

        return;
      }

      callback?.({
        success: response.data.success,
        message: response.data.message,
      });
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({
        success: false,
        message: handled.message,
      });
    }
  };

  const unlinkAccount = async (
    payload: UnlinkAccountPayload,
    callback?: UserInfoCallback
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.put<UpdateUserLoginMethodsResponse>(
        "/user/unlink-account",
        payload
      );

      if (response.data.data && user) {
        const updatedUser: UserInfo = {
          ...user,
          metodosLogin: response.data.data.metodosLogin,
        };

        setUser(updatedUser);

        callback?.({
          success: response.data.success,
          message: response.data.message,
          user: updatedUser,
        });

        return;
      }

      callback?.({
        success: response.data.success,
        message: response.data.message,
      });
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({
        success: false,
        message: handled.message,
      });
    }
  };

  const deleteAccount = async (
    payload: DeleteAccountPayload,
    callback?: UserInfoCallback
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.put<UpdateUserApiResponse>(
        "/user/delete-account",
        payload
      );

      callback?.({
        success: response.data.success,
        message: response.data.message,
      });
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({
        success: false,
        message: handled.message,
      });
    }
  };

  const deleteAccountGoogle = async (
    correo: string,
    callback?: UserInfoCallback
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.put<UpdateUserApiResponse>(
        `/user/delete-account-google?correo=${encodeURIComponent(correo)}`
      );

      callback?.({
        success: response.data.success,
        message: response.data.message,
      });
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({
        success: false,
        message: handled.message,
      });
    }
  };

  const getUserActivity = useCallback(
    async (): Promise<UserActivity | null> => {
      if (!user) return null;

      try {
        const response = await apiWithAuth.get<UserActivityResponse>(
          "/user/activity"
        );

        return response.data.data ?? null;
      } catch (error) {
        console.error(handleApiError(error).message);
        return null;
      }
    },
    [user]
  );

  const setProfileType = async (
    profileType: "empresa" | "independiente",
    callback?: UserInfoCallback
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.patch<UpdateUserApiResponse>(
        "/user/profile-type",
        { profileType }
      );

      if (response.data.success && user) {
        const updatedUser: UserInfo = {
          ...user,
          profileType,
        };

        setUser(updatedUser);

        callback?.({
          success: true,
          message: response.data.message,
          user: updatedUser,
        });

        return;
      }

      callback?.({
        success: response.data.success,
        message: response.data.message,
      });

    } catch (error) {
      const handled = handleApiError(error);
      callback?.({
        success: false,
        message: handled.message,
      });
    }
  };


  return {
    getUserInfo,
    updateUser,
    getUserActivity,
    changePassword,
    changeEmail,
    linkAccount,
    unlinkAccount,
    deleteAccount,
    deleteAccountGoogle,
    setProfileType
  };
};
