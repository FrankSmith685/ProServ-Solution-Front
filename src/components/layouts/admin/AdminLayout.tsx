/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState, type FC } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Wrench,
  FolderKanban,
  MessageSquare,
  Star,
  Settings,
  Menu,
  X,
  HardHat,
  LogOut,
  Users,
  ExternalLink,
  ChevronRight,
  ScrollText,
  Sun,
  Moon,
  GalleryHorizontal,
} from "lucide-react";

import { useAppState } from "@/hooks/useAppState";
import { useAuth } from "@/hooks/useAuth";
import { CustomLink } from "@/components/ui/kit/CustomLink";
import { getAdminTheme, setAdminTheme, type AdminTheme } from "@/helpers/theme";

import type { AdminNavItem } from "@/interfaces/layouts/admin/IAdminLayout";

const navItems: AdminNavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Home, label: "Página Inicio", path: "/admin/home" },
  { icon: Users, label: "Quiénes Somos", path: "/admin/nosotros" },
  { icon: Wrench, label: "Servicios", path: "/admin/servicios" },
  { icon: FolderKanban, label: "Proyectos", path: "/admin/proyectos" },
  { icon: MessageSquare, label: "Contactos", path: "/admin/contactos" },
  { icon: Star, label: "Testimonios", path: "/admin/testimonios" },
  { icon: Settings, label: "Configuración", path: "/admin/configuracion" },
  { icon: ScrollText, label: "Logs", path: "/admin/admin-logs" },
  { icon: GalleryHorizontal, label: "Media", path: "/admin/media" },
];

const AdminLayout: FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<AdminTheme>("dark");

  const location = useLocation();
  const { user } = useAppState();
  const { logout } = useAuth();

  const isDark = theme === "dark";

  const isActivePath = (path: string): boolean => {
    return (
      location.pathname === path ||
      (path !== "/admin" && location.pathname.startsWith(path))
    );
  };

  const currentPage = useMemo<string>(() => {
    return navItems.find((item) => isActivePath(item.path))?.label || "Admin";
  }, [location.pathname]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    setTheme(getAdminTheme());
  }, []);

  const handleToggleTheme = (): void => {
    const nextTheme: AdminTheme = isDark ? "light" : "dark";
    setTheme(nextTheme);
    setAdminTheme(nextTheme);
  };

  const sidebarClass = isDark
    ? "border-white/10 bg-[#0f172a] text-slate-100"
    : "border-slate-200 bg-white text-slate-900";

  const sidebarSoftBlockClass = isDark
    ? "border-white/10 bg-[#111827]"
    : "border-slate-200 bg-slate-50";

  const sidebarFooterClass = isDark
    ? "border-white/10 bg-[#0b1220]"
    : "border-slate-200 bg-white";

  const mainWrapperClass = isDark
    ? "bg-[#020617] text-slate-100"
    : "bg-slate-50 text-slate-900";

  const headerClass = isDark
    ? "border-white/10 bg-[#020617]/95"
    : "border-slate-200 bg-white/95";

  const softButtonClass = isDark
    ? "border-white/10 bg-[#111827] text-slate-300 hover:bg-[#1f2937] hover:text-white"
    : "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900";

  const inactiveNavClass = isDark
    ? "text-slate-300 hover:bg-white/8 hover:text-white"
    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900";

  const logoutButtonClass = isDark
    ? "border-white/10 bg-[#111827] text-slate-300 hover:bg-[#1f2937] hover:text-white"
    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900";

  return (
    <div
      className={[
        "admin-theme flex h-screen overflow-hidden transition-colors duration-300",
        isDark ? "theme-dark" : "theme-light",
      ].join(" ")}
    >
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Cerrar menú lateral"
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex h-screen w-[88vw] max-w-72.5 flex-col",
          "border-r shadow-2xl transition-transform duration-300 ease-out",
          "lg:sticky lg:top-0 lg:z-20 lg:w-72 lg:max-w-none lg:translate-x-0 lg:shadow-none",
          sidebarClass,
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div
          className={`border-b px-4 py-4 sm:px-5 lg:px-6 ${
            isDark ? "border-white/10" : "border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary shadow-orange">
                <HardHat size={20} className="text-white" />
              </div>

              <div className="min-w-0">
                <div
                  className={`truncate font-montserrat text-sm font-bold tracking-[0.18em] ${
                    isDark ? "text-slate-100" : "text-slate-900"
                  }`}
                >
                  BARBIERI
                </div>
                <div className="mt-0.5 text-xs font-medium text-primary">
                  Panel Admin
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleTheme}
                aria-label={
                  isDark ? "Activar modo claro" : "Activar modo oscuro"
                }
                className={[
                  "inline-flex h-10 w-10 items-center justify-center rounded-xl border transition lg:hidden",
                  softButtonClass,
                ].join(" ")}
              >
                {isDark ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className={[
                  "rounded-xl p-2 transition lg:hidden",
                  isDark
                    ? "text-slate-400 hover:bg-white/10 hover:text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")}
                aria-label="Cerrar menú"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="px-3 pt-4 sm:px-4">
            <div
              className={[
                "rounded-2xl border px-3 py-3",
                sidebarSoftBlockClass,
              ].join(" ")}
            >
              <div
                className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Navegación
              </div>
            </div>
          </div>

          <nav className="themed-scrollbar flex-1 space-y-1.5 overflow-y-auto px-3 py-4 sm:px-4">
            {navItems.map(({ icon: Icon, label, path }) => {
              const active = isActivePath(path);

              return (
                <CustomLink
                  key={path}
                  to={path}
                  text={
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                      <span className="min-w-0 truncate">{label}</span>
                      <ChevronRight
                        size={16}
                        className={`shrink-0 transition-transform duration-200 ${
                          active
                            ? "translate-x-0 opacity-100"
                            : "opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100"
                        }`}
                      />
                    </div>
                  }
                  icon={<Icon size={18} className="shrink-0" />}
                  onClick={() => setSidebarOpen(false)}
                  underline="none"
                  variant="primary"
                  className={[
                    "group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium",
                    "transition-all duration-200",
                    active
                      ? "bg-primary text-white shadow-orange"
                      : inactiveNavClass,
                  ].join(" ")}
                  sx={{
                    color: active ? "#fff" : "inherit",
                    textDecoration: "none",
                    "&:hover": {
                      color: active ? "#fff" : "inherit",
                      textDecoration: "none",
                    },
                  }}
                />
              );
            })}
          </nav>
        </div>

        <div className={`border-t p-4 ${sidebarFooterClass}`}>
          <div
            className={[
              "rounded-2xl border p-3",
              sidebarSoftBlockClass,
            ].join(" ")}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                {user?.nombre?.charAt(0)?.toUpperCase() || "A"}
              </div>

              <div className="min-w-0 flex-1">
                <div
                  className={`truncate text-sm font-semibold ${
                    isDark ? "text-slate-100" : "text-slate-900"
                  }`}
                >
                  {user?.nombre || "Admin"}
                </div>
                <div
                  className={`truncate text-xs ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {user?.email || ""}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className={[
                "mt-3 flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all",
                logoutButtonClass,
              ].join(" ")}
            >
              <LogOut size={16} className="shrink-0" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      <div className={["flex min-w-0 flex-1 flex-col overflow-hidden", mainWrapperClass].join(" ")}>
        <header className={["sticky top-0 z-20 border-b backdrop-blur", headerClass].join(" ")}>
          <div className="flex min-h-16 items-center gap-3 px-3 py-3 sm:min-h-18 sm:px-5 lg:px-6">
            <button
              type="button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              className={[
                "rounded-xl border p-2.5 transition lg:hidden",
                softButtonClass,
              ].join(" ")}
              aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="min-w-0 flex-1">
              <div
                className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Administración
              </div>
              <h1 className="truncate font-montserrat text-base font-bold text-primary sm:text-lg lg:text-[1.35rem]">
                {currentPage}
              </h1>
            </div>

            <button
              type="button"
              onClick={handleToggleTheme}
              aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
              className={[
                "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition",
                softButtonClass,
              ].join(" ")}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <CustomLink
              to="/"
              target="_blank"
              text={
                <span className="flex items-center gap-1.5">
                  <span className="hidden sm:inline">Ver sitio</span>
                  <ExternalLink size={15} />
                </span>
              }
              underline="none"
              variant="primary"
              className={[
                "shrink-0 rounded-xl border px-3 py-2 text-xs font-medium transition sm:text-sm",
                softButtonClass,
              ].join(" ")}
              sx={{
                color: "inherit",
                textDecoration: "none",
                "&:hover": {
                  color: "inherit",
                  textDecoration: "none",
                },
              }}
            />
          </div>
        </header>

        <main className={isDark ? "min-h-0 flex-1 overflow-y-auto bg-[#020617]" : "min-h-0 flex-1 overflow-y-auto bg-slate-50"}>
          <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;