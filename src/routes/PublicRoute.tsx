// import { Navigate, Outlet } from "react-router-dom";

import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = localStorage.getItem("accessToken");

  // const rol = localStorage.getItem("rol");
  // console.log("rol", rol)

  if (token) {
    // Si está logueado y es admin, redirigir al panel de administrador
    return <Navigate to="/panel" replace />;
    // return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
