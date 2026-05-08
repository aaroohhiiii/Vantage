import Link from "next/link"
import HeroDashboard from "@/components/HeroDashboard"
import SpendForm from "@/components/SpendForm"

const SOCIAL_PROOF_TOOLS = [
  { name: "Cursor", color: "#4F8CFF" },
  { name: "Claude", color: "#CC785C" },
  { name: "ChatGPT", color: "#10A37F" },
  { name: "Copilot", color: "#6E5494" },
  { name: "Gemini", color: "#4285F4" },
  { name: "Windsurf", color: "#60A5FA" },
  { name: "OpenAI API", color: "#94A3B8" },
]

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden" style={{ background: "#050816" }}>
      {/* ── Background: radial gradient + dot grid ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(27,43,90,0.8) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(139,92,246,0.06) 0%, transparent 60%)",
        }}
      />
      <div className="dot-grid pointer-events-none absolute inset-0 z-0 opacity-40" />

      {/* ── Animated blur orbs ── */}
      <div
        className="animate-orb-drift pointer-events-none absolute left-[10%] top-[15%] z-0 h-80 w-80 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #4F8CFF 0%, transparent 70%)" }}
      />
      <div
        className="animate-orb-drift-2 pointer-events-none absolute right-[8%] top-[30%] z-0 h-64 w-64 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)" }}
      />
      <div
        className="animate-orb-drift-3 pointer-events-none absolute bottom-[20%] left-[30%] z-0 h-96 w-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #4F8CFF 0%, transparent 70%)" }}
      />

      {/* ── Navbar ── */}
      <header className="relative z-10 mx-auto w-full max-w-7xl px-6 py-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-bold"
              style={{ background: "linear-gradient(135deg, #4F8CFF 0%, #8B5CF6 100%)" }}
            >
              P
            </div>
            <span
              className="text-lg font-semibold tracking-tight text-white"
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
                background: "rgba(79,140,255,0.1)",
                border: "1px solid rgba(79,140,255,0.2)",
                color: "#76A9FF",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#4F8CFF] animate-pulse-glow" />
              Powered by Credex
            </div>
            <a
              href="#spend-form"
              className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold text-white"
            >
              Free Audit
            </a>
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-12 pt-12 lg:px-8 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Left: Copy */}
          <div className="flex flex-col items-start">
            {/* Pill badge */}
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium"
              style={{
                background: "rgba(52,211,153,0.1)",
                border: "1px solid rgba(52,211,153,0.2)",
                color: "#34D399",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] animate-pulse-glow" />
              Free · No signup required · 90 seconds
            </div>

            {/* Headline */}
            <h1
              className="mb-5 text-5xl font-bold leading-[1.1] tracking-tight text-gradient sm:text-6xl lg:text-7xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Stop overspending
              <br />
              on AI tools.
            </h1>

            {/* Subheadline */}
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-[#94A3B8]">
              Audit your AI stack in 90 seconds. Find redundant subscriptions,
              overpriced plans, and hidden savings opportunities instantly.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#spend-form"
                className="btn-primary rounded-2xl px-7 py-3.5 text-sm font-semibold text-white"
                id="hero-cta-audit"
              >
                Run Free Audit →
              </a>
              <a
                href="#spend-form"
                className="btn-ghost rounded-2xl px-7 py-3.5 text-sm font-semibold text-white/80"
                id="hero-cta-example"
              >
                See Example Report
              </a>
            </div>

            {/* Social proof micro-text */}
            <p className="mt-6 text-xs text-[#64748B]">
              Trusted by engineering managers at YC startups and beyond.
            </p>
          </div>

          {/* Right: Dashboard mockup */}
          <div className="flex justify-center lg:justify-end">
            <HeroDashboard />
          </div>
        </div>
      </section>

      {/* ── Social proof tool strip ── */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
        <div
          className="rounded-2xl px-6 py-5"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-[#475569]">
            Audits tools you already pay for
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {SOCIAL_PROOF_TOOLS.map((tool) => (
              <div
                key={tool.name}
                className="flex items-center gap-2 rounded-full px-4 py-2"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: tool.color }}
                />
                <span className="text-xs font-medium text-[#94A3B8]">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Value props ── */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: "✂️",
              title: "Cut redundancy",
              desc: "Identify tools that overlap in functionality and consolidate spend.",
            },
            {
              icon: "📊",
              title: "Right-size plans",
              desc: "Find team plans with too few users or monthly billing you could annualize.",
            },
            {
              icon: "⚡",
              title: "Unlock credits",
              desc: "Credex offers discounted AI infrastructure credits for high-spend teams.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="glass-card glass-card-hover rounded-2xl p-6"
            >
              <div className="mb-3 text-2xl">{item.icon}</div>
              <h3
                className="mb-2 text-base font-semibold text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#64748B]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Form section ── */}
      <section
        id="spend-form"
        className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-8 px-6 pb-24 lg:px-8"
      >
        {/* Section header */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#4F8CFF]">
            Start your audit
          </p>
          <h2
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What AI tools does your team pay for?
          </h2>
          <p className="mt-3 text-[#64748B]">
            3 quick steps · completely free · no email required to see results
          </p>
        </div>

        <SpendForm />
      </section>

      {/* ── Footer ── */}
      <footer
        className="relative z-10"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div
                className="flex h-6 w-6 items-center justify-center rounded text-white text-xs font-bold"
                style={{ background: "linear-gradient(135deg, #4F8CFF 0%, #8B5CF6 100%)" }}
              >
                P
              </div>
              <span className="text-sm font-medium text-white/60">Prune</span>
            </div>
            <p className="text-xs text-[#334155]">
              A{" "}
              <Link
                href="https://credex.rocks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4F8CFF] hover:text-[#76A9FF] transition-colors"
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
