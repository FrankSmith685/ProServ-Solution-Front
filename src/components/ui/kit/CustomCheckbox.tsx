import { FormControlLabel, Checkbox } from "@mui/material";
import { memo, type FC } from "react";
import type { CustomCheckboxProps } from "@/interfaces/ui/kit/ICustomCheckbox";
import { checkboxVariantStyles } from "@/shared/design/checkboxVariant";

export const CustomCheckboxComponent: FC<CustomCheckboxProps> = ({
  label,
  checked,
  onChange,
  variant = "primary",
  fontSize,
  fontFamily = "Arial",
  disabled = false,
}) => {
  const styles = checkboxVariantStyles[variant];

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          sx={{
            transform: {
              xs: "scale(0.9)",
              md: "scale(0.9)",
              lg: "scale(0.85)",
            },

            color: styles.color,

            "&.Mui-checked": {
              color: styles.checked,
            },

            "&.Mui-disabled": {
              opacity: 0.5,
            },
          }}
        />
      }
      label={label}
      sx={{
        fontFamily,

        fontSize: {
          xs: fontSize ?? "15px",
          md: fontSize ?? "15px",
          lg: fontSize ?? "14px",
        },

        "& .MuiFormControlLabel-label": {
          fontFamily,
          fontSize: {
            xs: fontSize ?? "15px",
            md: fontSize ?? "15px",
            lg: fontSize ?? "14px",
          },
        },
      }}
    />
  );
};

export const CustomCheckbox = memo(CustomCheckboxComponent);
