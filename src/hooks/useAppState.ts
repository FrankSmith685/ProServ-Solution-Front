import { useContext } from "react";
import { AppContext } from "../context/appContext";

import {
  setAccessToken,
  setRefreshtoken,
  setChangePasswordToken,
  setTypeUserAuth,
  setUser,
  setCategories,
  setService,
  setRegisterUser,
  setServiceSteep,
  setServiceLoading,
  setServiceSteepInfo,
  setActiveInfoTab,
  setCompany,
  setServiceSteepEmpresa,
  setActiveEmpresaTab,
  setWizardStack,
  setActiveServiceSteep,
  setVisitedServiceSteep
} from "../context/actions/actions";
import type { TypeUserAuth } from "@/interfaces/auth/IRegister";
import type { UserInfo } from "@/interfaces/hook/IUseUser";
import type { Categoria } from "@/interfaces/hook/IUseCategoria";
import type { Service } from "@/interfaces/hook/IUseService";
import type { EmpresaTab, HuariqueTab, ServiceSteeps } from "@/interfaces/panel/mis-huariques/IHuarique";
import type { Company } from "@/interfaces/hook/IUseCompany";
import type { WizardView } from "./panel/mis-huariques/useHuariqueWizard";

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
    setCategories: (categories: Categoria[]) => dispatch(setCategories(categories)),
    setService: (service: Service | null) => dispatch(setService(service)),
    setServiceSteep: (serviceSteep: number) => dispatch(setServiceSteep(serviceSteep)),
    setRegisterUser: (registerUser: string | null) => dispatch(setRegisterUser(registerUser)),
    setServiceLoading: (serviceLoading: boolean) => dispatch(setServiceLoading(serviceLoading)),
    setServiceSteepInfo: (serviceSteepInfo: number) => dispatch(setServiceSteepInfo(serviceSteepInfo)),
    setActiveInfoTab: (activeInfoTab: HuariqueTab) => dispatch(setActiveInfoTab(activeInfoTab)),
    setCompany: (company: Company | null) => dispatch(setCompany(company)),
    setServiceSteepEmpresa: (serviceSteepEmpresa: number) => dispatch(setServiceSteepEmpresa(serviceSteepEmpresa)),
    setActiveEmpresaTab: (activeEmpresaTab: EmpresaTab) => dispatch(setActiveEmpresaTab(activeEmpresaTab)),
    setWizardStack: (wizardStack: WizardView[]) => dispatch(setWizardStack(wizardStack)),
    setActiveServiceSteep: (activeServiceSteep: ServiceSteeps) => dispatch(setActiveServiceSteep(activeServiceSteep)),
    setVisitedServiceSteep: (visitedServiceSteep: ServiceSteeps[]) => dispatch(setVisitedServiceSteep(visitedServiceSteep)),

  };
};

