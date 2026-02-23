import type { UserTypeProfile } from "@/interfaces/hook/IUseUser";

export const getHuariqueSteps = (profileType: UserTypeProfile) => {
  return profileType === "independiente"
    ? ["info", "multimedia", "menu", "promociones", "publicacion"]
    : ["empresa", "info", "multimedia", "menu", "promociones", "publicacion"];
};

import { validateHuariqueStep } from "./validateHuariqueStep";

export const getHuariqueProgress = (
  serviceSteep: number,
  profileType: UserTypeProfile
): number => {

  const steps = getHuariqueSteps(profileType);

  let completed = 0;

  for (const step of steps) {
    if (validateHuariqueStep(step, serviceSteep, profileType)) {
      completed++;
    }
  }

  return Math.round((completed / steps.length) * 100);
};