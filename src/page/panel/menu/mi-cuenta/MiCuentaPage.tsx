import type { FC } from "react";
import { Outlet } from "react-router-dom";
import { CustomSidebarSubMenu } from "@/components/ui/navigation/CustomSidebarSubMenu";
import { FaUserCircle } from "react-icons/fa";
import { miCuentaMenuData } from "../../data/miCuentaMenu";

export const MiCuentaPage: FC = () => {
  return (
    <div className="flex h-full bg-terciary-soft">
      <aside className="w-64 shrink-0 bg-secondary text-on-dark">
        <CustomSidebarSubMenu
          title="Mi Cuenta"
          titleIcon={FaUserCircle}
          menuData={miCuentaMenuData}
        />
      </aside>

      <section className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-3xl mx-auto bg-surface rounded-2xl shadow-lg p-6 animate-fade-in-up">
            <Outlet />
          </div>
        </div>
      </section>
    </div>
  );
};
