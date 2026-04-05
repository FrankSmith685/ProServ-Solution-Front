import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
} from "react";
import { catalog } from "./documentation";
import CustomSidebar from "@/components/ui/layout/ComponentSidebar";
import ComponentHeader from "@/components/ui/layout/ComponentHeader";
import ComponentPreviewCard from "@/components/ui/preview/ComponentPreviewCard";

const HEADER_OFFSET = 96;

const ComponentPage: FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const isProgrammaticScroll = useRef(false);
  const [manualActiveId, setManualActiveId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const filteredCatalog = useMemo(() => {
    const term = searchValue.toLowerCase().trim();
    if (!term) return catalog;

    return catalog.filter(
      (item) =>
        item.label.toLowerCase().includes(term) ||
        item.id.toLowerCase().includes(term)
    );
  }, [searchValue]);

  const scrollTo = useCallback((id: string) => {
    const el = document.querySelector<HTMLElement>(`[data-id="${id}"]`);
    if (!el) return;

    isProgrammaticScroll.current = true;
    setManualActiveId(id);

    const y = el.offsetTop - HEADER_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });

    setMenuOpen(false);
  }, []);

  useEffect(() => {
    const unlock = () => {
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
      (entries) => {
        if (isProgrammaticScroll.current) return;

        const visible = entries.find((e) => e.isIntersecting);
        if (!visible) return;

        const target = visible.target as HTMLElement;
        setActiveId(target.dataset.id ?? null);
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filteredCatalog]);

  const sidebarActive = manualActiveId ?? activeId;

  const groupedItems = useMemo(() => {
    return [
      {
        title: "Componentes",
        items: filteredCatalog.filter((i) => i.type === "component"),
      },
      {
        title: "Estilos",
        items: filteredCatalog.filter((i) => i.type === "style"),
      },
    ];
  }, [filteredCatalog]);

  return (
    <div className="min-h-screen bg-muted w-full flex">

      {/* SIDEBAR DESKTOP */}
      <div className="hidden lg:block w-72 shrink-0 border-r border-border bg-surface">
        <CustomSidebar
          items={filteredCatalog}
          active={sidebarActive}
          onSelect={scrollTo}
          isOpen={true}
          searchValue={searchValue}
          onSearch={setSearchValue}
        />
      </div>

      {/* SIDEBAR MOBILE */}
      <CustomSidebar
        items={filteredCatalog}
        active={sidebarActive}
        onSelect={scrollTo}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        searchValue={searchValue}
        onSearch={setSearchValue}
      />

      {/* CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <ComponentHeader
          title="UI Kit"
          subtitle="Componentes, colores y estilos"
          onMenuClick={() => setMenuOpen(true)}
        />

        {/* MAIN */}
        <main className="pt-28 px-4 md:px-8 pb-16 space-y-16">

          {groupedItems.map(({ title, items }) =>
            items.length ? (
              <section key={title} className="space-y-8">

                {/* SECTION TITLE */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {title}
                  </span>

                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* COMPONENT LIST */}
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