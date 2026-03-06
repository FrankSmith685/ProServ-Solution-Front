import { useAppState } from "@/hooks/useAppState";
import { Navigate } from "react-router-dom";

export const HuariqueStartRedirect = () => {
  const { user, serviceSteep, service } = useAppState();

  if (!user) return null;

  const hasMenu = (service?.menu?.length ?? 0) > 0;

  const BASE_STEPS =
    user.profileType === "empresa"
      ? ["empresa","info","multimedia","menu"]
      : ["info","multimedia","menu"];

  const WIZARD_STEPS = hasMenu
    ? [...BASE_STEPS, "promociones", "publicacion"]
    : [...BASE_STEPS, "publicacion"];

  const FIRST_STEP =
    user.profileType === "empresa"
      ? "empresa"
      : "info";

  const step =
    serviceSteep === 0
      ? FIRST_STEP
      : WIZARD_STEPS[serviceSteep];

  return <Navigate to={`/panel/mi-huarique/${step}`} replace />;
};