import { type FC, type JSX } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import {
  FaCommentDots,
  FaUtensils,
  FaStore,
} from "react-icons/fa";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import type { HomeProps } from "@/interfaces/components/home/IHome";


const HomeHuariquesOpiniones: FC<HomeProps> = ({
  variant,
}): JSX.Element => {
  const navigate: NavigateFunction = useNavigate();

  const goToExplore = (): void => {
    navigate("/servicios?m=map");
  };

  const goToRegister = (): void => {
    navigate("/registrar");
  };

  return (
    <section className="
      relative w-full
      bg-primary-gradient
      flex items-center
      py-12 sm:py-20 lg:py-28
    ">
      <div className="max-w-400 mx-auto responsive-padding w-full">
        <div className="max-w-3xl text-white space-y-8 sm:space-y-10">

          {/* Header */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-white/80">
              Comunidad
            </span>

            <h2 className="flex items-center gap-2 text-xl sm:text-3xl font-semibold">
              <FaCommentDots className="text-lg sm:text-xl" />
              {variant === "vendedor"
                ? "Lo que opinarán tus clientes"
                : "Opiniones reales"}
            </h2>

            <p className="text-sm sm:text-base text-white/90 max-w-xl leading-relaxed">
              {variant === "comensal" &&
                "Las experiencias de otros comensales te ayudarán a descubrir huariques auténticos."}

              {variant === "public" &&
                "Muy pronto la comunidad compartirá experiencias reales sobre los huariques."}

              {variant === "vendedor" &&
                "Las opiniones reales ayudarán a que tu huarique gane confianza y visibilidad."}
            </p>
          </div>

          {/* Card */}
          <div className="
            flex flex-col sm:flex-row
            items-start sm:items-center
            gap-4 sm:gap-6
            p-5 sm:p-6
            rounded-2xl
            bg-black/25
            backdrop-blur-sm
          ">
            <FaCommentDots className="text-3xl sm:text-4xl text-white/70 shrink-0" />

            <div className="space-y-1">
              <h3 className="font-medium text-sm sm:text-base">
                Aún no hay opiniones publicadas
              </h3>

              <p className="text-xs sm:text-sm text-white/80">
                {variant === "vendedor"
                  ? "Publica tu huarique y empieza a recibir opiniones reales."
                  : "Cuando la comunidad crezca, aquí verás experiencias reales."}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {(variant === "public" || variant === "comensal") && (
              <CustomButton
                type="button"
                variant="secondary"
                size="md"
                fontSize="14px"
                icon={<FaUtensils />}
                text="Explorar huariques"
                onClick={goToExplore}
                className="w-full sm:w-auto"
              />
            )}

            {(variant === "public" || variant === "vendedor") && (
              <CustomButton
                type="button"
                variant="primary-outline-white"
                size="md"
                fontSize="14px"
                icon={<FaStore />}
                text="Publicar mi huarique"
                onClick={goToRegister}
                className="w-full sm:w-auto"
              />
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HomeHuariquesOpiniones;
