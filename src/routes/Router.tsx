/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/exhaustive-deps */

// import { Routes, Route } from "react-router-dom";
// // import HomePage from "../pages/home/HomePage";
// // import ComponentPage from "../pages/components/ComponentPage";
// // import { useEffect } from "react";
// import PublicRoute from "./PublicRoute";
// // import HomePage from "../page/home/HomePage";
// import { lazy } from "react";

// const ComponentPage = lazy(() => import("../page/components/ComponentPage"));
// const HomePage = lazy(() => import("../page/home/HomePage"));
// const LoginPage = lazy(() => import("../page/auth/LoginPage"));

// // import { useUser } from "../hooks/useUser";
// // import { useAppState } from "../hooks/useAppState";
// // import { useAuth } from "../hooks/useAuth";
// // import { useNotification } from "../hooks/useNotificacionHooks/useNotification";
// // import ProtectedRoute from "./ProtectedRoute";
// // import PanelPage from "../pages/panel/PanelPage";
// // import PublicRoute from "./PublicRoute";
// // import LoginPage from "../pages/auth/LoginPage";
// // import RegisterPage from "../pages/auth/RegisterPage";
// // import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
// // import ChangePasswordPage from "../pages/auth/ChangePasswordPage";
// // import { useEmpresa } from "../hooks/useEmpresa";
// // import ServiciosPage from "../pages/services/ServiciosPage";
// // import ServicioDetallePage from "../pages/services/Detail/ServicioDetallePage";
// // import { useCategoria } from "../hooks/useCategoria.";

// const AppRouter = () => {
//   // const {getUserInfo} = useUser();
//   // const {validateResetToken}= useAuth();
//   // const {accessToken,setChangePasswordToken,changePasswordToken } = useAppState();
//   // const [searchParams] = useSearchParams();
//   // const {showMessage} = useNotification();
//   // const navigate= useNavigate();
//   // const {getEmpresa} = useEmpresa();
//   // const {getAllCategorias} = useCategoria();

//   // Obtener el perfil del usuari
//     // useEffect(() => {
//     //   if (!accessToken) return;
//     //   getUserInfo();
//     //   getEmpresa();
//     // }, [accessToken]);

//     // useEffect(()=>{
//     //   getAllCategorias();
//     // },[])

//     // useEffect(() => {
//     //   const token = searchParams.get("resetToken");
//     //   if (!token) return;

//     //   validateResetToken(token, (isValid, message) => {
//     //     if (isValid) {
//     //       navigate("/cambiar-contrasena")
//     //       setChangePasswordToken(token);
//     //     } else {
//     //       showMessage(message ?? 'Error al obtener token','error');
//     //     }
//     //   });
//     //   const newUrl = window.location.origin + window.location.pathname;
//     //   window.history.replaceState({}, document.title, newUrl);
//     // }, []);

//   return (
//     // <Router>
//     <div className="pt-0">
//         <Routes>
//         {/* Rutas públicas (siempre accesibles) */}
//         <Route path="/" element={<HomePage />} />
//         <Route path="/components" element={<ComponentPage />} />
//         {/* Vista general del mapa o servicios */}
//         {/* <Route path="/servicios" element={<ServiciosPage />} /> */}

//         {/* Vista de detalle del servicio */}
//         {/* <Route path="/servicios/:id" element={<ServicioDetallePage />} /> */}
//         {/* <Route path="/terminos-condiciones-de-uso" element={<TerminosCondiciones />} /> */}

//         {/* Rutas solo para NO autenticados */}
//         <Route element={<PublicRoute />}>
//           {/* <Route path="/" element={<HomePage />} /> */}
//           <Route path="/iniciar" element={<LoginPage />} />
//           {/* <Route path="/registrar" element={<RegisterPage />} /> */}
//           {/* <Route path="/recuperar" element={<ForgotPasswordPage />} /> */}
//           {/* {changePasswordToken && (
//             <Route path="/cambiar-contrasena" element={<ChangePasswordPage />} />
//           )} */}
//           {/* <Route path="/recuperar" element={<ForgotPage />} />
//           <Route path="/actualizar-contrasena" element={<UpdatePasswordPage />} />
//           <Route path="/registro" element={<RegisterPage />} /> */}
//         </Route>

//         {/* Rutas protegidas (solo para autenticados) */}
//         {/* <Route element={<ProtectedRoute />}>
//           <Route path="/panel" element={<Navigate to="/panel/avisos" replace />} />
//           <Route path="/panel/:option" element={<PanelPage />} />
//           <Route path="/panel/:option/:suboption" element={<PanelPage />} />
//           <Route path="/panel/:option/:suboption/:subsuboption" element={<PanelPage />} />
//           <Route path="/panel/:option/:suboption/:subsuboption/:id" element={<PanelPage />} />
//         </Route> */}
// {/* ........................ */}
//         {/* Ruta de Admin */}
//         {/* <Route element={<AdminRoute />}>
//           <Route path="/panel-admin" element={<AdminPage />} />
//           <Route path="/panel-admin/:option" element={<AdminPage />} />
//         </Route> */}


//         {/* Rutas de Servicios */}
//         {/* <Route path="/servicios" element={<ServiciosPage />} /> */}

//         {/* Página 404 para rutas inexistentes */}
//         {/* <Route path="*" element={<NotFoundPage />} /> */}
//       </Routes>
//     </div>
      
//     // </Router>
//   );
// };

// export default AppRouter;

import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import ComponentPageSkeleton from "../page/components/ComponentPageSkeleton";
import { useAppState } from "@/hooks/useAppState";
import { AuthLoader } from "@/components/loader/AuthLoader";
import { TermsLoader } from "@/components/loader/TermsLoader";
import HomeLayout from "@/components/layouts/home/HomeLayout";
import CustomLoader from "@/components/loader/CustomLoader";
import { useUser } from "@/hooks/useUser";
import ProtectedRoute from "./ProtectedRoute";
import { PanelPage } from "@/page/panel/PanelPage";
// import { MiCuentaPage } from "@/page/panel/menu/mi-cuenta/MiCuentaPage";
import { MisDatosPage } from "@/page/panel/menu/mi-cuenta/datos/MisDatosPage";
// import { PreferenciasPage } from "@/page/panel/menu/mi-cuenta/preferencia/PreferenciasPage";
import { PasswordPage } from "@/page/panel/menu/mi-cuenta/seguridad/password/PasswordPage";
import { CuentasVinculadasPage } from "@/page/panel/menu/mi-cuenta/seguridad/cuentas-vinculadas/CuentasVinculadasPage";
import { EliminarCuentaPage } from "@/page/panel/menu/mi-cuenta/seguridad/eliminar-cuenta/EliminarCuentaPage";
import { CorreoPage } from "@/page/panel/menu/mi-cuenta/seguridad/correo/CorreoPage";
import ProviderRoute from "./ProviderRoute";
import { NotificacionesPage } from "@/page/panel/menu/mi-cuenta/preferencia/notificaciones/NotificacionesPage";
import { HuariqueInfoPage } from "@/page/panel/menu/mi-huarique/info/HuariqueInfoPage";
import { HuariqueImagenesPage } from "@/page/panel/menu/mi-huarique/imagenes/HuariqueImagenes";
import { HuariqueMenuPage } from "@/page/panel/menu/mi-huarique/menu/HuariqueMenuPage";
import { HuariquePromocionesPage } from "@/page/panel/menu/mi-huarique/promociones/HuariquePromocionesPage ";
import { HuariquePublicacionPage } from "@/page/panel/menu/mi-huarique/publicacion/HuariquePublicacionPage";
import { HuariqueConfigPage } from "@/page/panel/menu/mi-huarique/configuracion/HuariqueConfigPage";
import { HuariqueWizardGuard } from "./HuariqueWizardGuard";
import { useCategoria } from "@/hooks/useCategoria";
import { HuariqueEmpresaPage } from "@/page/panel/menu/mi-huarique/empresa/HuariqueEmpresa";
// import { AuthLoader } from "@/components/loader/authLoader";

// Páginas
const ComponentPage = lazy(() => import("../page/components/ComponentPage"));
const HomePage = lazy(() => import("../page/home/HomePage"));
const LoginPage = lazy(() => import(/* webpackPrefetch: true */"../page/auth/LoginPage"));
const ForgotPasswordPage = lazy(() => import(/* webpackPrefetch: true */"../page/auth/ForgotPasswordPage"));
const ChangePasswordPage = lazy(() => import(/* webpackPrefetch: true */"../page/auth/ChangePasswordPage"));
const ResetPasswordRedirect = lazy(() => import(/* webpackPrefetch: true */"../page/auth/ResetPasswordRedirect"));
const RegisterPage = lazy(() => import(/* webpackPrefetch: true */"../page/auth/RegisterPage"));
const TermsAndConditionsPage = lazy(() => import(/* webpackPrefetch: true */"../page/terms/TermAndConditionPage"));





// import LoginPage from "../page/auth/LoginPage";

// const RegisterPage = lazy(() => import("../page/auth/RegisterPage"));
// const ForgotPasswordPage = lazy(() => import("../page/auth/ForgotPasswordPage"));
// const ChangePasswordPage = lazy(() => import("../page/auth/ChangePasswordPage"));

const AppRouter = () => {
  const { changePasswordToken, accessToken } = useAppState();
  const {getUserInfo} = useUser(); 
  const {getCategorias} = useCategoria();
  useEffect(() => {
    getCategorias();
    if (accessToken) {
      getUserInfo();
    }
  }, [accessToken]);


  // si lo usas:
  // const changePasswordToken = useAuthStore(state => state.changePasswordToken);

  return (
    <div className="pt-0">

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={
            <Suspense fallback={<CustomLoader/>}>
                <HomeLayout>
                  <HomePage />
                </HomeLayout>
            </Suspense>
          }
        />

        {/* COMPONENTS (USA SKELETON PRO) */}
        <Route
          path="/components"
          element={
            <Suspense fallback={<ComponentPageSkeleton />}>
              <ComponentPage />
            </Suspense>
          }
        />
        {/* TÉRMINOS Y CÓNDICIONES */}
        <Route
          path="/terminos-condiciones-uso"
          element={
            <Suspense fallback={<TermsLoader />}>
              <TermsAndConditionsPage />
            </Suspense>
          }
        />

        {/* PUBLIC ROUTES */}
        <Route element={<PublicRoute />}>
          {/* LOGIN */}
          <Route
            path="/iniciar"
            element={
              <Suspense fallback={<AuthLoader message="Iniciando sesión…" />}>
                <LoginPage />
              </Suspense>
            }
          />

          {/* RECUPERAR */}
          <Route
            path="/recuperar"
            element={
              <Suspense fallback={<AuthLoader message="Preparando recuperación…" />}>
                <ForgotPasswordPage />
              </Suspense>
            }
          />

          {/* RESET PASSWORD */}
          <Route
            path="/reset-password"
            element={
              <Suspense fallback={<AuthLoader message="Validando enlace…" />}>
                <ResetPasswordRedirect />
              </Suspense>
            }
          />

          {/* CAMBIAR CONTRASEÑA */}
          {changePasswordToken && (
            <Route
              path="/cambiar-contrasena"
              element={
                <Suspense fallback={<AuthLoader message="Preparando cambio de contraseña…" />}>
                  <ChangePasswordPage />
                </Suspense>
              }
            />
          )}

          {/* REGISTRO */}
          <Route
            path="/registrar"
            element={
              <Suspense fallback={<AuthLoader message="Creando tu cuenta…" />}>
                <RegisterPage />
              </Suspense>
            }
          />
        </Route>

        {/* ===============================
          PANEL (PRIVATE)
        =============================== */}
        <Route element={<ProtectedRoute />}>
          <Route path="/panel" element={<PanelPage />}>

            <Route index element={<Navigate to="mi-cuenta/datos" replace />} />
            
            <Route path="mi-cuenta">
              <Route index element={<Navigate to="datos" replace />} />
              <Route path="datos" element={<MisDatosPage />} />
              <Route path="seguridad">
                <Route element={ <ProviderRoute required={["correo"]} />}>
                  <Route path="password" element={<PasswordPage />} />
                  <Route path="correo" element={<CorreoPage />} />
                </Route>
                <Route element={ <ProviderRoute required={["google"]} redirectTo="/panel/mi-cuenta/seguridad/password" /> } />
                <Route path="cuentas" element={<CuentasVinculadasPage />} />
                <Route path="eliminar" element={<EliminarCuentaPage />} />
                <Route index element={<Navigate to="cuentas" replace />} />
              </Route>
              <Route path="preferencias">
                <Route index element={<Navigate to="notificaciones" replace />}/>
                <Route path="notificaciones" element={<NotificacionesPage />} />
              </Route>
            </Route>

            <Route path="mi-huarique">
              <Route index element={<Navigate to="info" replace />} />

              <Route element={<HuariqueWizardGuard />}>
                <Route path="empresa" element={<HuariqueEmpresaPage />} />
                <Route path="info" element={<HuariqueInfoPage />} />
                <Route path="imagenes" element={<HuariqueImagenesPage />} />
                <Route path="menu" element={<HuariqueMenuPage />} />
                <Route path="promociones" element={<HuariquePromocionesPage />} />
                <Route path="publicacion" element={<HuariquePublicacionPage />} />
              </Route>

              <Route path="configuracion" element={<HuariqueConfigPage />} />
            </Route>


            <Route path="*" element={<Navigate to="/panel/mi-cuenta/datos" replace />} />
          </Route>
        </Route>

      </Routes>
    </div>
  );
};

export default AppRouter;
