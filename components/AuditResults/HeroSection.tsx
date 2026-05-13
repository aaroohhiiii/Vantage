import { getEfficiencyLabel, getHeadline } from "./auditHelpers"
import type { AuditResult } from "@/lib/types"
import { Users, Briefcase, ArrowUpRight } from "lucide-react"

type Props = { audit: AuditResult; totalSpend: number }

export function HeroSection({ audit, totalSpend }: Props) {
  const score = audit.efficiencyScore ?? 75

  // 1. CALCULATE OVERLAP HEALTH
  // We calculate the average overlap to determine if the stack is "Inefficient" 
  // regardless of whether the total spend is low.

  const isOptimized = audit.isOptimal || (audit.totalMonthlySavings ?? 0) === 0

  // 2. DYNAMIC LABEL & COLORING
  const label = getEfficiencyLabel(score)
  const dynamicHeadline = getHeadline(audit)
  const dynamicHeadlineColor = (label === "Optimized" || label === "Good") ? "text-[#00C853]" : (label === "Fair" ? "text-[#F59E0B]" : "text-[#EF4444]")

  // Determine color theme based on the label
  const theme = {
    "Optimized": { color: "#00C853", bg: "bg-[#00C853]/5", border: "border-[#00C853]/10", text: "text-[#00C853]" },
    "Good": { color: "#00C853", bg: "bg-[#00C853]/5", border: "border-[#00C853]/10", text: "text-[#00C853]" },
    "Fair": { color: "#F59E0B", bg: "bg-[#F59E0B]/5", border: "border-[#F59E0B]/10", text: "text-[#F59E0B]" },
    "Inefficient": { color: "#EF4444", bg: "bg-[#EF4444]/5", border: "border-[#EF4444]/10", text: "text-[#EF4444]" },
    "Needs Work": { color: "#EF4444", bg: "bg-[#EF4444]/5", border: "border-[#EF4444]/10", text: "text-[#EF4444]" },
  }[label] || { color: "#00C853", bg: "bg-[#00C853]/5", border: "border-[#00C853]/10", text: "text-[#00C853]" }

  const radius = 54
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (score / 100) * circumference

  const totalWaste = (audit.totalMonthlySavings ?? 0) * 12

  // Dynamically split AI summary into bullet points
  const fallbackText = "Based on the comprehensive audit, we conclude that the current stack is well-optimized for your team's workflow. This setup offers superior value for your primary use case."
  const aiSummaryText = audit.aiSummary || fallbackText
  const aiSummaryPoints = aiSummaryText.split('. ')
    .map(p => p.trim())
    .filter(p => p.length > 10)
    .slice(0, 3)
    .map(p => p.endsWith('.') ? p : `${p}.`)

  const useCaseLabels: Record<string, string> = {
    coding: "Engineering", writing: "Content", data: "Data",
    research: "Research", mixed: "Mixed Stack",
  }

  return (
    <section className="mb-10 overflow-hidden rounded-[40px] bg-white border border-black/[0.08] shadow-xl shadow-black/[0.03] relative">
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-0">

        {/* Left: Efficiency Score Gauge */}
        <div className="lg:col-span-3 p-6 lg:p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-black/5 bg-[#F9FAFB]/50">
          <div className="relative flex h-40 w-40 items-center justify-center">
            <svg className="absolute inset-0" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="6" />
              <circle
                cx="64" cy="64" r={radius} fill="none" stroke={theme.color} strokeWidth="6"
                strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset}
                transform="rotate(-90 64 64)"
                style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.23, 1, 0.32, 1), stroke 1s ease" }}
              />
            </svg>
            <div className="text-center">
              <span className="text-5xl font-semibold text-[#111] tracking-tight">{score}</span>
              <span className="text-[10px] block text-[#666] font-semibold uppercase tracking-wider mt-1">Efficiency</span>
            </div>
          </div>
          <div className={`mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2 border ${theme.bg} ${theme.border}`}>
            <div className={`h-2 w-2 rounded-full`} style={{ background: theme.color }} />
            <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.text}`}>{label}</span>
          </div>
        </div>

        {/* Center: Savings Focus */}
        <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-center">
          <h1 className={`text-3xl lg:text-4xl font-semibold tracking-tight mb-3 leading-[1.1] ${dynamicHeadlineColor}`}>
            {dynamicHeadline}
          </h1>
          <p className="text-[#666] mb-6 text-sm lg:text-base font-medium leading-relaxed max-w-md">
            {isOptimized ? "Your team is getting maximum ROI from your current tooling." : "Your stack has high functional overlap. Consolidating redundant tools recovers wasted capital."}
          </p>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] mb-2">Spend</p>
              <p className="text-2xl lg:text-3xl font-semibold text-[#111] tracking-tight">
                ${totalSpend.toFixed(0)}<span className="text-xs font-medium text-[#9CA3AF] ml-1">/mo</span>
              </p>
            </div>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${theme.text}`}>Savings</p>
              <p className={`text-2xl lg:text-3xl font-semibold tracking-tight flex items-center ${theme.text}`}>
                ${(audit.totalMonthlySavings ?? 0).toLocaleString()}<span className="text-xs font-medium opacity-50 ml-1">/mo</span>
              </p>
            </div>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${theme.text}`}>Annual</p>
              <p className={`text-2xl lg:text-3xl font-semibold tracking-tight flex items-center gap-1 ${theme.text}`}>
                ${totalWaste.toLocaleString()}
                <ArrowUpRight className="h-4 w-4 opacity-30" />
              </p>
            </div>
          </div>
        </div>

        {/* Right: Context & Key Takeaways */}
        <div className="lg:col-span-4 p-6 lg:p-8 bg-[#F9FAFB] flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-black/5">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] mb-4">Key Takeaways</p>
              <div className="space-y-3">
                {aiSummaryPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 bg-[#111]" />
                    <p className="text-xs font-medium text-[#111] leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-black/5 text-[10px] font-bold text-[#666] uppercase tracking-widest">
                <Users className="h-3 w-3" /> {audit.input.teamSize} SEATS
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-black/5 text-[10px] font-bold text-[#666] uppercase tracking-widest">
                <Briefcase className="h-3 w-3" /> {useCaseLabels[audit.input.useCase] || "GENERAL"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
