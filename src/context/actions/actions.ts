// import type { ModeLoginType } from "../../interfaces/appStateInterface";
// import type { AuthLoginForm, AuthRegisterForm } from "../../interfaces/auth";
// import type { AvisoData, AvisosDTO } from "../../interfaces/IAviso";
// import type { CategoriaAttributes } from "../../interfaces/ICategoria";
// import type { DireccionService } from "../../interfaces/IDireccion";
// import type { EmpresaData } from "../../interfaces/IEmpresa";
// import type { MultimediaAvisoPreview, MultimediaService, MultimediaServiceDelete } from "../../interfaces/IMultimedia";
// import type { NewInmueble, ProgressPrincipalProperty, ProgressProperty } from "../../interfaces/inmueble";
// import type { ProgressPrincipalService, ProgressService, ServicioActivoData, ServicioData } from "../../interfaces/IServicio";
// import type { SubcategoriaAttributes } from "../../interfaces/ISubcategoria";
// import type { ubigeo_usuario } from "../../interfaces/IUbigeos";
// import type { ProfileType, SelectedPerfil, TypeUserAuth, UsuarioData } from "../../interfaces/IUser";
// import { SET_ACCESSTOKEN, SET_ACTIVE_INICIAR_SESION_RESENA, SET_AUTHLOGINFORM, SET_AUTHREGISTERFORM, SET_CATEGORIA, SET_CATEGORIA_SELECCIONADA, SET_CHANGE_PASSWORD_TOKEN, SET_COMPANY, SET_DEPARTAMENTOS, SET_DIRECCIONSERVICE, SET_DISTRITOS, SET_FILTRO_AVISOS, SET_ID_AVISO, SET_IDS_DElETE_MULTIMEDIA, SET_IS_ARCHIVADO, SET_IS_EXPANDED, SET_IS_SERVICE_EDIT, SET_IS_SHOW_FILTER_SERVICE, SET_LISTA_AVISOS, SET_LOADING_USER, SET_MENU_OPEN, SET_MENU_OPEN_USER, SET_MODAL, SET_MODAL_RESENA, SET_MODE, SET_MODELOGIN, SET_MODIFIEDCOMPANY, SET_MODIFIEDSERVICE, SET_MODIFIEDUSER, SET_MULTIMEDIA_AVISOS_PREVIEW, SET_MULTIMEDIASERVICE, SET_NEW_INMUEBLE, SET_PROFILE_TYPE, SET_PROGRESS_PRINCIPAL_PROPERTY, SET_PROGRESS_PRINCIPAL_SERVICE, SET_PROGRESS_PROPERTY, SET_PROGRESS_SERVICE, SET_PROVINCIAS, SET_REFRESHTOKEN, SET_REGISTERUSER, SET_SELECCIONADOS_AVISOS, SET_SELECTED_PERFIL, SET_SERVICE, SET_SERVICIO_SELECCIONADO, SET_SERVICIOS_ACTIVOS, SET_SERVICIOS_FILTER_ACTIVOS, SET_SUBCATEGORIA, SET_TYPE_USER_AUTH, SET_UBIGEO_USUARIO, SET_USER } from "../../types/actionTypes";

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
  SET_WIZARD_STACK
} from "../../types/actionTypes";
import type { UserInfo } from "@/interfaces/hook/IUseUser";
import type { Categoria } from "@/interfaces/hook/IUseCategoria";
import type { Service } from "@/interfaces/hook/IUseService";
import type { EmpresaTab, HuariqueTab } from "@/interfaces/panel/mis-huariques/IHuarique";
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



// wizardStack: WizardView[];



