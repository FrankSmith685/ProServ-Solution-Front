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
  inputProps,
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
    sm: { height: 36, padding: 0 },
    md: { height: 44, padding: 0 },
    lg: { height: 52, padding: 0 },
  };

  const { height, padding } = sizeConfig[size];

  const adornmentSize = {
    sm: 36,
    md: 44,
    lg: 52,
  };


  const fontSizeBySize = {
    sm: "13px",
    md: "14px",
    lg: "15px",
  };

  const sxStyles = useMemo(() => {


    return {

      backgroundColor: "var(--color-surface)",

      "& .MuiOutlinedInput-root": {
        // backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#fff",
        backgroundColor: "var(--color-surface)",
        boxSizing: "border-box",
        height: multiline ? "auto" : height,
        padding: 0,

        ...(multiline
          ? {}
          : {
              
              "@media (max-width:390px)": {
                height: 40
              },
              "@media (max-width:600px)": {
                height:
                  size === "lg"
                    ? 44
                    : size === "md"
                    ? 40
                    : 40,
              },
            }),

        "& fieldset": {
          borderColor: inputVariantStyles[variant].border,
        },

        "&:hover fieldset": {
          borderColor: inputVariantStyles[variant].focusBorder,
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
                : icon
                ? `${padding} 16px ${padding} ${0}px`
                : `${padding} 16px`,
              lineHeight: "1.2",
            }),

        fontSize: fontSize ?? fontSizeBySize[size],
        "@media (max-width:600px)": {
          fontSize:
            size === "lg"
              ? "14px"
              : size === "md"
              ? "13px"
              : "12px",
        },
        fontFamily: fontFamily ?? "Arial",
        color: "var(--color-text)",
      },

      "& .MuiInputLabel-root": {
        fontFamily: fontFamily ?? "Arial",
        transition: "color 0.2s ease, transform 0.2s ease",
        // padding: icon ? "0 16px" : "0px",
        fontSize: "16px",

        "@media (max-width:600px)": {
          fontSize: "15px",
        },
        "@media (max-width:390px)": {
          fontSize: "14px",
        },
        color: "var(--color-text-muted)",
          left: icon ? ` ${value ? '0px' : '28px'}` : "0px",
        
      },

      "& .MuiInputLabel-root.MuiInputLabel-shrink": {
        padding: 0,
        top: 0,
        transform: "translate(14px, -6px) scale(0.75)",
      },

      "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
        top: multiline
          ? "14px" // 👈 clave: posición natural dentro del textarea
          : error || helperText
          ? "35%"
          : "50%",
        transform: multiline
          ? "translate(14px, 0) scale(1)" // 👈 sin -100%
          : "translate(14px, -50%) scale(1)",
      },

      "& .MuiOutlinedInput-root:has(input:placeholder-shown) .MuiInputLabel-root": {
        padding: icon ? "0 16px" : "0px",
      },

      "& .MuiOutlinedInput-root:not(:has(input:placeholder-shown)) .MuiInputLabel-root": {
        padding: 0,
      },

      "& .MuiInputLabel-root.Mui-focused": {
        // color: isDark
        //   ? "#f97316"
        //   : inputVariantStyles[variant].focusBorder,
        color: inputVariantStyles[variant].focusBorder,
        left: icon ? `0px` : "0px",
      },

    };

  }, [
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
          width: adornmentSize[size],

          
          
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: '0px',
          // left: icon ? `0px` : "14px",
        }}
      >
        {isSearch ? (
          <Search sx={{ 
            fontSize: 20,
              "@media (max-width:600px)": {
                fontSize: 18,
              },
              "@media (max-width:390px)": {
                fontSize: 17,
              },
        color: "var(--color-text-muted)" }} />
        ) : (
          icon
        )}
      </InputAdornment>
    );
  }, [hasStartAdornment, isSearch, icon]);

  const [focused, setFocused] = useState<boolean>(false);
  const shouldShrink = isDate || focused || Boolean(value);

  return (
    <div
      style={{
        position: "relative",
        width: fullWidth ? "100%" : undefined,
      }}
      className={fullWidth ? "w-full" : ""}
    >
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
        InputLabelProps={{ shrink: shouldShrink }}
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
              <IconButton
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? (
                  <VisibilityOff className="text-md! sm:text-xl! lg:text-2xl!" style={{ color: "var(--color-text-muted)" }}/>
                ) : (
                  <Visibility className=" text-md! sm:text-xl! lg:text-2xl!" style={{ color: "var(--color-text-muted)" }}/>
                )}
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