"use client"

import Link from "next/link"
import { CheckCircle2, TrendingUp, Shield, Zap, ChevronDown } from "lucide-react"
import Image from "next/image"
import HeroDashboard from "@/components/HeroDashboard"
import PixelBlast from "@/components/ui/PixelBlast"
import { useEffect, useState } from "react"
import { trackEvent } from "@/lib/analytics"

export default function Home() {
  useEffect(() => {
    trackEvent('page_view_landing')
  }, [])

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

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
            <Link
              href="/audit/new"
              className="btn-primary rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-lg"
            >
              Free Audit
            </Link>
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
          
            <TrendingUp className="h-4 w-4 text-[#00C853]" />

            {/* Headline */}
            <h1
              className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
            Discover 
              <br />
              <span className="bg-gradient-to-r from-[#00C853] to-[#00A846] bg-clip-text text-transparent">
                hidden waste  
              </span>
              <br />
              in your AI tooling stack.
            </h1>

            {/* Subheadline */}
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-gray-300">
              Free audit. No login. See your savings in 60 seconds.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/audit/new"
                className="rounded-2xl bg-gradient-to-r from-[#00C853] to-[#00A846] px-8 py-4 text-sm font-semibold text-white shadow-xl hover:shadow-2xl transition-all duration-300"
                id="hero-cta-audit"
              >
                Audit My AI Spend →
              </Link>
            </div>

            {/* Social Proof Block */}
            <div className="mt-12 space-y-6 border-t border-gray-800 pt-10">
              <div className="rounded-xl bg-gray-900/40 p-4 border border-gray-800/50 backdrop-blur-sm">
                <p className="text-sm italic text-gray-300 mb-2">
                  &quot;Found $340/month in savings we didn&apos;t know about. Took 90 seconds.&quot;
                </p>
                <p className="text-xs font-semibold text-[#00C853]">
                  — Head of Engineering, Series A SaaS company
                </p>
              </div>
              <div className="rounded-xl bg-gray-900/40 p-4 border border-gray-800/50 backdrop-blur-sm">
                <p className="text-sm italic text-gray-300 mb-2">
                  &quot;Already switched from GitHub Copilot Business to Cursor Pro based on this. Saved $18/user/month with no drop in productivity.&quot;
                </p>
                <p className="text-xs font-semibold text-[#00C853]">
                  — CTO, 12-person startup
                </p>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
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
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-800 bg-gray-900/30 p-8 shadow-sm hover:border-[#00C85330] transition-all duration-300"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#00C85310] text-[#00C853] border border-[#00C85320]">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto border-t border-gray-800 pt-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Your Questions.Answered.
            </h2>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: "Is this actually free?",
                a: "Yes. There's no plan, no credit card, no login required. We show you the results first, then optionally ask for your email."
              },
              {
                q: "How do you calculate  savings?",
                a: "We look at public pricing for each tool and compare it to the most cost-effective alternative. For example, if you're using GitHub Copilot Business for a team of 10, we compare that to the cost of using Cursor Pro for the same team. We also factor in the cost of unused seats, redundant features, and API usage patterns."
              },
              {
                q: "How current is the pricing data?",
                a: "Pricing is verified weekly against official vendor pages. Every number in the audit cites its source URL and verification date."
              },
              {
                q: "Is my data shared or sold?",
                a: "No. Your audit data is stored to generate your shareable link. We don't sell or share it. Shared links strip identifying details."
              },
              {
                q: "What tools do you cover?",
                a: "Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, and Windsurf. More tools added regularly."
              }
            ].map((faq, i) => (
              <div key={i} className="group">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full rounded-2xl border border-gray-800/50 bg-white/10 backdrop-blur-sm p-6 hover:bg-white/15 transition-all duration-300 text-left"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">{faq.q}</h3>
                    <ChevronDown 
                      className={`w-5 h-5 text-[#00C853] transition-transform duration-300 ${
                        expandedFaq === i ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>
                
                {expandedFaq === i && (
                  <div className="mt-2 rounded-2xl border border-gray-800/30 bg-white/5 backdrop-blur-sm p-6 animate-in slide-in-from-top-2 duration-300">
                    <p className="text-gray-300 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-32 text-center">
          <Link
            href="/audit/new"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-black shadow-xl hover:bg-gray-100 transition-all duration-300"
          >
            Start Your Audit Now <TrendingUp className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-xs text-gray-500 uppercase tracking-widest">Takes 60 seconds • No credit card</p>
        </div>
      </section>
    </main>
  )
}
