import { getOfficialPrice } from "@/lib/pricingData"
import type { AuditInput, AuditResult, ToolAuditResult, ToolInput, UseCase } from "@/lib/types"

type AuditOutput = Omit<AuditResult, "id" | "aiSummary" | "createdAt">

function buildKeepResult(toolInput: ToolInput, credexOpportunity: boolean): ToolAuditResult {
  return {
    tool: toolInput.tool,
    currentPlan: toolInput.plan,
    currentSpend: toolInput.monthlySpend,
    recommendedAction: "keep",
    monthlySavings: 0,
    annualSavings: 0,
    reason: "Plan and pricing are appropriate for your team size.",
    credexOpportunity,
  }
}

function toCurrencyAmount(value: number): number {
  return Number(Math.max(0, value).toFixed(2))
}

function getUseCaseLabel(useCase: UseCase): string {
  if (useCase === "data") return "data workflows"
  return useCase
}

export function runAudit(input: AuditInput): AuditOutput {
  const totalSpend = input.tools.reduce((acc, tool) => acc + Math.max(0, tool.monthlySpend), 0)
  const hasTotalSpendOpportunity = totalSpend > 200
  const resultMap = new Map<string, ToolAuditResult>()

  for (const toolInput of input.tools) {
    const seats = Math.max(1, toolInput.seats)
    const spend = Math.max(0, toolInput.monthlySpend)
    const officialPrice = getOfficialPrice(toolInput.tool, toolInput.plan, seats)
    const credexOpportunity = hasTotalSpendOpportunity || spend > 50
    const result = buildKeepResult(toolInput, credexOpportunity)

    if (
      (toolInput.tool === "claude" && toolInput.plan.toLowerCase() === "team" && seats <= 1) ||
      (toolInput.tool === "chatgpt" && toolInput.plan.toLowerCase() === "team" && seats <= 1)
    ) {
      const recommendedPlan = toolInput.tool === "claude" ? "Pro" : "Plus"
      const targetCost = getOfficialPrice(toolInput.tool, recommendedPlan, 1)
      const monthlySavings = toCurrencyAmount(spend - targetCost)
      resultMap.set(toolInput.tool, {
        ...result,
        recommendedAction: "downgrade",
        recommendedPlan,
        monthlySavings,
        annualSavings: toCurrencyAmount(monthlySavings * 12),
        reason:
          "Team plan requires minimum 2 users - single users pay a per-seat premium they don't need. Pro plan covers the same use case.",
      })
      continue
    }

    if (officialPrice > 0 && spend > officialPrice * 1.15) {
      const monthlySavings = toCurrencyAmount(spend - officialPrice)
      const overpayPct = toCurrencyAmount(((spend - officialPrice) / officialPrice) * 100)
      resultMap.set(toolInput.tool, {
        ...result,
        recommendedAction: "downgrade",
        monthlySavings,
        annualSavings: toCurrencyAmount(monthlySavings * 12),
        reason: `Current spend exceeds list price by ${overpayPct}% - likely on monthly billing vs annual. Switching to annual saves ~17%.`,
      })
      continue
    }

    resultMap.set(toolInput.tool, result)
  }

  // Redundancy rule 2.1
  const cursorTool = input.tools.find(
    (tool) =>
      tool.tool === "cursor" &&
      (tool.plan.toLowerCase() === "pro" || tool.plan.toLowerCase() === "business"),
  )
  const copilotTool = input.tools.find((tool) => tool.tool === "github-copilot")
  if (cursorTool && copilotTool && input.useCase === "coding") {
    const monthlySavings = toCurrencyAmount(Math.max(0, copilotTool.monthlySpend))
    resultMap.set("github-copilot", {
      tool: "github-copilot",
      currentPlan: copilotTool.plan,
      currentSpend: copilotTool.monthlySpend,
      recommendedAction: "cancel-redundant",
      monthlySavings,
      annualSavings: toCurrencyAmount(monthlySavings * 12),
      reason:
        "Cursor Pro includes AI code completion that directly replaces Copilot's core feature. Maintaining both tools duplicates spend on identical functionality.",
      credexOpportunity: hasTotalSpendOpportunity || copilotTool.monthlySpend > 50,
    })
  }

  // Redundancy rule 2.2
  const claudeTool = input.tools.find((tool) => tool.tool === "claude")
  const chatGptTool = input.tools.find((tool) => tool.tool === "chatgpt")
  if (claudeTool && chatGptTool && input.useCase !== "coding") {
    const toolToCancel =
      claudeTool.monthlySpend <= chatGptTool.monthlySpend ? claudeTool : chatGptTool
    const monthlySavings = toCurrencyAmount(Math.max(0, toolToCancel.monthlySpend))
    resultMap.set(toolToCancel.tool, {
      tool: toolToCancel.tool,
      currentPlan: toolToCancel.plan,
      currentSpend: toolToCancel.monthlySpend,
      recommendedAction: "cancel-redundant",
      monthlySavings,
      annualSavings: toCurrencyAmount(monthlySavings * 12),
      reason: `Both tools provide general-purpose LLM capability for ${getUseCaseLabel(input.useCase)}. Recommend consolidating to the higher-value subscription.`,
      credexOpportunity: hasTotalSpendOpportunity || toolToCancel.monthlySpend > 50,
    })
  }

  // Redundancy rule 2.3
  const anthropicApi = input.tools.find((tool) => tool.tool === "anthropic-api")
  if (anthropicApi && claudeTool && claudeTool.plan.toLowerCase() !== "free" && anthropicApi.monthlySpend > 15) {
    const monthlySavings = toCurrencyAmount(Math.max(0, claudeTool.monthlySpend))
    resultMap.set("claude", {
      tool: "claude",
      currentPlan: claudeTool.plan,
      currentSpend: claudeTool.monthlySpend,
      recommendedAction: "cancel-redundant",
      monthlySavings,
      annualSavings: toCurrencyAmount(monthlySavings * 12),
      reason:
        "API spend suggests active programmatic usage. Claude Pro subscription adds limited value if API access already covers use case.",
      credexOpportunity: hasTotalSpendOpportunity || claudeTool.monthlySpend > 50,
    })
  }

  const filteredResults = Array.from(resultMap.values()).map((result) => {
    if (result.monthlySavings > 0 && result.monthlySavings < 10) {
      return {
        ...result,
        recommendedAction: "keep" as const,
        recommendedPlan: undefined,
        recommendedTool: undefined,
        monthlySavings: 0,
        annualSavings: 0,
        reason: "Plan and pricing are appropriate for your team size.",
      }
    }

    return result
  })

  const totalMonthlySavings = toCurrencyAmount(
    filteredResults.reduce((sum, result) => sum + result.monthlySavings, 0),
  )
  const totalAnnualSavings = toCurrencyAmount(totalMonthlySavings * 12)

  return {
    input,
    results: filteredResults,
    totalMonthlySavings,
    totalAnnualSavings,
    isOptimal: totalMonthlySavings < 100,
    showCredex: totalMonthlySavings > 500,
  }
}
