// import Link from "next/link"
// import { motion } from "framer-motion"
import { CheckCircle2, TrendingUp, Shield, Zap } from "lucide-react"
import Image from "next/image"
import HeroDashboard from "@/components/HeroDashboard"
import PixelBlast from "@/components/ui/PixelBlast"
export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black">
      {/* Background PixelBlast */}
      <div className="absolute inset-0 z-0">
        <PixelBlast
          variant="square"
          pixelSize={4}
          color="#9de396"
          patternScale={2}
          patternDensity={1}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.5}
          edgeFade={0.25}
          transparent
        />
      </div>

      <div className="dot-grid pointer-events-none absolute inset-0 z-0 opacity-10" />


      {/* ── Navbar ── */}
      <header className="relative z-10 border-b border-gray-800 bg-black/80 backdrop-blur-lg">
        <div className="mx-auto w-full max-w-7xl px-6 py-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/Logo.png"
              alt="Vantage"
              width={44}
              height={44}
              className="rounded-xl shadow-lg"
            />
            <span
              className="text-xl font-bold tracking-tight text-white"
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
                background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
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
              className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Stop overspending
              <br />
              <span className="bg-gradient-to-r from-[#00C853] to-[#00A846] bg-clip-text text-transparent">
                on AI tools.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-gray-300">
              Audit your AI stack in  seconds. Find redundant subscriptions,
              overpriced plans, and hidden savings opportunities instantly.
            </p>

            {/* Trust indicators */}
            <div className="mb-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#00C853]" />
                <span className="text-sm text-gray-400">Free Of Cost </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#00C853]" />
                <span className="text-sm text-gray-400">90-second audit</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#00C853]" />
                <span className="text-sm text-gray-400">Enterprise-grade security</span>
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
              <div className="text-sm text-gray-400">
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
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Everything you need to optimize AI spend
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
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
              className="rounded-2xl border border-gray-800 bg-gray-900/50 p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#00C853] to-[#00A846] text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
