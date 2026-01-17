import type { FC } from "react";

export const TermsLoader: FC = () => {
  return (
    <div
      className="
        fixed inset-0 z-9999
        w-screen h-screen
        bg-white
        font-sans
        flex items-center justify-center
        overflow-hidden
      "
    >
      <div className="w-full max-w-3xl px-4 sm:px-6 animate-fade-in-up">
        {/* Título skeleton */}
        <div className="h-7 w-56 sm:w-72 bg-secondary-soft rounded mb-6" />

        {/* Párrafos skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-full bg-terciary-soft rounded" />
          <div className="h-4 w-11/12 bg-terciary-soft rounded" />
          <div className="h-4 w-10/12 bg-terciary-soft rounded" />
        </div>

        <div className="space-y-4 mt-6">
          <div className="h-4 w-full bg-terciary-soft rounded" />
          <div className="h-4 w-9/12 bg-terciary-soft rounded" />
          <div className="h-4 w-8/12 bg-terciary-soft rounded" />
        </div>

        {/* Indicador */}
        <div className="mt-10 flex items-center gap-3">
          <div className="w-24 h-1 bg-secondary-soft rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-[loadLine_1.6s_ease-in-out_infinite]" />
          </div>
          <span className="text-sm text-terciary">
            Cargando términos y condiciones…
          </span>
        </div>

        <style>
          {`
            @keyframes loadLine {
              0% { width: 0% }
              50% { width: 100% }
              100% { width: 0% }
            }
          `}
        </style>
      </div>
    </div>
  );
};
