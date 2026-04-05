export type BaseVariant =
  | "primary"
  | "secondary"
  | "terciary"
  | "warning"
  | "error";

/* 🔥 GENERA TODOS LOS OUTLINE AUTOMÁTICAMENTE */
export type OutlineVariant = `${BaseVariant}-outline`;

/* 🔥 SOLO VARIANTES ESPECIALES (no duplicar) */
export type SpecialVariant =
  | "primary-outline-white"; // caso especial (dark backgrounds)

/* ✅ FINAL */
export type Variant =
  | BaseVariant
  | OutlineVariant
  | SpecialVariant;