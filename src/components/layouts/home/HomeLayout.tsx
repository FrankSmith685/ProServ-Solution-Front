import type { FC, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout: FC<HomeLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen w-full bg-white">
      <Header />

      <main className={isHome ? "" : "pt-16"}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
