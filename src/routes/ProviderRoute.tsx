import { Navigate, Outlet } from "react-router-dom";
import { useAppState } from "@/hooks/useAppState";

interface Props {
  required: ("correo" | "google")[];
  redirectTo?: string;
}

const ProviderRoute = ({
  required,
  redirectTo = "/panel/mi-cuenta/datos",
}: Props) => {
  const { user } = useAppState();

  if (!user) return null;

  const hasAccess = required.some(p =>
    user.metodosLogin.includes(p)
  );

  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default ProviderRoute;
