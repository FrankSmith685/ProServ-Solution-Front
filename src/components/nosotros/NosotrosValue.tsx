import { useMemo, type FC } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
  BadgeCheck,
  CheckCircle2,
} from "lucide-react";

import { useAppState } from "@/hooks/useAppState";

/* ================= HELPERS ================= */
const safeText = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
};

const uniqueTexts = (values: string[]): string[] => {
  const seen = new Set<string>();

  return values.filter((value) => {
    const normalized = value.toLowerCase();
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
};

const NosotrosValues: FC = () => {
  const { configNosotros } = useAppState();

  const values = useMemo(() => {
    if (!configNosotros) return [];

    const raw = [
      configNosotros.valores,
      configNosotros.beneficios,
      configNosotros.items,
      configNosotros.lista_puntos,
    ];

    for (const item of raw) {
      if (Array.isArray(item)) {
        return uniqueTexts(item.map(safeText));
      }
    }

    return uniqueTexts(
      [
        safeText(configNosotros.punto_1),
        safeText(configNosotros.punto_2),
        safeText(configNosotros.punto_3),
        safeText(configNosotros.punto_4),
      ].filter(Boolean)
    );
  }, [configNosotros]);

  if (!values.length) return null;

  return (
    <section className="relative bg-surface py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase text-primary">
            <Sparkles size={14} />
            Nuestros valores
          </div>

          <h2 className="mt-5 text-3xl font-black text-dark md:text-5xl">
            ¿Por qué elegirnos?
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl border border-border bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
                {i % 3 === 0 ? (
                  <ShieldCheck size={20} />
                ) : i % 3 === 1 ? (
                  <BadgeCheck size={20} />
                ) : (
                  <CheckCircle2 size={20} />
                )}
              </div>

              <p className="mt-4 text-sm font-semibold text-dark leading-relaxed">
                {value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NosotrosValues;