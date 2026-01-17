import { FaUtensils, FaStore } from "react-icons/fa";
import type { FC, JSX } from "react";

import { CustomModal } from "@/components/ui/overlay/CustomModal";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import type { UserTypeModalProps } from "@/interfaces/ui/overlay/ICustomUserTypeModal";
import { CustomImage } from "../ui/media/CustomImage";

const UserTypeModal: FC<UserTypeModalProps> = ({
  isOpen,
  onClose,
  onSelectType,
}): JSX.Element => {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      width="480px"
      closeButton={false}
      allowBackdropClose={false}
      footer={null}
      header={null}
    >
      <div className="flex flex-col items-center text-center gap-4 py-4">

        {/* Logo */}
        <div className="w-32 h-20 sm:w-40 sm:h-24 flex items-center justify-center">
          <CustomImage
            name="logo_03"
            alt="mappi-logo"
            className="object-contain scale-110"
          />
        </div>

        {/* Título */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800">
          ¡Bienvenido a <span className="text-primary">Mappi</span>!
        </h2>

        {/* Descripción */}
        <p className="text-sm sm:text-base text-gray-700 max-w-sm leading-relaxed">
          Conecta con los mejores huariques y emprendedores de tu zona.
          Elige tu rol para comenzar.
        </p>

        {/* Botones */}
        <div className="flex flex-col gap-3 w-full mt-2">
          <CustomButton
            text="Soy Comensal"
            fullWidth
            variant="primary"
            icon={<FaUtensils size={18} />}
            onClick={() => onSelectType("comensal")}
          />

          <CustomButton
            text="Soy Emprendedor"
            fullWidth
            variant="secondary-outline"
            icon={<FaStore size={18} />}
            onClick={() => onSelectType("vendedor")}
          />
        </div>

        {/* Separador */}
        <div className="w-full flex items-center my-2">
          <div className="flex-1 border-t border-gray-300" />
          <span className="mx-3 text-gray-400 text-sm">o</span>
          <div className="flex-1 border-t border-gray-300" />
        </div>

        {/* Frase */}
        <p className="text-xs sm:text-sm text-gray-500 italic max-w-sm">
          “Descubre sabores, conecta con emprendedores y vive nuevas experiencias.”
        </p>

        {/* Footer */}
        <div className="mt-4 text-[11px] sm:text-xs text-gray-400">
          © {new Date().getFullYear()} <strong>Mappi</strong>. Todos los derechos reservados.
        </div>

      </div>
    </CustomModal>
  );
};

export default UserTypeModal;
