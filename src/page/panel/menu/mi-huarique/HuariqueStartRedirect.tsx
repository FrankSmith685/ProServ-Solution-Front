import { useAppState } from "@/hooks/useAppState";
import { Navigate } from "react-router-dom";

export const HuariqueStartRedirect = () => {
  const { user, serviceSteep } = useAppState();

  if (!user) return null;

  const WIZARD_STEPS =
    user.profileType === "empresa"
      ? ["empresa","info","multimedia","menu","promociones","publicacion"]
      : ["info","multimedia","menu","promociones","publicacion"];

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
