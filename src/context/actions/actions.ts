import type { TypeUserAuth } from "@/interfaces/auth/IRegister";
import { 
  SET_ACCESSTOKEN, 
  SET_CATEGORIES,
  SET_CHANGEPASSWORDTOKEN, 
  SET_REFRESHTOKEN, 
  SET_REGISTERUSER, 
  SET_TYPE_USER_AUTH, 
  SET_USER,
  SET_SERVICE,
  SET_SERVICE_STEEP,
  SET_SERVICE_LOADING,
  SET_SERVICE_STEEP_INFO,
  SET_ACTIVE_INFO_TAB,
  SET_COMPANY,
  SET_SERVICE_STEEP_EMPRESA,
  SET_ACTIVE_EMPRESA_TAB,
  SET_WIZARD_STACK,
  SET_ACTIVE_SERVICE_STEEP,
  SET_VISITED_SERVICE_STEEP
} from "../../types/actionTypes";
import type { UserInfo } from "@/interfaces/hook/IUseUser";
import type { Categoria } from "@/interfaces/hook/IUseCategoria";
import type { Service } from "@/interfaces/hook/IUseService";
import type { EmpresaTab, HuariqueTab, ServiceSteeps } from "@/interfaces/panel/mis-huariques/IHuarique";
import type { Company } from "@/interfaces/hook/IUseCompany";
import type { WizardView } from "@/hooks/panel/mis-huariques/useHuariqueWizard";

export const setAccessToken = (accessToken: string | null) => ({
  type: SET_ACCESSTOKEN,
  payload: accessToken,
});

export const setRefreshtoken = (refreshToken: string | null) => ({
  type: SET_REFRESHTOKEN,
  payload: refreshToken,
});

export const setChangePasswordToken = (changePasswordToken: string | null) => ({
  type: SET_CHANGEPASSWORDTOKEN,
  payload: changePasswordToken,
});

export const setTypeUserAuth = (typeUserAuth: TypeUserAuth) => ({
  type: SET_TYPE_USER_AUTH,
  payload: typeUserAuth,
});

export const setUser = (user: UserInfo | null) => ({
  type: SET_USER,
  payload: user,
});

export const setCategories = (categories: Categoria[]) => ({
  type: SET_CATEGORIES,
  payload: categories,
});

export const setService = (service: Service | null) => ({
  type: SET_SERVICE,
  payload: service,
});

export const setRegisterUser = (registerUser: string | null) => ({
  type: SET_REGISTERUSER,
  payload: registerUser,
});

export const setServiceSteep = (serviceSteep: number) => ({
  type: SET_SERVICE_STEEP,
  payload: serviceSteep,
});

export const setServiceLoading = (serviceLoading: boolean) => ({
  type: SET_SERVICE_LOADING,
  payload: serviceLoading,
});

export const setServiceSteepInfo = (serviceSteepInfo: number) => ({
  type: SET_SERVICE_STEEP_INFO,
  payload: serviceSteepInfo,
});

export const setActiveInfoTab = (activeInfoTab: HuariqueTab) => ({
  type: SET_ACTIVE_INFO_TAB,
  payload: activeInfoTab,
});

export const setCompany = (company: Company | null) => ({
  type: SET_COMPANY,
  payload: company,
});

export const setServiceSteepEmpresa = (serviceSteepEmpresa: number) => ({
  type: SET_SERVICE_STEEP_EMPRESA,
  payload: serviceSteepEmpresa,
});

export const setActiveEmpresaTab = (activeEmpresaTab: EmpresaTab) => ({
  type: SET_ACTIVE_EMPRESA_TAB,
  payload: activeEmpresaTab,
});

export const setWizardStack = (wizardStack: WizardView[]) => ({
  type: SET_WIZARD_STACK,
  payload: wizardStack,
});

export const setActiveServiceSteep = (activeServiceSteep: ServiceSteeps) => ({
  type: SET_ACTIVE_SERVICE_STEEP,
  payload: activeServiceSteep,
});

export const setVisitedServiceSteep = (visitedServiceSteep: ServiceSteeps[]) => ({
  type: SET_VISITED_SERVICE_STEEP,
  payload: visitedServiceSteep,
});
