// import Link from "next/link"
// import { motion } from "framer-motion"
import { CheckCircle2, TrendingUp, Shield, Zap } from "lucide-react"
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
      <header className="relative z-10 border-b border-[#E5E7EB] bg-white/80 backdrop-blur-lg">
        <div className="mx-auto w-full max-w-7xl px-6 py-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white text-sm font-bold shadow-lg"
              style={{ background: "linear-gradient(135deg, #00C853 0%, #00A846 100%)" }}
            >
              P
            </div>
            <span
              className="text-xl font-bold tracking-tight text-[#0A0A0A]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Vantage
            </span>
          </div>

          {/* Badge */}
          <div className="flex items-center gap-4">
            <div
              className="hidden items-center gap-2 rounded-full px-4 py-2 text-xs font-medium sm:flex shadow-sm"
              style={{
                background: "linear-gradient(135deg, #F0FDF4 0%, #E6FFFA 100%)",
                border: "1px solid #00C85320",
                color: "#00C853",
              }}
            >
              <Shield className="h-3.5 w-3.5" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#00C853] animate-pulse-glow" />
              Powered by Credex
            </div>
            <a
              href="/audit/new"
              className="btn-primary rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-lg"
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
            <div className="mb-6 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#F0FDF4] to-[#E6FFFA] px-4 py-2 shadow-sm border border-[#00C85320]">
              <TrendingUp className="h-4 w-4 text-[#00C853]" />
              <span className="text-sm font-medium text-[#00C853]">Save up to 40% on AI spend</span>
            </div>

            {/* Headline */}
            <h1
              className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-[#0A0A0A] sm:text-6xl lg:text-7xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Stop overspending
              <br />
              <span className="bg-gradient-to-r from-[#00C853] to-[#00A846] bg-clip-text text-transparent">
                on AI tools.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-[#4B5563]">
              Audit your AI stack in 90 seconds. Find redundant subscriptions,
              overpriced plans, and hidden savings opportunities instantly.
            </p>

            {/* Trust indicators */}
            <div className="mb-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#00C853]" />
                <span className="text-sm text-[#4B5563]">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#00C853]" />
                <span className="text-sm text-[#4B5563]">90-second audit</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#00C853]" />
                <span className="text-sm text-[#4B5563]">Enterprise-grade security</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="/audit/new"
                className="rounded-2xl bg-gradient-to-r from-[#00C853] to-[#00A846] px-8 py-4 text-sm font-semibold text-white shadow-xl hover:shadow-2xl transition-all duration-300"
                id="hero-cta-audit"
              >
                Run Free Audit →
              </a>
              <div className="text-sm text-[#4B5563]">
                Trusted by 500+ engineering teams
              </div>
            </div>
          </div>

          {/* Right: Dashboard mockup */}
          <div className="flex justify-center lg:justify-end">
            <HeroDashboard />
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#0A0A0A] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Everything you need to optimize AI spend
          </h2>
          <p className="text-lg text-[#4B5563] max-w-2xl mx-auto">
            Get comprehensive insights and actionable recommendations in seconds, not weeks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: TrendingUp,
              title: "Cost Optimization",
              description: "Identify overspending and find the perfect plans for your team size and usage patterns."
            },
            {
              icon: Shield,
              title: "Security & Compliance",
              description: "Enterprise-grade security with SOC 2 compliance and data privacy protections."
            },
            {
              icon: Zap,
              title: "Instant Insights",
              description: "Get detailed audit reports and savings opportunities in under 90 seconds."
            }
          ].map((feature, ) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#00C853] to-[#00A846] text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-[#0A0A0A] mb-3">{feature.title}</h3>
              <p className="text-[#4B5563] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
