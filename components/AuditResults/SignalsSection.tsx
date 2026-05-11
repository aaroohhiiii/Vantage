import type { AuditResult } from "@/lib/types"
import { getSignals } from "./auditHelpers"
import { Check, AlertTriangle, Info, ArrowRight, CalendarClock } from "lucide-react"
import { TOOL_DISPLAY_NAMES } from "@/components/ui/ToolIcon"

type Props = { audit: AuditResult }

export function SignalsSection({ audit }: Props) {
  const signals = getSignals(audit)
  const hasSavings = audit.totalMonthlySavings > 0

  return (
    <section className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Signals Detected */}
      <div>
        <h2 className="mb-1 text-lg font-bold text-[#0A0A0A]">Signals Detected</h2>
        <p className="mb-5 text-xs text-[#6b7280]">Key signals our engine identified in your stack.</p>
        <div className="space-y-3">
          {signals.map((signal, i) => {
            const IconComp = signal.icon === "check" ? Check : signal.icon === "warning" ? AlertTriangle : Info
            const iconBg = signal.icon === "check" ? "bg-[#f0fdf4] text-[#16a34a]" : signal.icon === "warning" ? "bg-[#fef9c3] text-[#a16207]" : "bg-[#f3f4f6] text-[#6b7280]"
            const impactColor = signal.impact === "High impact" ? "text-[#dc2626] bg-[#fee2e2]"
              : signal.impact === "Medium impact" ? "text-[#a16207] bg-[#fef9c3]"
              : signal.impact === "Low impact" ? "text-[#16a34a] bg-[#f0fdf4]"
              : "text-[#6b7280] bg-[#f3f4f6]"

            return (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-[#e5e7eb] bg-white p-4">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
                  <IconComp className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#111827]">{signal.title}</p>
                  <p className="text-xs text-[#6b7280]">{signal.description}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${impactColor}`}>
                  {signal.impact}
                </span>
              </div>
            )
          })}
        </div>
        <button className="mt-4 flex items-center gap-1 text-xs font-medium text-[#6b7280] hover:text-[#111827]">
          View all signals <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Recommendations */}
      <div>
        <h2 className="mb-1 text-lg font-bold text-[#0A0A0A]">Recommendations</h2>
        <p className="mb-5 text-xs text-[#6b7280]">Prioritized actions to optimize your spend.</p>

        <div className="rounded-xl border border-[#e5e7eb] bg-white p-6">
          {!hasSavings ? (
            <>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0fdf4]">
                  <Check className="h-5 w-5 text-[#00C853]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#111827]">No high-impact actions</p>
                  <p className="text-xs text-[#6b7280]">Your stack is well-optimized. No significant savings opportunities were identified.</p>
                </div>
              </div>

              <div className="my-5 h-px w-full bg-[#f3f4f6]" />

              <p className="mb-3 text-xs font-bold text-[#111827]">If your needs change</p>
              <ul className="space-y-2 text-xs text-[#6b7280]">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#6b7280]" />
                  Re-evaluate if team size grows beyond 5–6 users.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#6b7280]" />
                  Monitor usage to ensure continued efficiency.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#6b7280]" />
                  Re-run audit quarterly for best results.
                </li>
              </ul>
            </>
          ) : (
            <>
              <p className="mb-3 text-sm font-bold text-[#111827]">Top actions</p>
              <div className="space-y-3">
                {audit.results.filter(r => r.recommendedAction !== "keep").map((r, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg bg-[#fef9c3]/50 p-3 border border-[#fef08a]">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#a16207]" />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#a16207] mb-1">{TOOL_DISPLAY_NAMES[r.tool]}</p>
                      <p className="text-xs font-bold text-[#111827]">{r.reason}</p>
                      {r.alternativeTool && (
                        <p className="mt-1 text-[11px] text-[#4b5563]">
                          <span className="font-semibold text-[#111827]">Primary Alternative:</span> {r.alternativeTool}
                        </p>
                      )}
                      <p className="mt-1 text-xs font-bold text-[#16a34a]">Save ${r.monthlySavings.toFixed(0)}/mo</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-5 flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-xs text-[#6b7280]">
            <CalendarClock className="h-4 w-4 shrink-0" />
            Re-run audit in 90 days
          </div>
        </div>
      </div>
    </section>
  )
}
