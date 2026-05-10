/**
 * ═══════════════════════════════════════════════════════════════
 * GRANULAR TOOL ANALYSIS — Individual Tool Recommendations
 * 
 * Evaluates each tool on:
 * - Plan fit for team size and usage
 * - Cheaper same-vendor plan recommendations
 * - Better alternative tools for use case (not just cheaper)
 * - Upgrade recommendations for underpowered teams
 * - Credit vs retail pricing opportunities
 * ═══════════════════════════════════════════════════════════════
 */

import type { ToolName, UseCase, ToolInput } from "@/lib/types"
import { getPlanCapabilities, getRequiredCapabilitiesForUseCase } from "./capabilityData"
import { getOfficialPrice, getPlanPricing, getToolPricing } from "./pricingData"

export type PlanFitAnalysis = {
  currentPlan: string
  recommendedPlan?: string
  reason: string
  savings: number
  additionalCost: number
  fitScore: "perfect" | "good" | "overkill" | "underpowered"
  upgradeReason?: string
}

export type AlternativeAnalysis = {
  alternativeTool: ToolName
  alternativePlan: string
  reason: string
  savings: number
  additionalCost: number
  capabilityMatch: number // 0-1, how well capabilities match current tool
  useCaseAlignment: number // 0-1, how well it matches the user's use case
  isUpgrade: boolean // true if this is an upgrade recommendation
}

export type CreditAnalysis = {
  hasCreditOption: boolean
  creditPrice?: number
  retailPrice: number
  potentialSavings: number
  creditSource: string
}

export type ToolGranularAnalysis = {
  tool: ToolName
  currentPlan: string
  currentSpend: number
  planFit: PlanFitAnalysis
  sameVendorAlternative?: PlanFitAnalysis
  betterAlternative?: AlternativeAnalysis
  creditOpportunity: CreditAnalysis
  overallRecommendation: "keep" | "downgrade-plan" | "upgrade-plan" | "switch-tool" | "use-credits"
  totalPotentialSavings: number
  recommendedAdditionalCost: number
}

// Analyze if current plan fits team size and usage
function analyzePlanFit(
  tool: ToolName,
  currentPlan: string,
  teamSize: number,
  monthlySpend: number
): PlanFitAnalysis {
  const toolPricing = getToolPricing(tool)
  if (!toolPricing) {
    return {
      currentPlan,
      reason: "Unknown tool - no pricing data available",
      savings: 0,
      additionalCost: 0,
      fitScore: "good"
    }
  }

  const currentPlanPricing = getPlanPricing(tool, currentPlan)
  if (!currentPlanPricing) {
    return {
      currentPlan,
      reason: "Unknown plan - no pricing data available",
      savings: 0,
      additionalCost: 0,
      fitScore: "good"
    }
  }

  // Check if team size fits plan requirements
  const minSeats = currentPlanPricing.minSeats
  const isPerUser = currentPlanPricing.isPerUser
  
  let fitScore: "perfect" | "good" | "overkill" | "underpowered" = "perfect"
  let recommendedPlan: string | undefined
  let reason = ""
  let savings = 0
  let additionalCost = 0
  let upgradeReason: string | undefined

  // Team size analysis
  if (minSeats && teamSize < minSeats) {
    fitScore = "overkill"
    // Find cheaper plan for smaller team
    const cheaperPlans = toolPricing.plans.filter(plan => 
      plan.planName !== currentPlan &&
      (!plan.minSeats || teamSize >= plan.minSeats) &&
      plan.pricePerUserPerMonth < currentPlanPricing.pricePerUserPerMonth
    )
    
    if (cheaperPlans.length > 0) {
      const bestPlan = cheaperPlans[0]
      recommendedPlan = bestPlan.planName
      savings = monthlySpend - (bestPlan.isPerUser ? bestPlan.pricePerUserPerMonth * teamSize : bestPlan.pricePerUserPerMonth)
      reason = `Team of ${teamSize} doesn't need ${currentPlan} plan (requires ${minSeats}+ seats). ${bestPlan.planName} plan saves $${savings.toFixed(2)}/month.`
    }
  } else if (teamSize > 10 && (currentPlan.includes("Individual") || currentPlan.includes("Pro") || currentPlan.includes("Free"))) {
    fitScore = "underpowered"
    upgradeReason = `Team of ${teamSize} needs collaboration features and higher limits. ${currentPlan} plan will limit productivity.`
    
    // Find upgrade options
    const upgradePlans = toolPricing.plans.filter(plan => 
      plan.planName !== currentPlan &&
      (plan.planName.includes("Team") || plan.planName.includes("Business") || plan.planName.includes("Enterprise")) &&
      (!plan.minSeats || teamSize >= plan.minSeats)
    )
    
    if (upgradePlans.length > 0) {
      const bestUpgrade = upgradePlans[0]
      recommendedPlan = bestUpgrade.planName
      additionalCost = (bestUpgrade.isPerUser ? bestUpgrade.pricePerUserPerMonth * teamSize : bestUpgrade.pricePerUserPerMonth) - monthlySpend
      reason = `Upgrade to ${bestUpgrade.planName} plan for $${additionalCost.toFixed(2)}/month more. ${upgradeReason}`
    } else {
      reason = `Team of ${teamSize} may outgrow ${currentPlan} plan. Consider Team/Business plans for better collaboration features.`
    }
  } else if (teamSize > 5 && currentPlan === "Free") {
    fitScore = "underpowered"
    upgradeReason = `Team of ${teamSize} on Free plan will hit usage limits quickly, reducing productivity.`
    
    // Find paid upgrade options
    const paidPlans = toolPricing.plans.filter(plan => 
      plan.planName !== currentPlan &&
      plan.pricePerUserPerMonth > 0 &&
      (!plan.minSeats || teamSize >= plan.minSeats)
    )
    
    if (paidPlans.length > 0) {
      const bestUpgrade = paidPlans[0]
      recommendedPlan = bestUpgrade.planName
      additionalCost = (bestUpgrade.isPerUser ? bestUpgrade.pricePerUserPerMonth * teamSize : bestUpgrade.pricePerUserPerMonth) - monthlySpend
      reason = `Upgrade to ${bestUpgrade.planName} plan for $${additionalCost.toFixed(2)}/month. ${upgradeReason}`
    }
  } else {
    reason = `${currentPlan} plan is appropriate for team of ${teamSize}.`
  }

  return {
    currentPlan,
    recommendedPlan,
    reason,
    savings,
    additionalCost,
    fitScore,
    upgradeReason
  }
}

// Find cheaper alternatives from same vendor
function findSameVendorAlternative(
  tool: ToolName,
  currentPlan: string,
  teamSize: number,
  monthlySpend: number
): PlanFitAnalysis | undefined {
  const toolPricing = getToolPricing(tool)
  if (!toolPricing) return undefined

  const currentPlanPricing = getPlanPricing(tool, currentPlan)
  if (!currentPlanPricing) return undefined

  // Find cheaper plans that could work
  const cheaperPlans = toolPricing.plans.filter(plan => 
    plan.planName !== currentPlan &&
    plan.pricePerUserPerMonth < currentPlanPricing.pricePerUserPerMonth &&
    (!plan.minSeats || teamSize >= plan.minSeats)
  )

  if (cheaperPlans.length === 0) return undefined

  const bestAlternative = cheaperPlans[0]
  const savings = monthlySpend - (bestAlternative.isPerUser ? bestAlternative.pricePerUserPerMonth * teamSize : bestAlternative.pricePerUserPerMonth)

  return {
    currentPlan,
    recommendedPlan: bestAlternative.planName,
    reason: `${bestAlternative.planName} plan provides similar core features for $${savings.toFixed(2)}/month less.`,
    savings,
    additionalCost: 0,
    fitScore: "good"
  }
}

// Find better alternative tools (cheaper or better for use case)
function findBetterAlternative(
  tool: ToolName,
  currentPlan: string,
  useCase: UseCase,
  monthlySpend: number,
  teamSize: number
): AlternativeAnalysis | undefined {
  const currentCapabilities = getPlanCapabilities(tool, currentPlan)
  const requiredCapabilities = getRequiredCapabilitiesForUseCase(useCase)
  
  // Define tool categories for alternatives
  const toolCategories: Record<string, ToolName[]> = {
    ide: ["cursor", "windsurf", "github-copilot"],
    chat: ["chatgpt", "claude", "gemini"],
    api: ["anthropic-api", "openai-api"]
  }

  // Find which category this tool belongs to
  let category: string | undefined
  for (const [cat, tools] of Object.entries(toolCategories)) {
    if (tools.includes(tool)) {
      category = cat
      break
    }
  }

  if (!category) return undefined

  // Check alternatives in same category
  const alternatives = toolCategories[category].filter((t: ToolName) => t !== tool)
  
  let bestAlternative: AlternativeAnalysis | undefined

  for (const altTool of alternatives) {
    const altToolPricing = getToolPricing(altTool)
    if (!altToolPricing) continue

    // Find the best plan for alternative tool (not just cheapest)
    const altPlans = altToolPricing.plans.filter(plan => 
      plan.pricePerUserPerMonth > 0 &&
      (!plan.minSeats || teamSize >= plan.minSeats)
    )
    if (altPlans.length === 0) continue

    // For each plan, calculate how well it fits the use case
    for (const altPlan of altPlans) {
      const altCapabilities = getPlanCapabilities(altTool, altPlan.planName)
      const altPrice = altPlan.isPerUser ? altPlan.pricePerUserPerMonth * teamSize : altPlan.pricePerUserPerMonth
      
      // Calculate capability match with current tool
      const matchingCapabilities = currentCapabilities.filter(cap => altCapabilities.includes(cap))
      const capabilityMatch = matchingCapabilities.length / currentCapabilities.length

      // Calculate use case alignment
      const useCaseCapabilities = altCapabilities.filter(cap => requiredCapabilities.includes(cap))
      const useCaseAlignment = useCaseCapabilities.length / requiredCapabilities.length

      // Must provide good use case alignment (80%+) or significant savings
      if (useCaseAlignment < 0.8 && altPrice >= monthlySpend) continue

      const savings = monthlySpend - altPrice
      const additionalCost = altPrice > monthlySpend ? altPrice - monthlySpend : 0
      const isUpgrade = altPrice > monthlySpend

      // Score the alternative (use case alignment is most important)
      const currentScore = bestAlternative ? 
        bestAlternative.useCaseAlignment * 0.6 + (bestAlternative.savings > 0 ? Math.min(bestAlternative.savings / monthlySpend, 0.3) : 0) : 0
      const score = useCaseAlignment * 0.6 + (savings > 0 ? Math.min(savings / monthlySpend, 0.3) : 0) + (isUpgrade && useCaseAlignment > 0.9 ? 0.2 : 0)

      if (score > currentScore) {
        const action = isUpgrade ? "upgrade to" : "switch to"
        const costDesc = isUpgrade ? `for $${additionalCost.toFixed(2)}/month more` : `saving $${savings.toFixed(2)}/month`
        
        bestAlternative = {
          alternativeTool: altTool,
          alternativePlan: altPlan.planName,
          reason: `${action} ${altTool} ${altPlan.planName} - ${Math.round(useCaseAlignment * 100)}% better for ${useCase}, ${costDesc}.`,
          savings: Math.max(0, savings),
          additionalCost,
          capabilityMatch,
          useCaseAlignment,
          isUpgrade
        }
      }
    }
  }

  return bestAlternative
}

// Analyze credit vs retail pricing opportunities
function analyzeCreditOpportunity(
  tool: ToolName,
  currentPlan: string,
  monthlySpend: number
): CreditAnalysis {
  // For now, this is a placeholder for future credit analysis
  // In a real implementation, you'd integrate with credit providers
  
  const hasCreditOption = false // Placeholder - would check actual credit availability
  const creditPrice = undefined // Placeholder - would get actual credit pricing
  const retailPrice = monthlySpend
  const potentialSavings = 0
  const creditSource = "None available"

  return {
    hasCreditOption,
    creditPrice,
    retailPrice,
    potentialSavings,
    creditSource
  }
}

// Main analysis function for a single tool
export function analyzeToolGranular(
  toolInput: ToolInput,
  useCase: UseCase
): ToolGranularAnalysis {
  const { tool, plan, monthlySpend, seats } = toolInput

  const planFit = analyzePlanFit(tool, plan, seats, monthlySpend)
  const sameVendorAlternative = findSameVendorAlternative(tool, plan, seats, monthlySpend)
  const betterAlternative = findBetterAlternative(tool, plan, useCase, monthlySpend, seats)
  const creditOpportunity = analyzeCreditOpportunity(tool, plan, monthlySpend)

  // Determine overall recommendation
  let overallRecommendation: "keep" | "downgrade-plan" | "upgrade-plan" | "switch-tool" | "use-credits" = "keep"
  let totalPotentialSavings = 0
  let recommendedAdditionalCost = 0

  // Priority 1: Upgrade recommendations for underpowered teams
  if (planFit.fitScore === "underpowered" && planFit.additionalCost > 0) {
    overallRecommendation = "upgrade-plan"
    recommendedAdditionalCost = planFit.additionalCost
  }
  // Priority 2: Downgrade for overkill
  else if (planFit.savings > 0) {
    overallRecommendation = "downgrade-plan"
    totalPotentialSavings = planFit.savings
  }
  // Priority 3: Better alternative (upgrade or switch)
  else if (betterAlternative) {
    if (betterAlternative.isUpgrade) {
      overallRecommendation = "switch-tool" // Even if upgrade, it's a different tool
      recommendedAdditionalCost = betterAlternative.additionalCost
    } else {
      overallRecommendation = "switch-tool"
      totalPotentialSavings = betterAlternative.savings
    }
  }
  // Priority 4: Same vendor alternative
  else if (sameVendorAlternative?.savings && sameVendorAlternative.savings > 0) {
    overallRecommendation = "downgrade-plan"
    totalPotentialSavings = sameVendorAlternative.savings
  }
  // Priority 5: Credit opportunities
  else if (creditOpportunity.potentialSavings > 0) {
    overallRecommendation = "use-credits"
    totalPotentialSavings = creditOpportunity.potentialSavings
  }

  return {
    tool,
    currentPlan: plan,
    currentSpend: monthlySpend,
    planFit,
    sameVendorAlternative,
    betterAlternative,
    creditOpportunity,
    overallRecommendation,
    totalPotentialSavings,
    recommendedAdditionalCost
  }
}

// Analyze all tools in the audit
export function analyzeAllToolsGranular(
  tools: ToolInput[],
  useCase: UseCase
): ToolGranularAnalysis[] {
  return tools.map(tool => analyzeToolGranular(tool, useCase))
}
