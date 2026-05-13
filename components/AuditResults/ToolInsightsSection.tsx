import type { AuditResult } from "@/lib/types"
import { getFitLabel } from "./auditHelpers"
import { ToolIcon, TOOL_DISPLAY_NAMES } from "@/components/ui/ToolIcon"

type Props = { audit: AuditResult }

export function ToolInsightsSection({ audit }: Props) {
  const results = audit.results
  return (
    <section className="mb-10">
      <div className="mb-12 flex flex-col items-center gap-4 text-center">
        <h2 className="text-[45px] font-bold  tracking-widest text-[#111]">Inventory Analysis</h2>

      </div>

      <div className="space-y-6">
        {results.map((result) => {
          const isKeep = result.recommendedAction === "keep"
          const fit = getFitLabel(result)
          const actionLabel = isKeep ? "Strategic Asset" : "Remove Redundancy"
          const seats = audit.input.tools.find(t => t.tool === result.tool)?.seats ?? 1

          const cardBase = "group rounded-[32px] p-8 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
          const cardStyle = `${cardBase} bg-white border border-[#111]`

          return (
            <div key={result.tool} className={cardStyle}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Tool Identity */}
                <div className="lg:col-span-3 flex flex-col items-start">
                  <div className="mb-6 p-4 rounded-2xl bg-[#f9fafb] border border-black/5 transition-transform">
                    <ToolIcon tool={result.tool} size={48} />
                  </div>
                  <h3 className="text-xl font-medium text-[#111] mb-1">{TOOL_DISPLAY_NAMES[result.tool]}</h3>
                  <p className="text-xs font-semibold lowercase tracking-wider text-[#111] mb-4">{result.currentPlan}</p>

                  <div className="mt-auto pt-4 border-t border-black/5 w-full">
                    <p className="text-base font-bold text-[#111]">
                      ${result.currentSpend.toFixed(0)}<span className="text-sm font-medium text-[#666]">/mo</span>
                    </p>
                    <p className="text-xs font-semibold lowercase tracking-wider text-[#111] mt-1">{seats} total seats</p>
                  </div>
                </div>

                {/* Analysis Column */}
                <div className="lg:col-span-6 border-x-0 lg:border-x border-black/5 px-0 lg:px-8">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-[18px] font-bold  uppercase tracking-wide text-[#111]">Stack Alignment</span>

                  </div>

                  <div className="h-1.5 w-full bg-[#f3f4f6] rounded-full mb-8 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.round(result.uniqueValueScore * 100)}%`, background: fit.color }}
                    />
                  </div>

                  <div className="space-y-6">
                    <p className="text-[15px] font-medium leading-relaxed text-[#111] bg-[#f9fafb] p-4 rounded-xl border border-black/[0.03]">
                      {result.uniqueCapabilityAnalysis || "Full analysis being compiled..."}
                    </p>

                    <div className="grid grid-cols-2 gap-6 mt-6">
                      <div>
                        <p className="text-sm font-bold uppercase tracking-wide text-[#111] mb-3">Key Strengths</p>
                        <ul className="space-y-2">
                          {(result.strengths ?? []).slice(0, 3).map((s, i) => (
                            <li key={i} className="text-sm font-medium text-[#111] flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-[#111]" /> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-bold uppercase tracking-wide text-[#111] mb-3">Redundancy Risks</p>
                        <ul className="space-y-2">
                          {(result.weaknesses ?? []).slice(0, 3).map((w, i) => (
                            <li key={i} className="text-sm font-medium text-[#666] flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-[#111]" /> {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendation Column */}
                <div className="lg:col-span-3 flex flex-col justify-center text-right">
                  <p className={`text-sm font-bold tracking-wide mb-2 ${isKeep ? "text-[#00C853]" : "text-[#111]"}`}>
                    Recommendation
                  </p>

                  <p className={`text-2xl font-black mb-4 leading-tight ${isKeep ? "text-[#111]" : "text-[#111]"}`}>
                    {actionLabel}
                  </p>

                  {/* Immediate Savings Badge */}
                  {!isKeep && (
                    <div className="mb-4 ml-auto inline-flex items-center gap-2 rounded-full bg-[#111] px-4 py-2 text-white shadow-sm">
                      <span className="text-xs font-bold tracking-wide opacity-90">Saves</span>
                      <span className="text-sm font-bold">${result.monthlySavings.toFixed(0)}/mo</span>
                    </div>
                  )}

                  {/* Keep Badge */}
                  {isKeep && (
                    <div className="mb-4 ml-auto inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[#00C853] border border-[#00C853]/20 shadow-sm">
                      <span className="text-xs font-bold tracking-wide">Core Tool</span>
                    </div>
                  )}



                  <p className="text-sm font-medium text-[#666] leading-relaxed">
                    {result.reason}
                  </p>
                </div>

              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
