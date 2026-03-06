/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Checkbox,
  ListItemText,
  Box,
} from "@mui/material";

import { memo, useState } from "react";
import type { SelectChangeEvent } from "@mui/material";

import {
  inputVariantStyles,
  neutralInput,
} from "@/shared/design/inputVariants";

import { CustomChip } from "@/components/ui/kit/CustomChip";
import type { CustomSelectOption } from "@/interfaces/ui/kit/ICustomSelected";

interface Props<T extends string | number> {
  value: T[];
  onChange: (event: SelectChangeEvent<any>) => void;
  options: CustomSelectOption<T>[];

  label?: string;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;

  variant?: keyof typeof inputVariantStyles;
  size?: "md" | "lg";

  fontSize?: string;
  fontFamily?: string;

  error?: boolean;
  helperText?: string;
}

export const CustomMultiSelectedComponent = <T extends string | number>({
  value,
  onChange,
  options,

  label = "Seleccione opciones",
  placeholder = "Seleccione opciones",

  disabled = false,
  fullWidth = false,

  variant = "primary",
  size = "lg",

  fontSize,
  fontFamily = "Arial",

  error = false,
  helperText = "",
}: Props<T>) => {

  const current = inputVariantStyles[variant];
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);

  const height = size === "lg" ? 52 : 44;
  const baseFontSize = fontSize ?? (size === "lg" ? "16px" : "15px");

  const hasValue = value && value.length > 0;

  return (
    <div style={{ width: fullWidth ? "100%" : "auto" }}>
      <FormControl fullWidth={fullWidth} error={error} disabled={disabled}>

        {hasValue && (
          <InputLabel
                sx={{
                    fontSize: baseFontSize,
                    fontFamily,
                    color: neutralInput.label,

                    "&.Mui-focused": {
                    color: open ? current.focusBorder : neutralInput.label,
                    },

                    ".MuiFormControl-root:hover &": {
                    color: current.focusBorder,
                    },

                    "@media (max-width:600px)": {
                    fontSize: fontSize ?? (size === "lg" ? "15px" : "14px"),
                    },
                }}
                >
            {label}
          </InputLabel>
        )}

        <Select
          multiple
          value={value ?? []}
          onChange={onChange}
          displayEmpty
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          onMouseEnter={() => {
            setHover(true);
          }}
          onMouseLeave={() => {
            setHover(false)
          }}

          input={
            <OutlinedInput
              label={hasValue ? label : undefined}
              sx={{
                height,

                "@media (max-width:600px)": {
                  height: size === "lg" ? 44 : 40,
                },

                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: open || hover ? current.focusBorder : neutralInput.border,
                  borderWidth: "1px",
                },

                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: open || hover ? current.focusBorder : neutralInput.border,
                },

                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: open || hover ? current.focusBorder : neutralInput.border,
                  borderWidth: "1px",
                },
              }}
            />
          }

          renderValue={(selected) => {

            if (!selected || (selected as T[]).length === 0) {
              return (
                <span style={{ color: neutralInput.placeholder }}>
                  {placeholder}
                </span>
              );
            }

            const values = selected as T[];

            if (values.length > 3) {
              return `${values.length} seleccionados`;
            }

            return (
              <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "4px",
                }}
                >
                {values.map((v, index) => {

                  const option = options.find(o => o.value === v);

                  if (!option) return null;

                  return (
                    <CustomChip
                      key={`${v}-${index}`}
                      label={option.label}
                      size="small"
                      variant={open ? `${variant}-outline` as any : "neutral-outline"}
                    />
                  );

                })}
              </Box>
            );

          }}

          MenuProps={{
                disableScrollLock: true,
                disableRestoreFocus: true,
                PaperProps: {
                  sx: {
                    mt: 1,
                    border: `1px solid ${neutralInput.border}`,
                    backgroundColor: "#fff",
                    maxHeight: 320,

                    "& .MuiMenuItem-root": {
                      fontSize: baseFontSize,
                      fontFamily,

                      "@media (max-width:600px)": {
                        fontSize: fontSize ?? (size === "lg" ? "15px" : "14px"),
                      },
                    },
                  },
                },
              }}
          sx={{
            height,

            "@media (max-width:600px)": {
              height: size === "lg" ? 44 : 40,
            },

          "& .MuiSelect-select": {
            minHeight: height,
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "4px",
            padding: "6px 14px",
            fontSize: baseFontSize,
            fontFamily,
            color: neutralInput.label,
          },

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: open || hover ? current.focusBorder : neutralInput.border,
              borderWidth: "1px",
            },

            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: open || hover ? current.focusBorder : neutralInput.border,
            },

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: open || hover ? current.focusBorder : neutralInput.border,
              borderWidth: "1px",
            },
          }}
        >

          {options.map((opt, index) => (
            <MenuItem key={`${opt.value}-${index}`} value={opt.value}>

                <Checkbox
                  checked={Array.isArray(value) && value.includes(opt.value)}
                  sx={{
                  color: neutralInput.border,
                  "&.Mui-checked": {
                    color: current.focusBorder,
                  },
                }}
              />

              <ListItemText primary={opt.label} />

            </MenuItem>

          ))}

        </Select>

        {helperText && (
          <FormHelperText
            sx={{
              backgroundColor: "transparent",
              px: 0,
              mt: 0.5,
              fontSize: "12px",
            }}
          >
            {helperText}
          </FormHelperText>
        )}

      </FormControl>
    </div>
  );
};

export const CustomMultiSelected = memo(CustomMultiSelectedComponent);