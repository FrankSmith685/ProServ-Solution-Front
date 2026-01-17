export type BaseVariant =
  | "primary"
  | "secondary"
  | "terciary"
  | "warning";

export type OutlineVariant = `${BaseVariant}-outline`;

export type SpecialVariant =
  | "primary-outline-white";

export type Variant =
  | BaseVariant
  | OutlineVariant
  | SpecialVariant;
