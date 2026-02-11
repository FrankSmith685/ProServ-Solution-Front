import { validateHuariqueStep } from "./validateHuariqueStep";
const STEPS = ["info", "imagenes", "menu", "promociones", "publicacion"];

export const getHuariqueProgress = (serviceSteep: number): number => {

  let completed = 0;

  for (const step of STEPS) {
    if (validateHuariqueStep(step, serviceSteep)) {
      completed++;
    }
  }

  return Math.round((completed / STEPS.length) * 100);
};
