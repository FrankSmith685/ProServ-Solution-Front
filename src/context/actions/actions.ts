import type { TypeUserAuth } from "@/interfaces/auth/IRegister";
import { 
  SET_ACCESSTOKEN, 
  SET_CATEGORIES,
  SET_CHANGEPASSWORDTOKEN, 
  SET_REFRESHTOKEN, 
  SET_REGISTERUSER, 
  SET_TYPE_USER_AUTH, 
  SET_USER,
  SET_HERO_SLIDE,
  SET_CONFIG_HOME,
  SET_CONFIG_NOSOTROS,
  SET_SERVICES,
  SET_PROJECTS,
  SET_TAGS,
  SET_CONTACTS,
  SET_TESTIMONIALS,
  SET_QUOTES,
  SET_REQUESTS,
  SET_COMPANY,
  SET_SITE_CONFIG,
  SET_LOG
} from "../../types/actionTypes";
import type { ConfigNosotros } from "@/interfaces/hook/IUseConfigNosotros";
import type { AuthUser } from "@/interfaces/hook/IUseAuth";
import type { HeroSlide } from "@/interfaces/hook/IUseHeroSlides";
import type { ConfigHome } from "@/interfaces/hook/IUseConfigHome";
import type { Service } from "@/interfaces/hook/IUseServices";
import type { Project } from "@/interfaces/hook/IUseProjects";
import type { Category } from "@/interfaces/hook/IUseCategories";
import type { Tag } from "@/interfaces/hook/IUseTags";
import type { Contact } from "@/interfaces/hook/IUseContacts";
import type { Testimonial } from "@/interfaces/hook/IUseTestimonials";
import type { Quote } from "@/interfaces/hook/IUseQuotes";
import type { RequestItem } from "@/interfaces/hook/IUseRequests";
import type { Company, SiteConfigMap } from "@/interfaces/hook/IUseConfigSite";
import type { AdminLog } from "@/interfaces/hook/IUseAdminLogs";

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

export const setUser = (user: AuthUser | null) => ({
  type: SET_USER,
  payload: user,
});


export const setRegisterUser = (registerUser: string | null) => ({
  type: SET_REGISTERUSER,
  payload: registerUser,
});


export const setHeroSlide = (heroSlide: HeroSlide[]) => ({
  type: SET_HERO_SLIDE,
  payload: heroSlide,
});

export const setConfigHome = (configHome: ConfigHome) => ({
  type: SET_CONFIG_HOME,
  payload: configHome,
});

export const setConfigNosotros = (configNosotros: ConfigNosotros) => ({
  type: SET_CONFIG_NOSOTROS,
  payload: configNosotros,
});

export const setServices = (services: Service[]) => ({
  type: SET_SERVICES,
  payload: services,
});

export const setProjects = (projects: Project[]) => ({
  type: SET_PROJECTS,
  payload: projects,
});

export const setCategories = (categories: Category[]) => ({
  type: SET_CATEGORIES,
  payload: categories,
});

export const setTags = (tags: Tag[]) => ({
  type: SET_TAGS,
  payload: tags,
});

export const setContacts = (contacts: Contact[]) => ({
  type: SET_CONTACTS,
  payload: contacts,
});

export const setTestimonials = (testimonials: Testimonial[]) => ({
  type: SET_TESTIMONIALS,
  payload: testimonials,
});

export const setQuotes = (quotes: Quote[]) => ({
  type: SET_QUOTES,
  payload: quotes,
});

export const setRequests = (requests: RequestItem[]) => ({
  type: SET_REQUESTS,
  payload: requests,
});

export const setCompany = (company: Company | null) => ({
  type: SET_COMPANY,
  payload: company,
});

export const setSiteConfig = (siteConfig: SiteConfigMap) => ({
  type: SET_SITE_CONFIG,
  payload: siteConfig,
});

export const setLogs = (logs: AdminLog[]) => ({
  type: SET_LOG,
  payload: logs,
});