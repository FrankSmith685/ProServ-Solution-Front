import { FaSpinner } from "react-icons/fa";

export const RegisterSkeleton = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans w-full relative">

      {/* Fondo */}
      <div className="absolute inset-0 bg-primary/80 z-0" />

      {/* Header */}
      <div className="relative z-10 h-20 flex items-center justify-center">
        <div className="w-36 h-10 bg-white/30 rounded animate-pulse" />
      </div>

      {/* Body */}
      <div className="relative z-10 flex-1 flex items-center justify-center responsive-padding">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-10">

          {/* FORM SKELETON */}
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl space-y-4 animate-pulse">
            <div className="h-7 w-2/3 bg-gray-200 rounded mx-auto" />
            <div className="h-4 w-3/4 bg-gray-100 rounded mx-auto" />

            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-11 bg-gray-100 rounded" />
            ))}

            <div className="h-11 bg-primary/40 rounded mt-4" />
          </div>

          {/* RIGHT SECTION */}
          <div className="hidden lg:flex flex-1 flex-col gap-4 animate-pulse">
            <div className="h-8 w-2/3 bg-white/30 rounded" />
            <div className="h-4 w-full bg-white/20 rounded" />

            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-28 bg-white/15 rounded-xl"
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* STEPS */}
      <div className="relative z-10 flex justify-center gap-3 pb-6 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-10 h-2 bg-white/40 rounded-full" />
        ))}
      </div>

      {/* Loading icon */}
      <div className="absolute bottom-6 right-6 z-20">
        <FaSpinner className="animate-spin text-white text-xl" />
      </div>
    </div>
  );
};
