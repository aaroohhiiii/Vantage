import type { Metadata } from "next"
import Link from "next/link"
import { getAuditById } from "@/lib/supabase"
import { HeroSection } from "@/components/AuditResults/HeroSection"
import { AnalyticsGrid } from "@/components/AuditResults/AnalyticsGrid"
import { ToolInsightsSection } from "@/components/AuditResults/ToolInsightsSection"
import { SignalsSection } from "@/components/AuditResults/SignalsSection"
import { MethodologySection } from "@/components/AuditResults/MethodologySection"
import { ResultsNavbar } from "@/components/AuditResults/ResultsNavbar"
import PixelBlast from "@/components/ui/PixelBlast"
import { trackEvent } from "@/lib/analytics"

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

  if (audit) {
    trackEvent('results_viewed', audit.id)
  }

  if (!audit) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
        <h1 className="mb-2 text-2xl font-bold text-[#0A0A0A]">Audit not found</h1>
        <p className="mb-6 text-[#4B5563]">This audit doesnt exist or has expired.</p>
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

      <div className="relative z-10">
        <ResultsNavbar />

        <main className="mx-auto max-w-7xl px-6 py-10">
        {/* PDF Only Header */}
        <div className="hidden print:flex items-center justify-between mb-8 border-b border-[#f3f4f6] pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00C853] text-white font-bold">V</div>
            <span className="text-xl font-bold tracking-tight text-[#0A0A0A]">Vantage AI Audit Report</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase text-[#9ca3af]">Generated On</p>
            <p className="text-xs font-medium">{new Date(audit.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <HeroSection audit={audit} totalSpend={totalSpend} />
        
        <AnalyticsGrid audit={audit} totalSpend={totalSpend} />
        
        <ToolInsightsSection audit={audit} />
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
          <div className="lg:col-span-2">
            <SignalsSection audit={audit} />
          </div>
          <div className="lg:col-span-1">
            <MethodologySection audit={audit} />
          </div>
        </div>

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
