import { type FC } from "react";
import { CustomModal } from "@/components/ui/overlay/CustomModal";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { FaUserTie, FaBuilding } from "react-icons/fa";

type Props = {
  open: boolean;
  loading?: boolean;
  onSelect: (tipo: "independiente" | "empresa") => void;
};

export const PanelStartSelector: FC<Props> = ({
  open,
  loading = false,
  onSelect,
}) => {
  return (
    <CustomModal
      isOpen={open}
      onClose={() => {}}
      width="500px"
      allowBackdropClose={false}
      closeButton={false}
      title=""
      mainClassName="flex items-center justify-center"
      containerClassName="w-full max-w-lg mx-auto"
    >
      <div className="relative flex flex-col gap-8 w-full">

        {/* Header */}
        <div className="flex flex-col gap-3 text-center">
          <h2 className="text-3xl font-bold text-gray-900 leading-tight">
            ¿Cómo quieres iniciar tu Huarique?
          </h2>

          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Define si publicarás como independiente o representando una empresa.
            Esto configurará tu panel inicial.
          </p>
        </div>

        {/* Opciones */}
        <div className="flex flex-col gap-4 mt-2">

          <CustomButton
            fullWidth
            size="lg"
            variant="primary"
            text="Soy Independiente"
            icon={<FaUserTie />}
            loading={loading}
            onClick={() => onSelect("independiente")}
            fontSize="16px"
          />

          <CustomButton
            fullWidth
            size="lg"
            variant="secondary"
            text="Soy Empresa"
            icon={<FaBuilding />}
            loading={loading}
            onClick={() => onSelect("empresa")}
            fontSize="16px"
          />

        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Podrás cambiar esta configuración más adelante desde tu panel.
          </p>
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <span className="text-sm font-medium text-gray-700">
              Configurando tu panel...
            </span>
          </div>
        )}
      </div>
    </CustomModal>
  );
};
