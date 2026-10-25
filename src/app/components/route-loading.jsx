
export default function RouteLoading({
  title = "Loading Bazar Dor...",
  showCards = false,
}) {
  return (
    <section
      className="bazar-container min-h-[60vh] py-10 sm:py-14"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="mb-8 flex items-center gap-3">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-green-100 border-t-green-700" />

        <p className="text-sm font-semibold text-gray-600">
          {title}
        </p>
      </div>

      {showCards && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
            >
              <div className="h-40 animate-pulse bg-green-50 sm:h-44" />

              <div className="space-y-4 p-5">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />

                <div className="border-t border-gray-100 pt-4">
                  <div className="h-6 w-1/2 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
