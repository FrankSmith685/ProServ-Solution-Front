import { type FC, type JSX } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import {
  FaBullhorn,
  FaStore,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import type { HomeProps } from "@/interfaces/components/home/IHome";

const HomeVisibilidadFutura: FC<HomeProps> = ({
  variant,
}): JSX.Element => {
  const navigate: NavigateFunction = useNavigate();

  const goToRegister = (): void => {
    navigate("/registrar");
  };

  return (
    <section className="w-full bg-white py-12 sm:py-20">
      <div className="max-w-400 mx-auto responsive-padding">
        <div className="max-w-3xl space-y-8">

          {/* Header */}
          <div className="space-y-3">
            <span className="text-[10px] xs:text-xs uppercase tracking-widest text-terciary">
              Próximamente
            </span>

            <h2 className="text-xl xs:text-2xl sm:text-3xl font-semibold text-secondary leading-tight">
              {variant === "comensal" && "Más descubrimiento local"}
              {variant === "public" && "Más visibilidad para huariques locales"}
              {variant === "vendedor" && "Más visibilidad para tu huarique"}
            </h2>

            <p className="text-xs xs:text-sm sm:text-base text-terciary max-w-xl">
              {variant === "comensal" &&
                "Estamos trabajando en nuevas formas de ayudarte a descubrir huariques auténticos cerca de ti."}

              {variant === "public" &&
                "Estamos construyendo herramientas para que los huariques puedan destacar, siempre priorizando lo local y lo auténtico."}

              {variant === "vendedor" &&
                "Muy pronto podrás destacar tu huarique y llegar a más personas sin perder la esencia local."}
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="
              p-4 xs:p-5 sm:p-6
              rounded-xl
              border border-terciary-alpha-12
              space-y-2 sm:space-y-3
            ">
              <FaBullhorn className="text-primary text-lg sm:text-xl" />

              <h3 className="font-medium text-secondary text-sm sm:text-base">
                {variant === "comensal" && "Mejores recomendaciones"}
                {variant !== "comensal" && "Mayor alcance"}
              </h3>

              <p className="text-xs xs:text-sm text-terciary">
                {variant === "comensal" &&
                  "Recomendaciones más precisas basadas en lo que te gusta."}

                {variant !== "comensal" &&
                  "Opciones para destacar huariques cuando la plataforma crezca."}
              </p>
            </div>

            <div className="
              p-4 xs:p-5 sm:p-6
              rounded-xl
              border border-terciary-alpha-12
              space-y-2 sm:space-y-3
            ">
              {variant === "comensal" ? (
                <FaUsers className="text-primary text-lg sm:text-xl" />
              ) : (
                <FaStore className="text-primary text-lg sm:text-xl" />
              )}

              <h3 className="font-medium text-secondary text-sm sm:text-base">
                {variant === "comensal"
                  ? "Pensado para personas reales"
                  : "Pensado para negocios reales"}
              </h3>

              <p className="text-xs xs:text-sm text-terciary">
                {variant === "comensal"
                  ? "Sin rankings falsos ni anuncios que no aportan valor."
                  : "Sin rankings falsos ni anuncios invasivos."}
              </p>
            </div>
          </div>

          {/* CTA */}
          {(variant === "public" || variant === "vendedor") && (
            <div className="pt-2">
              <CustomButton
                type="button"
                variant="primary"
                size="md"
                fontSize="14px"
                icon={<FaChartLine />}
                text="Publicar mi huarique"
                onClick={goToRegister}
              />
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default HomeVisibilidadFutura;
