export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f9fafb] px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.02)] animate-pulse">
        {/* ── Navbar Skeleton ── */}
        <header className="flex items-center justify-between border-b border-[#f3f4f6] px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-200"></div>
            <div className="h-5 w-16 rounded bg-gray-200"></div>
          </div>
          <div className="h-9 w-24 rounded-lg bg-gray-100"></div>
        </header>

        <div className="p-6 sm:p-8">
          {/* ════════════════════════════════════
              HERO SECTION SKELETON
          ════════════════════════════════════ */}
          <section className="mb-8 overflow-hidden rounded-[20px] bg-gray-100">
            <div className="grid grid-cols-1 items-center gap-10 p-8 sm:p-10 lg:grid-cols-[1fr_auto_1.2fr]">
              {/* Left: Savings */}
              <div>
                <div className="mb-3 h-4 w-40 rounded bg-gray-200"></div>
                <div className="mb-4 h-16 w-64 rounded bg-gray-300 sm:h-20 sm:w-80"></div>
                <div className="mb-6 h-5 w-48 rounded bg-gray-200"></div>
                <div className="h-10 w-36 rounded-xl bg-gray-200"></div>
              </div>

              {/* Center: Glowing Circle */}
              <div className="mx-auto h-36 w-36 shrink-0 rounded-full bg-gray-200 sm:h-44 sm:w-44 lg:mx-6"></div>

              {/* Right: AI Summary */}
              <div className="rounded-xl border border-gray-200 bg-white/50 p-6">
                <div className="mb-4 h-5 w-48 rounded bg-gray-200"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-gray-200"></div>
                  <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                </div>
                <div className="my-5 h-px w-full bg-gray-200" />
                <div className="mb-3 h-4 w-32 rounded bg-gray-200"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-gray-200"></div>
                  <div className="h-4 w-5/6 rounded bg-gray-200"></div>
                </div>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════
              BODY GRID SKELETON
          ════════════════════════════════════ */}
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.6fr_1fr]">
            {/* Left Column: Tool Breakdown */}
            <section>
              <div className="mb-5 h-6 w-32 rounded bg-gray-200"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded bg-gray-200"></div>
                        <div className="space-y-2">
                          <div className="h-5 w-24 rounded bg-gray-200"></div>
                          <div className="h-3 w-16 rounded bg-gray-100"></div>
                        </div>
                      </div>
                      <div className="space-y-2 text-right">
                        <div className="ml-auto h-5 w-16 rounded bg-gray-200"></div>
                        <div className="ml-auto h-3 w-12 rounded bg-gray-100"></div>
                      </div>
                    </div>
                    <div className="mb-5 flex items-start gap-2.5">
                      <div className="mt-1 h-4 w-4 rounded bg-gray-200"></div>
                      <div className="w-full space-y-2">
                        <div className="h-4 w-40 rounded bg-gray-200"></div>
                        <div className="h-3 w-full max-w-sm rounded bg-gray-100"></div>
                      </div>
                    </div>
                    <div className="h-10 w-full rounded-lg bg-gray-50"></div>
                  </div>
                ))}
              </div>
            </section>

            {/* Right Column: Sidebar */}
            <div className="space-y-6">
              {/* Savings Summary Card Skeleton */}
              <section className="rounded-[20px] border border-gray-100 bg-gray-50 p-6">
                <div className="mb-5 h-5 w-32 rounded bg-gray-200"></div>
                <div className="mb-5 space-y-4">
                  <div className="flex justify-between">
                    <div className="h-4 w-24 rounded bg-gray-200"></div>
                    <div className="h-4 w-16 rounded bg-gray-200"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-32 rounded bg-gray-200"></div>
                    <div className="h-4 w-16 rounded bg-gray-200"></div>
                  </div>
                </div>
                <div className="my-5 h-px w-full bg-gray-200" />
                <div className="mb-6 space-y-3">
                  <div className="h-4 w-24 rounded bg-gray-200"></div>
                  <div className="h-10 w-32 rounded bg-gray-300"></div>
                  <div className="h-6 w-20 rounded bg-gray-200"></div>
                </div>
                <div className="h-20 w-full rounded-xl bg-white border border-gray-100"></div>
              </section>

              {/* Email Capture Card Skeleton */}
              <section className="rounded-[20px] border border-gray-100 bg-gray-50 p-6">
                <div className="mb-4 flex gap-4">
                  <div className="w-full space-y-2">
                    <div className="h-5 w-48 rounded bg-gray-200"></div>
                    <div className="h-3 w-full rounded bg-gray-200"></div>
                    <div className="h-3 w-3/4 rounded bg-gray-200"></div>
                  </div>
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-gray-200"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-10 w-full rounded-xl bg-white"></div>
                  <div className="h-10 w-full rounded-xl bg-white"></div>
                  <div className="h-10 w-full rounded-xl bg-gray-200"></div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
