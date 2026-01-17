const ComponentPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <aside
        className="
          fixed top-0 left-0 z-50
          h-screen w-full xs:w-72
          bg-white
          border-r border-primary-alpha-8
          shadow-xl shadow-black/5
          -translate-x-full
          lg:translate-x-0
        "
      >
        {/* HEADER SIDEBAR */}
        <div className="px-4 pt-4 pb-3 border-b border-primary-alpha-8">
          <div className="h-12 flex items-center justify-between">
            <div className="h-6 w-28 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="mt-3">
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* LISTA ITEMS */}
        <div className="h-[calc(100vh-5rem)] overflow-y-auto px-3 pb-4 space-y-3">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </aside>

      {/* MAIN */}
      <div className="lg:ml-72">

        {/* HEADER */}
        <header
          className="
            fixed top-0 z-30 w-full
            backdrop-blur bg-white/80
            border-b border-primary-alpha-8
            shadow-sm shadow-black/5
          "
        >
          <div className="h-20 flex items-center justify-between px-4 md:px-8">
            <div className="space-y-2">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
            </div>

            <div className="lg:hidden h-10 w-10 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </header>

        {/* CONTENT */}
        <main className="pt-28 px-4 md:px-8 pb-16 space-y-16">
          {[1, 2, 3].map(i => (
            <section key={i} className="space-y-6">
              <div className="h-4 w-32 bg-gray-300 rounded animate-pulse" />

              <div className="space-y-8">
                {[1, 2].map(j => (
                  <div
                    key={j}
                    className="h-52 w-full bg-gray-200 rounded-xl animate-pulse"
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
