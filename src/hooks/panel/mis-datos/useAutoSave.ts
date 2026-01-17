import { useEffect } from "react";

interface Props {
  enabled: boolean;
  dirty: boolean;
  onSave: () => void;
}

export const useAutoSave = ({ enabled, dirty, onSave }: Props) => {
  useEffect(() => {
    if (!enabled || !dirty) return;

    const t = setTimeout(onSave, 1200);
    return () => clearTimeout(t);
  }, [enabled, dirty, onSave]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        onSave();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSave]);
};
