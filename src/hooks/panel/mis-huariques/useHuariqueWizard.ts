// import type { EmpresaTab, HuariqueTab } from "@/interfaces/panel/mis-huariques/IHuarique";

// export type HuariqueStep =
//   | "empresa"
//   | "info"
//   | "multimedia"
//   | "menu"
//   | "promociones"
//   | "publicacion";

// const STEPS: HuariqueStep[] = [
//   "empresa",
//   "info",
//   "multimedia",
//   "menu",
//   "promociones",
//   "publicacion",
// ];

// export const useHuariqueWizard = () => {
//   const getStepIndex = (step: HuariqueStep) =>
//     STEPS.indexOf(step);

//   const getNextStep = (step: HuariqueStep) =>
//     STEPS[getStepIndex(step) + 1];

//   const getPrevStep = (step: HuariqueStep) =>
//     STEPS[getStepIndex(step) - 1];

//   return {
//     STEPS,
//     getNextStep,
//     getPrevStep,
//   };
// };

import { useAppState } from "@/hooks/useAppState";
import type { EmpresaTab, HuariqueTab } from "@/interfaces/panel/mis-huariques/IHuarique";

export type HuariqueStep =
  | "empresa"
  | "info"
  | "multimedia"
  | "menu"
  | "promociones"
  | "publicacion";

export const useHuariqueWizard = () => {

  const { user, service } = useAppState();

  const hasMenu = (service?.menu?.length ?? 0) > 0;

  const BASE_STEPS: HuariqueStep[] =
    user?.profileType === "empresa"
      ? ["empresa", "info", "multimedia", "menu"]
      : ["info", "multimedia", "menu"];

  const STEPS: HuariqueStep[] = hasMenu
    ? [...BASE_STEPS, "promociones", "publicacion"]
    : [...BASE_STEPS, "publicacion"];

  const getStepIndex = (step: HuariqueStep) =>
    STEPS.indexOf(step);

  const getNextStep = (step: HuariqueStep) =>
    STEPS[getStepIndex(step) + 1];

  const getPrevStep = (step: HuariqueStep) =>
    STEPS[getStepIndex(step) - 1];

  return {
    STEPS,
    getNextStep,
    getPrevStep,
  };
};

export type WizardView =
  | { view: "empresa"; tab: EmpresaTab }
  | { view: "info"; tab: HuariqueTab }
  | { view: "multimedia" }
  | { view: "menu" }
  | { view: "promociones" }
  // | { view: "imagenes" };