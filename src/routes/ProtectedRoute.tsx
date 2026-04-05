import { useAppState } from "@/hooks/useAppState";
import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoute = () => {
  const { accessToken } = useAppState();

  if (!accessToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;