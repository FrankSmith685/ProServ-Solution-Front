import type { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { CustomLink } from "@/components/ui/kit/CustomLink";
import { CustomImage } from "@/components/ui/media/CustomImage";

const Footer: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const hiddenPaths: string[] = [
    "/iniciar",
    "/recuperar",
    "/reset-password",
    "/cambiar-contrasena",
  ];

  const shouldHideFooter: boolean = hiddenPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  if (shouldHideFooter) return null;


  return (
    <footer
      className="
        w-full relative z-40
        bg-secondary text-white
        border-t border-secondary-alpha-12
      "
    >
      <div
        className="
          max-w-400 mx-auto w-full py-6
          flex flex-col gap-5
          responsive-padding
        "
      >
        {/* TOP */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <CustomImage
            name="logo_02"
            alt="mappi-logo"
            className="object-contain transition-all duration-300 w-40! lg:w-47.5! cursor-pointer"
            onClick={()=>navigate("/")}
          />

          <p className="text-sm text-white/85 text-center sm:text-right leading-relaxed">
            Haz crecer tu huarique y conecta con miles de personas.
          </p>
        </div>

        <hr className="border-white/20" />

        {/* BOTTOM */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/80 text-center sm:text-left">
            © {new Date().getFullYear()} mappi.pe — Todos los derechos reservados
          </p>

          <CustomLink
            to="/terminos-condiciones-uso"
            text="Términos y condiciones de uso"
            variant="secondary"
            fontWeight={500}
            fontSize="14px"
            className="text-white! hover:text-primary!"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// import type { FC } from "react";
// import { useNavigate } from "react-router-dom";

// import { CustomLink } from "@/components/ui/kit/CustomLink";
// import { CustomImage } from "@/components/ui/media/CustomImage";

// const Footer: FC = () => {
//   const navigate = useNavigate();

//   return (
//     <footer className="bg-secondary text-white border-t border-secondary-alpha-12">
//       <div className="max-w-400 mx-auto py-6 responsive-padding flex flex-col gap-5">
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//           <CustomImage
//             name="logo_02"
//             alt="mappi-logo"
//             className="w-40! object-contain cursor-pointer"
//             onClick={() => navigate("/")}
//           />

//           <p className="text-sm text-white/85 text-center sm:text-right">
//             Haz crecer tu huarique y conecta con miles de personas.
//           </p>
//         </div>

//         <hr className="border-white/20" />

//         <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
//           <p className="text-sm text-white/80 text-center sm:text-left">
//             © {new Date().getFullYear()} mappi.pe — Todos los derechos reservados
//           </p>

//           <CustomLink
//             to="/terminos-condiciones-uso"
//             text="Términos y condiciones de uso"
//             variant="secondary"
//             className="text-white! hover:text-primary!"
//           />
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
