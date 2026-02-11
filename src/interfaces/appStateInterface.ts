import type { WizardView } from "@/hooks/panel/mis-huariques/useHuariqueWizard";
import type { TypeUserAuth } from "./auth/IRegister";
import type { Categoria } from "./hook/IUseCategoria";
import type { Company } from "./hook/IUseCompany";
import type { Service } from "./hook/IUseService";
import type { UserInfo } from "./hook/IUseUser";
import type { EmpresaTab, HuariqueTab } from "./panel/mis-huariques/IHuarique";

export interface AppState {
  accessToken: string | null;
  refreshToken: string | null;
  changePasswordToken: string | null;
  typeUserAuth: TypeUserAuth;
  user: UserInfo | null;
  categories: Categoria[];
  service: Service | null;
  registerUser: string | null;
  serviceSteep: number;
  serviceLoading: boolean;
  serviceSteepInfo: number;
  activeInfoTab: HuariqueTab;
  company: Company | null;
  serviceSteepEmpresa: number;
  activeEmpresaTab: EmpresaTab;
  wizardStack: WizardView[];
}