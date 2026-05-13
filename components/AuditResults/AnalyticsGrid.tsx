import type { AuditResult } from "@/lib/types"
import { getBenchmarkRange, getStackOverlap } from "./auditHelpers"
import { TOOL_DISPLAY_NAMES } from "@/components/ui/ToolIcon"

type Props = { audit: AuditResult; totalSpend: number }

export function AnalyticsGrid({ audit, totalSpend }: Props) {
  const results = audit.results
  const overlap = getStackOverlap(results)
  const overlapVerdict = overlap.avg > 0.6 ? "Critical Waste" : overlap.avg < 0.2 ? "Highly Efficient" : "Moderate Overlap"
  const verdictColor = overlap.avg > 0.6 ? "text-[#EF4444]" : overlap.avg < 0.2 ? "text-[#00C853]" : "text-[#F59E0B]"
  const benchmark = getBenchmarkRange(audit.input.teamSize)


  // Donut chart calculations
  const colors = ["#00C853", "#111111", "#4F8CFF", "#F59E0B", "#8B5CF6", "#EF4444", "#06B6D4", "#EC4899"]
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
      <div className="rounded-[32px] border border-black/[0.06] bg-[#F9FAFB] p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h3 className="mb-8 text-xl font-black text-[#111]">Spend Breakdown</h3>
        <div className="flex flex-col items-center gap-8">
          <div className="relative flex h-40 w-40 shrink-0 items-center justify-center">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              {segments.map((seg, i) => (
                <circle key={i} cx="60" cy="60" r={radius} fill="none" stroke={seg.color}
                  strokeWidth="12" strokeDasharray={`${seg.dashLength} ${circumference - seg.dashLength}`}
                  strokeDashoffset={-seg.offset} strokeLinecap="butt" />
              ))}
            </svg>
            <div className="absolute text-center">
              <p className="text-xl font-medium text-[#111]">${totalSpend.toFixed(0)}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#666]">Total</p>
            </div>
          </div>
          <div className="w-full space-y-3">
            {segments.map((seg, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full" style={{ background: seg.color }} />
                  <p className="text-xs font-medium text-[#111]">{TOOL_DISPLAY_NAMES[seg.tool]}</p>
                </div>
                <p className="text-[11px] font-medium text-[#666]">${seg.spend.toFixed(0)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overlap Analysis */}
      <div className="rounded-[32px] border border-black/[0.06] bg-[#F9FAFB] p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h3 className="mb-8 text-xl font-black text-[#111]">Overlap Analysis</h3>

        <p className={`text-2xl font-black mb-6 ${verdictColor}`}>
          {overlapVerdict}
        </p>

        <div className="mb-6">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-3">
            <span>Efficient</span><span>Redundant</span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#f3f4f6]">
            <div
              className="absolute top-0 h-full w-2 rounded-full bg-[#111] shadow-sm z-10"
              style={{ left: `${Math.min(overlap.avg * 100, 95)}%`, transition: 'left 1s cubic-bezier(0.23, 1, 0.32, 1)' }}
            />
            <div className="absolute inset-0 bg-[#E5E7EB]" />
          </div>
        </div>

        <p className="text-sm leading-relaxed text-[#666] font-medium opacity-80">{overlap.desc}</p>
      </div>

      {/* Benchmark Comparison */}
      <div className="rounded-[32px] border border-black/[0.06] bg-[#F9FAFB] p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h3 className="mb-8 text-xl font-black text-[#111]">Market Benchmark</h3>

        <div className="space-y-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] mb-2">Cost Per Seat You are Spending</p>
            <p className="text-3xl font-medium text-[#111] tracking-tighter">
              ${(totalSpend / audit.input.teamSize).toFixed(0)}<span className="text-sm font-medium text-[#9CA3AF] ml-1">/mo</span>
            </p>
          </div>

          <div className="h-px w-full bg-black/5" />

          <div>
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1">Standard Range</p>
                <p className="text-base font-bold text-[#111]">${benchmark.low} – ${benchmark.high}/mo</p>
              </div>
              <p className="text-xs font-medium text-[#666]">Target for {audit.input.teamSize} member team</p>
            </div>

            <div className="relative h-4 w-full rounded-full bg-[#f3f4f6] mb-4">
              {/* Market Range "Safe Zone" Bar */}
              <div
                className="absolute top-0 h-full bg-[#00C853]/15 border-x border-[#00C853]/20"
                style={{ 
                  left: `${(benchmark.low / (benchmark.high * 1.5)) * 100}%`, 
                  width: `${((benchmark.high - benchmark.low) / (benchmark.high * 1.5)) * 100}%` 
                }}
              />

              {/* User Position Indicator */}
              <div
                className="absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-[#111] shadow-md z-10 border-2 border-white"
                style={{
                  left: `${Math.max(2, Math.min((totalSpend / (benchmark.high * 1.5)) * 100, 98))}%`,
                  transition: 'left 1s cubic-bezier(0.23, 1, 0.32, 1)'
                }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#111] text-white text-[10px] px-2 py-1 rounded font-bold whitespace-nowrap">
                  You
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">
              <span>Lean</span>
              <span className="text-[#00C853]">Standard Range</span>
              <span>Heavy</span>
            </div>
          </div>


        </div>
      </div>
    </section>
  )
}
