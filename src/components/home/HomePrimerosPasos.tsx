import type { HomeProps } from "@/interfaces/components/home/IHome";
import { type FC, type JSX } from "react";
import {
  FaUtensils,
  FaStore,
  FaUsers,
  FaMapMarkerAlt,
  FaChartLine,
  FaHeart,
} from "react-icons/fa";


const HomePrimerosPasos: FC<HomeProps> = ({
  variant,
}): JSX.Element => {
  return (
    <section className="w-full bg-white py-18">
      <div className="max-w-400 mx-auto responsive-padding">
        <div className="max-w-3xl mb-10">
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-semibold text-secondary leading-tight">
            Primeros pasos en Mappi
          </h2>
          <p className="text-terciary text-sm mt-2">
            La plataforma recién comienza. Empieza explorando, publicando
            o formando parte de la comunidad.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {(variant === "public" || variant === "comensal") && (
            <div className="p-6 rounded-xl border border-terciary-alpha-12 space-y-4 hover:shadow-soft transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center">
                  <FaUtensils className="text-primary text-lg" />
                </div>
                <h3 className="text-secondary font-semibold sm:text-lg">
                  Descubre comida local
                </h3>
              </div>

              <p className="text-sm text-terciary">
                Explora huariques y lugares reales cerca de ti,
                recomendados por personas de la comunidad.
              </p>

              <ul className="text-sm text-terciary space-y-2">
                <li className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-primary" />
                  Lugares cercanos
                </li>
                <li className="flex items-center gap-2">
                  <FaHeart className="text-primary" />
                  Comida auténtica
                </li>
              </ul>
            </div>
          )}

          {(variant === "public" || variant === "vendedor") && (
            <div className="p-6 rounded-xl border border-terciary-alpha-12 space-y-4 hover:shadow-soft transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center">
                  <FaStore className="text-primary text-lg" />
                </div>
                <h3 className="text-secondary font-semibold sm:text-lg">
                  Publica tu huarique
                </h3>
              </div>

              <p className="text-sm text-terciary">
                Registra tu negocio y sé de los primeros en ganar
                visibilidad dentro de Mappi.
              </p>

              <ul className="text-sm text-terciary space-y-2">
                <li className="flex items-center gap-2">
                  <FaChartLine className="text-primary" />
                  Más visibilidad
                </li>
                <li className="flex items-center gap-2">
                  <FaUsers className="text-primary" />
                  Comunidad local
                </li>
              </ul>
            </div>
          )}

          <div className="p-6 rounded-xl border border-terciary-alpha-12 space-y-4 hover:shadow-soft transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center">
                <FaUsers className="text-primary text-lg" />
              </div>
              <h3 className="text-secondary font-semibold sm:text-lg">
                Comunidad primero
              </h3>
            </div>

            <p className="text-sm text-terciary">
              Recomendaciones reales, personas reales y un proyecto
              que recién comienza.
            </p>

            <ul className="text-sm text-terciary space-y-2">
              <li className="flex items-center gap-2">
                <FaHeart className="text-primary" />
                Opiniones reales
              </li>
              <li className="flex items-center gap-2">
                <FaUsers className="text-primary" />
                Comunidad activa
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HomePrimerosPasos;
