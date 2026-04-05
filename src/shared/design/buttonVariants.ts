import type { Variant } from "./types";

export const buttonVariantStyles: Record<Variant, string> = {
  /* ================= SOLID ================= */

  primary: `
    !bg-[hsl(var(--color-primary))]
    !text-[hsl(var(--color-primary-foreground))]
    hover:brightness-110 active:brightness-95
    shadow-sm
  `,

  secondary: `
    !bg-[hsl(var(--color-secondary))]
    !text-[hsl(var(--color-secondary-foreground))]
    hover:brightness-110 active:brightness-95
  `,

  terciary: `
    !bg-[hsl(var(--color-terciary))]
    !text-[hsl(var(--color-terciary-foreground))]
    hover:brightness-110 active:brightness-95
  `,

  warning: `
    !bg-[hsl(var(--color-warning))]
    !text-[hsl(var(--color-warning-foreground))]
    hover:brightness-110 active:brightness-95
  `,

  error: `
    !bg-[hsl(var(--color-error))]
    !text-[hsl(var(--color-error-foreground))]
    hover:brightness-110 active:brightness-95
  `,

  /* ================= OUTLINE ================= */

  "primary-outline": `
    !border !border-[hsl(var(--color-primary))]
    !text-[hsl(var(--color-primary))]
    !bg-transparent
    hover:!bg-[hsl(var(--color-primary)/0.1)]
  `,

  "secondary-outline": `
    !border !border-[var(--color-outline-border)]
    !text-[var(--color-outline-text)]
    !bg-transparent
    hover:!bg-[var(--color-outline-hover)]
  `,

  "terciary-outline": `
    !border !border-[hsl(var(--color-terciary))]
    !text-[hsl(var(--color-terciary))]
    !bg-transparent
    hover:!bg-[hsl(var(--color-terciary)/0.1)]
  `,

  "warning-outline": `
    !border !border-[hsl(var(--color-warning))]
    !text-[hsl(var(--color-warning))]
    !bg-transparent
    hover:!bg-[hsl(var(--color-warning)/0.1)]
  `,

  "error-outline": `
    !border !border-[hsl(var(--color-error))]
    !text-[hsl(var(--color-error))]
    !bg-transparent
    hover:!bg-[hsl(var(--color-error)/0.1)]
  `,

  "primary-outline-white": `
    !border !border-white
    !text-white
    !bg-transparent
    hover:!bg-white/10
  `,
};