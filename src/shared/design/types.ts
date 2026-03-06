export type BaseVariant =
  | "primary"
  | "secondary"
  | "terciary"
  | "warning"

export type OutlineVariant = `${BaseVariant}-outline`;

export type SpecialVariant =
  | "neutral-outline"
  | "primary-outline";

export type Variant =
  | BaseVariant
  | OutlineVariant
  | SpecialVariant;
