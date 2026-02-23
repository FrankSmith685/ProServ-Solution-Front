import { useReducer, type ReactNode } from "react";
import { AppContext } from "./appContext";
import { appReducer } from "./appReducer";
import type { AppState } from "../interfaces/appStateInterface";
// import { ImagePreloaderProvider } from "../hooks/useImageHooks/imagePreloaderProvider";
// import { NotificationProvider } from "../hooks/useNotificacionHooks/notificacionProvider";
import { SET_LOGOUT } from "../types/actionTypes";
import { ImagePreloaderProvider } from "@/hooks/useImageHooks/imagePreloaderProvider";
import { NotificationProvider } from "@/hooks/useNotificationHooks/notificationProvider";
import { getAccessToken, getRefreshToken } from "@/helpers/authStorage";
import { LocationProvider } from "@/hooks/useLocationHooks/locationProvider";
// import { setLogoutFunction } from "../helpers/logoutHelper";
// import { LocationProvider } from "../hooks/useLocationHooks/locationProvider";
// import { VideoPreloaderProvider } from "../hooks/useVideoHooks/videoPreloaderProvider";

interface Props {
  children: ReactNode;
}

const initialState: AppState = {
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
  changePasswordToken: null,
  typeUserAuth: null,
  user: null,
  categories: [],
  registerUser: null,
  service: null,
  serviceSteep: 0,
  serviceLoading: false,
  serviceSteepInfo: 0,
  activeInfoTab: 'info',
  company: null,
  serviceSteepEmpresa: 0,
  activeEmpresaTab: 'info',
  wizardStack:[],
  activeServiceSteep:'empresa',
  visitedServiceSteep:[],
}


export const AppProvider = ({ children }: Props) => {
  const [appState, dispatch] = useReducer(appReducer, initialState);

  const logout = () => {
    dispatch({ type: SET_LOGOUT });
  };

  // setLogoutFunction(logout);

  return (
    <AppContext.Provider value={{ appState, dispatch, logout }}>
      <LocationProvider>
        <NotificationProvider>
          <ImagePreloaderProvider> 
        {/* <LocationProvider>
          <NotificationProvider>
          */}
            {/* <VideoPreloaderProvider> */}
              {children}
            {/* </VideoPreloaderProvider> */}
            {/* 
            </NotificationProvider>
          </LocationProvider> */}
          </ImagePreloaderProvider>
        </NotificationProvider>
      </LocationProvider>
    </AppContext.Provider>
  );
};
