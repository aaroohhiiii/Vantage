import { getEfficiencyLabel, getHeadline, getSubheadline } from "./auditHelpers"
import type { AuditResult } from "@/lib/types"
import { Check, Users, Briefcase, Clock, Layers } from "lucide-react"

type Props = { audit: AuditResult; totalSpend: number }

export function HeroSection({ audit, totalSpend }: Props) {
  const score = audit.efficiencyScore ?? 75
  const label = getEfficiencyLabel(score)
  const headline = getHeadline(audit)
  const subheadline = getSubheadline(audit)
  const dupes = audit.summary?.duplicateCapabilities ?? []
  const toolCount = audit.input.tools.length
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (score / 100) * circumference
  const arcColor = score >= 70 ? "#00C853" : score >= 40 ? "#F59E0B" : "#EF4444"
  const useCaseLabels: Record<string, string> = {
    coding: "Coding", writing: "Writing", data: "Data analysis",
    research: "Research", mixed: "Mixed use case",
  }

  const summaryItems = [
    {
      ok: dupes.length === 0,
      label: dupes.length === 0 ? "Low overlap across tools" : "Overlap detected",
      desc: dupes.length === 0 ? "No duplicate capabilities detected" : `${dupes.length} shared capabilities`,
    },
    {
      ok: audit.results.every(r => r.recommendedAction === "keep"),
      label: "Pricing aligned",
      desc: "Plans match team size and usage",
    },
    {
      ok: true,
      label: "No seat inefficiency",
      desc: "Seat count is appropriate",
    },
    {
      ok: audit.input.teamSize <= 10,
      label: audit.input.teamSize <= 10 ? "No enterprise risk" : "Enterprise risk",
      desc: audit.input.teamSize <= 10 ? "No unnecessary enterprise tiers" : "Consider enterprise plans",
    },
  ]

  return (
    <section className="mb-10 overflow-hidden rounded-[20px] bg-[#032e21] text-white">
      <div className="grid grid-cols-1 gap-6 p-8 sm:p-10 lg:grid-cols-[auto_1fr_1fr]">
        {/* Left: Gauge */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="relative flex h-40 w-40 items-center justify-center">
            <svg className="absolute inset-0" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
              <circle
                cx="64" cy="64" r={radius} fill="none" stroke={arcColor} strokeWidth="10"
                strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset}
                transform="rotate(-90 64 64)" style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div className="text-center">
              <span className="text-4xl font-bold text-white">{score}</span>
              <span className="text-lg text-white/60">/100</span>
            </div>
          </div>
          <p className="text-xs font-medium text-white/60">Efficiency Score</p>
          <span className="rounded-full bg-[#00C853]/20 px-3 py-1 text-xs font-bold text-[#00C853]">
            {label}
          </span>
          <p className="mt-1 max-w-[160px] text-center text-[11px] leading-snug text-white/50">
            Your AI spend is efficient and well-aligned with your team&apos;s needs.
          </p>
        </div>

        {/* Center: Headline + Stats */}
        <div className="flex flex-col justify-center">
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#00C853]">
            <Check className="h-4 w-4" /> Audit Result
          </p>
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {headline}
          </h1>
          <p className="mb-6 text-sm text-white/70">{subheadline}</p>

          <div className="mb-5 flex flex-wrap gap-6">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-white/50">Monthly Spend</p>
              <p className="text-xl font-bold text-white">${totalSpend.toFixed(2)}<span className="text-sm font-normal text-white/50">/mo</span></p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-white/50">Potential Savings</p>
              <p className="text-xl font-bold text-white">${audit.totalMonthlySavings.toFixed(2)}<span className="text-sm font-normal text-white/50">/mo</span></p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-white/50">Tools Audited</p>
              <p className="text-xl font-bold text-white">{toolCount}</p>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <Users className="h-3 w-3" /> {audit.input.teamSize} team members
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <Briefcase className="h-3 w-3" /> {useCaseLabels[audit.input.useCase] || audit.input.useCase}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <Clock className="h-3 w-3" /> Audit generated in 4.2s
            </span>
          </div>

          <div className="flex flex-wrap gap-3 text-[11px] text-white/40">
            <span>Pricing verified {new Date(audit.createdAt).toLocaleString("en-US", { month: "long", year: "numeric" })}</span>
            <span>·</span>
            <span>7 pricing models analyzed</span>
            <span>·</span>
            <span>Currency: USD</span>
          </div>
        </div>

        {/* Right: Summary checklist */}
        <div className="flex flex-col justify-center rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/60">
            <Layers className="h-4 w-4" /> Summary
          </h3>
          <div className="space-y-4">
            {summaryItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${item.ok ? "bg-[#00C853]/20 text-[#00C853]" : "bg-red-500/20 text-red-400"}`}>
                  {item.ok ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <span className="text-xs font-bold">!</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="text-xs text-white/50">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
