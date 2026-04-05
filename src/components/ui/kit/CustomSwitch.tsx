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
  sm: 0.8,
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
      transform: `scale(${Math.max(baseScale - 0.1, 0.7)})`,
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

  const fontSizeBySize = {
    sm: "13px",
    md: "14px",
    lg: "16px",
  };

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
          fontSize: fontSize ?? fontSizeBySize[size],

          "@media (max-width:600px)": {
            fontSize:
              fontSize ??
              (size === "lg"
                ? "15px"
                : size === "md"
                ? "14px"
                : "13px"),
          },

          color: disabled ? "text.disabled" : "text.primary",
        },
      }}
    />
  );
};

export const CustomSwitch = memo(CustomSwitchComponent);
