import React from "react";
import { FaMapMarkerAlt, FaRegImage, FaWhatsapp } from "react-icons/fa";

const RegisterSection: React.FC = () => {
  return (
    <section
      className="
        w-full
        text-white
        flex flex-col items-center text-center
        gap-4
        bg-black/30 backdrop-blur-xl
        rounded-2xl
        border border-white/15
        p-4 sm:p-5 lg:p-6
        shadow-[0_10px_35px_rgba(0,0,0,.35)]
        max-w-120 lg:max-w-full
      "
    >
      {/* Badge */}
      <span
        className="
          px-3 py-1 
          rounded-full 
          text-[10px] sm:text-xs font-medium
          bg-white/10 
          border border-white/20
          tracking-wide
        "
      >
        Diseñado para emprendedores
      </span>

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-extrabold">
        Registra tu huarique y llega a miles de personas
      </h2>

      {/* Description */}
      <p className="text-white/85 text-sm sm:text-base">
        Gana visibilidad, conecta con clientes reales y haz crecer tu negocio.
      </p>

      {/* FEATURES */}
      <div
        className="
          grid 
          grid-cols-1
          sm:grid-cols-1
          xl:grid-cols-3
          gap-3 w-full mt-1
        "
      >
        {[
          { icon: <FaMapMarkerAlt size={20} />, text: "Ubicación geolocalizada" },
          { icon: <FaRegImage size={20} />, text: "Logo y portada personalizable" },
          { icon: <FaWhatsapp size={20} />, text: "Conecta pedidos por WhatsApp" },
        ].map((item, i) => (
          <div
            key={i}
            className="
              bg-white/8
              border border-white/15
              rounded-xl
              p-3
              flex flex-col items-center text-center
              gap-2
              transition-all duration-300
              hover:bg-white/12
              hover:-translate-y-0.5
              shadow-[0_6px_18px_rgba(0,0,0,.22)]
            "
          >
            <div
              className="
                w-10 h-10 sm:w-12 sm:h-12
                rounded-xl
                bg-primary
                flex items-center justify-center
                shadow-[0_0_14px_rgba(255,108,79,.45)]
              "
            >
              {item.icon}
            </div>

            <p className="text-[11px] sm:text-sm text-white/90 font-medium leading-snug">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-2 flex flex-col items-center gap-1">
        <h3 className="text-sm sm:text-base font-semibold">
          ¡Comienza hoy mismo!
        </h3>

        <div
          className="
            bg-white/10
            px-5 py-1.5
            rounded-xl
            border border-white/25
            shadow-lg
            flex items-center justify-center
          "
        >
          <span className="text-xl sm:text-2xl font-extrabold">30</span>
          <span className="ml-2 text-xs sm:text-sm text-white/90">
            días gratis
          </span>
        </div>
      </div>
    </section>
  );
};

export default RegisterSection;
