/**
 * ═══════════════════════════════════════════════════════════════
 * AUDIT ENGINE V2 — Capability overlap analysis
 *
 * Focuses on capability overlap and unique value rather than just pricing.
 * Every recommendation includes confidence, overlap score, unique value score,
 * and need alignment score with detailed rationale.
 * ═══════════════════════════════════════════════════════════════
 */

import { getOfficialPrice, getToolPricing } from "@/lib/pricingData"
import { 
  getPlanCapabilities, 
  getRequiredCapabilitiesForUseCase 
} from "@/lib/capabilityData"
import {
  calculateMarginalUtility,
  findDuplicateCapabilities,
  findUncoveredCapabilities,
  recommendAction,
  getStackCapabilities
} from "@/lib/capabilityAnalysis"
import { analyzeAllToolsGranular } from "@/lib/granularAnalysis"
import type {
  AuditInput,
  AuditOutput,
  ToolAuditResult,
  ToolInput,
  ToolName,
  AuditFinding,
  AuditStackSummary,
  Capability
} from "@/lib/types"

/* ─── Utility helpers ─── */

function round2(value: number): number {
  return Number(Math.max(0, value).toFixed(2))
}

function buildKeep(tool: ToolInput, credex: boolean): ToolAuditResult {
  return {
    tool: tool.tool,
    currentPlan: tool.plan,
    currentSpend: tool.monthlySpend,
    recommendedAction: "keep",
    monthlySavings: 0,
    annualSavings: 0,
    reason: "Plan and pricing are appropriate for your team size and use case.",
    credexOpportunity: credex,
    
    // NEW FIELDS
    confidence: "medium",
    overlapScore: 0,
    uniqueValueScore: 0.5,
    needAlignmentScore: 0.5,
    findings: [],
    rationale: ["Provides appropriate capabilities for your use case"],
    marginalUtility: {
      capabilities: [],
      description: "Provides baseline capabilities for your workflow"
    }
  }
}

// function findTool(tools: ToolInput[], name: ToolName): ToolInput | undefined {
//   return tools.find((t) => t.tool === name)
// }

/* ─── Pipeline Stage 1: Normalize Input ─── */

function normalizeAuditInput(input: AuditInput): AuditInput {
  const normalizedTools = input.tools.map(tool => {
    const officialPrice = getOfficialPrice(tool.tool, tool.plan, tool.seats)
    const reportedSpend = Math.max(tool.monthlySpend, 0)
    const normalizedSeats = Math.max(tool.seats, 1)
    
    // Detect price discrepancies
    const priceDiscrepancy = officialPrice > 0 ? Math.abs(reportedSpend - officialPrice) / officialPrice : 0
    
    return {
      ...tool,
      monthlySpend: reportedSpend,
      seats: normalizedSeats,
      // Add metadata about price accuracy
      _priceDiscrepancy: priceDiscrepancy,
      _officialPrice: officialPrice
    }
  })
  
  return {
    tools: normalizedTools,
    teamSize: Math.max(input.teamSize, 1),
    useCase: input.useCase || "mixed"
  }
}

/* ─── Pipeline Stage 2: Build Context ─── */

interface AuditContext {
  normalized: AuditInput
  totalSpend: number
  allCapabilities: Capability[]
  duplicateCapabilities: Capability[]
  uncoveredCapabilities: Capability[]
  requiredCapabilities: Capability[]
  toolCapabilities: Map<ToolName, Capability[]>
}

function buildAuditContext(normalized: AuditInput): AuditContext {
  const totalSpend = normalized.tools.reduce((sum, t) => sum + t.monthlySpend, 0)
  const toolCapabilities = new Map<ToolName, Capability[]>()
  
  normalized.tools.forEach(tool => {
    toolCapabilities.set(tool.tool, getPlanCapabilities(tool.tool, tool.plan))
  })
  
  const allCapabilities = getStackCapabilities(normalized.tools)
  const duplicateCapabilities = findDuplicateCapabilities(normalized.tools)
  const requiredCapabilities = getRequiredCapabilitiesForUseCase(normalized.useCase)
  const uncoveredCapabilities = findUncoveredCapabilities(normalized.tools, normalized.useCase)
  
  return {
    normalized,
    totalSpend,
    allCapabilities,
    duplicateCapabilities,
    uncoveredCapabilities,
    requiredCapabilities,
    toolCapabilities
  }
}

/* ─── Pipeline Stage 3: Generate Findings ─── */

function generateCapabilityOverlapFindings(context: AuditContext): AuditFinding[] {
  const findings: AuditFinding[] = []
  const { normalized, toolCapabilities } = context
  
  normalized.tools.forEach(tool => {
    const capabilities = toolCapabilities.get(tool.tool) || []
    const otherCapabilities = normalized.tools
      .filter(t => t.tool !== tool.tool)
      .flatMap(t => toolCapabilities.get(t.tool) || [])
    
    const overlap = capabilities.filter(cap => otherCapabilities.includes(cap))
    const unique = capabilities.filter(cap => !otherCapabilities.includes(cap))
    const overlapScore = capabilities.length > 0 ? overlap.length / capabilities.length : 0
    
    if (overlapScore > 0.7) {
      findings.push({
        ruleId: "high-overlap",
        severity: "high",
        type: "overlap",
        message: `${tool.tool} ${tool.plan} has ${Math.round(overlapScore * 100)}% capability overlap with other tools in your stack.`,
        evidence: {
          overlap,
          unique,
          score: overlapScore
        }
      })
    }
  })
  
  return findings
}

function generatePricingFindings(context: AuditContext): AuditFinding[] {
  const findings: AuditFinding[] = []
  const { normalized } = context
  
  normalized.tools.forEach(tool => {
    const officialPrice = getOfficialPrice(tool.tool, tool.plan, tool.seats)
    if (officialPrice > 0 && tool.monthlySpend > officialPrice * 1.25) {
      const overpayPct = Math.round(((tool.monthlySpend - officialPrice) / officialPrice) * 100)
      findings.push({
        ruleId: "spend-mismatch",
        severity: "medium",
        type: "pricing",
        message: `${tool.tool} spend exceeds official pricing by ${overpayPct}%.`,
        evidence: {
          score: overpayPct
        }
      })
    }
  })
  
  return findings
}

function runAllRules(context: AuditContext): AuditFinding[] {
  const { normalized } = context
  const findings: AuditFinding[] = []
  
  // Rule 1: Unknown plan detection
  normalized.tools.forEach(tool => {
    const toolPricingData = getToolPricing(tool.tool)
    if (!toolPricingData) return
    
    const hasKnownPlan = toolPricingData.plans.some(
      (plan: { planName: string }) => plan.planName.toLowerCase() === tool.plan.toLowerCase()
    )
    
    if (!hasKnownPlan) {
      findings.push({
        ruleId: "unknown-plan",
        severity: "medium",
        type: "data-quality",
        message: `${tool.tool} plan "${tool.plan}" not found in pricing database`,
        evidence: {}
      })
    }
    
    // Rule 2: Price discrepancy detection
    if (tool._priceDiscrepancy && tool._priceDiscrepancy > 0.1) { // 10%+ discrepancy
      findings.push({
        ruleId: "price-discrepancy",
        severity: "high",
        type: "pricing",
        message: `${tool.tool} reported spend ($${tool.monthlySpend.toFixed(2)}) is ${Math.round(tool._priceDiscrepancy * 100)}% different from official price ($${tool._officialPrice?.toFixed(2)})`,
        evidence: {
          score: tool._priceDiscrepancy
        }
      })
    }
  })
  
  return [
    ...generateCapabilityOverlapFindings(context),
    ...generatePricingFindings(context),
    ...findings
  ]
}

/* ─── Pipeline Stage 4: Resolve Findings to Recommendations ─── */

function resolveFindingsToRecommendations(
  findings: AuditFinding[], 
  context: AuditContext
): ToolAuditResult[] {
  const { normalized, totalSpend } = context
  const resultMap = new Map<ToolName, ToolAuditResult>()
  
  // Get granular analysis for all tools
  const granularAnalyses = analyzeAllToolsGranular(normalized.tools, normalized.useCase)
  
  // Start with baseline results
  normalized.tools.forEach(tool => {
    const credex = tool.monthlySpend > 50 || totalSpend > 200
    resultMap.set(tool.tool, buildKeep(tool, credex))
  })
  
  // Apply both capability-based and granular analysis
  normalized.tools.forEach(tool => {
    const otherTools = normalized.tools.filter(t => t.tool !== tool.tool)
    const utility = calculateMarginalUtility(
      tool.tool,
      tool.plan,
      otherTools,
      normalized.useCase
    )
    
    const granularAnalysis = granularAnalyses.find(a => a.tool === tool.tool)
    
    const toolFindings = findings.filter(f => {
      // Check if this finding applies to this tool
      const toolName = tool.tool
      return f.message.toLowerCase().includes(toolName.toLowerCase())
    })
    
    const hasUnknownPlan = toolFindings.some(f => f.ruleId === "unknown-plan")
    
    // Determine action based on both analyses
    let action: "keep" | "remove" | "downgrade" | "upgrade" | "consolidate" | "switch" | "cancel-redundant" = "keep"
    let monthlySavings = 0
    let reason = utility.description
    
    // Priority 1: Granular analysis recommendations
    if (granularAnalysis) {
      switch (granularAnalysis.overallRecommendation) {
        case "downgrade-plan":
          action = "downgrade"
          monthlySavings = granularAnalysis.totalPotentialSavings
          reason = granularAnalysis.planFit.reason
          break
        case "switch-tool":
          action = "switch"
          monthlySavings = granularAnalysis.totalPotentialSavings
          reason = granularAnalysis.betterAlternative?.reason || "Switch to better alternative"
          break
        case "upgrade-plan":
          action = "upgrade"
          monthlySavings = 0 // Upgrades cost more, not savings
          reason = granularAnalysis.planFit.reason
          break
        case "use-credits":
          action = "keep" // Keep tool but use credits
          monthlySavings = granularAnalysis.totalPotentialSavings
          reason = "Use credits instead of retail pricing"
          break
      }
    }
    
    // Priority 2: Capability overlap analysis (if no granular recommendation)
    if (action === "keep") {
      const capabilityAction = recommendAction(
        utility.overlapScore,
        utility.uniqueValueScore,
        utility.needAlignmentScore,
        tool.monthlySpend,
        hasUnknownPlan
      )
      
      if (capabilityAction !== "keep") {
        action = capabilityAction
        if (action === "remove" || action === "consolidate") {
          monthlySavings = tool.monthlySpend
        }
      }
    }
    
    // Build comprehensive rationale
    const rationale: string[] = []
    
    // Add granular insights
    if (granularAnalysis) {
      if (granularAnalysis.planFit.savings > 0) {
        rationale.push(`Plan fit: ${granularAnalysis.planFit.reason}`)
      }
      if (granularAnalysis.sameVendorAlternative?.savings) {
        rationale.push(`Same vendor alternative: ${granularAnalysis.sameVendorAlternative.reason}`)
      }
      if (granularAnalysis.betterAlternative?.savings || granularAnalysis.betterAlternative?.additionalCost) {
        rationale.push(`Alternative tool: ${granularAnalysis.betterAlternative.reason}`)
      }
    }
    
    // Add capability insights
    if (utility.overlapScore > 0.6) {
      rationale.push(`${Math.round(utility.overlapScore * 100)}% of capabilities overlap with other tools`)
    }
    if (utility.uniqueValueScore > 0.5) {
      rationale.push(`Provides unique capabilities: ${utility.marginalCapabilities.map(c => c.replace(/_/g, ' ')).join(', ')}`)
    }
    if (utility.needAlignmentScore > 0.7) {
      rationale.push(`Strong alignment with your ${normalized.useCase} use case`)
    }
    if (utility.overlapScore > 0.7 && utility.uniqueValueScore < 0.3) {
      rationale.push(`High overlap with minimal unique value suggests redundancy`)
    }
    
    const confidence = hasUnknownPlan ? "low" : 
                    utility.overlapScore > 0.8 ? "high" : 
                    utility.overlapScore > 0.5 ? "medium" : "medium"
    
    resultMap.set(tool.tool, {
      tool: tool.tool,
      currentPlan: tool.plan,
      currentSpend: tool.monthlySpend,
      recommendedAction: action,
      monthlySavings,
      annualSavings: round2(monthlySavings * 12),
      reason,
      credexOpportunity: tool.monthlySpend > 50 || totalSpend > 200,
      
      // NEW FIELDS
      confidence,
      overlapScore: utility.overlapScore,
      uniqueValueScore: utility.uniqueValueScore,
      needAlignmentScore: utility.needAlignmentScore,
      findings: toolFindings,
      rationale,
      marginalUtility: {
        capabilities: utility.marginalCapabilities,
        description: utility.description
      }
    })
  })
  
  return Array.from(resultMap.values())
}

/* ─── Pipeline Stage 5: Build Stack Summary ─── */

function buildAuditStackSummary(
  recommendations: ToolAuditResult[],
  context: AuditContext
): AuditStackSummary {
  const { normalized, duplicateCapabilities, uncoveredCapabilities } = context
  
  const currentMonthlySpend = normalized.tools.reduce((sum, t) => sum + t.monthlySpend, 0)
  const optimizedMonthlySpend = recommendations.reduce((sum, r) => 
    sum + (r.currentSpend - r.monthlySavings), 0)
  const estimatedMonthlySavings = currentMonthlySpend - optimizedMonthlySpend
  
  // Determine stack status
  const highOverlapTools = recommendations.filter(r => r.overlapScore > 0.7).length
  const totalTools = recommendations.length
  const hasUncovered = uncoveredCapabilities.length > 0
  
  let stackStatus: "optimized" | "overlapping" | "underprovided" | "mixed"
  if (highOverlapTools === 0 && !hasUncovered) {
    stackStatus = "optimized"
  } else if (highOverlapTools > totalTools / 2) {
    stackStatus = "overlapping"
  } else if (hasUncovered) {
    stackStatus = "underprovided"
  } else {
    stackStatus = "mixed"
  }
  
  // Find primary consolidation opportunity
  const consolidationCandidate = recommendations
    .filter(r => r.recommendedAction === "consolidate" || r.recommendedAction === "remove")
    .sort((a, b) => b.monthlySavings - a.monthlySavings)[0]
  
  // Find biggest value adder
  const valueAdder = recommendations
    .filter(r => r.uniqueValueScore > 0.5)
    .sort((a, b) => b.uniqueValueScore - a.uniqueValueScore)[0]
  
  return {
    currentMonthlySpend,
    optimizedMonthlySpend,
    estimatedMonthlySavings,
    duplicateCapabilities,
    uncoveredCapabilities,
    stackStatus,
    primaryConsolidationOpportunity: consolidationCandidate?.tool,
    biggestValueAdder: valueAdder?.tool
  }
}

/* ═══════════════════════════════════════════════════════════════
   MAIN ENTRY POINT
   ═══════════════════════════════════════════════════════════════ */

export function runAudit(input: AuditInput): AuditOutput {
  // Step 1: Normalize all input
  const normalized = normalizeAuditInput(input)
  
  // Step 2: Build context with capability profiles
  const context = buildAuditContext(normalized)
  
  // Step 3: Generate findings (not recommendations yet)
  const findings = runAllRules(context)
  
  // Step 4: Resolve findings to recommendations
  const recommendations = resolveFindingsToRecommendations(findings, context)
  
  // Step 5: Generate stack-level summary
  const summary = buildAuditStackSummary(recommendations, context)
  
  // Filter out savings < $10/mo (too noisy)
  const filteredResults = recommendations.map(result => {
    if (result.monthlySavings > 0 && result.monthlySavings < 10) {
      return {
        ...result,
        recommendedAction: "keep" as const,
        monthlySavings: 0,
        annualSavings: 0,
        reason: "Savings amount is too small to justify the change."
      }
    }
    return result
  })
  
  const totalMonthlySavings = round2(
    filteredResults.reduce((sum, r) => sum + r.monthlySavings, 0),
  )
  const totalAnnualSavings = round2(totalMonthlySavings * 12)

  return {
    input: normalized,
    results: filteredResults,
    summary,
    totalMonthlySavings,
    totalAnnualSavings,
    isOptimal: summary.stackStatus === "optimized" || totalMonthlySavings < 100,
    showCredex: totalAnnualSavings > 500,
  }
}
