import type { AuditResult, ToolAuditResult } from "@/lib/types"
import { getToolPricing } from "@/lib/pricingData"

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

  if (avg < 0.2) return { avg, label: "Efficient", desc: "Your tools complement each other well with minimal functional duplication." }
  if (avg < 0.5) return { avg, label: "Moderate overlap", desc: "Some shared capabilities exist. There is room to consolidate a few subscriptions." }
  return { avg, label: "High Redundancy", desc: "Significant overlap detected. You are paying for multiple tools that perform the same primary functions." }
}

// Replace these in auditHelpers.ts

export function getEfficiencyLabel(score: number): string {
  if (score >= 85) return "Optimized" // Only 85+ is truly optimized
  if (score >= 70) return "Good"
  if (score >= 50) return "Fair"
  return "Inefficient"
}


export function getHeadline(audit: AuditResult): string {
  const savings = audit.totalMonthlySavings ?? 0
  const avgOverlap = audit.results.reduce((s, r) => s + r.overlapScore, 0) / audit.results.length

  if (avgOverlap > 0.6) return "Critical Redundancy Detected" // Priority 1: Stack Health
  if (savings > 100) return "Significant Savings Available"   // Priority 2: Money
  if (audit.isOptimal) return "AI Spend is Optimized"
  return "Room to Optimize"
}

export function getSubheadline(audit: AuditResult): string {
  const savings = audit.totalMonthlySavings ?? 0
  const avgOverlap = audit.results.reduce((s, r) => s + r.overlapScore, 0) / audit.results.length

  if (avgOverlap > 0.6) {
    return `Your stack has high functional overlap. Consolidating redundant tools could save $${savings.toFixed(0)}/mo.`
  }
  if (savings > 50) return `We've identified $${savings.toFixed(0)}/mo in potential savings.`
  if (audit.isOptimal) return "No meaningful waste detected in your current stack."
  return `We found $${savings.toFixed(0)}/mo in minor optimization opportunities.`
}

export type Signal = {
  title: string
  description: string
  impact: "Low impact" | "Medium impact" | "High impact" | "Not applicable"
  icon: "check" | "warning" | "info"
}

export function getSignals(audit: AuditResult): Signal[] {
  const results = audit.results
  const teamSize = audit.input.teamSize

  // DETECT CATEGORY OVERLAP FOR SPECIFIC SIGNAL
  const categoryCounts: Record<string, string[]> = {}
  results.forEach(r => {
    const cat = getToolPricing(r.tool)?.category || 'unknown'
    if (!categoryCounts[cat]) categoryCounts[cat] = []
    categoryCounts[cat].push(r.tool)
  })

  const redundantCategories = Object.entries(categoryCounts).filter(([, tools]) => tools.length > 1)

  const signals: Signal[] = [
    {
      title: "Category Redundancy",
      description: redundantCategories.length > 0
        ? `Detected ${redundantCategories.length} categories with multiple tools. (e.g., ${redundantCategories[0][1].join(", ")})`
        : "Each tool serves a unique purpose in your stack.",
      impact: redundantCategories.length > 1 ? "High impact" : redundantCategories.length > 0 ? "Medium impact" : "Low impact",
      icon: redundantCategories.length > 0 ? "warning" : "check",
    },
    {
      title: "Seat Efficiency",
      description: results.some(r => r.recommendedAction === "remove")
        ? "Some tools are redundant for your current team size."
        : "Seat count is well-aligned with team scale.",
      impact: "Medium impact",
      icon: results.some(r => r.recommendedAction === "remove") ? "warning" : "check",
    },
    {
      title: "Pricing Alignment",
      description: "Your plans match the industry standard for your team size.",
      impact: "Low impact",
      icon: "check",
    },
    {
      title: "Enterprise Risk",
      description: teamSize > 10
        ? "Consider enterprise tiers for compliance and security."
        : "No unnecessary enterprise overhead detected.",
      impact: teamSize > 10 ? "Medium impact" : "Low impact",
      icon: teamSize > 10 ? "warning" : "check",
    },
    {
      title: "API Strategy",
      description: results.some(r => r.tool.includes("api"))
        ? "API usage detected; potential for subscription consolidation."
        : "No API usage detected. Relying on flat-fee subscriptions.",
      impact: "Low impact",
      icon: "info",
    },
  ]

  return signals
}

export function getFitLabel(result: ToolAuditResult): { text: string; color: string } {
  if (result.recommendedAction === "remove") return { text: "Redundant", color: "#EF4444" }
  if (result.uniqueValueScore >= 0.6) return { text: "Strategic Asset", color: "#00C853" }
  if (result.uniqueValueScore >= 0.3) return { text: "Moderate Fit", color: "#F59E0B" }
  return { text: "Redundant", color: "#EF4444" }
}

export function getActionLabel(result: ToolAuditResult): string {
  switch (result.recommendedAction) {
    case "keep": return "Keep"
    case "remove": return "Remove Redundancy"
    case "consolidate": return "Consolidate"
    case "switch": return "Switch Tool"
    case "downgrade": return "Downgrade Plan"
    case "upgrade": return "Upgrade Plan"
    default: return "Keep"
  }
}

export function getFallbackSummary(audit: AuditResult): string {
  const savings = audit.totalMonthlySavings ?? 0
  if (audit.isOptimal) return "Your AI stack is lean and efficient."
  if (savings > 100) return `Your stack has critical redundancies. Removing duplicate ${audit.results[0].tool} alternatives could save you $${savings.toFixed(0)}/mo.`
  return `We found minor overlaps in your stack. Consolidating a few tools could save $${savings.toFixed(0)}/mo.`
}
