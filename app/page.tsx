import Link from "next/link"
import HeroDashboard from "@/components/HeroDashboard"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white">
      <div className="dot-grid pointer-events-none absolute inset-0 z-0 opacity-10" />

      {/* ── Animated blur orbs ── */}
      <div
        className="animate-orb-drift pointer-events-none absolute left-[10%] top-[15%] z-0 h-80 w-80 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(0,200,83,0.24) 0%, transparent 70%)" }}
      />
      <div
        className="animate-orb-drift-2 pointer-events-none absolute right-[8%] top-[30%] z-0 h-64 w-64 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)" }}
      />
      <div
        className="animate-orb-drift-3 pointer-events-none absolute bottom-[20%] left-[30%] z-0 h-96 w-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(0,200,83,0.18) 0%, transparent 70%)" }}
      />

      {/* ── Navbar ── */}
      <header className="relative z-10 border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto w-full max-w-7xl px-6 py-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-bold"
              style={{ background: "#00C853" }}
            >
              P
            </div>
            <span
              className="text-lg font-semibold tracking-tight text-[#0A0A0A]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Prune
            </span>
          </div>

          {/* Badge */}
          <div className="flex items-center gap-3">
            <div
              className="hidden items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium sm:flex"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                color: "#00C853",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#00C853] animate-pulse-glow" />
              Powered by Credex
            </div>
            <a
              href="/audit/new"
              className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold text-white"
            >
              Free Audit
            </a>
          </div>
        </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-12 pt-12 lg:px-8 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Left: Copy */}
          <div className="flex flex-col items-start">
            {/* Pill badge */}
            

            {/* Headline */}
            <h1
              className="mb-5 text-5xl font-bold leading-[1.1] tracking-tight text-[#0A0A0A] sm:text-6xl lg:text-7xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Stop overspending
              <br />
              on AI tools.
            </h1>

            {/* Subheadline */}
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-[#4B5563]">
              Audit your AI stack in 90 seconds. Find redundant subscriptions,
              overpriced plans, and hidden savings opportunities instantly.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/audit/new"
                className="rounded-2xl bg-[#00C853] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#00A846]"
                id="hero-cta-audit"
              >
                Run Free Audit →
              </a>
             
            </div>

            {/* Social proof micro-text */}
            {/* <p className="mt-6 text-xs text-[#9CA3AF]">
              Trusted by engineering managers at YC startups and beyond.
            </p> */}
          </div>

          {/* Right: Dashboard mockup */}
          <div className="flex justify-center lg:justify-end">
            <HeroDashboard />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-[#111827] bg-[#0A0A0A]">
        <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div
                className="flex h-6 w-6 items-center justify-center rounded text-white text-xs font-bold"
                style={{ background: "#00C853" }}
              >
                P
              </div>
              <span className="text-sm font-medium text-[#9CA3AF]">Prune</span>
            </div>
            <p className="text-xs text-[#9CA3AF]">
              A{" "}
              <Link
                href="https://credex.rocks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9CA3AF] transition-colors hover:text-[#00C853]"
              >
                Credex
              </Link>{" "}
              product · Discounted AI infrastructure credits for startups
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
