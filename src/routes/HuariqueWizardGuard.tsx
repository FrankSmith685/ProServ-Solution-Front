import { Navigate, Outlet, useLocation } from "react-router-dom";
import { validateHuariqueStep } from "@/helpers/panel/mi-huarique/validateHuariqueStep";
import { useAppState } from "@/hooks/useAppState";
import type { ServiceSteeps } from "@/interfaces/panel/mis-huariques/IHuarique";

export const HuariqueWizardGuard = () => {
  const { serviceSteep, serviceLoading, user, visitedServiceSteep } = useAppState();
  const { pathname } = useLocation();

  if (!user) return null;
  if (serviceLoading || serviceSteep === null) return null;

  const WIZARD_STEPS =
    user.profileType === "empresa"
      ? ["empresa","info","multimedia","menu","promociones","publicacion"]
      : ["info","multimedia","menu","promociones","publicacion"];

  const currentStep = pathname.split("/").at(-1);

  if (!currentStep) return null;

  const FIRST_STEP =
    user.profileType === "empresa"
      ? "empresa"
      : "info";

  const allowedStep =
    serviceSteep === 0
      ? FIRST_STEP
      : WIZARD_STEPS[serviceSteep];

  if (currentStep === allowedStep) {
    return <Outlet />;
  }

  const stepName = currentStep as ServiceSteeps;

  const isVisited = visitedServiceSteep.includes(stepName);
  const isUnlockedByProgress = validateHuariqueStep(
    stepName,
    serviceSteep,
    user.profileType
  );

  if (!isVisited && !isUnlockedByProgress) {
    return (
      <Navigate
        to={`/panel/mi-huarique/${allowedStep}`}
        replace
      />
    );
  }
  return <Outlet />;
};
