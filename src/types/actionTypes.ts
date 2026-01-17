import type { TypeUserAuth } from "@/interfaces/auth/IRegister";
import type { UserInfo } from "@/interfaces/hook/IUseUser";

export const SET_ACCESSTOKEN = "SET_ACCESSTOKEN" as const;
export const SET_REFRESHTOKEN = "SET_REFRESHTOKEN" as const;
export const SET_CHANGEPASSWORDTOKEN = "SET_CHANGEPASSWORDTOKEN" as const;
export const SET_TYPE_USER_AUTH = "SET_TYPE_USER_AUTH" as const;
export const SET_USER = "SET_USER" as const;




export const SET_LOGOUT = "SET_LOGOUT" as const;
export const SET_REGISTERUSER = "SET_REGISTERUSER" as const;

export type ActionTypes =
  | { type: typeof SET_ACCESSTOKEN; payload: string | null }
  | { type: typeof SET_REFRESHTOKEN; payload: string | null }
  | { type: typeof SET_CHANGEPASSWORDTOKEN; payload: string | null }
  | { type: typeof SET_TYPE_USER_AUTH; payload:  TypeUserAuth}
  | { type: typeof SET_USER; payload:  UserInfo | null}


  | { type: typeof SET_LOGOUT}
  | { type: typeof SET_LOGOUT}
  | { type: typeof SET_REGISTERUSER; payload: string | null }
  