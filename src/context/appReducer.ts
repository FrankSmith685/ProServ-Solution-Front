// import type { AppState } from "../interfaces/appStateInterface";
// import { SET_ACCESSTOKEN, SET_LOGOUT, SET_REFRESHTOKEN, SET_REGISTERUSER, type ActionTypes } from "../types/actionTypes";

// export const appReducer = (state: AppState, action: ActionTypes): AppState => {
//   switch (action.type) {
//     case SET_ACCESSTOKEN:
//       return { ...state, registerUser: action.payload };
//       case SET_REFRESHTOKEN:
//       return { ...state, registerUser: action.payload };
//       case SET_REGISTERUSER:
//       return { ...state, registerUser: action.payload };
//     case SET_LOGOUT:
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       return {
//         ...state,
//         // accessToken: null,
//         // refreshToken: null,
//         // user: null,
//         // modal: true,
//         // modeLogin: "login_one",
//         // mode: 'login',
//         // authLoginForm: {
//         //   correo: '',
//         //   contraseña: '',
//         // },
//         // authRegisterForm: {
//         //   tipoUsuario: 0,
//         //   correo: '',
//         //   contraseña: '',
//         //   nombre: '',
//         //   apellido: '',
//         //   razon_social: null,
//         //   tipoDocumento: 0,
//         //   nroDocumento: '',
//         //   telefono: '',
//         //   telefono_movil: '',
//         // }
//       }
//     default:
//       return state;
//   }
// };
import type { AppState } from "../interfaces/appStateInterface";
import { 
  SET_ACCESSTOKEN, 
  SET_CHANGEPASSWORDTOKEN, 
  SET_LOGOUT, 
  SET_REFRESHTOKEN, 
  SET_REGISTERUSER, 
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

    default:
      return state;
  }
};
