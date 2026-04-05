const ComponentPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-muted flex">

      {/* SIDEBAR */}
      <aside
        className="
          fixed top-0 left-0 z-50
          h-screen w-full xs:w-72

          bg-surface-glass
          backdrop-blur-xl

          border-r border-border
          shadow-xl

          -translate-x-full
          lg:translate-x-0
        "
      >
        {/* HEADER */}
        <div className="px-5 pt-5 pb-4 border-b border-border bg-surface-soft">
          <div className="h-6 w-28 bg-muted rounded-md animate-pulse" />

          <div className="mt-4">
            <div className="h-10 w-full bg-muted rounded-xl animate-pulse" />
          </div>
        </div>

        {/* ITEMS */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="h-4 rounded bg-muted/70 animate-pulse"
            />
          ))}
        </div>

        {/* FOOTER */}
        <div className="px-4 py-3 border-t border-border">
          <div className="h-3 w-24 bg-muted rounded animate-pulse" />
        </div>
      </aside>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header
          className="
            fixed top-0 z-30 w-full

            bg-surface-glass
            backdrop-blur-xl

            border-b border-border
            shadow-sm
          "
        >
          <div className="h-20 flex items-center justify-between px-5 md:px-8">
            <div className="space-y-2">
              <div className="h-6 w-40 bg-muted rounded-md animate-pulse" />
              <div className="h-4 w-64 bg-muted/70 rounded animate-pulse" />
            </div>

            <div className="lg:hidden h-10 w-10 bg-muted rounded-xl animate-pulse" />
          </div>
        </header>

        {/* MAIN */}
        <main className="pt-28 px-4 md:px-8 pb-16 space-y-16">

          {[1, 2, 3].map((i) => (
            <section key={i} className="space-y-8">

              {/* SECTION TITLE */}
              <div className="flex items-center gap-3">
                <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* CARDS */}
              <div className="space-y-10">
                {[1, 2].map((j) => (
                  <div
                    key={j}
                    className="
                      h-52 w-full

                      rounded-2xl
                      border border-border

                      bg-surface-soft
                      backdrop-blur

                      animate-pulse
                    "
                  />
                ))}
              </div>

            </section>
          ))}

        </main>
      </div>
    </div>
  );
};

export default ComponentPageSkeleton;