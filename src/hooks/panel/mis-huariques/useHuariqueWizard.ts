import type { EmpresaTab, HuariqueTab } from "@/interfaces/panel/mis-huariques/IHuarique";

export type HuariqueStep =
  | "empresa"
  | "info"
  | "imagenes"
  | "menu"
  | "promociones"
  | "publicacion";

const STEPS: HuariqueStep[] = [
  "empresa",
  "info",
  "imagenes",
  "menu",
  "promociones",
  "publicacion",
];

export const useHuariqueWizard = () => {
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
  | { view: "imagenes" }
  // | { view: "promociones" }
  // | { view: "imagenes" };