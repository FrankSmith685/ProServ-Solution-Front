import type { AppState } from "../interfaces/appStateInterface";
import { 
  SET_ACCESSTOKEN,
  SET_CATEGORIES, 
  SET_CHANGEPASSWORDTOKEN, 
  SET_COMPANY, 
  SET_CONFIG_HOME, 
  SET_CONFIG_NOSOTROS, 
  SET_CONTACTS, 
  SET_HERO_SLIDE, 
  SET_LOG, 
  SET_LOGOUT, 
  SET_PROJECTS, 
  SET_QUOTES, 
  SET_REFRESHTOKEN, 
  SET_REGISTERUSER,
  SET_REQUESTS,
  SET_SERVICES, 
  SET_SITE_CONFIG, 
  SET_TAGS, 
  SET_TESTIMONIALS, 
  SET_TYPE_USER_AUTH, 
  SET_USER, 
  type ActionTypes 
} from "../types/actionTypes";

export const appReducer = (state: AppState, action: ActionTypes): AppState => {
  switch (action.type) {

    case SET_ACCESSTOKEN: {
      const token = action.payload;

      if (token) {
        localStorage.setItem("accessToken", token);
      } else {
        localStorage.removeItem("accessToken");
      }

      return {
        ...state,
        accessToken: token ?? null
      };
    }

    case SET_REFRESHTOKEN: {
      const token = action.payload;

      if (token) {
        localStorage.setItem("refreshToken", token);
      } else {
        localStorage.removeItem("refreshToken");
      }

      return {
        ...state,
        refreshToken: token ?? null
      };
    }

    case SET_CHANGEPASSWORDTOKEN: {
      const token = action.payload;

      if (token) {
        localStorage.setItem("changePasswordToken", token);
      } else {
        localStorage.removeItem("changePasswordToken");
      }

      return {
        ...state,
        changePasswordToken: token ?? null
      };
    }

    case SET_TYPE_USER_AUTH:
      return { 
        ...state, 
        typeUserAuth: action.payload 
      };

    case SET_USER:
      return { 
        ...state, 
        user: action.payload 
      };

    case SET_REGISTERUSER:
      return { 
        ...state, 
        registerUser: action.payload 
      };

    case SET_LOGOUT:
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("changePasswordToken");

      return {
        ...state,
        accessToken: null,
        refreshToken: null,
        registerUser: null,
        changePasswordToken: null
      };
    

    case SET_HERO_SLIDE:
      return { 
        ...state, 
        heroSlide: action.payload 
      };

    case SET_CONFIG_HOME:
      return { 
        ...state, 
        configHome: action.payload 
      };

    case SET_CONFIG_NOSOTROS:
      return { 
        ...state, 
        configNosotros: action.payload 
      };

    case SET_SERVICES:
      return { 
        ...state, 
        services: action.payload 
      };

    case SET_PROJECTS:
      return { 
        ...state, 
        projects: action.payload 
      };
    
    case SET_CATEGORIES:
      return { 
        ...state, 
        categories: action.payload 
      };
    
    case SET_TAGS:
      return { 
        ...state, 
        tags: action.payload 
      };
     case SET_CONTACTS:
      return { 
        ...state, 
        contacts: action.payload 
      };
    case SET_TESTIMONIALS:
      return { 
        ...state, 
        testimonials: action.payload 
      };
    case SET_QUOTES:
      return { 
        ...state, 
        quotes: action.payload 
      };

      case SET_REQUESTS:
      return { 
        ...state, 
        requests: action.payload 
      };

      case SET_COMPANY:
      return { 
        ...state, 
        company: action.payload 
      };
      case SET_SITE_CONFIG:
      return { 
        ...state, 
        siteConfig: action.payload 
      };
      case SET_LOG:
      return { 
        ...state, 
        logs: action.payload 
      };

    default:
      return state;
  }
};
