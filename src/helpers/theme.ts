export type AdminTheme = "light" | "dark";

const ADMIN_THEME_KEY = "admin-theme";

export const getAdminTheme = (): AdminTheme => {
  if (typeof window === "undefined") return "light";

  const saved = window.localStorage.getItem(ADMIN_THEME_KEY);

  return saved === "dark" ? "dark" : "light";
};

export const setAdminTheme = (theme: AdminTheme): void => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_THEME_KEY, theme);
};

export const toggleAdminTheme = (): AdminTheme => {
  const nextTheme: AdminTheme = getAdminTheme() === "dark" ? "light" : "dark";
  setAdminTheme(nextTheme);
  return nextTheme;
};