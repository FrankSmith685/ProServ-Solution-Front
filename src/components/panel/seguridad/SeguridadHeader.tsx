import type { SeguridadHeaderProps } from "@/interfaces/panel/mis-datos/ISeguridad";

export const SeguridadHeader = ({
  icon: Icon,
  title,
  description,
  status,
}: SeguridadHeaderProps) => {
  const StatusIcon = status.icon;

  return (
    <header className="rounded-3xl bg-surface-soft p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-primary-soft text-primary flex items-center justify-center">
          <Icon />
        </div>

        <div className="flex flex-col items-center sm:items-start">
          <h1 className="text-base sm:text-lg font-semibold text-secondary text-center sm:text-left">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-terciary text-center sm:text-left">
            {description}
          </p>
        </div>
      </div>

      <div className="w-full lg:w-auto flex items-center justify-center">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${status.color}`}>
          <StatusIcon className="text-sm" />
          <span>{status.text}</span>
        </div>
      </div>
    </header>
  );
};
