import type { AuditResult, ToolAuditResult } from "@/lib/types"

export function getBenchmarkRange(teamSize: number): { low: number; high: number } {
  if (teamSize <= 2) return { low: 20, high: 80 }
  if (teamSize <= 5) return { low: 40, high: 120 }
  if (teamSize <= 15) return { low: 100, high: 400 }
  if (teamSize <= 50) return { low: 300, high: 1200 }
  return { low: 800, high: 3000 }
}

export function getStackOverlap(results: ToolAuditResult[]): { avg: number; label: string; desc: string } {
  if (results.length === 0) return { avg: 0, label: "None", desc: "" }
  const avg = results.reduce((s, r) => s + r.overlapScore, 0) / results.length
  if (avg < 0.2) return { avg, label: "Low overlap", desc: "Your tools complement each other well with minimal capability duplication." }
  if (avg < 0.5) return { avg, label: "Moderate overlap", desc: "Some shared capabilities exist across your tools." }
  return { avg, label: "High overlap", desc: "Significant capability duplication detected across your stack." }
}

export function getEfficiencyLabel(score: number): string {
  if (score >= 80) return "Optimized"
  if (score >= 60) return "Good"
  if (score >= 40) return "Fair"
  return "Needs Work"
}

export function getHeadline(audit: AuditResult): string {
  if (audit.isOptimal) return "Efficient AI spend."
  if (audit.totalMonthlySavings > 50) return "Savings available."
  return "Room to optimize."
}

export function getSubheadline(audit: AuditResult): string {
  if (audit.isOptimal) return "No meaningful waste detected in your current stack."
  return `We found $${audit.totalMonthlySavings.toFixed(2)}/mo in potential savings.`
}

export type Signal = {
  title: string
  description: string
  impact: "Low impact" | "Medium impact" | "High impact" | "Not applicable"
  icon: "check" | "warning" | "info"
}

export function getSignals(audit: AuditResult): Signal[] {
  const dupes = audit.summary?.duplicateCapabilities ?? []
  const results = audit.results
  const teamSize = audit.input.teamSize

  const signals: Signal[] = [
    {
      title: "Duplicate capability",
      description: dupes.length > 0
        ? `${dupes.length} shared capabilities detected across tools.`
        : "No significant capability duplication detected.",
      impact: dupes.length > 3 ? "High impact" : dupes.length > 0 ? "Medium impact" : "Low impact",
      icon: dupes.length > 0 ? "warning" : "check",
    },
    {
      title: "Seat efficiency",
      description: results.every(r => r.recommendedAction === "keep")
        ? "Seat count is well-aligned with team size."
        : "Some tools may have misaligned seat counts.",
      impact: "Low impact",
      icon: "check",
    },
    {
      title: "Pricing alignment",
      description: "Your plans match usage needs and team size.",
      impact: "Low impact",
      icon: "check",
    },
    {
      title: "Enterprise risk",
      description: teamSize > 10
        ? "Consider enterprise tiers for compliance features."
        : "No unnecessary enterprise or business tier detected.",
      impact: teamSize > 10 ? "Medium impact" : "Low impact",
      icon: teamSize > 10 ? "warning" : "check",
    },
    {
      title: "API concentration",
      description: results.some(r => r.tool === "anthropic-api" || r.tool === "openai-api")
        ? "API usage detected in this audit."
        : "No API usage detected in this audit.",
      impact: "Not applicable",
      icon: "info",
    },
  ]

  return signals
}

export function getFitLabel(result: ToolAuditResult): { text: string; color: string } {
  if (result.uniqueValueScore >= 0.6) return { text: "Good fit", color: "#00C853" }
  if (result.uniqueValueScore >= 0.3) return { text: "Moderate fit", color: "#F59E0B" }
  return { text: "Poor fit", color: "#EF4444" }
}

export function getActionLabel(result: ToolAuditResult): string {
  switch (result.recommendedAction) {
    case "keep": return "No action needed"
    case "remove": return "Consider removing"
    case "consolidate": return "Consider consolidating"
    case "switch": return "Consider switching"
    case "downgrade": return "Consider downgrading"
    case "upgrade": return "Consider upgrading"
    case "cancel-redundant": return "Consider removing"
    default: return "No action needed"
  }
}
