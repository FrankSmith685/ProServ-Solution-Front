import { type FC } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import {
  FaUtensils,
  FaIceCream,
  FaGlassCheers,
  FaHamburger,
  FaCompass,
  FaStore,
} from "react-icons/fa";
import type { CategoriaUI } from "@/interfaces/components/home/IHomeCategoria";
import type { HomeProps } from "@/interfaces/components/home/IHome";

const CATEGORIAS: CategoriaUI[] = [
  {
    key: "restaurantes",
    label: "Restaurantes",
    icon: <FaUtensils className="text-primary text-xl sm:text-3xl" />,
  },
  {
    key: "comida-al-paso",
    label: "Comida al paso",
    icon: <FaHamburger className="text-primary text-xl sm:text-3xl" />,
  },
  {
    key: "postres-cafe",
    label: "Postres y café",
    icon: <FaIceCream className="text-primary text-xl sm:text-3xl" />,
  },
  {
    key: "bar",
    label: "Bar",
    icon: <FaGlassCheers className="text-primary text-xl sm:text-3xl" />,
  },
];

export const HomeCategorias: FC<HomeProps> = ({ variant }) => {
  const navigate: NavigateFunction = useNavigate();

  const handleClick = (categoriaKey: string): void => {
    navigate(`/servicios?m=map&categoria=${categoriaKey}`);
  };

  const title =
    variant === "vendedor"
      ? "Explora lo que buscan los comensales"
      : "¿Qué te provoca hoy?";

  const subtitle =
    variant === "vendedor"
      ? "Conoce las categorías más visitadas en Mappi"
      : "Explora huariques por tipo de comida";

  return (
    <section className="w-full bg-terciary-soft py-12 sm:py-20">
      <div className="max-w-400 mx-auto responsive-padding space-y-10 sm:space-y-12">

        {/* Header */}
        <div className="max-w-xl space-y-2">
          <span className="text-[10px] xs:text-xs uppercase tracking-widest text-terciary flex items-center gap-2">
            <FaCompass />
            Explora por categoría
          </span>

          <h2 className="text-xl xs:text-2xl sm:text-3xl font-semibold text-secondary">
            {title}
          </h2>

          <p className="text-xs xs:text-sm text-terciary">
            {subtitle}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 xs:gap-5 sm:grid-cols-4 sm:gap-6">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleClick(cat.key)}
              className="
                group
                flex flex-col items-center justify-center
                gap-2 sm:gap-3
                p-4 xs:p-5 sm:p-6
                rounded-xl sm:rounded-2xl
                bg-white
                border border-terciary-alpha-12
                transition-all
                hover:border-primary-alpha-16
                hover:-translate-y-1
                hover:shadow-lg
              "
            >
              {/* Icon */}
              <div
                className="
                  w-12 h-12 xs:w-13 xs:h-13 sm:w-14 sm:h-14
                  rounded-full
                  bg-primary-soft
                  flex items-center justify-center
                  transition-transform
                  group-hover:scale-110
                "
              >
                {cat.icon}
              </div>

              {/* Label */}
              <span className="text-xs xs:text-sm sm:text-base font-medium text-secondary text-center">
                {cat.label}
              </span>

              {/* CTA */}
              <span className="text-[10px] text-xs text-terciary flex items-center gap-1">
                <FaCompass />
                Explorar
              </span>
            </button>
          ))}
        </div>

        {/* Extra vendedor */}
        {variant === "vendedor" && (
          <div className="flex items-start gap-2 text-xs sm:text-sm text-terciary">
            <FaStore className="text-primary mt-0.5" />
            Estas categorías te ayudan a entender qué buscan los comensales.
          </div>
        )}

      </div>
    </section>
  );
};
