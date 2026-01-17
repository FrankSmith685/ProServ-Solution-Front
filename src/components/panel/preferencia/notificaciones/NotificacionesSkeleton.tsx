import type { FC } from "react";

export const NotificacionesSkeleton: FC = () => {
  return (
    <section className="bg-glass rounded-3xl p-6 space-y-6 w-full animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start justify-between gap-6"
        >
          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 bg-surface-soft rounded" />
            <div className="h-3 w-full max-w-md bg-surface-soft rounded" />
          </div>

          <div className="h-6 w-12 bg-surface-soft rounded-full shrink-0" />
        </div>
      ))}
    </section>
  );
};
