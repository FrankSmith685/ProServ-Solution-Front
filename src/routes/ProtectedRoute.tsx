import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  const token = localStorage.getItem("accessToken");
  return token !== null;
};

const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
