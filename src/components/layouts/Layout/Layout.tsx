import { Outlet } from "react-router-dom";
import Navbar from "../header/NavBar";
import Footer from "../footer/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import { useLayoutBootstrap } from "@/hooks/bootstrap/useLayoutBootstrap";
import ScrollToTop from "@/components/utils/ScrollToTop";

export default function Layout() {
  useLayoutBootstrap();

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}