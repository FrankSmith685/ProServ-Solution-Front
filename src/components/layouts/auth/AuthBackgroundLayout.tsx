import type { FC, ReactNode } from "react";
import Footer from "../footer/Footer";

interface AuthBackgroundLayoutProps {
  desktopImage: string;
  mobileImage: string;
  overlayColor?: string;
  children: ReactNode;
}

export const AuthBackgroundLayout: FC<AuthBackgroundLayoutProps> = ({
  desktopImage,
  mobileImage,
  overlayColor = "bg-primary opacity-45",
  children,
}) => {
  return (
    <>
      <div className="relative w-full min-h-screen font-sans overflow-hidden flex flex-col">
        <div className="w-full h-full fixed inset-0 z-10">
          <img 
            alt="desktop_bg"
            className="size-custom object-cover hidden md:flex"
            src={desktopImage}
          />
          <img
            alt="mobile_bg"
            className="md:hidden size-custom object-cover"
            src={mobileImage}
          />

          <div className={`absolute inset-0 w-full h-full ${overlayColor}`} />
        </div>

        {children}
      </div>
      <Footer />
    </>
  );
};
