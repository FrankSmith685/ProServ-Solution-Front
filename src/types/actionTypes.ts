import type { WizardView } from "@/hooks/panel/mis-huariques/useHuariqueWizard";
import type { TypeUserAuth } from "@/interfaces/auth/IRegister";
import type { Categoria } from "@/interfaces/hook/IUseCategoria";
import type { Company } from "@/interfaces/hook/IUseCompany";
import type { Service } from "@/interfaces/hook/IUseService";
import type { UserInfo } from "@/interfaces/hook/IUseUser";
import type { EmpresaTab, HuariqueTab } from "@/interfaces/panel/mis-huariques/IHuarique";

export const SET_ACCESSTOKEN = "SET_ACCESSTOKEN" as const;
export const SET_REFRESHTOKEN = "SET_REFRESHTOKEN" as const;
export const SET_CHANGEPASSWORDTOKEN = "SET_CHANGEPASSWORDTOKEN" as const;
export const SET_TYPE_USER_AUTH = "SET_TYPE_USER_AUTH" as const;
export const SET_USER = "SET_USER" as const;
export const SET_CATEGORIES = "SET_CATEGORIES" as const;
export const SET_SERVICE = "SET_SERVICE" as const;
export const SET_SERVICE_STEEP = "SET_SERVICE_STEEP" as const;
export const SET_LOGOUT = "SET_LOGOUT" as const;
export const SET_REGISTERUSER = "SET_REGISTERUSER" as const;
export const SET_SERVICE_LOADING = "SET_SERVICE_LOADING" as const;
export const SET_SERVICE_STEEP_INFO = "SET_SERVICE_STEEP_INFO" as const;
export const SET_ACTIVE_INFO_TAB = "SET_ACTIVE_INFO_TAB" as const;
export const SET_COMPANY = "SET_COMPANY" as const;
export const SET_SERVICE_STEEP_EMPRESA = "SET_SERVICE_STEEP_EMPRESA" as const;
export const SET_ACTIVE_EMPRESA_TAB = "SET_ACTIVE_EMPRESA_TAB" as const;
export const SET_WIZARD_STACK = "SET_WIZARD_STACK" as const;

export type ActionTypes =
  | { type: typeof SET_ACCESSTOKEN; payload: string | null }
  | { type: typeof SET_REFRESHTOKEN; payload: string | null }
  | { type: typeof SET_CHANGEPASSWORDTOKEN; payload: string | null }
  | { type: typeof SET_TYPE_USER_AUTH; payload:  TypeUserAuth}
  | { type: typeof SET_USER; payload:  UserInfo | null}

  | { type: typeof SET_LOGOUT}
  | { type: typeof SET_LOGOUT}
  | { type: typeof SET_REGISTERUSER; payload: string | null }
  | { type: typeof SET_CATEGORIES; payload: Categoria[]}
  | { type: typeof SET_SERVICE; payload: Service | null }
  | { type: typeof SET_SERVICE_STEEP; payload: number}
  | { type: typeof SET_SERVICE_LOADING; payload: boolean}
  | { type: typeof SET_SERVICE_STEEP_INFO; payload: number}
  | { type: typeof SET_ACTIVE_INFO_TAB; payload: HuariqueTab}
  | { type: typeof SET_COMPANY; payload: Company | null }
  | { type: typeof SET_SERVICE_STEEP_EMPRESA; payload: number }
  | { type: typeof SET_ACTIVE_EMPRESA_TAB; payload: EmpresaTab }
  | { type: typeof SET_WIZARD_STACK; payload: WizardView[] }
