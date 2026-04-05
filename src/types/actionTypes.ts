
import type { TypeUserAuth } from "@/interfaces/auth/IRegister";
import type { AuthUser } from "@/interfaces/hook/IUseAuth";
import type { ConfigNosotros } from "@/interfaces/hook/IUseConfigNosotros";
import type { ConfigHome } from "@/interfaces/hook/IUseConfigHome";
import type { HeroSlide } from "@/interfaces/hook/IUseHeroSlides";
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

export const SET_ACCESSTOKEN = "SET_ACCESSTOKEN" as const;
export const SET_REFRESHTOKEN = "SET_REFRESHTOKEN" as const;
export const SET_CHANGEPASSWORDTOKEN = "SET_CHANGEPASSWORDTOKEN" as const;
export const SET_TYPE_USER_AUTH = "SET_TYPE_USER_AUTH" as const;
export const SET_USER = "SET_USER" as const;
export const SET_CATEGORIES = "SET_CATEGORIES" as const;

export const SET_SERVICE_STEEP = "SET_SERVICE_STEEP" as const;
export const SET_LOGOUT = "SET_LOGOUT" as const;
export const SET_REGISTERUSER = "SET_REGISTERUSER" as const;

export const SET_HERO_SLIDE = "SET_HERO_SLIDE" as const;
export const SET_CONFIG_HOME = "SET_CONFIG_HOME" as const;
export const SET_CONFIG_NOSOTROS = "SET_CONFIG_NOSOTROS" as const
export const SET_SERVICES = "SET_SERVICES" as const;
export const SET_PROJECTS = "SET_PROJECTS" as const;
export const SET_TAGS = "SET_TAGS" as const;
export const SET_CONTACTS = "SET_CONTACTS" as const;
export const SET_TESTIMONIALS = "SET_TESTIMONIALS" as const;
export const SET_QUOTES = "SET_QUOTES" as const;
export const SET_REQUESTS = "SET_REQUESTS" as const;
export const SET_COMPANY = "SET_COMPANY" as const;
export const SET_SITE_CONFIG = "SET_SITE_CONFIG" as const;
export const SET_LOG = "SET_LOG" as const;



export type ActionTypes =
  | { type: typeof SET_ACCESSTOKEN; payload: string | null }
  | { type: typeof SET_REFRESHTOKEN; payload: string | null }
  | { type: typeof SET_CHANGEPASSWORDTOKEN; payload: string | null }
  | { type: typeof SET_TYPE_USER_AUTH; payload:  TypeUserAuth}
  | { type: typeof SET_USER; payload:  AuthUser | null}

  | { type: typeof SET_LOGOUT}
  | { type: typeof SET_REGISTERUSER; payload: string | null }
  

  | { type: typeof SET_HERO_SLIDE; payload: HeroSlide[] }
  | { type: typeof SET_CONFIG_HOME; payload: ConfigHome }
  | { type: typeof SET_CONFIG_NOSOTROS; payload: ConfigNosotros }
  | { type: typeof SET_SERVICES; payload: Service[] }
  | { type: typeof SET_PROJECTS; payload: Project[] }
  | { type: typeof SET_CATEGORIES; payload: Category[]}
  | { type: typeof SET_TAGS; payload: Tag[]}
  | { type: typeof SET_CONTACTS; payload: Contact[]}
  | { type: typeof SET_TESTIMONIALS; payload: Testimonial[]}
  | { type: typeof SET_QUOTES; payload: Quote[]}
  | { type: typeof SET_REQUESTS; payload: RequestItem[]}
  | { type: typeof SET_COMPANY; payload: Company | null}
  | { type: typeof SET_SITE_CONFIG; payload: SiteConfigMap}
  | { type: typeof SET_LOG; payload: AdminLog[]}
  

  


  
