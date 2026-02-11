import type { HuariqueHeaderProps } from "@/interfaces/panel/mis-huariques/IHuarique";
import { FaStore } from "react-icons/fa";

// Header del formulario de Huarique
export const HuariqueHeader = ({
  title,
  description,
  status,
}: HuariqueHeaderProps) => {
  const StatusIcon = status.icon;
  return (
    <header className="rounded-3xl bg-surface-soft p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-primary-soft text-primary flex items-center justify-center">
          <FaStore />
        </div>

        <div>
          <h1 className="text-lg font-semibold text-secondary">
            {title}
          </h1>
          <p className="text-sm text-terciary">
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