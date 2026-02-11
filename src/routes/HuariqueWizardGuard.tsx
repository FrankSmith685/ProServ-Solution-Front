import { Navigate, Outlet, useLocation } from "react-router-dom";
import { validateHuariqueStep } from "@/helpers/panel/mi-huarique/validateHuariqueStep";
import { useAppState } from "@/hooks/useAppState";

export const HuariqueWizardGuard = () => {
  const { serviceSteep, serviceLoading, user } = useAppState();
  const { pathname } = useLocation();

  if (!user) return null;
  if (serviceLoading || serviceSteep === null) return null;
  const WIZARD_STEPS = user.tieneEmpresa
    ? ["empresa","info","imagenes","menu","promociones","publicacion"]
    : ["info","imagenes","menu","promociones","publicacion"];
  const currentStep = pathname.split("/").at(-1);
  if (!user.tieneEmpresa && currentStep === "empresa") {
    return <Navigate to="/panel/mi-huarique/info" replace />;
  }
  let lastAllowedStep = WIZARD_STEPS[0];
  for (const step of WIZARD_STEPS) {
    if (validateHuariqueStep(step, serviceSteep)) {
      lastAllowedStep = step;
    } else {
      break;
    }
  }

  if (currentStep === lastAllowedStep) {
    return <Outlet />;
  }

  if (!validateHuariqueStep(currentStep!, serviceSteep)) {
    return (
      <Navigate
        to={`/panel/mi-huarique/${lastAllowedStep}`}
        replace
      />
    );
  }

  return <Outlet />;
};
