import type { AuditResult } from "@/lib/types"
import { getBenchmarkRange, getStackOverlap } from "./auditHelpers"
import { TOOL_DISPLAY_NAMES } from "@/components/ui/ToolIcon"

type Props = { audit: AuditResult; totalSpend: number }

export function AnalyticsGrid({ audit, totalSpend }: Props) {
  const results = audit.results
  const overlap = getStackOverlap(results)
  const benchmark = getBenchmarkRange(audit.input.teamSize)
  const isInRange = totalSpend >= benchmark.low && totalSpend <= benchmark.high

  // Donut chart calculations
  const colors = ["#00C853", "#4F8CFF", "#F59E0B", "#8B5CF6", "#EF4444", "#06B6D4", "#EC4899", "#10B981"]
  const radius = 50
  const circumference = 2 * Math.PI * radius
  let cumulativeOffset = 0
  const segments = results.map((r, i) => {
    const pct = totalSpend > 0 ? r.currentSpend / totalSpend : 0
    const dashLength = pct * circumference
    const offset = cumulativeOffset
    cumulativeOffset += dashLength
    return { tool: r.tool, plan: r.currentPlan, spend: r.currentSpend, pct, dashLength, offset, color: colors[i % colors.length] }
  })

  return (
    <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Spend Breakdown */}
      <div className="rounded-xl border border-[#e5e7eb] bg-white p-6">
        <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-[#9ca3af]">Spend Breakdown</h3>
        <div className="flex items-center gap-6">
          <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              {segments.map((seg, i) => (
                <circle key={i} cx="60" cy="60" r={radius} fill="none" stroke={seg.color}
                  strokeWidth="14" strokeDasharray={`${seg.dashLength} ${circumference - seg.dashLength}`}
                  strokeDashoffset={-seg.offset} strokeLinecap="butt" />
              ))}
            </svg>
            <div className="absolute text-center">
              <p className="text-lg font-bold text-[#0A0A0A]">${totalSpend.toFixed(2)}</p>
              <p className="text-[10px] text-[#9ca3af]">Total /mo</p>
            </div>
          </div>
          <div className="space-y-2">
            {segments.map((seg, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: seg.color }} />
                <div>
                  <p className="text-xs font-semibold text-[#111827]">{TOOL_DISPLAY_NAMES[seg.tool]} <span className="font-normal text-[#9ca3af]">{seg.plan}</span></p>
                  <p className="text-[11px] text-[#6b7280]">${seg.spend.toFixed(2)} ({(seg.pct * 100).toFixed(1)}%)</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Overlap Analysis */}
      <div className="rounded-xl border border-[#e5e7eb] bg-white p-6">
        <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-[#9ca3af]">Overlap Analysis</h3>
        <div className="mb-4 mt-6">
          <div className="flex items-center justify-between text-[10px] text-[#9ca3af]">
            <span>Low</span><span>High</span>
          </div>
          <div className="relative mt-1 h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-[#00C853] via-[#F59E0B] to-[#EF4444]">
            <div className="absolute top-0 h-full w-1 rounded-full bg-white shadow-md" style={{ left: `${Math.min(overlap.avg * 100, 97)}%` }} />
          </div>
        </div>
        <p className="mb-2 text-xl font-bold" style={{ color: overlap.avg < 0.3 ? "#00C853" : overlap.avg < 0.6 ? "#F59E0B" : "#EF4444" }}>
          {overlap.label}
        </p>
        <p className="text-xs leading-relaxed text-[#6b7280]">{overlap.desc}</p>

      </div>

      {/* Benchmark Comparison */}
      <div className="rounded-xl border border-[#e5e7eb] bg-white p-6">
        <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-[#9ca3af]">Benchmark Comparison</h3>
        <p className="mb-4 mt-2 text-xs text-[#6b7280]">Teams of similar size and use case typically spend between:</p>
        <p className="mb-1 text-3xl font-bold text-[#0A0A0A]">
          ${benchmark.low} – ${benchmark.high}<span className="text-base font-normal text-[#9ca3af]"> /mo</span>
        </p>
        <p className={`text-xs font-medium ${isInRange ? "text-[#00C853]" : "text-[#F59E0B]"}`}>
          {isInRange ? "You're within the efficient range." : "You're outside the typical range."}
        </p>

      </div>
    </section>
  )
}
