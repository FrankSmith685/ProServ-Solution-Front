import { createContext } from "react";
import type { AppState } from "../interfaces/appStateInterface";
import type { ActionTypes } from "../types/actionTypes";

export interface AppContextProps {
  appState: AppState;
  dispatch: React.Dispatch<ActionTypes>;
  logout: () => void;
}

export const AppContext = createContext<AppContextProps | null>(null);
