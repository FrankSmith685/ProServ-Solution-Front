  import { getHuariqueProgress } from "@/helpers/panel/mi-huarique/getHuariqueProgress";
  import { useAppState } from "@/hooks/useAppState";
  // Barra de progreso del wizard de Huarique
  export const HuariqueWizardProgress = () => {
    const { serviceSteep } = useAppState();
    const progress = getHuariqueProgress(serviceSteep);

    return (
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-xs text-terciary">
            Progreso de publicación
          </span>
          <span className="text-xs font-medium">
            {progress}%
          </span>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-primary rounded transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };
