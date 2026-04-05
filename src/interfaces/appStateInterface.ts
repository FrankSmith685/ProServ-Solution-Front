import type { TypeUserAuth } from "./auth/IRegister";
import type { ConfigNosotros } from "./hook/IUseConfigNosotros";
import type { AuthUser } from "./hook/IUseAuth";
import type { HeroSlide } from "./hook/IUseHeroSlides";
import type { ConfigHome } from "./hook/IUseConfigHome";
import type { Service } from "./hook/IUseServices";
import type { Project } from "./hook/IUseProjects";
import type { Category } from "./hook/IUseCategories";
import type { Tag } from "./hook/IUseTags";
import type { Contact } from "./hook/IUseContacts";
import type { Testimonial } from "./hook/IUseTestimonials";
import type { Quote } from "./hook/IUseQuotes";
import type { RequestItem } from "./hook/IUseRequests";
import type { Company, SiteConfigMap } from "./hook/IUseConfigSite";
import type { AdminLog } from "./hook/IUseAdminLogs";

export interface AppState {
  accessToken: string | null;
  refreshToken: string | null;
  changePasswordToken: string | null;
  typeUserAuth: TypeUserAuth;
  user: AuthUser | null;
  
  
  registerUser: string | null;

  heroSlide: HeroSlide[];
  configHome: ConfigHome;
  configNosotros: ConfigNosotros;
  services: Service[];
  projects: Project[];
  categories: Category[];
  tags: Tag[];
  contacts: Contact[];
  testimonials: Testimonial[];
  quotes: Quote[];
  requests: RequestItem[];
  company: Company | null;
  siteConfig: SiteConfigMap;
  logs: AdminLog[];
}