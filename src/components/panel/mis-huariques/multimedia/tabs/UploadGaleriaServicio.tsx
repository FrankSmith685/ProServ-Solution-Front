import { useState, useMemo, useEffect, useRef } from "react";
import { FaTrash, FaExpand, FaPlus, FaCheck } from "react-icons/fa";
import { CustomImageViewer } from "@/components/ui/media/CustomImageViewer";
import { CustomButton } from "@/components/ui/kit/CustomButton";

interface Props {
  galeria: (File | string)[];
  onAdd: (file: File) => void;
  onRemove: (index: number) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

const UploadGaleriaServicio = ({
  galeria,
  onAdd,
  onRemove,
  maxFiles = 3,
  maxSizeMB = 4,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [dragging, setDragging] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [successIndex, setSuccessIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // previews seguros
  const previews = useMemo(() => {
    return galeria.map(img =>
      typeof img === "string" ? img : URL.createObjectURL(img)
    );
  }, [galeria]);

  // liberar memoria correctamente
  useEffect(() => {
    return () => {
      previews.forEach(src => {
        if (src.startsWith("blob:")) {
          URL.revokeObjectURL(src);
        }
      });
    };
  }, [previews]);

  // validación tipo logo/portada
  const validateFile = (file: File) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (!allowed.includes(file.type)) {
      setError("Formato no permitido.");
      return false;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Máximo ${maxSizeMB}MB por imagen.`);
      return false;
    }

    if (galeria.length >= maxFiles) {
      setError(`Máximo ${maxFiles} imágenes.`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleAdd = async (file?: File) => {
    if (!file) return;
    if (!validateFile(file)) return;

    const index = galeria.length;

    setLoadingIndex(index);
    setSuccessIndex(null);

    onAdd(file);

    setLoadingIndex(null);
    setSuccessIndex(index);

    setTimeout(() => setSuccessIndex(null), 2000);
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <section className="space-y-5">

      {/* Header */}
      <div>
        <h3 className="text-base font-semibold">Galería del huarique</h3>
        <p className="text-xs text-gray-500">
          Máximo {maxFiles} imágenes del local, comida o ambiente.
        </p>
      </div>

      {/* Card */}
      <div
        onDragOver={e => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault();
          setDragging(false);
          handleAdd(e.dataTransfer.files?.[0]);
        }}
        className={`
          bg-white rounded-2xl p-5
          ring-1 ring-gray-200/70 shadow-sm
          transition-all duration-300
          hover:ring-gray-300 hover:shadow-md
          ${dragging ? "ring-primary bg-primary-soft" : ""}
        `}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {/* imágenes existentes */}
          {previews.map((src, index) => (
            <div key={index}>
              <div
                className="
                  relative group rounded-xl overflow-hidden
                  bg-gray-100 ring-1 ring-gray-200 shadow-inner
                "
              >
                <img
                  src={src}
                  className="
                    w-full h-32 object-cover
                    transition-transform duration-300
                    group-hover:scale-105
                    cursor-pointer
                  "
                  onClick={() => {
                    setViewerIndex(index);
                    setViewerOpen(true);
                  }}
                />

                {/* overlay oscuro */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />

                {/* botón ver */}
                <CustomButton
                  iconOnly
                  icon={<FaExpand size={14} />}
                  ariaLabel="Ver imagen"
                  variant="secondary-outline"
                  className="
                    absolute! top-2 right-2
                    opacity-0 group-hover:opacity-100
                  "
                  onClick={() => {
                    setViewerIndex(index);
                    setViewerOpen(true);
                  }}
                />

                {/* botón eliminar */}
                <CustomButton
                  iconOnly
                  icon={<FaTrash size={14} />}
                  ariaLabel="Eliminar imagen"
                  variant="warning-outline"
                  className="
                    absolute! top-2 left-2
                    opacity-0 group-hover:opacity-100
                  "
                  onClick={() => onRemove(index)}
                />

                {/* loading */}
                {loadingIndex === index && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}

                {/* success */}
                {successIndex === index && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <FaCheck className="text-green-600 text-xl" />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* agregar imagen */}
          {galeria.length < maxFiles && (
            <div
              onClick={openPicker}
              className={`
                h-32 rounded-xl flex flex-col items-center justify-center
                cursor-pointer transition bg-gray-50 ring-1 ring-gray-200
                hover:bg-gray-100
              `}
            >
              <div className="p-3 rounded-full bg-white shadow">
                <FaPlus className="text-gray-600 text-sm" />
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Agregar imagen
              </p>
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-500 mt-3">
            {error}
          </p>
        )}
      </div>

      {/* input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleAdd(e.target.files?.[0])}
      />

      {/* viewer */}
      <CustomImageViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        startIndex={viewerIndex}
        images={previews.map(src => ({
          src,
          alt: "Imagen del huarique",
        }))}
      />
    </section>
  );
};

export default UploadGaleriaServicio;
