import type { Capability, ToolName, UseCase } from "@/lib/types"
import { getPlanCapabilities, getRequiredCapabilitiesForUseCase } from "./capabilityData"

const USE_CASE_CAPABILITY_PRIORITIES: Record<UseCase, Record<string, number>> = {
  coding: { ide_integration: 1.0, code_assistant: 1.0, mcp_support: 0.9, agent_mode: 0.8, frontier_models: 0.7, advanced_reasoning: 0.8, extended_context: 0.7 },
  writing: { frontier_models: 1.0, advanced_reasoning: 0.9, memory: 0.8, projects: 0.8, image_generation: 0.6 },
  data: { advanced_reasoning: 1.0, frontier_models: 0.9, extended_context: 0.9, image_analysis: 0.7, high_usage_limits: 0.6 },
  research: { deep_research: 1.0, advanced_reasoning: 1.0, extended_context: 0.9, frontier_models: 0.8, memory: 0.7 },
  mixed: { frontier_models: 0.9, advanced_reasoning: 0.8, ide_integration: 0.7, code_assistant: 0.7, projects: 0.6, high_usage_limits: 0.6 }
}

function getUseCaseWeight(capability: string, useCase: UseCase): number {
  return USE_CASE_CAPABILITY_PRIORITIES[useCase]?.[capability] ?? 0.5
}

export function findOverlapCapabilities(plan1: Capability[], plan2: Capability[]): Capability[] {
  return plan1.filter(cap => plan2.includes(cap))
}

export function findUniqueCapabilities(plan: Capability[], otherPlans: Capability[]): Capability[] {
  return plan.filter(cap => !otherPlans.includes(cap))
}

export function getStackCapabilities(tools: { tool: ToolName; plan: string }[]): Capability[] {
  const allCapabilities = tools.flatMap(tool => getPlanCapabilities(tool.tool, tool.plan))
  return [...new Set(allCapabilities)]
}

export function findDuplicateCapabilities(tools: { tool: ToolName; plan: string }[]): Capability[] {
  const capabilityCount = new Map<Capability, number>()
  tools.forEach(tool => {
    getPlanCapabilities(tool.tool, tool.plan).forEach(cap => {
      capabilityCount.set(cap, (capabilityCount.get(cap) || 0) + 1)
    })
  })
  return Array.from(capabilityCount.entries()).filter(([, count]) => count > 1).map(([cap]) => cap)
}

export function findUncoveredCapabilities(tools: { tool: ToolName; plan: string }[], useCase: UseCase): Capability[] {
  const stackCapabilities = getStackCapabilities(tools)
  const requiredCapabilities = getRequiredCapabilitiesForUseCase(useCase)
  return requiredCapabilities.filter(cap => !stackCapabilities.includes(cap))
}

export function calculateOverlapScore(plan: Capability[], otherPlans: Capability[]): number {
  if (plan.length === 0 || otherPlans.length === 0) return 0
  const intersection = plan.filter(cap => otherPlans.includes(cap)).length
  return intersection / plan.length // Containment score
}

export function scoreNeedAlignment(uniqueCapabilities: Capability[], requiredCapabilities: Capability[], context?: { teamSize: number; seats: number }): number {
  if (uniqueCapabilities.length === 0 || requiredCapabilities.length === 0) return 0
  const matching = uniqueCapabilities.filter(cap => requiredCapabilities.includes(cap))
  const baseAlignment = matching.length / requiredCapabilities.length
  if (context) {
    const maturityWeight = context.teamSize <= 3 ? 1.2 : context.teamSize >= 20 ? 0.8 : 1.0
    const utilizationRate = context.teamSize / Math.max(1, context.seats)
    const utilizationPenalty = utilizationRate < 0.5 ? 0.7 : utilizationRate > 2.0 ? 0.8 : 1.0
    return Math.min(1, baseAlignment * maturityWeight * utilizationPenalty)
  }
  return baseAlignment
}

export function calculateMarginalUtility(tool: ToolName, plan: string, allOtherPlans: { tool: ToolName; plan: string }[], userNeeds: UseCase): { overlapScore: number; uniqueValueScore: number; needAlignmentScore: number; marginalCapabilities: Capability[]; description: string } {
  const planCapabilities = getPlanCapabilities(tool, plan)
  const otherCapabilities = allOtherPlans.flatMap(other => getPlanCapabilities(other.tool, other.plan))
  const requiredCapabilities = getRequiredCapabilitiesForUseCase(userNeeds)
  const uniqueCaps = findUniqueCapabilities(planCapabilities, otherCapabilities)

  const overlapScore = calculateOverlapScore(planCapabilities, otherCapabilities)
  let uniqueValueScore = 0
  if (uniqueCaps.length > 0) {
    const weightedValue = uniqueCaps.reduce((sum, cap) => sum + getUseCaseWeight(cap, userNeeds), 0)
    uniqueValueScore = Math.min(weightedValue / uniqueCaps.length, 1.0)
  }

  const needAlignmentScore = scoreNeedAlignment(uniqueCaps, requiredCapabilities)
  const highValueUniqueCaps = uniqueCaps.filter(cap => getUseCaseWeight(cap, userNeeds) > 0.6).map(cap => cap.replace(/_/g, ' '))
  const description = highValueUniqueCaps.length > 0
    ? `Provides ${userNeeds}-critical unique capabilities: ${highValueUniqueCaps.join(', ')}`
    : `Lacks ${userNeeds}-critical unique capabilities`

  return { overlapScore, uniqueValueScore, needAlignmentScore, marginalCapabilities: uniqueCaps, description }
}

export function recommendAction(
  overlapScore: number,
  uniqueValueScore: number,
  needAlignmentScore: number,
  monthlySavings: number,
  isUnknownPlan: boolean = false,
  context?: { teamSize: number; useCase: UseCase },
  forceRemove: boolean = false // NEW: Explicit override for redundancy
): "keep" | "remove" | "consolidate" | "switch" | "downgrade" | "upgrade" {
  if (isUnknownPlan) return "keep"
  if (forceRemove) return "remove" // Absolute override

  const teamSize = context?.teamSize ?? 10
  const userNeeds = context?.useCase ?? "mixed"
  const overlapThreshold = teamSize <= 5 ? 0.4 : teamSize >= 15 ? 0.7 : 0.55
  const minUniqueValue = ["coding", "research"].includes(userNeeds) ? 0.2 : 0.1

  if (overlapScore > overlapThreshold && uniqueValueScore < minUniqueValue && needAlignmentScore < 0.4) return "remove"
  if (overlapScore > (overlapThreshold - 0.15) && uniqueValueScore < 0.25) return "consolidate"
  if (uniqueValueScore > (minUniqueValue + 0.1) || needAlignmentScore > 0.5) return "keep"

  return "keep"
}
