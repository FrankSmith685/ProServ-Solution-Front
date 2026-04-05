export const isPlainObject = (
  value: unknown
): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

export const isEmptyObject = (value: unknown): boolean => {
  return isPlainObject(value) && Object.keys(value).length === 0;
};