import { memo, useMemo, type FC } from "react";
import { FormControlLabel, Switch } from "@mui/material";
import type { ChangeEvent } from "react";
import { inputVariantStyles } from "@/shared/design/inputVariants";
import type {
  CustomSwitchProps,
  SwitchSize,
} from "@/interfaces/ui/kit/ICustomSwitch";

const sizeScaleMap: Record<SwitchSize, number> = {
  lg: 1,
  md: 0.9,
};

const CustomSwitchComponent: FC<CustomSwitchProps> = ({
  label,
  checked,
  onChange,
  variant = "primary",
  fontSize,
  fontFamily = "Arial",
  disabled = false,
  size = "lg",
}) => {
  const current = inputVariantStyles[variant];
  const baseScale: number = sizeScaleMap[size];

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean
  ): void => {
    onChange(event, checked);
  };

  const switchSx = useMemo(() => ({
    transform: `scale(${baseScale})`,
    transition: "transform 0.2s ease",
    "@media (max-width:600px)": {
      transform: `scale(${baseScale - 0.1})`,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: current.focusBorder,
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: current.focusBorder,
    },
    "& .MuiSwitch-switchBase.Mui-checked.Mui-disabled": {
      color: current.focusBorder,
      opacity: 1,
    },
    "& .MuiSwitch-switchBase.Mui-checked.Mui-disabled + .MuiSwitch-track": {
      backgroundColor: current.focusBorder,
      opacity: 0.6,
    },
    "& .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.4,
    },
  }), [baseScale, current.focusBorder]);


  return (
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          sx={switchSx}
        />

      }
      label={label}
      sx={{
        width: "fit-content",
        maxWidth: "100%",
        margin: 0,

        "& .MuiFormControlLabel-label": {
          fontFamily,
          fontSize: fontSize ?? (size === "lg" ? "16px" : "15px"),

          "@media (max-width:600px)": {
            fontSize: fontSize ?? (size === "lg" ? "15px" : "14px"),
          },

          color: disabled ? "text.disabled" : "text.primary",
        },
      }}
    />
  );
};

export const CustomSwitch = memo(CustomSwitchComponent);
