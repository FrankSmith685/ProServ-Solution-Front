import type { FC } from "react";
import { FaStore, FaUtensils } from "react-icons/fa";
import { useAppState } from "@/hooks/useAppState";

export const RegisterUserTypeSelect: FC = () => {
  const { setTypeUserAuth } = useAppState();

  return (
    <div className="flex flex-col items-center text-center gap-6">
      <span
        className="
          px-4 py-1.5 rounded-full 
          text-xs font-medium
          bg-primary-soft text-primary 
          border border-primary-alpha-12
        "
      >
        Registro de usuario
      </span>

      <h2 className="text-2xl sm:text-3xl font-bold text-secondary tracking-tight">
        ¿Cómo deseas registrarte?
      </h2>


      <p className="text-terciary text-sm max-w-90 leading-relaxed">
        Elige una opción para continuar.  
        Explora huariques o registra tu negocio.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-4">

        <button
          onClick={() => setTypeUserAuth("comensal")}
          className="
            group relative w-full rounded-2xl
            p-6 bg-white
            border border-primary-alpha-8
            hover:border-primary
            shadow-lg hover:shadow-2xl
            transition-all duration-300
            hover:-translate-y-1 active:scale-[0.98]
            focus-visible:ring-2 focus-visible:ring-primary
          "
        >
          <div
            className="
              h-14 flex items-center justify-center 
              rounded-2xl
              bg-primary-alpha-12 text-primary
              transition-all duration-300 group-hover:scale-110
            "
          >
            <FaUtensils size={28} />
          </div>

          <h3 className="mt-4 text-xl font-semibold text-secondary">
            Comensal
          </h3>

          <p className="text-sm text-terciary mt-1">
            Descubre experiencias gastronómicas.
          </p>

          <div
            className="
              absolute left-0 bottom-0 h-1 w-0
              bg-primary rounded-b-2xl
              transition-all duration-300 group-hover:w-full
            "
          />
        </button>

        <button
          onClick={() => setTypeUserAuth("emprendedor")}
          className="
            group relative w-full rounded-2xl
            p-6 bg-white
            border border-terciary-alpha-8
            hover:border-secondary
            shadow-lg hover:shadow-2xl
            transition-all duration-300 
            hover:-translate-y-1 active:scale-[0.98]
            focus-visible:ring-2 focus-visible:ring-secondary
          "
        >
          <div
            className="
              h-14 flex items-center justify-center 
              rounded-2xl
              bg-secondary-alpha-8 text-secondary
              transition-all duration-300 group-hover:scale-110
            "
          >
            <FaStore size={28} />
          </div>

          <h3 className="mt-4 text-xl font-semibold text-secondary">
            Emprendedor
          </h3>

          <p className="text-sm text-terciary mt-1">
            Registra tu negocio y crece.
          </p>

          <div
            className="
              absolute left-0 bottom-0 h-1 w-0
              bg-secondary rounded-b-2xl
              transition-all duration-300 group-hover:w-full
            "
          />
        </button>
      </div>
    </div>
  );
};
