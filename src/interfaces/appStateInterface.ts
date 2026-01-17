import type { TypeUserAuth } from "./auth/IRegister";
import type { UserInfo } from "./hook/IUseUser";

export interface AppState {
  accessToken: string | null;
  refreshToken: string | null;
  changePasswordToken: string | null;
  typeUserAuth: TypeUserAuth;
  user: UserInfo | null



  registerUser: string | null;
}