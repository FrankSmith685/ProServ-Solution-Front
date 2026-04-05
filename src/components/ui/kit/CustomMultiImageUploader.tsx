/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useCallback, useMemo, useRef, useState } from "react";
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import {
  Upload,
  Link as LinkIcon,
  X,
  Image as ImageIcon,
  Eye,
  Plus,
} from "lucide-react";

import { CustomInput } from "@/components/ui/kit/CustomInput";
import { inputVariantStyles } from "@/shared/design/inputVariants";
import type { BaseVariant } from "@/shared/design/types";

export interface CustomMultiImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;

  label?: string;
  variant?: BaseVariant;
  maxSizeMB?: number;
  accept?: string;
  maxImages?: number;

  onPreview?: (index: number) => void;

  onFilesSelected?: (files: File[], previews: string[]) => void;
  onAddUrl?: (url: string) => void;
  onRemove?: (index: number, url: string) => void;
}

const CustomMultiImageUploaderComponent = ({
  value,
  onChange,
  onPreview,
  onFilesSelected,
  onAddUrl,
  onRemove,
  label = "Imágenes",
  variant = "primary",
  maxSizeMB = 10,
  accept = "image/*",
  maxImages = 10,
}: CustomMultiImageUploaderProps) => {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState<boolean>(false);
  const [drag, setDrag] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [urlValue, setUrlValue] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  const images = Array.isArray(value) ? value.filter(Boolean) : [];
  const reachedLimit = images.length >= maxImages;

  const validateFile = (file: File): string => {
    if (!file.type.startsWith("image/")) {
      return "El archivo debe ser una imagen";
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      return `Máximo ${maxSizeMB}MB por imagen`;
    }

    return "";
  };

  const readFilesAsPreview = async (files: File[]): Promise<string[]> => {
    return Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Error leyendo archivo"));

            reader.readAsDataURL(file);
          })
      )
    );
  };

  const handleFiles = useCallback(
    async (filesInput: FileList | File[]) => {
      const fileArray = Array.from(filesInput);

      if (!fileArray.length) return;

      const availableSlots = maxImages - images.length;

      if (availableSlots <= 0) {
        setError(`Solo puedes agregar hasta ${maxImages} imágenes`);
        return;
      }

      const filesToProcess = fileArray.slice(0, availableSlots);

      const validationError = filesToProcess
        .map(validateFile)
        .find((msg) => msg !== "");

      if (validationError) {
        setError(validationError);
        return;
      }

      try {
        setError("");
        setUploading(true);

        const previews = await readFilesAsPreview(filesToProcess);
        const nextImages = [...images, ...previews];

        onChange(nextImages);
        onFilesSelected?.(filesToProcess, previews);
      } catch {
        setError("Error al procesar una o más imágenes");
      } finally {
        setUploading(false);
      }
    },
    [images, maxImages, onChange, onFilesSelected]
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDrag(false);

    if (reachedLimit) {
      setError(`Solo puedes agregar hasta ${maxImages} imágenes`);
      return;
    }

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles?.length) {
      void handleFiles(droppedFiles);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const selectedFiles = e.target.files;
    if (selectedFiles?.length) {
      void handleFiles(selectedFiles);
    }

    e.target.value = "";
  };

  const handleAddUrl = (): void => {
    const cleanUrl = urlValue.trim();

    if (!cleanUrl) {
      setError("Ingresa una URL válida");
      return;
    }

    if (images.includes(cleanUrl)) {
      setError("La imagen ya fue agregada");
      return;
    }

    if (images.length >= maxImages) {
      setError(`Solo puedes agregar hasta ${maxImages} imágenes`);
      return;
    }

    setError("");
    onChange([...images, cleanUrl]);
    onAddUrl?.(cleanUrl);
    setUrlValue("");
  };

  const handleRemove = (index: number): void => {
    const removedUrl = images[index];
    const nextImages = images.filter((_, i) => i !== index);

    onChange(nextImages);
    onRemove?.(index, removedUrl);
  };

  const sxDropzone = useMemo(() => {
    return {
      border: "1px dashed",
      borderColor: drag
        ? "hsl(var(--color-primary))"
        : "hsl(var(--color-border))",
      backgroundColor: drag
        ? "hsl(var(--color-primary) / 0.08)"
        : "var(--color-surface-soft)",
      borderRadius: "14px",
      padding: "24px",
      textAlign: "center",
      cursor: reachedLimit ? "not-allowed" : "pointer",
      transition: "all 0.2s ease",
      opacity: reachedLimit ? 0.65 : 1,
      "&:hover": {
        borderColor: reachedLimit
          ? "hsl(var(--color-border))"
          : inputVariantStyles[variant].focusBorder,
        backgroundColor: reachedLimit
          ? "var(--color-surface-soft)"
          : "hsl(var(--color-primary) / 0.05)",
      },
    };
  }, [drag, reachedLimit, variant]);

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        mb={1.5}
        flexWrap="wrap"
      >
        <Box>
          <Typography
            fontSize={13}
            fontWeight={600}
            sx={{ color: "var(--color-text)" }}
          >
            {label}
          </Typography>

          <Typography fontSize={11} sx={{ color: "var(--color-text-muted)" }}>
            {images.length} / {maxImages} imágenes
          </Typography>
        </Box>

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

      {images.length > 0 && (
        <Box
          mb={2}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
            },
            gap: 1.5,
          }}
        >
          {images.map((image, index) => (
            <Box
              key={`${image}-${index}`}
              sx={{
                position: "relative",
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid hsl(var(--color-border))",
                background: "var(--color-surface-soft)",
                aspectRatio: "1 / 1",
                cursor: onPreview ? "pointer" : "default",
              }}
              onClick={() => onPreview?.(index)}
            >
              <img
                src={image}
                alt={`preview-${index}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  background: "rgba(0,0,0,0.6)",
                  backdropFilter: "blur(6px)",
                  borderRadius: "8px",
                  padding: "6px",
                  border: "1px solid rgba(255,255,255,0.16)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Eye size={15} color="#fff" />
              </Box>

              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
                size="small"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 2,
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  "&:hover": {
                    background: "hsl(var(--color-error))",
                  },
                }}
              >
                <X size={14} />
              </IconButton>

              <Box
                sx={{
                  position: "absolute",
                  left: 8,
                  bottom: 8,
                  background: "rgba(0,0,0,0.58)",
                  color: "#fff",
                  px: 1,
                  py: 0.4,
                  borderRadius: "999px",
                  fontSize: "11px",
                  fontWeight: 600,
                  backdropFilter: "blur(6px)",
                }}
              >
                {index + 1}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {mode === "upload" && (
        <Box
          sx={sxDropzone}
          onDragOver={(e) => {
            e.preventDefault();
            if (!reachedLimit) setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          onClick={() => {
            if (!reachedLimit) inputRef.current?.click();
          }}
        >
          <input
            ref={inputRef}
            type="file"
            hidden
            multiple
            accept={accept}
            onChange={handleInputChange}
          />

          {uploading ? (
            <Box display="flex" flexDirection="column" gap={1} alignItems="center">
              <CircularProgress size={28} />
              <Typography fontSize={13} sx={{ color: "var(--color-text)" }}>
                Procesando imágenes...
              </Typography>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" gap={1} alignItems="center">
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "12px",
                  background: "hsl(var(--color-primary) / 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ImageIcon size={18} color="hsl(var(--color-primary))" />
              </Box>

              <Typography fontSize={14} fontWeight={600}>
                {reachedLimit
                  ? "Límite de imágenes alcanzado"
                  : "Click o arrastra una o varias imágenes"}
              </Typography>

              <Typography fontSize={12} sx={{ color: "var(--color-text-muted)" }}>
                Máx {maxSizeMB}MB por imagen · hasta {maxImages} imágenes
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {mode === "url" && (
        <Box display="flex" gap={1} alignItems="stretch" flexWrap="wrap">
          <Box flex={1} minWidth={240}>
            <CustomInput
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              fullWidth
              size="md"
              variant={variant}
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleAddUrl}
            disabled={reachedLimit}
            sx={{
              minHeight: "44px",
              minWidth: "44px",
              borderRadius: "10px",
              textTransform: "none",
              boxShadow: "none",
              background: "hsl(var(--color-primary))",
              "&:hover": {
                background: "hsl(var(--color-primary))",
                opacity: 0.92,
                boxShadow: "none",
              },
              "&:disabled": {
                opacity: 0.6,
                color: "#fff",
              },
            }}
          >
            <Box display="flex" alignItems="center" gap={0.8}>
              <Plus size={15} />
              <span>Agregar</span>
            </Box>
          </Button>
        </Box>
      )}

      {error && (
        <Typography mt={1} fontSize={12} sx={{ color: "hsl(var(--color-error))" }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export const CustomMultiImageUploader = memo(
  CustomMultiImageUploaderComponent
);