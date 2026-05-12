import type { AuditResult } from "@/lib/types"
import { getFitLabel, getActionLabel } from "./auditHelpers"
import { ToolIcon, TOOL_DISPLAY_NAMES } from "@/components/ui/ToolIcon"

type Props = { audit: AuditResult }

export function ToolInsightsSection({ audit }: Props) {
  const results = audit.results
  return (
    <section className="mb-10">
      <div className="mb-5 flex items-center justify-between">
        <div>
         
        </div>
        <span className="rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-3 py-1 text-xs font-medium text-[#6b7280]">
          {results.length} tools analyzed
        </span>
      </div>

      <div className="space-y-4">
        {results.map((result) => {
          const isKeep = result.recommendedAction === "keep"
          const fit = getFitLabel(result)
          const actionLabel = getActionLabel(result)
          const seats = audit.input.tools.find(t => t.tool === result.tool)?.seats ?? 1

          return (
            <div key={result.tool} className="grid grid-cols-1 gap-4 rounded-xl border border-[#e5e7eb] bg-white p-5 sm:p-6 lg:grid-cols-[1fr_1.2fr_auto]">
              {/* Left: Tool info + fit */}
              <div className="flex items-start gap-4">
                <ToolIcon tool={result.tool} size={40} />
                <div className="flex-1">
                  <p className="text-base font-bold text-[#0A0A0A]">{TOOL_DISPLAY_NAMES[result.tool]}
                    <span className="ml-2 text-[11px] font-normal text-[#9ca3af] uppercase tracking-wider">{result.currentPlan}</span>
                  </p>
                  <p className="mb-3 text-sm font-semibold text-[#0A0A0A]">
                    ${result.currentSpend.toFixed(2)}<span className="text-xs font-normal text-[#9ca3af]"> /mo</span> &nbsp;·&nbsp; {seats} seat{seats > 1 ? "s" : ""}
                  </p>
                  <div className="mb-1 flex items-center gap-3">
                    <span className="text-sm font-extrabold uppercase tracking-tight" style={{ color: fit.color }}>{fit.text}</span>
                    <div className="h-2.5 w-32 overflow-hidden rounded-full bg-[#f3f4f6]">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.round(result.uniqueValueScore * 100)}%`, background: fit.color }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Center: AI Analysis */}
              <div className="border-l border-[#f3f4f6] pl-4">
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#00C853]">Strengths</p>
                    <ul className="space-y-1">
                      {(result.strengths && result.strengths.length > 0 ? result.strengths : ["Specific feature advantage", "Cost-effective tier", "High availability"]).map((pro, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-[11px] text-[#111827]">
                          <div className="h-1 w-1 rounded-full bg-[#00C853]" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#EF4444]">Weaknesses</p>
                    <ul className="space-y-1">
                      {(result.weaknesses && result.weaknesses.length > 0 ? result.weaknesses : ["Capability overlap", "Pricing premium", "Usage limits"]).map((con, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-[11px] text-[#111827]">
                          <div className="h-1 w-1 rounded-full bg-[#EF4444]" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-lg bg-[#f0fdf4] p-3 border border-[#dcfce7]">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#16a34a]">Unique Capability Analysis</p>
                  <p className="text-xs leading-relaxed text-[#111827]">
                    {result.uniqueCapabilityAnalysis || "Detailed workflow analysis is being generated..."}
                  </p>
                </div>
              </div>

              {/* Right: Action */}
              <div className="flex flex-col items-end justify-center border-l border-[#f3f4f6] pl-4 text-right">
                <p className={`text-sm font-bold ${isKeep ? "text-[#00C853]" : "text-[#EF4444]"}`}>
                  {actionLabel}
                </p>
                <p className="mt-1 max-w-[200px] text-[11px] text-[#6b7280] leading-relaxed">
                  {result.reason}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
