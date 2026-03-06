import { memo, useCallback, useMemo, useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Search, Visibility, VisibilityOff } from "@mui/icons-material";
import type { ChangeEvent, FC } from "react";
import {
  inputVariantStyles,
  neutralInput,
} from "@/shared/design/inputVariants";
import type { CustomInputProps } from "@/interfaces/ui/kit/ICustomInput";

const CustomInputComponent: FC<CustomInputProps> = ({
  name,
  inputRef,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  fullWidth = false,
  variant = "primary",
  size = "lg",
  ariaLabel,
  fontSize,
  fontFamily,
  icon,
  label,
  required,
  error = false,
  helperText = "",
  multiline = false,
  rows,
  autoComplete = "off",
  onFocus,
  onBlur,
  onKeyDown,
  inputProps
}) => {

  const isPassword = type === "password";
  const isSearch = type === "search";
  const isNumber = type === "number";
  const isDate = type === "date";

  const hasStartAdornment = isSearch || icon;

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (isNumber && !/^\d*$/.test(e.target.value)) return;
      onChange(e);
    },
    [onChange, isNumber]
  );

  const sizeConfig = {
    lg: {
      height: 52,
      padding: 0,
    },
    md: {
      height: 44,
      padding: 0,
    },
  };

  const { height, padding } = sizeConfig[size];

  const sxStyles = useMemo(() => ({

    backgroundColor: "#fff",

    "& .MuiOutlinedInput-root": {

      boxSizing: "border-box",
      height: multiline ? "auto" : height,
      padding: 0,

      ...(multiline
        ? {}
        : {
            "@media (max-width:600px)": {
              height: size === "lg" ? 44 : 40,
            },
          }),

      "& fieldset": {
        borderColor: neutralInput.border,
        borderWidth: "1px",
      },

      "&:hover fieldset": {
        borderColor: inputVariantStyles[variant].focusBorder,
        borderWidth: "1px",
      },

      "&.Mui-focused fieldset": {
        borderColor: inputVariantStyles[variant].focusBorder,
        borderWidth: "1px",
      },
    },

    "& .MuiOutlinedInput-input": {

      ...(multiline
        ? { padding: "12px 14px" }
        : {
            height: height,
            padding: isDate
              ? "0 14px"
              : !icon
              ? `${isSearch ? "0px" : padding} 16px`
              : `${isSearch ? "0px" : padding} 16px ${padding} 0px`,
            lineHeight: "1.2",
          }),

      fontSize: fontSize ?? "15px",
      fontFamily: fontFamily ?? "Arial",
      color: neutralInput.label,
    },

    "& .MuiInputLabel-root": {
      fontFamily: fontFamily ?? "Arial",
      transition: "color 0.2s ease, transform 0.2s ease",
      padding: icon ? "0 16px" : 0,
    },

    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
      padding: 0,
      top: 0,
      transform: "translate(14px, -6px) scale(0.75)",
    },

    "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
      top: error ? "35%" : helperText ? "35%" : multiline ? "0%" : "50%",
      transform: multiline
        ? "translate(14px, -100%) scale(1)"
        : "translate(14px, -50%) scale(1)",
    },

    "& .MuiOutlinedInput-root:has(input:placeholder-shown) .MuiInputLabel-root": {
      padding: icon ? "0 16px" : undefined,
    },

    "& .MuiOutlinedInput-root:not(:has(input:placeholder-shown)) .MuiInputLabel-root": {
      padding: 0,
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: inputVariantStyles[variant].focusBorder,
    },

  }), [
    height,
    fontSize,
    fontFamily,
    multiline,
    variant,
    icon,
    padding,
    error,
    isSearch,
    size,
    helperText,
    isDate
  ]);

  const startAdornment = useMemo(() => {

    if (!hasStartAdornment) return undefined;

    return (
      <InputAdornment
        position="start"
        sx={{
          width: 44,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 0,
        }}
      >

        {isSearch ? (
          <Search
            sx={{
              fontSize: 20,
              color: neutralInput.placeholder,
            }}
          />
        ) : (
          icon
        )}

      </InputAdornment>
    );

  }, [hasStartAdornment, isSearch, icon]);

  const [focused, setFocused] = useState<boolean>(false);

  const shouldShrink = isDate || focused || Boolean(value);

  return (

    <div style={{ position: "relative", width: fullWidth ? "100%" : "auto" }}>

      <TextField
        name={name}
        inputRef={inputRef}
        value={value}
        onChange={handleChange}

        inputProps={inputProps}

        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}

        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}

        onKeyDown={onKeyDown}

        InputLabelProps={{
          shrink: shouldShrink,
        }}

        placeholder={isDate ? undefined : placeholder}

        type={
          isPassword
            ? showPassword
              ? "text"
              : "password"
            : isNumber
            ? "text"
            : type
        }

        disabled={disabled}
        fullWidth={fullWidth}
        aria-label={ariaLabel}
        error={error}
        helperText={helperText}

        multiline={multiline}
        minRows={multiline ? rows ?? 3 : undefined}

        autoComplete={autoComplete}

        label={isSearch ? undefined : label}
        required={isSearch ? false : required}

        InputProps={{

          startAdornment: startAdornment,

          endAdornment: isPassword ? (

            <InputAdornment position="end">

              <IconButton onClick={() => setShowPassword((p) => !p)}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>

            </InputAdornment>

          ) : null,

        }}

        sx={sxStyles}

      />

    </div>

  );

};

export const CustomInput = memo(CustomInputComponent);