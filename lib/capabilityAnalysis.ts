import type { Capability, ToolName, UseCase } from "@/lib/types"
import { getPlanCapabilities, getRequiredCapabilitiesForUseCase } from "./capabilityData"

// Find capabilities that overlap between two plans
export function findOverlapCapabilities(plan1: Capability[], plan2: Capability[]): Capability[] {
  return plan1.filter(cap => plan2.includes(cap))
}

// Find capabilities unique to one plan compared to others
export function findUniqueCapabilities(plan: Capability[], otherPlans: Capability[]): Capability[] {
  return plan.filter(cap => !otherPlans.includes(cap))
}

// Calculate overlap ratio for a plan vs rest of stack (symmetric)
export function calculateOverlapScore(plan: Capability[], otherPlans: Capability[]): number {
  if (plan.length === 0) return 0
  if (otherPlans.length === 0) return 0
  
  // CORRECT: Use union of both, not just one
  const totalCapabilities = new Set([...plan, ...otherPlans]).size
  const uniqueCapabilities = new Set([
    ...plan.filter(cap => !otherPlans.includes(cap)),
    ...otherPlans.filter(cap => !plan.includes(cap))
  ]).size
  
  // Overlap is inverse of unique
  const overlapRatio = (totalCapabilities - uniqueCapabilities) / totalCapabilities
  
  return overlapRatio
}

// Score how well a plan's unique capabilities match user needs
export function scoreNeedAlignment(uniqueCapabilities: Capability[], requiredCapabilities: Capability[]): number {
  if (uniqueCapabilities.length === 0) return 0
  if (requiredCapabilities.length === 0) return 0
  
  const matching = uniqueCapabilities.filter(cap => requiredCapabilities.includes(cap))
  return matching.length / requiredCapabilities.length
}

// Calculate marginal utility scores for a plan
export function calculateMarginalUtility(
  tool: ToolName,
  plan: string,
  allOtherPlans: { tool: ToolName; plan: string }[],
  userNeeds: UseCase
): {
  overlapScore: number
  uniqueValueScore: number
  needAlignmentScore: number
  marginalCapabilities: Capability[]
  description: string
} {
  const planCapabilities = getPlanCapabilities(tool, plan)
  const otherCapabilities = allOtherPlans.flatMap(
    other => getPlanCapabilities(other.tool, other.plan)
  )
  const requiredCapabilities = getRequiredCapabilitiesForUseCase(userNeeds)
  
  const uniqueCapabilities = findUniqueCapabilities(planCapabilities, otherCapabilities)
  const overlapScore = calculateOverlapScore(planCapabilities, otherCapabilities)
  // Boost unique value score for tools with more unique capabilities
  const baseUniqueScore = planCapabilities.length > 0 ? uniqueCapabilities.length / planCapabilities.length : 0
  
  // Additional boost for premium capabilities that are valuable even if overlapping
  const hasPremiumCapabilities = planCapabilities.some(cap => 
    ["projects", "deep_research", "image_generation", "ide_integration", "code_assistant"].includes(cap)
  )
  
  const premiumBoost = hasPremiumCapabilities ? 0.3 : 0
  const uniqueValueScore = Math.min(baseUniqueScore * 1.5 + premiumBoost, 1.0) // Boost by 50% + premium boost
  const needAlignmentScore = scoreNeedAlignment(uniqueCapabilities, requiredCapabilities)
  
  // Generate description
  const capabilitiesText = uniqueCapabilities.length > 0 
    ? uniqueCapabilities.map(cap => cap.replace(/_/g, ' ')).join(', ')
    : 'none'
  
  const description = uniqueCapabilities.length > 0
    ? `Provides unique capabilities: ${capabilitiesText}`
    : 'Provides no unique capabilities not already covered by other tools'
  
  return {
    overlapScore,
    uniqueValueScore,
    needAlignmentScore,
    marginalCapabilities: uniqueCapabilities,
    description
  }
}

// Get all capabilities across the entire stack
export function getStackCapabilities(tools: { tool: ToolName; plan: string }[]): Capability[] {
  const allCapabilities = tools.flatMap(
    tool => getPlanCapabilities(tool.tool, tool.plan)
  )
  return [...new Set(allCapabilities)] // Remove duplicates
}

// Find duplicate capabilities across the stack
export function findDuplicateCapabilities(tools: { tool: ToolName; plan: string }[]): Capability[] {
  const capabilityCount = new Map<Capability, number>()
  
  tools.forEach(tool => {
    const capabilities = getPlanCapabilities(tool.tool, tool.plan)
    capabilities.forEach(cap => {
      capabilityCount.set(cap, (capabilityCount.get(cap) || 0) + 1)
    })
  })
  
  return Array.from(capabilityCount.entries())
    .filter(([, count]) => count > 1)
    .map(([cap]) => cap)
}

// Find capabilities that are missing for the use case
export function findUncoveredCapabilities(
  tools: { tool: ToolName; plan: string }[],
  useCase: UseCase
): Capability[] {
  const stackCapabilities = getStackCapabilities(tools)
  const requiredCapabilities = getRequiredCapabilitiesForUseCase(useCase)
  
  return requiredCapabilities.filter(cap => !stackCapabilities.includes(cap))
}

// Decide action based on scores and savings
export function recommendAction(
  overlapScore: number,
  uniqueValueScore: number,
  needAlignmentScore: number,
  monthlySavings: number,
  isUnknownPlan: boolean = false
): "keep" | "remove" | "consolidate" | "switch" | "downgrade" | "upgrade" {
  if (isUnknownPlan) {
    return "keep" // Can't confidently recommend changes for unknown plans
  }
  
  // High overlap, low unique value, poor alignment -> remove
  if (overlapScore > 0.7 && uniqueValueScore < 0.15 && needAlignmentScore < 0.3) {
    return "remove"
  }
  
  // High overlap but some unique value -> consolidate (only for 0.15–0.2 range)
  if (overlapScore > 0.6 && uniqueValueScore >= 0.15 && uniqueValueScore <= 0.2) {
    return "consolidate"
  }
  
  // If plan provides meaningful unique value or aligns well to needs, keep it
  if (uniqueValueScore > 0.2 || needAlignmentScore > 0.4) {
    return "keep"
  }
  
  // Low unique value but good alignment -> consider switch
  if (uniqueValueScore < 0.05 && needAlignmentScore > 0.9) {
    return "switch"
  }
  
  // Default to keep for edge cases
  return "keep"
}
