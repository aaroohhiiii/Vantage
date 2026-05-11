import type { Metadata } from "next"
import Link from "next/link"
import { Download, ArrowLeft } from "lucide-react"

import { getAuditById } from "@/lib/supabase"
import { HeroSection } from "@/components/AuditResults/HeroSection"
import { AnalyticsGrid } from "@/components/AuditResults/AnalyticsGrid"
import { ToolInsightsSection } from "@/components/AuditResults/ToolInsightsSection"
import { SignalsSection } from "@/components/AuditResults/SignalsSection"
import { MethodologySection } from "@/components/AuditResults/MethodologySection"
import PixelBlast from "@/components/ui/PixelBlast"

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const audit = await getAuditById(id)

  if (!audit) return { title: "Audit Not Found — Vantage" }

  const savings = audit.totalMonthlySavings
  const title = savings > 0 
    ? `Potential savings of $${savings.toFixed(0)}/mo found` 
    : "AI spend is optimized"

  return {
    title: `Audit Results — ${title}`,
    description: "Personalized AI tool spend audit and optimization report."
  }
}

export default async function AuditPage({ params }: PageProps) {
  const { id } = await params
  const audit = await getAuditById(id)

  if (!audit) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
        <h1 className="mb-2 text-2xl font-bold text-[#0A0A0A]">Audit not found</h1>
        <p className="mb-6 text-[#4B5563]">This audit doesn&apos;t exist or has expired.</p>
        <Link href="/" className="rounded-xl bg-[#00C853] px-6 py-3 text-sm font-semibold text-white">
          Run a New Audit
        </Link>
      </main>
    )
  }

  const totalSpend = audit.input.tools.reduce((acc, t) => acc + Math.max(0, t.monthlySpend), 0)

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black">
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

      {/* Content */}
      <div className="relative z-10">
        {/* Navbar */}
        <header className="sticky top-0 z-50 border-b border-gray-800 bg-black/80 backdrop-blur-md px-6 py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/Logo.png"
                alt="Vantage"
                className="h-8 w-8 rounded-lg"
              />
              <span className="text-lg font-bold tracking-tight text-white">Vantage</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="h-3 w-3" /> New Audit
              </Link>
              <button className="flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-900/50 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors">
                <Download className="h-3.3 w-3" />
              </button>
            </div>
          </div>
        </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <HeroSection audit={audit} totalSpend={totalSpend} />
        
        <AnalyticsGrid audit={audit} totalSpend={totalSpend} />
        
        <ToolInsightsSection audit={audit} />
        
        <SignalsSection audit={audit} />
        
        <MethodologySection audit={audit} />

        {/* Footer */}
        <footer className="mt-20 border-t border-gray-800 py-10 text-center">
          <p className="flex items-center justify-center gap-2 text-[10px] font-medium text-gray-400">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-800 text-[8px] text-gray-400">🛡️</span>
            Your data is secure and never stored without permission.
          </p>
        </footer>
      </main>
      </div>
    </div>
  )
}
