import { type FC } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { CustomImage } from "@/components/ui/media/CustomImage";
import Footer from "@/components/layouts/footer/Footer";

const TermsAndConditionsPage: FC = () => {
  const navigate: NavigateFunction = useNavigate();

  const handleGoHome = (): void => {
    navigate("/");
  };

  return (
    <> 
      <div className="min-h-screen bg-white font-sans">
        {/* Header moderno */}
        <div className="border-b border-primary-alpha-12">
          <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-4">
            <CustomImage
              name="logo_01"
              alt="mappi-logo"
              className="w-40! object-contain cursor-pointer"
              onClick={handleGoHome}
            />

            <h1 className="text-3xl font-bold text-secondary">
              Términos y Condiciones de Uso
            </h1>

            <p className="text-terciary max-w-2xl">
              Estos términos regulan el uso de la plataforma. Léelos con atención
              antes de continuar.
            </p>
          </div>
        </div>

        {/* Contenido */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* Índice lateral */}
            <aside className="hidden md:block">
              <ul className="text-sm text-terciary space-y-3 sticky top-24">
                <li className="text-secondary font-medium">Introducción</li>
                <li>Uso de la plataforma</li>
                <li>Responsabilidades</li>
                <li>Modificaciones</li>
                <li>Contacto</li>
              </ul>
            </aside>

            {/* Texto legal */}
            <article className="md:col-span-3 space-y-10 text-terciary leading-relaxed">

              <section>
                <h2 className="text-xl font-semibold text-secondary mb-3">
                  Introducción
                </h2>
                <p>
                  Al acceder y utilizar esta plataforma, aceptas cumplir con los
                  presentes términos y condiciones. Si no estás de acuerdo con
                  alguno de ellos, te recomendamos no utilizar el servicio.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-secondary mb-3">
                  Uso de la plataforma
                </h2>
                <p>
                  La plataforma proporciona servicios digitales orientados a
                  mejorar la experiencia del usuario. El uso indebido del sistema
                  está estrictamente prohibido.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-secondary mb-3">
                  Responsabilidades
                </h2>
                <p>
                  El usuario es responsable de la veracidad de la información
                  proporcionada y del uso adecuado de su cuenta dentro de la
                  plataforma.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-secondary mb-3">
                  Modificaciones
                </h2>
                <p>
                  Nos reservamos el derecho de modificar estos términos en cualquier
                  momento. Las modificaciones serán efectivas desde su publicación
                  en la plataforma.
                </p>
              </section>

            </article>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsAndConditionsPage;
