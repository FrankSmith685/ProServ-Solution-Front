import { useContext } from "react";
import { AppContext } from "../context/appContext";

import {
  setAccessToken,
  setRefreshtoken,
  setChangePasswordToken,
  setTypeUserAuth,
  setUser,
  
  setRegisterUser,
} from "../context/actions/actions";
import type { TypeUserAuth } from "@/interfaces/auth/IRegister";
import type { UserInfo } from "@/interfaces/hook/IUseUser";

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState debe ser usado dentro de un AppProvider");
  }

  const { appState, dispatch } = context;

  return {
    ...appState,
    setAccessToken: (accessToken: string | null) => dispatch(setAccessToken(accessToken)),
    setRefreshtoken: (refreshToken: string | null) => dispatch(setRefreshtoken(refreshToken)),
    setChangePasswordToken: (changePasswordToken: string | null) => dispatch(setChangePasswordToken(changePasswordToken)),
    setTypeUserAuth: (typeUserAuth: TypeUserAuth) => dispatch(setTypeUserAuth(typeUserAuth)),
    setUser: (user: UserInfo | null) => dispatch(setUser(user)),

    
    setRegisterUser: (registerUser: string | null) => dispatch(setRegisterUser(registerUser)),
  };
};
