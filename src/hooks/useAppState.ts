import { useContext } from "react";
import { AppContext } from "../context/appContext";

import {
  setAccessToken,
  setRefreshtoken,
  setChangePasswordToken,
  setTypeUserAuth,
  setUser,

  setRegisterUser,

  setHeroSlide,
  setConfigHome,
  setConfigNosotros,
  setServices,
  setProjects,
  setCategories,
  setTags,
  setContacts,
  setTestimonials,
  setQuotes,
  setRequests,
  setCompany,
  setSiteConfig,
  setLogs

} from "../context/actions/actions";
import type { TypeUserAuth } from "@/interfaces/auth/IRegister";
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
import type { RequestItem } from "@/interfaces/hook/IUseRequests";
import type { Quote } from "@/interfaces/hook/IUseQuotes";
import type { Company, SiteConfigMap } from "@/interfaces/hook/IUseConfigSite";
import type { AdminLog } from "@/interfaces/hook/IUseAdminLogs";

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
    setUser: (user: AuthUser | null) => dispatch(setUser(user)),
    
    setRegisterUser: (registerUser: string | null) => dispatch(setRegisterUser(registerUser)),

    setHeroSlide: (heroSlide: HeroSlide[]) => dispatch(setHeroSlide(heroSlide)),
    setConfigHome: (configHome: ConfigHome) => dispatch(setConfigHome(configHome)),
    setConfigNosotros: (configNosotros: ConfigNosotros) => dispatch(setConfigNosotros(configNosotros)),
    setServices: (services: Service[]) => dispatch(setServices(services)),
    setProjects: (projects: Project[]) => dispatch(setProjects(projects)),
    setCategories: (categories: Category[]) => dispatch(setCategories(categories)),
    setTags: (tags: Tag[]) => dispatch(setTags(tags)),
    setContacts: (contacts: Contact[]) => dispatch(setContacts(contacts)),
    setTestimonials: (testimonials: Testimonial[]) => dispatch(setTestimonials(testimonials)),
    setQuotes: (quotes: Quote[]) => dispatch(setQuotes(quotes)),
    setRequests: (requests: RequestItem[]) => dispatch(setRequests(requests)),
    setCompany: (company: Company | null) => dispatch(setCompany(company)),
    setSiteConfig: (siteConfig: SiteConfigMap) => dispatch(setSiteConfig(siteConfig)),
    setLogs: (logs: AdminLog[]) => dispatch(setLogs(logs)),

  
    

  };
};

