import { FaCheck } from "react-icons/fa";
import type { FC } from "react";
import type {
  CustomStepProgressBarProps,
} from "@/interfaces/ui/navigation/ICustomStepProgressBar";

export const CustomStepProgressBar: FC<CustomStepProgressBarProps> = ({
  steps,
  currentPath,
  maxStep,
}) => {
  const currentIndex = steps.findIndex((s) => s.path === currentPath);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex w-full justify-between items-center relative">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <div
              key={step.path}
              className="flex-1 flex flex-col items-center relative z-10"
            >
              {/* Línea conectora */}
              {index !== steps.length - 1 && (
                <div className="absolute top-4.5 left-1/2 w-full h-0.5 z-0">
                  <div
                    className={`h-full transition-all duration-300 
                      ${index < currentIndex ? "bg-primary" : "bg-gray-300"}`}
                  />
                </div>
              )}

              {/* Círculo */}
              <div
                className={`
                  z-10 w-7 h-7 flex justify-center items-center rounded-full border-2 text-sm font-semibold
                  transition-all duration-300
                  ${index + 1 <= maxStep && "cursor-default"}
                  ${
                    isCompleted
                      ? "bg-primary text-white border-primary"
                      : isActive
                      ? "bg-white text-primary border-primary animate-pulse"
                      : "bg-white text-gray-400 border-gray-300"
                  }
                `}
              >
                {isCompleted ? <FaCheck className="text-xs" /> : index + 1}
              </div>

              {/* Label */}
              <span
                className={`
                  mt-1 text-xs text-center transition-colors duration-200
                  ${index + 1 <= maxStep && "cursor-default"}
                  ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-gray-500"
                  }
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
