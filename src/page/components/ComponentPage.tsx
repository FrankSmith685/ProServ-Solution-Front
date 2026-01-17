import { useCallback, useEffect, useMemo, useRef, useState, type FC } from "react";
import { catalog } from "./documentation";
import CustomSidebar from "@/components/ui/layout/ComponentSidebar";
import ComponentHeader from "@/components/ui/layout/ComponentHeader";
import ComponentPreviewCard from "@/components/ui/preview/ComponentPreviewCard";

const HEADER_OFFSET = 96;

const ComponentPage: FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const isProgrammaticScroll = useRef<boolean>(false);
  const [manualActiveId, setManualActiveId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const filteredCatalog = useMemo(() => {
    const term = searchValue.toLowerCase().trim();
    if (!term) return catalog;

    return catalog.filter(item =>
      item.label.toLowerCase().includes(term) ||
      item.id.toLowerCase().includes(term)
    );
  }, [searchValue]);

  const scrollTo = useCallback((id: string): void => {
    const el = document.querySelector<HTMLElement>(`[data-id="${id}"]`);
    if (!el) return;

    isProgrammaticScroll.current = true;
    setManualActiveId(id);

    const y = el.offsetTop - HEADER_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });

    setMenuOpen(false);
  }, []);

  useEffect(() => {
    const unlock = (): void => {
      if (!isProgrammaticScroll.current) return;
      isProgrammaticScroll.current = false;
      setManualActiveId(null);
    };

    window.addEventListener("wheel", unlock, { passive: true });
    window.addEventListener("touchmove", unlock, { passive: true });
    window.addEventListener("keydown", unlock);

    return () => {
      window.removeEventListener("wheel", unlock);
      window.removeEventListener("touchmove", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-id]");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]): void => {
        if (isProgrammaticScroll.current) return;

        const visible = entries.find(e => e.isIntersecting);
        if (!visible) return;

        const target = visible.target as HTMLElement;
        setActiveId(target.dataset.id ?? null);
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [filteredCatalog]);

  const sidebarActive: string | null = manualActiveId ?? activeId;

  const groupedItems = useMemo(() => {
    return [
      {
        title: "Componentes",
        items: filteredCatalog.filter(i => i.type === "component"),
      },
      {
        title: "Estilos",
        items: filteredCatalog.filter(i => i.type === "style"),
      },
    ];
  }, [filteredCatalog]);

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomSidebar
        items={filteredCatalog}
        active={sidebarActive}
        onSelect={scrollTo}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        searchValue={searchValue}
        onSearch={setSearchValue}
      />


      <div className="lg:ml-72">
        <ComponentHeader
          title="UI Kit"
          subtitle="Componentes, colores y estilos"
          onMenuClick={() => setMenuOpen(true)}
        />

        <main className="pt-28 px-4 md:px-8 pb-16 space-y-16">
          {groupedItems.map(({ title, items }) =>
            items.length ? (
              <section key={title}>
                <p className="mb-6 text-xs font-bold uppercase text-gray-500">
                  {title}
                </p>

                <div className="space-y-12">
                  {items.map(({ id, label, Component }) => (
                    <ComponentPreviewCard key={id} id={id} label={label}>
                      <Component />
                    </ComponentPreviewCard>
                  ))}
                </div>
              </section>
            ) : null
          )}
        </main>
      </div>
    </div>
  );
};

export default ComponentPage;
