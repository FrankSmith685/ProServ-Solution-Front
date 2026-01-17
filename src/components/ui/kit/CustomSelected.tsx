import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import {
  inputVariantStyles,
  neutralInput,
} from "@/shared/design/inputVariants";
import type { CustomSelectProps } from "@/interfaces/ui/kit/ICustomSelected";
import { memo, useState } from "react";

export const CustomSelectedComponent = <T extends string | number>({
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
  const current = inputVariantStyles[variant];
  const hasValue = value !== "" && value !== undefined && value !== null;
  const height = size === "lg" ? 52 : 44;
  const baseFontSize = fontSize ?? (size === "lg" ? "16px" : "15px");
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div style={{ width: fullWidth ? "100%" : "auto" }}>
      <FormControl
        fullWidth={fullWidth}
        error={error}
        disabled={disabled}
      >
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
          value={value}
          onChange={onChange}
          displayEmpty
          onOpen={() => setOpen(true)}
          onClose={() => {
            setOpen(false)
          }}
          
          input={
            <OutlinedInput
              label={hasValue ? label : undefined}
              sx={{
                height,

                "@media (max-width:600px)": {
                  height: size === "lg" ? 44 : 40,
                },
              }}
            />
          }
          renderValue={(selected) => {
            if (!selected) {
              return (
                <span style={{ color: neutralInput.placeholder }}>
                  {placeholder}
                </span>
              );
            }
            return options.find((o) => o.value === selected)?.label;
          }}
          MenuProps={{
            disableScrollLock: true,
            disableRestoreFocus: true,
            PaperProps: {
              sx: {
                mt: 1,
                border: `1px solid ${neutralInput.border}`,
                backgroundColor: "#fff",

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
          onMouseEnter={() => {
            setOpen(true);
          }}
          onMouseLeave={() => {
            setOpen(false)
          }}
          sx={{
            height,

            "@media (max-width:600px)": {
              height: size === "lg" ? 44 : 40,
            },

            "& .MuiSelect-select": {
              minHeight: height,
              lineHeight: `${height}px`,
              padding: "0 14px",
              fontSize: baseFontSize,
              fontFamily,
              color: neutralInput.label,

              "@media (max-width:600px)": {
                minHeight: size === "lg" ? 44 : 40,
                lineHeight: `${size === "lg" ? 44 : 40}px`,
                fontSize: fontSize ?? (size === "lg" ? "15px" : "14px"),
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: open ? current.focusBorder : neutralInput.border,
              borderWidth: "1px",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: open ? current.focusBorder : neutralInput.border,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: open ? current.focusBorder : neutralInput.border,
              borderWidth: "1px",
            },
          }}
          
        >
          <MenuItem disabled value="">
            {placeholder}
          </MenuItem>

          {options.map((opt) => (
            <MenuItem
              key={opt.value}
              value={opt.value}
              sx={{ fontFamily }}
            >
              {opt.label}
            </MenuItem>
          ))}
        </Select>

        {helperText && (
          <FormHelperText sx={{ backgroundColor: "#fff", px: 2, m: 0 }}>
            {helperText}
          </FormHelperText>
        )}
      </FormControl>
    </div>
  );
};

export const CustomSelected = memo(CustomSelectedComponent);
