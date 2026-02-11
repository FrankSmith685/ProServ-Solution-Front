export const validateHuariqueStep = (
  step: string,
  serviceSteep: number
): boolean => {
  const stepIndexMap: Record<string, number> = {
    empresa: 0,
    info: 1,
    imagenes: 2,
    menu: 3,
    promociones: 4,
    publicacion: 5,
  };

  const stepIndex = stepIndexMap[step];

  if (stepIndex === undefined) return false;

  return serviceSteep >= stepIndex;
};
