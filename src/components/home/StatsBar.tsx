/* eslint-disable react-hooks/set-state-in-effect */
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { motion, useInView } from "framer-motion";
import {
  BriefcaseBusiness,
  Building2,
  ShieldCheck,
  Users,
} from "lucide-react";

import { useConfigHome } from "@/hooks/useConfigHome";
import { useAppState } from "@/hooks/useAppState";

type HomeStatItem = {
  value: number;
  suffix?: string;
  label: string;
  icon: ReactNode;
};

type CounterProps = {
  value: number;
  suffix?: string;
  duration?: number;
};

type StatCardProps = {
  stat: HomeStatItem;
  index: number;
};

type ParsedStatValue = {
  value: number;
  suffix: string;
};

const parseStatValue = (input: unknown): ParsedStatValue => {
  if (typeof input === "number" && Number.isFinite(input)) {
    return {
      value: Math.max(0, input),
      suffix: "",
    };
  }

  if (typeof input === "string") {
    const clean = input.trim().replace(/,/g, "");

    if (!clean) {
      return {
        value: 0,
        suffix: "",
      };
    }

    const match = clean.match(/^(\d+(?:\.\d+)?)(.*)$/);

    if (!match) {
      return {
        value: 0,
        suffix: "",
      };
    }

    const parsedNumber = Number(match[1]);
    const parsedSuffix = match[2]?.trim() ?? "";

    return {
      value: Number.isFinite(parsedNumber) ? Math.max(0, parsedNumber) : 0,
      suffix: parsedSuffix,
    };
  }

  return {
    value: 0,
    suffix: "",
  };
};

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isEmptyObject = (value: unknown): boolean => {
  return isPlainObject(value) && Object.keys(value).length === 0;
};

const Counter: FC<CounterProps> = ({
  value,
  suffix = "",
  duration = 1400,
}) => {
  const [count, setCount] = useState<number>(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView) return;

    if (value <= 0) {
      setCount(0);
      return;
    }

    let animationFrame = 0;
    let startTime: number | null = null;

    const animate = (timestamp: number): void => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(value * easedProgress);

      setCount(currentValue);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

const StatCard: FC<StatCardProps> = ({ stat, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-[28px] border border-white/12 bg-white/8 p-5 text-white shadow-[0_14px_50px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:bg-white/10 sm:p-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex h-full flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-inner shadow-white/5 transition-all duration-300 group-hover:scale-105 group-hover:bg-white/14 sm:h-16 sm:w-16">
          {stat.icon}
        </div>

        <div className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-[2.7rem]">
          <Counter value={stat.value} suffix={stat.suffix} />
        </div>

        <div className="mt-3 h-px w-12 bg-white/20 transition-all duration-300 group-hover:w-16 group-hover:bg-white/35" />

        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80 sm:text-xs">
          {stat.label}
        </p>
      </div>
    </motion.div>
  );
};

const StatsBarSkeleton: FC = () => {
  return (
    <section className="relative overflow-hidden bg-primary py-10 sm:py-12 lg:py-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_45%)]" />
      <div className="absolute left-[8%] top-[15%] h-28 w-28 rounded-full bg-white/8 blur-3xl" />
      <div className="absolute right-[10%] bottom-[12%] h-36 w-36 rounded-full bg-white/8 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] bg-size-[34px_34px] opacity-[0.08]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-4xl border border-white/12 bg-white/6 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-sm sm:p-5 lg:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`stats-skeleton-${index}`}
                className="rounded-[28px] border border-white/10 bg-white/7 p-5 text-center sm:p-6"
              >
                <div className="mx-auto h-14 w-14 animate-pulse rounded-2xl bg-white/12 sm:h-16 sm:w-16" />
                <div className="mx-auto mt-5 h-10 w-24 animate-pulse rounded-2xl bg-white/14" />
                <div className="mx-auto mt-4 h-px w-12 bg-white/10" />
                <div className="mx-auto mt-4 h-4 w-28 animate-pulse rounded-full bg-white/10 sm:w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const StatsBar: FC = () => {
  const { configHome } = useAppState();
  const { loading } = useConfigHome();

  const shouldFetchConfig = useMemo<boolean>(() => {
    return !configHome || isEmptyObject(configHome);
  }, [configHome]);


  const stats = useMemo<HomeStatItem[]>(() => {
    if (!configHome || isEmptyObject(configHome)) return [];

    const anos = parseStatValue(configHome.stats_anos_valor);
    const proyectos = parseStatValue(configHome.stats_proyectos_valor);
    const clientes = parseStatValue(configHome.stats_clientes_valor);
    const colaboradores = parseStatValue(configHome.stats_colaboradores_valor);

    const items: HomeStatItem[] = [
      {
        value: anos.value,
        suffix: anos.suffix,
        label: "Años de experiencia",
        icon: <ShieldCheck size={28} strokeWidth={2.1} />,
      },
      {
        value: proyectos.value,
        suffix: proyectos.suffix || "+",
        label: "Proyectos completados",
        icon: <BriefcaseBusiness size={28} strokeWidth={2.1} />,
      },
      {
        value: clientes.value,
        suffix: clientes.suffix || "+",
        label: "Clientes satisfechos",
        icon: <Users size={28} strokeWidth={2.1} />,
      },
      {
        value: colaboradores.value,
        suffix: colaboradores.suffix || "+",
        label: "Colaboradores",
        icon: <Building2 size={28} strokeWidth={2.1} />,
      },
    ];

    return items.filter((item) => item.value > 0 && item.label.trim());
  }, [configHome]);

  if (loading && shouldFetchConfig) {
    return <StatsBarSkeleton />;
  }

  if (!stats.length) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-primary py-10 sm:py-12 lg:py-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_42%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_38%,rgba(255,255,255,0.05)_100%)]" />
      <div className="absolute left-[7%] top-[18%] h-32 w-32 rounded-full bg-white/8 blur-3xl" />
      <div className="absolute right-[8%] bottom-[14%] h-36 w-36 rounded-full bg-white/8 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] bg-size-[34px_34px] opacity-[0.08]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-4xl border border-white/12 bg-white/6 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.14)] backdrop-blur-md sm:p-5 lg:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {stats.map((stat, index) => (
              <StatCard
                key={`${stat.label}-${index}`}
                stat={stat}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsBar;