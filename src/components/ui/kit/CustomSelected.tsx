import { memo, useMemo, type ReactNode, type ChangeEvent } from "react";
import { TextField, MenuItem } from "@mui/material";

import { inputVariantStyles } from "@/shared/design/inputVariants";
import type { CustomSelectProps } from "@/interfaces/ui/kit/ICustomSelected";

const CustomSelectedComponent = <T extends string | number = string>({
  value,
  onChange,
  options,
  label = "Seleccione una opción",
  placeholder = "Seleccione una opción",
  disabled = false,
  fullWidth = false,
  variant = "primary",
  size = "lg",
  fontSize,
  fontFamily = "Arial",
  error = false,
  helperText = "",
}: CustomSelectProps<T>) => {
  const sizeConfig = {
    sm: { height: 36 },
    md: { height: 44 },
    lg: { height: 52 },
  };

  const fontSizeBySize = {
    sm: "13px",
    md: "14px",
    lg: "15px",
  };

  const current = inputVariantStyles[variant];
  const { height } = sizeConfig[size];
  const baseFontSize = fontSize ?? fontSizeBySize[size];
  const hasValue = value !== "" && value !== undefined && value !== null;

  const sxStyles = useMemo(() => {
  return {
    backgroundColor: "var(--color-surface)",

    "& .MuiOutlinedInput-root": {
      backgroundColor: "var(--color-surface)",
      boxSizing: "border-box",
      height,
      padding: 0,
      borderRadius: "12px",

      "@media (max-width:390px)": {
        height: 40,
      },

      "@media (max-width:600px)": {
        height: size === "lg" ? 44 : size === "md" ? 40 : 40,
      },

      "& fieldset": {
        borderColor: error ? "hsl(var(--color-error))" : current.border,
      },

      "&:hover fieldset": {
        borderColor: error
          ? "hsl(var(--color-error))"
          : current.focusBorder,
      },

      "&.Mui-focused fieldset": {
        borderColor: error
          ? "hsl(var(--color-error))"
          : current.focusBorder,
        borderWidth: "1px",
      },

      "&.Mui-disabled": {
        backgroundColor: "hsl(var(--color-muted) / 0.08)",
      },

      "&.Mui-disabled fieldset": {
        borderColor: "hsl(var(--color-border))",
      },
    },

    /* 🔥 FIX IMPORTANTE */
    "& .MuiSelect-select": {
      height: "100% !important",
      minHeight: "100% !important",
      display: "flex !important",
      alignItems: "center !important",
      boxSizing: "border-box",
      padding: "0 14px !important",
      fontSize: baseFontSize,
      fontFamily,
      color: hasValue
        ? "var(--color-text)"
        : "var(--color-text-muted)",
    },

    /* 🔥 EXTRA FIX (MUI nested class) */
    "& .MuiSelect-select.MuiSelect-outlined": {
      height: "100% !important",
      minHeight: "100% !important",
      display: "flex !important",
      alignItems: "center !important",
    },

    /* 🔥 ESTE ES CLAVE TAMBIÉN */
    "& .MuiInputBase-input": {
      height: "100% !important",
      display: "flex",
      alignItems: "center",
    },

    "& .MuiSelect-icon": {
      color: "var(--color-text-muted)",
      right: "12px",
    },

    "& .MuiInputLabel-root": {
      fontFamily,
      transition: "color 0.2s ease, transform 0.2s ease",
      fontSize: "16px",
      color: error
        ? "hsl(var(--color-error))"
        : "var(--color-text-muted)",

      "@media (max-width:600px)": {
        fontSize: "15px",
      },

      "@media (max-width:390px)": {
        fontSize: "14px",
      },
    },

    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
      transform: "translate(14px, -6px) scale(0.75)",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: error
        ? "hsl(var(--color-error))"
        : current.focusBorder,
    },
  };
}, [
  height,
  size,
  baseFontSize,
  fontFamily,
  hasValue,
  error,
  current.border,
  current.focusBorder,
]);

  const handleInternalChange = (
    event:
      | ChangeEvent<HTMLInputElement>
      | (Event & { target: { value: unknown; name: string } }),
    child?: ReactNode
  ) => {
    onChange(event, child);
  };

  return (
    <div
      style={{
        position: "relative",
        width: fullWidth ? "100%" : undefined,
      }}
      className={fullWidth ? "w-full" : ""}
    >
      <TextField
        select
        value={value ?? ""}
        fullWidth={fullWidth}
        disabled={disabled}
        error={error}
        helperText={helperText}
        label={label}
        InputLabelProps={{
          shrink: true,
        }}
        sx={sxStyles}
        SelectProps={{
          onChange: handleInternalChange,
          displayEmpty: true,
          renderValue: (selected) => {
            if (
              selected === "" ||
              selected === undefined ||
              selected === null
            ) {
              return (
                <span style={{ color: "var(--color-text-muted)" }}>
                  {placeholder}
                </span>
              );
            }

            return (
              options.find((o) => String(o.value) === String(selected))?.label ??
              ""
            );
          },
          MenuProps: {
            PaperProps: {
              sx: {
                mt: 1,
                borderRadius: "14px",
                border: "1px solid hsl(var(--color-border))",
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",

                "& .MuiList-root": {
                  padding: "6px",
                  backgroundColor: "var(--color-surface)",
                },

                "& .MuiMenuItem-root": {
                  minHeight: "42px",
                  borderRadius: "10px",
                  fontSize: baseFontSize,
                  fontFamily,
                  color: "var(--color-text)",
                  transition: "background-color 0.2s ease, color 0.2s ease",

                  "&:hover": {
                    backgroundColor: "hsl(var(--color-muted) / 0.12)",
                  },

                  "&.Mui-selected": {
                    backgroundColor: "hsl(var(--color-primary) / 0.14)",
                    color: "var(--color-text)",
                  },

                  "&.Mui-selected:hover": {
                    backgroundColor: "hsl(var(--color-primary) / 0.20)",
                  },
                },
              },
            },
          },
        }}
      >
        <MenuItem disabled value="">
          <span style={{ color: "var(--color-text-muted)" }}>
            {placeholder}
          </span>
        </MenuItem>

        {options.map((opt) => (
          <MenuItem key={String(opt.value)} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export const CustomSelected = memo(
  CustomSelectedComponent
) as typeof CustomSelectedComponent;