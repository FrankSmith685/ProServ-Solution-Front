import { type FC, type JSX } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import {
  FaStar,
  FaBoxOpen,
  FaUtensils,
  FaStore,
} from "react-icons/fa";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import type { HomeProps } from "@/interfaces/components/home/IHome";

const HomeHuariquesDestacados: FC<HomeProps> = ({
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
    <section className="w-full bg-gray-50 py-12 sm:py-20">
      <div className="max-w-400 mx-auto responsive-padding">
        <div className="max-w-3xl space-y-8">

          {/* Header */}
          <div className="space-y-3">
            <span className="text-[10px] xs:text-xs uppercase tracking-widest text-terciary">
              Próximamente
            </span>

            <h2 className="
              text-xl xs:text-2xl sm:text-3xl
              font-semibold text-secondary
              flex items-center gap-2
            ">
              <FaStar className="text-primary text-base sm:text-lg" />
              {variant === "vendedor"
                ? "Huariques que la gente busca"
                : "Huariques destacados"}
            </h2>

            <p className="text-xs xs:text-sm sm:text-base text-terciary max-w-xl">
              {variant === "comensal" &&
                "Aquí aparecerán los huariques más recomendados por la comunidad a medida que el proyecto crezca."}

              {variant === "public" &&
                "Cuando empiecen las publicaciones, destacaremos los huariques más recomendados por la comunidad."}

              {variant === "vendedor" &&
                "Estos serán los huariques más recomendados por la comunidad. Una oportunidad para destacar tu negocio."}
            </p>
          </div>

          {/* Empty state */}
          <div className="
            flex flex-col xs:flex-row
            items-start xs:items-center
            gap-4
            p-4 xs:p-5 sm:p-6
            rounded-xl sm:rounded-2xl
            bg-white
            border border-terciary-alpha-12
          ">
            <FaBoxOpen className="text-3xl sm:text-4xl text-primary/60 shrink-0" />

            <div className="space-y-1">
              <h3 className="font-medium text-secondary text-sm sm:text-base">
                {variant === "vendedor"
                  ? "Aún no hay huariques publicados"
                  : "Aún no hay huariques destacados"}
              </h3>

              <p className="text-xs xs:text-sm text-terciary">
                {variant === "vendedor"
                  ? "Publica tu huarique y sé de los primeros en aparecer."
                  : "Sé parte de los primeros en descubrir y recomendar huariques."}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {(variant === "public" || variant === "comensal") && (
              <CustomButton
                type="button"
                variant="secondary"
                fontSize="14px"
                size="md"
                icon={<FaUtensils />}
                text="Explorar huariques"
                onClick={goToExplore}
              />
            )}

            {(variant === "public" || variant === "vendedor") && (
              <CustomButton
                type="button"
                variant="primary"
                fontSize="14px"
                size="md"
                icon={<FaStore />}
                text="Publicar mi huarique"
                onClick={goToRegister}
              />
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HomeHuariquesDestacados;
