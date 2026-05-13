import { getAuditById } from "@/lib/supabase"
import { getEfficiencyLabel } from "@/components/AuditResults/auditHelpers"
import { TOOL_DISPLAY_NAMES } from "@/components/ui/ToolIcon"
import { Check, ArrowRight } from "lucide-react"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function EmbedPage({ params }: PageProps) {
  const { id } = await params
  const audit = await getAuditById(id)

  if (!audit) return <div className="p-4 text-xs text-gray-500">Audit not found</div>

  const score = audit.efficiencyScore ?? 75

  const label = getEfficiencyLabel(score)
  const radius = 30
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (score / 100) * circumference
  const arcColor = score >= 70 ? "#00C853" : score >= 40 ? "#F59E0B" : "#EF4444"

  const topRecommendations = audit.results
    .filter(r => r.recommendedAction !== "keep")
    .slice(0, 2)

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm max-w-[350px]">
      <div className="bg-[#032e21] p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="relative flex h-14 w-14 items-center justify-center shrink-0">
            <svg className="absolute inset-0" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
              <circle
                cx="40" cy="40" r={radius} fill="none" stroke={arcColor} strokeWidth="6"
                strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset}
                transform="rotate(-90 40 40)"
              />
            </svg>
            <span className="text-lg font-bold">{score}</span>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#00C853]">Audit Score</p>
            <h4 className="text-sm font-bold leading-tight">Vantage AI Spend Audit</h4>
            <p className="text-[10px] text-white/60">{label} · ${audit.totalMonthlySavings.toFixed(0)}/mo savings found</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-white">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af] mb-3">Top Recommendations</p>
        <div className="space-y-3">
          {topRecommendations.length > 0 ? (
            topRecommendations.map((r, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#fef9c3] text-[#a16207]">
                  <span className="text-[10px] font-bold">!</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#111827]">{TOOL_DISPLAY_NAMES[r.tool]}</p>
                  <p className="text-[10px] text-[#6b7280] leading-snug">{r.reason}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2 text-[#00C853]">
              <Check className="h-4 w-4" />
              <p className="text-[10px] font-medium">Stack is fully optimized</p>
            </div>
          )}
        </div>
        
        <a 
          href={`https://vantage.sh/audit/${id}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-1 w-full py-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-[11px] font-bold text-[#111827] hover:bg-gray-50 transition-colors"
        >
          View Full Audit Report <ArrowRight className="h-3 w-3" />
        </a>
      </div>
      
      <div className="px-4 py-2 bg-[#f9fafb] border-t border-[#f3f4f6] flex items-center justify-between">
        <span className="text-[9px] font-medium text-[#9ca3af]">Powered by Vantage</span>
        <div className="flex h-4 w-4 items-center justify-center rounded bg-[#00C853] text-white text-[8px] font-bold">V</div>
      </div>
    </div>
  )
}
