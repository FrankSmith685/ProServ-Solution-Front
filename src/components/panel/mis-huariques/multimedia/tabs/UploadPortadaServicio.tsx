import { useState, useMemo, useEffect, useRef } from "react";
import { FaImage, FaTrash, FaExpand, FaCheck } from "react-icons/fa";
import { CustomImageViewer } from "@/components/ui/media/CustomImageViewer";
import { CustomButton } from "@/components/ui/kit/CustomButton";

interface Props {
  portada: File | string | null;
  onChange: (file: File | null) => void;
  maxSizeMB?: number;
}

const WIDTH = 1280;
const HEIGHT = 720;

const UploadPortadaServicio = ({
  portada,
  onChange,
  maxSizeMB = 4,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dragging, setDragging] = useState(false);

  const [meta, setMeta] = useState<{
    size?: string;
    resolution?: string;
    tooSmall?: boolean;
  }>({});

  const preview = useMemo(() => {
    if (!portada) return null;
    if (typeof portada === "string") return portada;
    return URL.createObjectURL(portada);
  }, [portada]);

  useEffect(() => {
    return () => {
      if (portada && typeof portada !== "string") {
        URL.revokeObjectURL(preview as string);
      }
    };
  }, [portada, preview]);

  // lectura metadata ORIGINAL
  const readImageMetaInstant = (file: File) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      setMeta({
        size: `${(file.size / 1024).toFixed(0)} KB`,
        resolution: `${img.width}x${img.height}`,
        tooSmall: img.width < WIDTH || img.height < HEIGHT,
      });

      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  };

  // compresión horizontal portada
  const compressImage = async (file: File): Promise<File> => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    await new Promise(res => (img.onload = res));

    const canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, WIDTH, HEIGHT);

    return new Promise(resolve => {
      canvas.toBlob(blob => {
        if (!blob) return resolve(file);
        resolve(new File([blob], file.name, { type: "image/webp" }));
      }, "image/webp", 0.9);
    });
  };

  const validateFile = (file: File) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (!allowed.includes(file.type)) {
      setError("Formato no permitido.");
      return false;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Máximo ${maxSizeMB}MB.`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    if (!validateFile(file)) return;

    readImageMetaInstant(file);

    setLoading(true);
    setSuccess(false);

    const optimized = await compressImage(file);

    onChange(optimized);

    setLoading(false);
    setSuccess(true);

    setTimeout(() => setSuccess(false), 2000);
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    setMeta({});
    onChange(null);
  };

  return (
    <section className="space-y-5">

      <div>
        <h3 className="text-base font-semibold">Portada</h3>
        <p className="text-xs text-gray-500">
          Imagen horizontal para el perfil del huarique.
        </p>
      </div>

      <div
        onDragOver={e => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`
          bg-white rounded-2xl p-5 space-y-4
          ring-1 ring-gray-200/70 shadow-sm
          transition-all duration-300
          hover:ring-gray-300 hover:shadow-md
          ${dragging ? "ring-primary bg-primary-soft" : ""}
        `}
      >
        <div className="space-y-4">

          {/* Preview */}
          <div
            onClick={!preview ? openFilePicker : () => setViewerOpen(true)}
            className={`
              relative w-full h-48 rounded-xl overflow-hidden
              bg-gray-100 ring-1 shadow-inner
              flex items-center justify-center cursor-pointer
              ${meta.tooSmall ? "ring-amber-400" : "ring-gray-200"}
            `}
          >
            {loading && (
              <div className="absolute inset-0 animate-pulse bg-gray-200" />
            )}

            {preview ? (
              <img src={preview} className="w-full h-full object-contain" />
            ) : (
              <FaImage className="text-gray-400 text-2xl" />
            )}

            {success && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                <FaCheck className="text-green-600 text-xl" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-2">

            <p className="text-sm font-medium">
              {preview ? "Portada cargada (optimizada)" : "Haz clic para subir portada"}
            </p>

            <p className="text-xs text-gray-500">
              PNG/JPG/WEBP • Máx {maxSizeMB}MB
            </p>

            {meta.resolution && (
              <div className="space-y-1">
                <p className="text-xs text-gray-400">
                  Resolución real: {meta.resolution}
                </p>

                <p className="text-xs text-gray-400">
                  Recomendado: {WIDTH}x{HEIGHT}
                </p>

                <p className="text-xs text-gray-400">
                  Tamaño: {meta.size}
                </p>

                {meta.tooSmall && (
                  <p className="text-xs text-amber-600 font-medium">
                    ⚠ Portada pequeña, puede perder calidad.
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-2 flex-wrap">

              <CustomButton
                text={preview ? "Reemplazar" : "Subir portada"}
                variant="secondary-outline"
                size="md"
                fontSize="14px"
                onClick={openFilePicker}
                loading={loading}
              />

              {preview && (
                <>
                  <CustomButton
                    text="Ver"
                    variant="terciary-outline"
                    size="md"
                    fontSize="14px"
                    icon={<FaExpand size={12} />}
                    onClick={() => setViewerOpen(true)}
                  />

                  <CustomButton
                    text="Eliminar"
                    variant="warning-outline"
                    size="md"
                    fontSize="14px"
                    icon={<FaTrash size={12} />}
                    onClick={handleRemove}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-500">
            {error}
          </p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleFile(e.target.files?.[0])}
      />

      <CustomImageViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        startIndex={0}
        images={preview ? [{ src: preview, alt: "Portada del huarique" }] : []}
      />
    </section>
  );
};

export default UploadPortadaServicio;
