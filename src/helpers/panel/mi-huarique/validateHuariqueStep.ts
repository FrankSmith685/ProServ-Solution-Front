
import type { UserTypeProfile } from "@/interfaces/hook/IUseRequests";

export const validateHuariqueStep = (
  step: string,
  serviceSteep: number,
  profileType: UserTypeProfile
): boolean => {

  const stepIndexMap =
    profileType === "independiente"
      ? {
          info: 0,
          multimedia: 1,
          menu: 2,
          promociones: 3,
          publicacion: 4,
        }
      : {
          empresa: 0,
          info: 1,
          multimedia: 2,
          menu: 3,
          promociones: 4,
          publicacion: 5,
        };

  const stepIndex = stepIndexMap[step as keyof typeof stepIndexMap];
  if (stepIndex === undefined) return false;
  return serviceSteep >= stepIndex;
};
