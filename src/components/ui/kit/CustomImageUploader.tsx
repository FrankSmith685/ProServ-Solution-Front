/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { memo, useCallback, useMemo, useRef, useState } from "react";
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Upload,
  Link as LinkIcon,
  X,
  Image as ImageIcon,
  Eye, // ✅ NEW
} from "lucide-react";

import { CustomInput } from "@/components/ui/kit/CustomInput";
import { inputVariantStyles } from "@/shared/design/inputVariants";
import type { BaseVariant } from "@/shared/design/types";

interface CustomImageUploaderProps {
  value: string | null;
  onChange: (url: string | null) => void;
  onUpload?: (file: File) => Promise<string>;

  label?: string;
  variant?: BaseVariant;

  maxSizeMB?: number;
  accept?: string;

  // ✅ NEW (viewer)
  onPreview?: () => void;
}

const CustomImageUploaderComponent = ({
  value,
  onChange,
  onUpload,
  onPreview, // ✅

  label = "Imagen",
  variant = "primary",
  maxSizeMB = 10,
  accept = "image/*",
}: CustomImageUploaderProps) => {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  // =========================
  // VALIDACIÓN
  // =========================
  const validateFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return "El archivo debe ser una imagen";
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      return `Máximo ${maxSizeMB}MB`;
    }

    return "";
  };

  // =========================
  // FILE HANDLER
  // =========================
  const handleFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);

      if (validationError) {
        setError(validationError);
        return;
      }

      setError("");

      if (onUpload) {
        try {
          setUploading(true);
          const url = await onUpload(file);
          onChange(url);
        } catch (e) {
          setError("Error al subir imagen");
        } finally {
          setUploading(false);
        }
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          onChange(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onUpload, onChange]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  // =========================
  // STYLES
  // =========================
  const sxDropzone = useMemo(() => {
    return {
      border: "1px dashed",
      borderColor: drag
        ? "hsl(var(--color-primary))"
        : "hsl(var(--color-border))",

      backgroundColor: drag
        ? "hsl(var(--color-primary) / 0.08)"
        : "var(--color-surface-soft)",

      borderRadius: "12px",
      padding: "24px",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.2s ease",

      "&:hover": {
        borderColor: inputVariantStyles[variant].focusBorder,
        backgroundColor: "hsl(var(--color-primary) / 0.05)",
      },
    };
  }, [drag, variant]);

  // =========================
  // RENDER
  // =========================
  return (
    <Box
    >
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography fontSize={13} fontWeight={600} sx={{ color: "var(--color-text)" }}>
          {label}
        </Typography>

        <ToggleButtonGroup
          size="small"
          value={mode}
          exclusive
          onChange={(_, v) => v && setMode(v)}
          sx={{
            background: "var(--color-surface-soft)",
            borderRadius: "8px",
            border: "1px solid hsl(var(--color-border))",
          }}
        >
          <ToggleButton value="upload">
            <Upload size={14} style={{ color: "var(--color-text-muted)" }} />
          </ToggleButton>

          <ToggleButton value="url">
            <LinkIcon size={14} style={{ color: "var(--color-text-muted)" }} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* PREVIEW */}
      {typeof value === "string" && value.trim() !== "" && (
        <Box
          position="relative"
          mb={2}
          sx={{
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid hsl(var(--color-border))",
            cursor: onPreview ? "pointer" : "default",
          }}
          onClick={() => onPreview?.()} // ✅ abrir viewer
        >
          <img
            src={value || undefined}
            alt="preview"
            style={{
              width: "100%",
              maxHeight: "220px",
              objectFit: "contain",
              background: "var(--color-surface-soft)",
              transition: "0.3s",
            }}
          />

          {/* 👁️ ICONO SIEMPRE */}
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(6px)",
              borderRadius: "8px",
              padding: "6px",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Eye size={16} color="#fff" />
          </Box>

          {/* ❌ DELETE */}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onChange(null as any);
            }}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 10, // 🔥 CLAVE
              background: "rgba(0,0,0,0.6)",
              color: "#fff",
              "&:hover": {
                background: "hsl(var(--color-error))",
              },
            }}
          >
            <X size={14} />
          </IconButton>

          {/* 🔥 OVERLAY HOVER */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              opacity: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "0.3s",

              pointerEvents: "none", // 🔥 CLAVE

              "&:hover": {
                opacity: 1,
              },

              "& > *": {
                pointerEvents: "auto", // 🔥 permite interacción interna
              },
            }}
          >
            <Typography
              fontSize={12}
              sx={{ color: "#fff", display: "flex", gap: "6px", alignItems: "center" }}
            >
              <Eye size={14} />
              Ver imagen
            </Typography>
          </Box>
        </Box>
      )}

      {/* UPLOAD */}
      {mode === "upload" && (
        <Box
          sx={sxDropzone}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            hidden
            accept={accept}
            onChange={handleInputChange}
          />

          {uploading ? (
            <Box display="flex" flexDirection="column" gap={1} alignItems="center">
              <CircularProgress size={28} />
              <Typography fontSize={13} sx={{ color: "var(--color-text)" }}>
                Subiendo...
              </Typography>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" gap={1} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  background: "hsl(var(--color-primary) / 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ImageIcon size={18} color="hsl(var(--color-primary))" />
              </Box>

              <Typography fontSize={14} fontWeight={600}>
                Click o arrastra imagen
              </Typography>

              <Typography fontSize={12} sx={{ color: "var(--color-text-muted)" }}>
                Máx {maxSizeMB}MB
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* URL */}
      {mode === "url" && (
        <CustomInput
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://ejemplo.com/imagen.jpg"
          fullWidth
          size="md"
          variant={variant}
        />
      )}

      {/* ERROR */}
      {error && (
        <Typography mt={1} fontSize={12} sx={{ color: "hsl(var(--color-error))" }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export const CustomImageUploader = memo(CustomImageUploaderComponent);