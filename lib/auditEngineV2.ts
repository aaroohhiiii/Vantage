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
  getStackCapabilities
} from "@/lib/capabilityAnalysis"
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

  // Initialize all results as "keep" by default
  normalized.tools.forEach((tool) => {
    const credex = tool.monthlySpend > 50 || totalSpend > 200
    resultMap.set(tool.tool, buildKeep(tool, credex))
  })

  // ─────────────────────────────────────────────────────────
  // PRIORITY 1: API vs Subscription Overlap (HIGHEST PRIORITY)
  // ─────────────────────────────────────────────────────────
  const hasAnthropicAPI = normalized.tools.some((t) => t.tool === "anthropic-api")
  const hasOpenAIAPI = normalized.tools.some((t) => t.tool === "openai-api")

  const anthropicAPISpend = normalized.tools.find(
    (t) => t.tool === "anthropic-api"
  )?.monthlySpend || 0
  const openaiAPISpend = normalized.tools.find((t) => t.tool === "openai-api")
    ?.monthlySpend || 0

  // If high API spend, remove corresponding chat subscriptions
  if (anthropicAPISpend > 30) {
    const claudeTool = normalized.tools.find((t) => t.tool === "claude")
    if (claudeTool && hasAnthropicAPI) {
      const claudeResult = resultMap.get("claude")!
      claudeResult.recommendedAction = "remove"
      claudeResult.monthlySavings = claudeTool.monthlySpend
      claudeResult.annualSavings = claudeTool.monthlySpend * 12
      claudeResult.reason = `High Anthropic API spend ($${anthropicAPISpend}/mo) makes Claude subscription redundant` 
      claudeResult.rationale = [
        `Anthropic API spend of $${anthropicAPISpend}/mo exceeds subscription cost`,
        "API access provides same capabilities as subscription",
        "Consolidate to API direct to eliminate duplicate costs"
      ]
    }
  }

  if (openaiAPISpend > 30) {
    const chatgptTool = normalized.tools.find((t) => t.tool === "chatgpt")
    if (chatgptTool && hasOpenAIAPI) {
      const chatgptResult = resultMap.get("chatgpt")!
      chatgptResult.recommendedAction = "remove"
      chatgptResult.monthlySavings = chatgptTool.monthlySpend
      chatgptResult.annualSavings = chatgptTool.monthlySpend * 12
      chatgptResult.reason = `High OpenAI API spend ($${openaiAPISpend}/mo) makes ChatGPT subscription redundant` 
      chatgptResult.rationale = [
        `OpenAI API spend of $${openaiAPISpend}/mo exceeds subscription cost`,
        "API access provides same capabilities as subscription",
        "Consolidate to API direct to eliminate duplicate costs"
      ]
    }
  }

  // ─────────────────────────────────────────────────────────
  // PRIORITY 2: Capability-Based Analysis
  // ─────────────────────────────────────────────────────────
  normalized.tools.forEach((tool) => {
    const otherTools = normalized.tools.filter((t) => t.tool !== tool.tool)
    const utility = calculateMarginalUtility(
      tool.tool,
      tool.plan,
      otherTools,
      normalized.useCase
    )

    const toolFindings = findings.filter((f) =>
      f.message.toLowerCase().includes(tool.tool.toLowerCase())
    )

    const hasUnknownPlan = toolFindings.some((f) => f.ruleId === "unknown-plan")

    // Get current result (already initialized as "keep")
    const currentResult = resultMap.get(tool.tool)!
    
    // Skip recommendation logic if API overlap already handled this tool
    // But still update the scores and rationale
    const apiOverlapHandled = currentResult.recommendedAction === "remove" && 
                             currentResult.rationale.some(r => r.includes("API"))

    // Build rationale array
    const rationale: string[] = []

    // ─── Calculate overlap impact ───
    if (utility.overlapScore >= 0.6) {
      rationale.push(
        `${Math.round(utility.overlapScore * 100)}% of capabilities overlap with other tools` 
      )
    }

    // ─── Add unique value info ───
    if (utility.uniqueValueScore > 0.5) {
      const uniqueCaps = utility.marginalCapabilities
        .map((c) => c.replace(/_/g, " "))
        .join(", ")
      rationale.push(`Provides unique capabilities: ${uniqueCaps}`)
    } else if (utility.overlapScore > 0.6 && utility.uniqueValueScore < 0.3) {
      rationale.push(
        `High overlap with minimal unique value suggests potential redundancy` 
      )
    }

    // ─── Add alignment info ───
    if (utility.needAlignmentScore > 0.7) {
      rationale.push(
        `Strong alignment with your ${normalized.useCase} use case` 
      )
    }

    // ─── Determine recommendation ───
    let recommendation: "keep" | "remove" | "consolidate" = "keep"

    // Only change recommendation if API overlap didn't already handle it
    if (!apiOverlapHandled) {
      // Count how many tools in the same category to adjust thresholds
      const sameCategoryTools = normalized.tools.filter(t => {
        if (tool.tool === "chatgpt" || tool.tool === "claude" || tool.tool === "gemini") {
          return t.tool === "chatgpt" || t.tool === "claude" || t.tool === "gemini"
        }
        if (tool.tool === "cursor" || tool.tool === "github-copilot" || tool.tool === "windsurf") {
          return t.tool === "cursor" || t.tool === "github-copilot" || t.tool === "windsurf"
        }
        return false
      }).length

      // Adjust thresholds based on number of similar tools
      const overlapThreshold = sameCategoryTools >= 3 ? 0.3 : 0.7
      const uniqueValueThreshold = sameCategoryTools >= 3 ? 0.5 : 0.1

      // Only recommend removal if:
      // 1. High overlap (adjusted threshold) AND
      // 2. Low unique value (adjusted threshold) AND
      // 3. Poor need alignment (<0.3)
      if (
        utility.overlapScore > overlapThreshold &&
        utility.uniqueValueScore < uniqueValueThreshold &&
        utility.needAlignmentScore < 0.3
      ) {
        recommendation = "remove"
        currentResult.monthlySavings = tool.monthlySpend
        currentResult.annualSavings = tool.monthlySpend * 12
        rationale.push(
          `High overlap with ${sameCategoryTools} similar tools - removing frees $${tool.monthlySpend}/mo` 
        )
      }
      // Consolidate if moderate overlap and reasonable value, BUT only if poor use case alignment
      else if (
        utility.overlapScore > 0.3 &&
        utility.uniqueValueScore < 0.8 &&
        utility.needAlignmentScore <= 0.5  // Only consolidate if poor use case alignment
      ) {
        recommendation = "consolidate"
        currentResult.monthlySavings = tool.monthlySpend
        currentResult.annualSavings = tool.monthlySpend * 12
        rationale.push(
          `Moderate overlap suggests consolidation opportunity` 
        )
      }
      // Otherwise keep
      else {
        recommendation = "keep"
        currentResult.monthlySavings = 0
        currentResult.annualSavings = 0
      }

      // ─── Build final result ───
      currentResult.recommendedAction = recommendation
      
      // Only set confidence if API overlap didn't already handle it
      if (!apiOverlapHandled) {
        currentResult.confidence = hasUnknownPlan
          ? "low"
          : utility.overlapScore > 0.5
            ? "high"
            : utility.overlapScore > 0.08
              ? "medium"
              : "low"
      }
      
      // Set scores for capability analysis
      currentResult.overlapScore = utility.overlapScore
      currentResult.uniqueValueScore = utility.uniqueValueScore
      currentResult.needAlignmentScore = utility.needAlignmentScore
      currentResult.findings = toolFindings
    }
    
    // For API overlap handled tools, still set the scores but confidence was already set
    if (apiOverlapHandled) {
      currentResult.overlapScore = utility.overlapScore
      currentResult.uniqueValueScore = utility.uniqueValueScore
      currentResult.needAlignmentScore = utility.needAlignmentScore
      currentResult.findings = toolFindings
    }
    
    // Merge rationale: preserve API rationale if it exists, add capability rationale
    if (apiOverlapHandled) {
      // Keep the original API rationale, but add capability insights
      const apiRationale = currentResult.rationale
      currentResult.rationale = [...apiRationale, ...rationale]
    } else {
      currentResult.rationale = rationale.length > 0 ? rationale : ["Plan is appropriate for your setup"]
    }
    
    currentResult.marginalUtility = {
      capabilities: utility.marginalCapabilities,
      description: utility.description,
    }

    // Add reason string (don't override if API overlap handled)
    if (!apiOverlapHandled) {
      if (recommendation === "remove") {
        currentResult.reason = `Tool has high capability overlap with minimal unique value. Removing saves $${tool.monthlySpend}/month.` 
      } else if (recommendation === "consolidate") {
        currentResult.reason = `Tool has significant capability overlap. Consider consolidating to primary alternative to save $${tool.monthlySpend}/month.` 
      } else {
        currentResult.reason = `${tool.tool} provides ${
          utility.uniqueValueScore > 0.5 ? "valuable unique" : "appropriate"
        } capabilities for your ${normalized.useCase} use case.`
      }
    }
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
  const optimizedMonthlySpend = recommendations.reduce((sum, r) => {
    if (r.recommendedAction === "remove") {
      return sum + 0
    } else {
      return sum + r.currentSpend
    }
  }, 0)
  const estimatedMonthlySavings = currentMonthlySpend - optimizedMonthlySpend
  
  // Determine stack status
  const highOverlapTools = recommendations.filter(r => r.overlapScore > 0.6).length
  const mediumOverlapTools = recommendations.filter(r => r.overlapScore > 0.3).length
  const totalTools = recommendations.length
  const hasUncovered = uncoveredCapabilities.length > 0
  const hasSomeOverlap = mediumOverlapTools > 0
  
  let stackStatus: "optimized" | "overlapping" | "underprovided" | "mixed"
  if (hasUncovered) {
    stackStatus = "underprovided"
  } else if (highOverlapTools >= totalTools / 2 && mediumOverlapTools >= totalTools * 0.8) {
    stackStatus = "overlapping"
  } else if (hasSomeOverlap) {
    stackStatus = "mixed"
  } else if (highOverlapTools === 0 && mediumOverlapTools <= 1) {
    stackStatus = "optimized"
  } else {
    stackStatus = "optimized"
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
    primaryConsolidationOpportunity: consolidationCandidate?.tool || undefined,
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
