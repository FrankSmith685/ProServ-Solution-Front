export type AuthMode = "login" | "register";

export interface AuthExtrasProps {
  mode?: AuthMode;
  onGoogleLogin: () => Promise<void>;
  loadingGoogle?: boolean;
  showForgotPassword?: boolean;
}
