/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, type FC } from "react";
import { motion } from "framer-motion";
import {
  HardHat,
  LogIn,
  ShieldCheck,
  Sun,
  Moon,
  ChevronRight,
  Sparkles,
  LayoutDashboard,
  LockKeyhole,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "@mui/icons-material";

import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { useAuth } from "@/hooks/useAuth";
import { getAdminTheme, setAdminTheme, type AdminTheme } from "@/helpers/theme";

import type {
  LoginAdminForm,
  LoginAdminInputChange,
  LoginAdminResponse,
} from "@/interfaces/page/admin/login/ILoginAdminPage";

const initialForm: LoginAdminForm = {
  email: "",
  password: "",
};

const LoginAdminPage: FC = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState<LoginAdminForm>(initialForm);
  const [theme, setTheme] = useState<AdminTheme>("dark");

  const isDark = theme === "dark";

  useEffect(() => {
    setTheme(getAdminTheme());
  }, []);

  const toggleTheme = (): void => {
    const nextTheme: AdminTheme = isDark ? "light" : "dark";
    setTheme(nextTheme);
    setAdminTheme(nextTheme);
  };

  const handleChange = (e: LoginAdminInputChange): void => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      await loginUser(form, (res: LoginAdminResponse) => {
        setLoading(false);

        if (res.success) {
          navigate("/admin");
          return;
        }

        setError(res.message || "Error al iniciar sesión");
      });
    } catch {
      setLoading(false);
      setError("Ocurrió un error inesperado al iniciar sesión");
    }
  };

  return (
    <div
      className={[
        "admin-theme relative min-h-screen overflow-hidden transition-colors duration-300",
        isDark ? "theme-dark" : "theme-light",
        "bg-surface text-(--color-text)",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl md:h-96 md:w-96"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--color-primary) / 0.18) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute right-0 bottom-0 h-72 w-72 translate-x-1/4 translate-y-1/4 rounded-full blur-3xl md:h-112 md:w-md"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--color-primary) / 0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/3 left-0 h-56 w-56 -translate-x-1/3 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--color-primary) / 0.10) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen lg:grid lg:h-screen lg:grid-cols-[1.08fr_0.92fr] lg:overflow-hidden">
        <header className="sticky top-0 z-30 border-b border-border bg-surface-soft-light/90 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--color-primary)), hsl(var(--color-primary) / 0.75))",
                }}
              >
                <HardHat size={18} />
              </div>

              <div className="min-w-0">
                <p className="truncate font-montserrat text-sm font-black tracking-[0.18em] sm:text-base">
                  BARBIERI
                </p>
                <p className="text-[11px] text-muted-foreground sm:text-xs">
                  Panel Administrativo
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface-soft shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-muted"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <aside className="themed-scrollbar relative hidden lg:block lg:h-screen lg:overflow-y-auto">
          <div className="absolute inset-y-0 right-0 w-px bg-linear-to-b from-transparent via-[hsl(var(--color-border))] to-transparent" />

          <div className="flex min-h-full flex-col justify-between px-10 py-10 xl:px-14 xl:py-12">
            <div>
              <div className="flex items-center gap-4">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-3xl text-white shadow-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--color-primary)), hsl(var(--color-primary) / 0.75))",
                  }}
                >
                  <HardHat size={26} />
                </div>

                <div>
                  <h1 className="font-montserrat text-xl font-black tracking-[0.22em]">
                    BARBIERI
                  </h1>
                  <p className="text-xs uppercase tracking-[0.30em] text-primary">
                    Contratistas Generales
                  </p>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="mt-16 max-w-2xl"
              >
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface-soft px-4 py-2 text-xs font-semibold text-primary shadow-sm">
                  <ShieldCheck size={14} />
                  Acceso interno seguro
                </div>

                <h2 className="max-w-xl font-montserrat text-4xl font-black leading-[1.05] xl:text-5xl 2xl:text-6xl">
                  Administra tu
                  <span className="block text-primary">panel con claridad</span>
                </h2>

                <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground xl:text-base">
                  Una experiencia de acceso moderna, elegante y preparada para
                  modo claro y oscuro. Ingresa al panel para gestionar contenido,
                  configuraciones y recursos del sitio de forma centralizada.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-border bg-surface-soft p-4 shadow-sm backdrop-blur">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <LayoutDashboard size={18} />
                    </div>
                    <h3 className="text-sm font-bold">Gestión centralizada</h3>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      Controla módulos, contenido e información visual desde un
                      solo lugar.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-border bg-surface-soft p-4 shadow-sm backdrop-blur">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <LockKeyhole size={18} />
                    </div>
                    <h3 className="text-sm font-bold">Acceso protegido</h3>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      Inicio de sesión seguro para administradores y operadores del
                      sistema.
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  {[
                    "Interfaz profesional y adaptable",
                    "Diseño optimizado para desktop y móvil",
                    "Paleta dinámica según modo claro u oscuro",
                    "Experiencia visual moderna y limpia",
                    "Panel administrativo claro y ordenado",
                    "Jerarquía visual enfocada en productividad",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-(--color-text)"
                    >
                      <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <ChevronRight size={15} />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-10 rounded-3xl border border-border bg-surface-soft p-5 shadow-sm">
                  <h3 className="text-sm font-bold">Ventajas del sistema</h3>
                  <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
                    <p>
                      El panel administrativo está diseñado para ofrecer una
                      experiencia clara, estable y enfocada en la gestión diaria
                      del contenido del sitio.
                    </p>
                    <p>
                      Su estructura permite centralizar procesos, organizar mejor
                      los módulos internos y facilitar la administración visual
                      del proyecto en distintos tamaños de pantalla.
                    </p>
                    <p>
                      Además, el soporte para tema claro y oscuro ayuda a mejorar
                      la legibilidad y la comodidad de uso durante sesiones
                      prolongadas de trabajo.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mt-10 flex items-center justify-between gap-4 pt-6">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  © 2026 Barbieri
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Sistema administrativo interno
                </p>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface-soft shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </aside>

        <main className="flex min-h-[calc(100vh-76px)] items-center justify-center px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:h-screen lg:min-h-0 lg:overflow-hidden lg:px-10 lg:py-8 xl:px-14">
          <div className="flex w-full items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-md sm:max-w-lg"
            >
              <div className="overflow-hidden rounded-[30px] border border-border bg-surface-soft/95 shadow-[0_20px_70px_rgba(0,0,0,0.12)] backdrop-blur-xl">
                <div
                  className="h-1.5 w-full"
                  style={{
                    background:
                      "linear-gradient(90deg, hsl(var(--color-primary)), hsl(var(--color-primary) / 0.65))",
                  }}
                />

                <div className="p-5 sm:p-7 md:p-8">
                  <div className="mb-6 lg:hidden">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
                      <Sparkles size={14} />
                      Acceso administrativo
                    </div>

                    <h2 className="font-montserrat text-2xl font-black leading-tight sm:text-3xl">
                      Panel de
                      <span className="block text-primary">Administración</span>
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      Inicia sesión para gestionar el contenido, la configuración
                      general y los recursos del sistema.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-montserrat text-2xl font-black sm:text-3xl">
                      Bienvenido
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Accede con tu cuenta de administrador
                    </p>
                  </div>

                  <div className="space-y-4">
                    <CustomInput
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      label="Correo electrónico"
                      type="email"
                      fullWidth
                      variant="primary"
                      size="lg"
                      icon={
                        <Mail
                          className="text-base sm:text-lg"
                          style={{ color: "var(--color-text-muted)" }}
                        />
                      }
                      required
                    />

                    <CustomInput
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      label="Contraseña"
                      type="password"
                      fullWidth
                      variant="primary"
                      size="lg"
                      icon={
                        <Lock
                          className="text-base sm:text-lg"
                          style={{ color: "var(--color-text-muted)" }}
                        />
                      }
                      required
                    />
                  </div>

                  {error ? (
                    <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-center text-sm text-error">
                      {error}
                    </div>
                  ) : null}

                  <div className="mt-6">
                    <CustomButton
                      text={loading ? "Ingresando..." : "Ingresar al panel"}
                      onClick={handleLogin}
                      loading={loading}
                      fullWidth
                      size="lg"
                      variant="primary"
                      icon={<LogIn size={17} />}
                      className="justify-center"
                    />
                  </div>

                  <div className="mt-5 rounded-2xl border border-border bg-surface px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <ShieldCheck size={16} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          Acceso exclusivo para personal autorizado
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          Usa tus credenciales administrativas para ingresar al
                          sistema y gestionar los módulos internos.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LoginAdminPage;