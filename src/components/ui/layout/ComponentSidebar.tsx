import { memo, useState, useCallback, type JSX } from "react";
import { HiChevronRight } from "react-icons/hi2";
import type { Item } from "@/interfaces/ui/layout/IComponentSidebar";
import CustomSidebarItem from "../kit/CustomSidebarItem";
import { FaTimes } from "react-icons/fa";
import { CustomInput } from "../kit/CustomInput";

interface Props {
  items: Item[];
  active: string | null;
  onSelect: (id: string) => void;
  isOpen: boolean;
  onClose?: () => void;
  searchValue: string;
  onSearch: (value: string) => void;
}

const CustomSidebar = memo(
  ({ items, active, onSelect, isOpen, onClose, searchValue, onSearch }: Props): JSX.Element => {

    const [openComponents, setOpenComponents] = useState<boolean>(true); 
    const [openStyles, setOpenStyles] = useState<boolean>(true);

    const handleSelect = useCallback(
      (id: string): void => {
        onSelect(id);
      },
      [onSelect]
    );

    const componentes: Item[] = items.filter(i => i.type === "component");
    const estilos: Item[] = items.filter(i => i.type === "style");

    return (
      <>
        {/* OVERLAY SOLO MOBILE */}
        <div
          onMouseDown={onClose}
          className={`fixed inset-0 z-40 bg-black/30 lg:hidden ${
            isOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />

        <aside
          className={`
            fixed top-0 left-0 z-50
            h-screen w-full xs:w-72
            bg-white
            border-r border-primary-alpha-8
            shadow-xl shadow-black/5
            transition-transform duration-300
            lg:translate-x-0
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            flex flex-col
          `}
        >
          {/* HEADER */}
          <div className="px-4 pt-4 pb-3 border-b border-primary-alpha-8">
            <div className="h-12 flex items-center justify-between">
              <span className="font-bold text-lg text-primary tracking-tight">
                UI Kit
              </span>

              {/* cerrar SOLO mobile */}
              <button
                type="button"
                onClick={onClose}
                className="
                  xs:hidden
                  inline-flex items-center justify-center
                  w-10 h-10
                  rounded-xl
                  text-primary
                  hover:bg-primary-alpha-8
                  active:bg-primary-alpha-12
                  transition-colors
                  cursor-pointer
                "
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* SEARCH */}
            <div className="mt-3">
              <CustomInput
                type="search"
                placeholder="Buscar componente…"
                fullWidth
                value={searchValue}
                onChange={(e) => onSearch?.(e.target.value)}
                size="md"
              />
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-4">

            {/* COMPONENTES */}
            <button
              onClick={() => setOpenComponents(v => !v)}
              className={`flex w-full items-center justify-between px-2 py-2 text-xs font-semibold uppercase transition-colors
                ${openComponents ? "text-primary" : "text-terciary"}
              `}
            >
              Componentes

              <HiChevronRight
                size={14}
                className={`transition-transform
                  ${openComponents ? "rotate-90 text-primary" : "text-terciary"}
                `}
              />
            </button>

            {openComponents && (
              <ul className="mb-6">
                {componentes.map(item => (
                  <CustomSidebarItem
                    key={item.id}
                    label={item.label}
                    active={active === item.id}
                    onClick={() => handleSelect(item.id)}
                  />
                ))}
              </ul>
            )}

            {/* ESTILOS */}
            <button
              onClick={() => setOpenStyles(v => !v)}
              className={`flex w-full items-center justify-between px-2 py-2 text-xs font-semibold uppercase transition-colors
                ${openStyles ? "text-primary" : "text-terciary"}
              `}
            >
              Estilos

              <HiChevronRight
                size={14}
                className={`transition-transform
                  ${openStyles ? "rotate-90 text-primary" : "text-terciary"}
                `}
              />
            </button>

            {openStyles && (
              <ul className="mb-6">
                {estilos.map(item => (
                  <CustomSidebarItem
                    key={item.id}
                    label={item.label}
                    active={active === item.id}
                    onClick={() => handleSelect(item.id)}
                  />
                ))}
              </ul>
            )}

          </div>
        </aside>
      </>
    );
  }
);

export default CustomSidebar;
