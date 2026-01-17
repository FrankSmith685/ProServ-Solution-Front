import { memo, useEffect, useState, useCallback, type FC } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { CustomImageViewerProps } from "@/interfaces/ui/media/ICustomImageViewer";

const CustomImageViewerComponent: FC<CustomImageViewerProps> = ({
  images,
  startIndex = 0,
  isOpen,
  onClose,
}) => {
  const [closing, setClosing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  // =====================
  // Navigation
  // =====================
  const prevImage = useCallback(
    () =>
      setCurrentIndex(prev =>
        prev > 0 ? prev - 1 : images.length - 1
      ),
    [images.length]
  );

  const nextImage = useCallback(
    () =>
      setCurrentIndex(prev =>
        prev < images.length - 1 ? prev + 1 : 0
      ),
    [images.length]
  );

  // =====================
  // Handle open/close UI + animation
  // =====================
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return;
    }

    document.body.style.overflow = "auto";

    // IMPORTANTE → NO setState sincrónico
    const start = setTimeout(() => setClosing(true), 0);
    const end = setTimeout(() => setClosing(false), 300);

    return () => {
      clearTimeout(start);
      clearTimeout(end);
    };
  }, [isOpen]);

  // =====================
  // Sync startIndex -> state
  // =====================
  useEffect(() => {
    if (!isOpen) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentIndex(startIndex);
  }, [startIndex, isOpen]);

  // =====================
  // Keyboard
  // =====================
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, nextImage, prevImage]);

  // Unmount cuando ya cerró totalmente
  if ((!isOpen && !closing) || images.length === 0) return null;

  const { src, alt } = images[currentIndex];

  return (
    <div
      onClick={onClose}
      className={`
        fixed inset-0 z-9999 flex items-center justify-center
        bg-linear-to-br from-black/95 via-black/90 to-black/95
        backdrop-blur-xl
        transition-opacity duration-300
        ${isOpen ? "opacity-100" : "opacity-0"}
      `}
      role="dialog"
      aria-modal="true"
    >
      {/* Close */}
      <button
        onClick={e => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Cerrar visor"
        className="
          absolute top-4 right-4 z-50
          p-3 rounded-full
          bg-white/10 hover:bg-white/20
          border border-white/30 shadow-xl
          transition hover:scale-110
        "
      >
        <FaTimes className="text-white w-6 h-6" />
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={e => {
            e.stopPropagation();
            prevImage();
          }}
          aria-label="Imagen anterior"
          className="
            absolute left-4 sm:left-8 z-50
            p-3 rounded-full
            bg-white/10 hover:bg-white/20
            border border-white/30 shadow-lg text-white
          "
        >
          <FaChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Image */}
      <div
        onClick={e => e.stopPropagation()}
        className="relative flex items-center justify-center w-full h-full px-4 sm:px-10"
      >
        <img
          src={src}
          alt={alt || "Imagen"}
          className="
            rounded-2xl
            shadow-[0_20px_60px_rgba(0,0,0,.35)]
            border border-white/20
            object-contain
            max-w-full
            max-h-[78vh] sm:max-h-[88vh]
            transition-transform duration-500
            hover:scale-[1.02]
          "
        />

        {alt && (
          <div className="absolute bottom-6 w-[90%] sm:w-[70%] bg-linear-to-t from-black/80 to-transparent rounded-xl px-5 py-4">
            <p className="text-sm sm:text-base text-white text-center font-medium leading-snug">
              {alt}
            </p>
          </div>
        )}

        <div
          className="
            absolute -z-10
            w-[80%] h-[80%]
            rounded-full
            bg-linear-to-r
            from-primary/30 via-secondary/30 to-terciary/30
            blur-3xl
            animate-pulse
          "
        />
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={e => {
            e.stopPropagation();
            nextImage();
          }}
          aria-label="Siguiente imagen"
          className="
            absolute right-4 sm:right-8 z-50
            p-3 rounded-full
            bg-white/10 hover:bg-white/20
            border border-white/30 shadow-lg text-white
          "
        >
          <FaChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export const CustomImageViewer = memo(CustomImageViewerComponent);
