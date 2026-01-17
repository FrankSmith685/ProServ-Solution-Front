import { type FC, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";

import { useAppState } from "@/hooks/useAppState";
import { HeaderUserPanel } from "./HeaderUserPanel";
import { MobileUserPanel } from "./MobileUserPanel";
import { CustomImage } from "@/components/ui/media/CustomImage";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import type { AppUser, UserRole } from "@/interfaces/layouts/header/ITypes";

const SCROLL_THRESHOLD = 16;
const MOBILE_BREAKPOINT = 768;
const HEADER_HEIGHT = 64;

const Header: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, accessToken } = useAppState();

  const [drawer, setDrawer] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_BREAKPOINT
  );

  const isHome = location.pathname === "/";
  const isPanel = location.pathname.startsWith("/panel");

  const isLogged = Boolean(accessToken && user);
  const role = user?.tipo_usuario?.[0]?.descripcion as UserRole | undefined;

  /* =========================
     Responsive
  ========================== */
  useEffect(() => {
    const onResize = (): void => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);

      if (!mobile) setDrawer(false);
      else setUserMenuOpen(false);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* =========================
     Scroll (solo HOME)
  ========================== */
  useEffect(() => {
    if (!isHome || isPanel) return;

    const onScroll = (): void => {
      const effectiveScroll = isMobile
        ? window.scrollY - HEADER_HEIGHT
        : window.scrollY;

      setScrolled(effectiveScroll > SCROLL_THRESHOLD);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome, isPanel, isMobile]);

  /* =========================
     Visual State
  ========================== */
  const forceSolid = drawer || userMenuOpen;
  const isSolid =
    isPanel ||
    forceSolid ||
    !isHome ||
    scrolled ||
    (!isMobile && hovered);
  const isTransparent = !isSolid && !isPanel;
  const showMobileSpacer = isMobile && !isPanel && isSolid;
  /* =========================
     Render
  ========================== */
  return (
    <>
      <header
        onMouseEnter={() => !isMobile && !isPanel && setHovered(true)}
        onMouseLeave={() => !isMobile && !isPanel && setHovered(false)}
        className={`
          ${isPanel ? "relative" : "fixed top-0 inset-x-0"}
          z-40
          transition-all duration-300
          ${
            isPanel
              ? "bg-white border-b border-gray-200 shadow-sm"
              : isSolid
              ? `
                  bg-primary/90
                  backdrop-blur-sm
                  border-b border-primary-alpha-16
                  shadow-[0_10px_40px_rgba(255,108,79,0.35)]
                `
              : "bg-transparent"
          }
        `}
      >
        <div className="max-w-400 mx-auto h-16 responsive-padding flex items-center justify-between">
          {/* Logo */}
          <CustomImage
            name="logo_01"
            alt="mappi-logo"
            className="w-28! cursor-pointer"
            onClick={() => navigate("/")}
          />

          {/* Desktop */}
          {!isMobile && (
            <div className="flex items-center gap-3">
              {!isLogged && (
                <CustomButton
                  icon={<FaUserCircle />}
                  text="Ingresar"
                  variant="primary"
                  onClick={() => navigate("/iniciar")}
                />
              )}

              {isLogged && user && role && (
                <HeaderUserPanel
                  user={user as AppUser}
                  role={role}
                  isTransparent={isTransparent}
                  isOpen={userMenuOpen}
                  onOpen={() => {
                    setHovered(false);
                    setUserMenuOpen(true);
                  }}
                  onClose={() => setUserMenuOpen(false)}
                />
              )}
            </div>
          )}

          {/* Mobile */}
          {isMobile && (
            <>
              {!isLogged && (
                <button
                  onClick={() => navigate("/iniciar")}
                  className={`
                    w-9 h-9 rounded-full
                    flex items-center justify-center
                    transition
                    ${
                      isTransparent
                        ? "bg-black/30 text-on-dark"
                        : "bg-primary text-on-dark"
                    }
                  `}
                >
                  <FaUserCircle />
                </button>
              )}

              {isLogged && user && (
                <button
                  onClick={() => setDrawer((p) => !p)}
                  className={`
                    flex items-center gap-1 px-1 py-1 rounded-full transition cursor-pointer
                    ${isTransparent ? "text-orange-500" : "text-on-dark"}
                  `}
                >
                  <div
                    className={`
                      w-9 h-9 rounded-full overflow-hidden
                      flex items-center justify-center
                      ${
                        isTransparent
                          ? "bg-white text-primary"
                          : "bg-primary text-white"
                      }
                    `}
                  >
                    {user.fotoPerfil ? (
                      <img
                        src={user.fotoPerfil}
                        alt={user.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.nombre?.charAt(0) ?? user?.correo?.charAt(0)
                    )}
                  </div>

                  <FaChevronDown
                    className={`
                      text-xs transition-transform duration-200
                      ${drawer ? "rotate-180" : ""}
                      ${isTransparent ? "text-white" : "text-primary"}
                    `}
                  />
                </button>
              )}
            </>
          )}
        </div>
      </header>

      {/* Spacer solo HOME */}
      {showMobileSpacer && (
        <div style={{ height: HEADER_HEIGHT }} aria-hidden />
      )}

      {/* Mobile user panel */}
      {drawer && isMobile && user && role && (
        <MobileUserPanel
          user={user as AppUser}
          role={role}
          onClose={() => setDrawer(false)}
        />
      )}
    </>
  );
};

export default Header;
