import type { FC } from "react";
import { FaSpinner } from "react-icons/fa";

export const CustomLoaderSpinner: FC = () => {
  return (
    <div
      className="
        w-full h-48
        flex items-center justify-center
      "
      aria-busy="true"
      aria-live="polite"
    >
      <FaSpinner className="animate-spin text-primary text-xl" />
    </div>
  );
};
