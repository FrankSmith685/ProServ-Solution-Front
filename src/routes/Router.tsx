/* eslint-disable react-hooks/exhaustive-deps */
import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "@/components/layouts/admin/AdminLayout";
import Layout from "@/components/layouts/Layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useAppState } from "@/hooks/useAppState";
// import ComponentPageSkeleton from "@/page/components/ComponentPageSkeleton";
import NosotrosPage from "@/page/nosotros/NosotrosPage";
import ServiciosPage from "@/page/servicios/ServiciosPage";
import ServicioDetallePage from "@/page/servicios/ServicioDetallePage";
import ProyectosPage from "@/page/proyectos/ProyectosPage";
import ProyectoDetallePage from "@/page/proyectos/ProyectoDetallePage";

import ProtectedRoute from "./ProtectedRoute";
import AdminPage from "@/page/admin/panel/AdminPage ";
import AdminMediaPage from "@/page/admin/panel/AdminMediaPage";
import ContactoPage from "@/page/contact/ContactPage";
import DejarTestimonioPage from "@/page/testimonios/DejarTestimonioPage";

// =========================
// Lazy pages
// =========================
// const ComponentPage = lazy(() => import("@/page/components/ComponentPage"));
const HomePage = lazy(() => import("@/page/home/HomePage"));
const LoginAdminPage = lazy(() => import("@/page/admin/login/LoginAdminPage"));

const AdminHomePage = lazy(() => import("@/page/admin/panel/AdminHomePage"));
const AdminNosotrosPage = lazy(
  () => import("@/page/admin/panel/AdminNosotrosPage")
);
const AdminServicesPage = lazy(
  () => import("@/page/admin/panel/AdminServiciosPage")
);
const AdminProjectsPage = lazy(
  () => import("@/page/admin/panel/AdminProjectsPage")
);
const AdminContactsPage = lazy(
  () => import("@/page/admin/panel/AdminContactsPage")
);
const AdminTestimonialsPage = lazy(
  () => import("@/page/admin/panel/AdminTestimonialsPage")
);
const AdminConfiguracionPage = lazy(
  () => import("@/page/admin/panel/AdminConfiguracionPage")
);
const AdminLogsPage = lazy(() => import("@/page/admin/panel/AdminLogsPage"));

const pageFallback = <p>Cargando...</p>;

const AppRouter = () => {
  const { accessToken, user } = useAppState();
  const { getCurrentUser } = useAuth();

  useEffect(() => {
    if (accessToken && !user) {
      getCurrentUser();
    }
  }, [accessToken, user]);

  return (
    <div className="pt-0">
      <Routes>
        {/* <Route
          path="/components"
          element={
            <Suspense fallback={<ComponentPageSkeleton />}>
              <ComponentPage />
            </Suspense>
          }
        /> */}

        <Route
          path="/admin/login"
          element={
            <Suspense fallback={pageFallback}>
              <LoginAdminPage />
            </Suspense>
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route
              index
              element={
                <Suspense fallback={pageFallback}>
                  <AdminPage />
                </Suspense>
              }
            />

            <Route
              path="home"
              element={
                <Suspense fallback={pageFallback}>
                  <AdminHomePage />
                </Suspense>
              }
            />

            <Route
              path="nosotros"
              element={
                <Suspense fallback={pageFallback}>
                  <AdminNosotrosPage />
                </Suspense>
              }
            />

            <Route
              path="servicios"
              element={
                <Suspense fallback={pageFallback}>
                  <AdminServicesPage />
                </Suspense>
              }
            />

            <Route
              path="proyectos"
              element={
                <Suspense fallback={pageFallback}>
                  <AdminProjectsPage />
                </Suspense>
              }
            />

            <Route
              path="contactos"
              element={
                <Suspense fallback={pageFallback}>
                  <AdminContactsPage />
                </Suspense>
              }
            />

            <Route
              path="testimonios"
              element={
                <Suspense fallback={pageFallback}>
                  <AdminTestimonialsPage />
                </Suspense>
              }
            />

            <Route
              path="configuracion"
              element={
                <Suspense fallback={pageFallback}>
                  <AdminConfiguracionPage />
                </Suspense>
              }
            />

            <Route
              path="admin-logs"
              element={
                <Suspense fallback={pageFallback}>
                  <AdminLogsPage />
                </Suspense>
              }
            />

            <Route
              path="media"
              element={
                <Suspense fallback={pageFallback}>
                  <AdminMediaPage />
                </Suspense>
              }
            />

            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Route>

        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <Suspense fallback={pageFallback}>
                <HomePage />
              </Suspense>
            }
          />
        </Route>

        <Route path="/nosotros" element={<Layout />}>
          <Route index element={<NosotrosPage />} />
        </Route>

        <Route path="/servicios" element={<Layout />}>
          <Route index element={<ServiciosPage />} />
          <Route path=":slug" element={<ServicioDetallePage />} />
        </Route>

        <Route path="/proyectos" element={<Layout />}>
          <Route index element={<ProyectosPage />} />
          <Route path=":slug" element={<ProyectoDetallePage />} />
        </Route>

        <Route path="/contacto" element={<Layout />}>
          <Route index element={<ContactoPage />} />
        </Route>

        <Route path="/dejar-testimonio" element={<Layout />}>
          <Route index element={<DejarTestimonioPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default AppRouter;