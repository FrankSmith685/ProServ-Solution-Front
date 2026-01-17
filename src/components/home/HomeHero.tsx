import { type FC, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUtensils,
  FaStore,
  FaMapMarkedAlt,
  FaChartLine,
  FaUsers,
  FaSeedling,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import type { HomeProps } from "@/interfaces/components/home/IHome";


const backgroundStyle: CSSProperties = {
  backgroundImage: "url('/images/hero-food.png')",
};

const HomeHero: FC<HomeProps> = ({ variant }) => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={backgroundStyle}
      />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative w-full max-w-400 mx-auto responsive-padding">
        <div className="max-w-xl flex flex-col pt-4 xs:pt-0 gap-2 xs:gap-4">

          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-white flex items-center gap-2">
              <FaSeedling className="text-green-400" />
              Proyecto en crecimiento
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-white flex items-center gap-2">
              <FaUsers className="text-blue-300" />
              Comunidad primero
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-white flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-300" />
              Huariques reales
            </span>
          </div>

          {variant === "public" && (
            <>
              <h1 className="font-raphtalia text-3xl xs:text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
                Descubre y publica
                <br />
                huariques reales
              </h1>

              <p className="text-white/90 text-sm sm:text-base bg-black/40 p-2 rounded-lg backdrop-blur-sm">
                Mappi está comenzando. Descubre comida local auténtica
                o publica tu huarique y crece junto a la comunidad.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <CustomButton
                  icon={<FaMapMarkedAlt />}
                  text="Explorar huariques"
                  variant="secondary"
                  size="lg"
                  fontSize="14px"
                  onClick={() => navigate("/servicios?m=map")}
                />
                <CustomButton
                  icon={<FaStore />}
                  text="Publicar mi huarique"
                  variant="primary"
                  size="lg"
                  fontSize="14px"
                  onClick={() => navigate("/registrar")}
                />
              </div>

              <p className="text-xs text-white/70">
                Sé de los primeros en formar parte del proyecto.
              </p>
            </>
          )}

          {variant === "comensal" && (
            <>
              <h1 className="font-raphtalia text-3xl xs:text-4xl sm:text-5xl text-white leading-tight">
                Esto recién comienza
                <br />
                descubre huariques
              </h1>

              <p className="text-white/90 text-sm sm:text-base bg-black/40 p-2 rounded-lg backdrop-blur-sm">
                Todavía no sigues huariques. Explora comida real,
                lugares auténticos y nuevas recomendaciones cada semana.
              </p>

              <ul className="text-white/80 text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-400" />
                  Recomendaciones reales
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-400" />
                  Comida local auténtica
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-400" />
                  Sin rankings falsos
                </li>
              </ul>

              <div className="flex gap-3 pt-2">
                <CustomButton
                  icon={<FaUtensils />}
                  text="Explorar huariques"
                  variant="secondary"
                  size="lg"
                  fontSize="14px"
                  onClick={() => navigate("/servicios?m=map")}
                />
              </div>
            </>
          )}

          {variant === "vendedor" && (
            <>
              <h1 className="font-raphtalia text-3xl xs:text-4xl sm:text-5xl text-white leading-tight">
                Tu huarique
                <br />
                aún no está publicado
              </h1>

              <p className="text-white/90 text-xs xs:text-sm sm:text-base bg-black/40 p-2 rounded-lg backdrop-blur-sm">
                El proyecto está comenzando. Publica tu huarique,
                gana visibilidad y conecta con nuevos clientes cerca de ti.
              </p>

              <div className="flex gap-3 text-white/80 text-sm">
                <div className="bg-white/10 px-4 py-2 rounded-lg flex items-center gap-2">
                  <FaChartLine className="text-green-400" />
                  Más visibilidad
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-300" />
                  Clientes cercanos
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <CustomButton
                  icon={<FaChartLine />}
                  text="Crear mi huarique"
                  variant="primary"
                  size="lg"
                  fontSize="14px"
                  onClick={() => navigate("/panel")}
                />
                <CustomButton
                  icon={<FaUtensils />}
                  text="Ver huariques"
                  variant="secondary"
                  size="lg"
                  fontSize="14px"
                  onClick={() => navigate("/servicios?m=map")}
                />
              </div>

              <p className="text-xs text-white/70">
                Empieza hoy y sé parte de los primeros negocios en Mappi.
              </p>
            </>
          )}

        </div>
      </div>
    </section>
  );
};

export default HomeHero;
