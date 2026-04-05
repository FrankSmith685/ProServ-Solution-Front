import { useEffect, useReducer, type ReactNode } from "react";
import { AppContext } from "./appContext";
import { appReducer } from "./appReducer";
import type { AppState } from "../interfaces/appStateInterface";
import { SET_LOGOUT } from "../types/actionTypes";
import { NotificationProvider } from "@/hooks/useNotificationHooks/notificationProvider";
import { getAccessToken, getRefreshToken } from "@/helpers/authStorage";

interface Props {
  children: ReactNode;
}

const initialState: AppState = {
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
  changePasswordToken: null,
  typeUserAuth: null,
  user: null,

  registerUser: null,

  heroSlide: [],
  configHome: {},
  configNosotros: {},
  services: [],
  projects: [],
  categories: [],
  tags: [],
  contacts: [],
  testimonials: [],
  quotes: [],
  requests: [],
  company: null,
  siteConfig: {
    site_name: "",
    site_description: "",
    contact_phone: "",
    contact_email: "",
    whatsapp_url: "",
    facebook_url: "",
    instagram_url: "",
  },
  logs: [],
};

export const AppProvider = ({ children }: Props) => {
  const [appState, dispatch] = useReducer(appReducer, initialState);

  const logout = () => {
    dispatch({ type: SET_LOGOUT });
  };

  useEffect(() => {
    const faviconUrl = appState.company?.favicon?.url;

    let link =
      document.querySelector("link[rel='icon']") ||
      document.querySelector("link[rel='shortcut icon']");

    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "icon");
      document.head.appendChild(link);
    }

    if (faviconUrl) {
      link.setAttribute("href", faviconUrl);
    } else {
      link.setAttribute("href", "/default-favicon.ico");
    }
  }, [appState.company?.favicon?.url]);

  useEffect(() => {
    const siteName =
      appState.siteConfig?.site_name?.trim() ||
      appState.company?.nombre?.trim() ||
      "Mi App";

    document.title = siteName;
  }, [appState.siteConfig?.site_name, appState.company?.nombre]);

  return (
    <AppContext.Provider value={{ appState, dispatch, logout }}>
      <NotificationProvider>{children}</NotificationProvider>
    </AppContext.Provider>
  );
};