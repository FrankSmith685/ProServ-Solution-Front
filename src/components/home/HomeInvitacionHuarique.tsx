import { type FC, type JSX } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { FaStore, FaUtensils } from "react-icons/fa";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import type { HomeProps } from "@/interfaces/components/home/IHome";

const HomeInvitacionHuarique: FC<HomeProps> = ({
  variant,
}): JSX.Element => {
  const navigate: NavigateFunction = useNavigate();

  const handlePublicar = (): void => {
    navigate("/panel/publicador");
  };

  const handleExplorar = (): void => {
    navigate("/servicios?m=map");
  };

  return (
    <section
      className="
        w-full bg-white
        py-14 sm:py-20 lg:py-28
      "
    >
      <div className="max-w-5xl mx-auto responsive-padding">
        <div className="text-center space-y-5 sm:space-y-6 text-secondary">

          {/* Title */}
          <h2 className="text-xl sm:text-3xl font-semibold leading-tight">
            {variant === "vendedor" && "Tu huarique puede crecer aquí"}
            {variant === "comensal" && "¿Conoces un huarique increíble?"}
            {variant === "public" && "¿Tienes un huarique?"}
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-secondary max-w-2xl mx-auto leading-relaxed">
            {variant === "vendedor" &&
              "Publica tu huarique, gana visibilidad y sé parte de los primeros negocios en Mappi."}

            {variant === "comensal" &&
              "Ayuda a que más personas descubran comida auténtica compartiendo huariques reales."}

            {variant === "public" &&
              "Únete a la comunidad y permite que más personas descubran tu sazón, tu historia y tu comida auténtica."}
          </p>

          {/* Actions */}
          <div className="
            pt-4
            flex flex-col sm:flex-row
            items-stretch sm:items-center
            justify-center
            gap-3 sm:gap-4
          ">
            {(variant === "public" || variant === "vendedor") && (
              <CustomButton
                type="button"
                variant="secondary"
                size="lg"
                fontSize="14px"
                icon={<FaStore />}
                text="Publicar mi huarique"
                onClick={handlePublicar}
                className="w-full sm:w-auto"
              />
            )}

            {variant === "comensal" && (
              <CustomButton
                type="button"
                variant="secondary"
                size="lg"
                fontSize="14px"
                icon={<FaUtensils />}
                text="Explorar huariques"
                onClick={handleExplorar}
                className="w-full sm:w-auto"
              />
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HomeInvitacionHuarique;
