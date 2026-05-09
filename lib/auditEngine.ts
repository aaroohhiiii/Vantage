/**
 * ═══════════════════════════════════════════════════════════════
 * AUDIT ENGINE — Deterministic, finance-defensible rule engine
 *
 * Every rule outputs: recommendedAction, plan/tool, monthlySavings, reason
 * Every reason is 1 sentence, cites real pricing facts.
 * Every savings number traces to getOfficialPrice() or documented logic.
 *
 * NO AI/LLM used for calculations — deterministic rules only.
 * ═══════════════════════════════════════════════════════════════
 */

import { getOfficialPrice } from "@/lib/pricingData"
import type {
  AuditInput,
  AuditResult,
  ToolAuditResult,
  ToolInput,
  ToolName,
  UseCase,
} from "@/lib/types"

type AuditOutput = Omit<AuditResult, "id" | "aiSummary" | "createdAt">

/* ─── Utility helpers ─── */

function round2(value: number): number {
  return Number(Math.max(0, value).toFixed(2))
}

function formatUseCase(useCase: UseCase): string {
  const labels: Record<UseCase, string> = {
    coding: "coding",
    writing: "writing",
    data: "data analysis",
    research: "research",
    mixed: "mixed workflows",
  }
  return labels[useCase]
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
  }
}

function findTool(tools: ToolInput[], name: ToolName): ToolInput | undefined {
  return tools.find((t) => t.tool === name)
}


/* ═══════════════════════════════════════════════════════════════
   MAIN ENTRY POINT
   ═══════════════════════════════════════════════════════════════ */

export function runAudit(input: AuditInput): AuditOutput {
  const resultMap = new Map<ToolName, ToolAuditResult>()
  const totalSpend = input.tools.reduce((sum, t) => sum + Math.max(0, t.monthlySpend), 0)

  // ── Phase 1: Per-tool rules ──────────────────────────────
  for (const toolInput of input.tools) {
    const seats = Math.max(1, toolInput.seats)
    const spend = Math.max(0, toolInput.monthlySpend)
    const plan = toolInput.plan.toLowerCase()
    const credex = spend > 50 || totalSpend > 200

    // Start with KEEP as default
    let result = buildKeep(toolInput, credex)

    // ── RULE 1.1: Claude/ChatGPT Team plan with 1 seat ──
    if (
      (toolInput.tool === "claude" || toolInput.tool === "chatgpt") &&
      plan === "team" &&
      seats <= 1
    ) {
      const recPlan = toolInput.tool === "claude" ? "Pro" : "Plus"
      const targetCost = toolInput.tool === "claude" ? 20 : 20
      const savings = round2(spend - targetCost)
      if (savings >= 10) {
        result = {
          ...result,
          recommendedAction: "downgrade",
          recommendedPlan: recPlan,
          monthlySavings: savings,
          annualSavings: round2(savings * 12),
          reason: `Team plan ($30/user) requires 2+ users to be cost-effective; single users should use ${recPlan} ($20/mo) for identical access.`,
        }
      }
    }

    // ── RULE 1.2: Cursor Teams plan with 1 seat ──
    else if (toolInput.tool === "cursor" && plan === "teams" && seats === 1) {
      const savings = round2(spend - 20) // Pro is $20, cheaper than Teams $40
      if (savings >= 10) {
        result = {
          ...result,
          recommendedAction: "downgrade",
          recommendedPlan: "Pro",
          monthlySavings: savings,
          annualSavings: round2(savings * 12),
          reason:
            "Teams plan ($40/user) is for 2+ people; solo developers get the same AI features with Pro ($20/user) at half the cost.",
        }
      }
    }

    // ── RULE 1.3: GitHub Copilot Business with ≤2 seats ──
    else if (
      toolInput.tool === "github-copilot" &&
      plan === "business" &&
      seats <= 2
    ) {
      const recPlan = seats === 1 ? "Pro" : "Pro+"
      const targetCost = seats === 1 ? 10 : 39 * 2 // Pro: $10, Pro+ $39×2=$78
      const savings = round2(spend - targetCost)
      if (savings >= 10) {
        result = {
          ...result,
          recommendedAction: "downgrade",
          recommendedPlan: recPlan,
          monthlySavings: savings,
          annualSavings: round2(savings * 12),
          reason: `Business plan is enterprise-focused; small teams should use ${recPlan} ($${seats === 1 ? "10" : "39"}/user) with same features and ${seats === 1 ? "equivalent" : "5×"} request limits.`,
        }
      }
    }

    // ── RULE 1.4: Overspending vs official list price (>25%) ──
    else {
      const officialPrice = getOfficialPrice(toolInput.tool, toolInput.plan, seats)
      if (officialPrice > 0 && spend > officialPrice * 1.25) {
        const savings = round2(spend - officialPrice)
        if (savings >= 10) {
          const overpayPct = Math.round(((spend - officialPrice) / officialPrice) * 100)
          result = {
            ...result,
            recommendedAction: "downgrade",
            monthlySavings: savings,
            annualSavings: round2(savings * 12),
            reason: `Current spend exceeds official pricing by ${overpayPct}%; likely on monthly vs annual billing or an unapplied negotiated rate.`,
          }
        }
      }
    }

    // ── RULE 1.5: Claude/ChatGPT Team with 2 seats, solo use cases ──
    if (
      (toolInput.tool === "claude" || toolInput.tool === "chatgpt") &&
      plan === "team" &&
      seats === 2 &&
      input.useCase !== "mixed" &&
      result.recommendedAction === "keep" // Don't override a stronger rule
    ) {
      const recPlan = toolInput.tool === "claude" ? "Pro" : "Plus"
      // Team: $30×2 = $60 → Two Pro/Plus: $20×2 = $40, saves $20
      const savings = round2(spend - 40)
      if (savings >= 10) {
        result = {
          ...result,
          recommendedAction: "switch",
          recommendedPlan: `Two individual ${recPlan} subscriptions`,
          monthlySavings: savings,
          annualSavings: round2(savings * 12),
          reason: `Team plan assumes shared workspace; two solo developers on separate ${formatUseCase(input.useCase)} tasks should each buy ${recPlan} ($20/mo) instead of Team ($30/user).`,
        }
      }
    }

    resultMap.set(toolInput.tool, result)
  }

  // ── Phase 2: Cross-tool redundancy rules ─────────────────

  // ── RULE 2.1: Cursor + GitHub Copilot (coding) ──
  const cursorEntry = findTool(input.tools, "cursor")
  const copilotEntry = findTool(input.tools, "github-copilot")
  if (
    cursorEntry &&
    copilotEntry &&
    input.useCase === "coding"
  ) {
    const copilotSpend = Math.max(0, copilotEntry.monthlySpend)
    if (copilotSpend >= 10) {
      resultMap.set("github-copilot", {
        tool: "github-copilot",
        currentPlan: copilotEntry.plan,
        currentSpend: copilotEntry.monthlySpend,
        recommendedAction: "cancel-redundant",
        monthlySavings: round2(copilotSpend),
        annualSavings: round2(copilotSpend * 12),
        reason:
          "Cursor Pro includes AI code completion that directly replaces GitHub Copilot's core coding feature; maintaining both duplicates spend on identical functionality.",
        credexOpportunity: copilotSpend > 50 || totalSpend > 200,
      })
    }
  }

  // ── RULE 2.2: Dual LLM redundancy (non-coding) ──
  if (input.useCase !== "coding") {
    const claudeEntry = findTool(input.tools, "claude")
    const chatgptEntry = findTool(input.tools, "chatgpt")
    const geminiEntry = findTool(input.tools, "gemini")

    // Claude + ChatGPT
    if (claudeEntry && chatgptEntry) {
      const cheaper =
        claudeEntry.monthlySpend <= chatgptEntry.monthlySpend
          ? claudeEntry
          : chatgptEntry
      const cheaperSpend = Math.max(0, cheaper.monthlySpend)
      if (cheaperSpend >= 10) {
        resultMap.set(cheaper.tool, {
          tool: cheaper.tool,
          currentPlan: cheaper.plan,
          currentSpend: cheaper.monthlySpend,
          recommendedAction: "cancel-redundant",
          monthlySavings: round2(cheaperSpend),
          annualSavings: round2(cheaperSpend * 12),
          reason: `Both tools provide general-purpose reasoning and chat for ${formatUseCase(input.useCase)}. Consolidating to one subscription eliminates duplicate spend on overlapping capabilities.`,
          credexOpportunity: cheaperSpend > 50 || totalSpend > 200,
        })
      }
    }

    // Claude + Gemini
    if (claudeEntry && geminiEntry && !chatgptEntry) {
      const cheaper =
        claudeEntry.monthlySpend <= geminiEntry.monthlySpend
          ? claudeEntry
          : geminiEntry
      const cheaperSpend = Math.max(0, cheaper.monthlySpend)
      if (cheaperSpend >= 10) {
        resultMap.set(cheaper.tool, {
          tool: cheaper.tool,
          currentPlan: cheaper.plan,
          currentSpend: cheaper.monthlySpend,
          recommendedAction: "cancel-redundant",
          monthlySavings: round2(cheaperSpend),
          annualSavings: round2(cheaperSpend * 12),
          reason: `Both tools provide general-purpose reasoning and chat for ${formatUseCase(input.useCase)}. Consolidating to one subscription eliminates duplicate spend on overlapping capabilities.`,
          credexOpportunity: cheaperSpend > 50 || totalSpend > 200,
        })
      }
    }
  }

  // ── RULE 2.3: Claude API + Claude subscription overlap ──
  {
    const claudeEntry = findTool(input.tools, "claude")
    const anthropicApi = findTool(input.tools, "anthropic-api")
    if (
      claudeEntry &&
      anthropicApi &&
      (claudeEntry.plan.toLowerCase() === "pro" ||
        claudeEntry.plan.toLowerCase() === "max") &&
      anthropicApi.monthlySpend > 30
    ) {
      const claudeSpend = Math.max(0, claudeEntry.monthlySpend)
      if (claudeSpend >= 10) {
        resultMap.set("claude", {
          tool: "claude",
          currentPlan: claudeEntry.plan,
          currentSpend: claudeEntry.monthlySpend,
          recommendedAction: "cancel-redundant",
          monthlySavings: round2(claudeSpend),
          annualSavings: round2(claudeSpend * 12),
          reason: `API spend of $${anthropicApi.monthlySpend}/month suggests active programmatic use; Claude ${claudeEntry.plan} ($${claudeSpend}) provides less value than API access alone. Cancel subscription, keep API.`,
          credexOpportunity: claudeSpend > 50 || totalSpend > 200,
        })
      }
    }
  }

  // ── Phase 3: Credex opportunity flags ────────────────────

  // ── RULE 4.1: Heavy spend on Claude/ChatGPT/API tools ──
  for (const toolInput of input.tools) {
    const spend = Math.max(0, toolInput.monthlySpend)
    if (
      spend > 50 &&
      (toolInput.tool === "claude" ||
        toolInput.tool === "chatgpt" ||
        toolInput.tool === "openai-api" ||
        toolInput.tool === "anthropic-api")
    ) {
      const existing = resultMap.get(toolInput.tool)
      if (existing) {
        resultMap.set(toolInput.tool, { ...existing, credexOpportunity: true })
      }
    }
  }

  // ── RULE 4.2: High total spend across all tools ──
  if (totalSpend > 200) {
    for (const [name, result] of resultMap) {
      resultMap.set(name, { ...result, credexOpportunity: true })
    }
  }

  // ── Phase 4: Noise filter & totals ──────────────────────

  // RULE 5.2: Filter out savings < $10/mo (too noisy)
  const filteredResults = Array.from(resultMap.values()).map((result) => {
    if (result.monthlySavings > 0 && result.monthlySavings < 10) {
      return {
        ...result,
        recommendedAction: "keep" as const,
        recommendedPlan: undefined,
        recommendedTool: undefined,
        monthlySavings: 0,
        annualSavings: 0,
        reason: "Plan and pricing are appropriate for your team size and use case.",
      }
    }
    return result
  })

  // RULE 6: Totals & flags
  const totalMonthlySavings = round2(
    filteredResults.reduce((sum, r) => sum + r.monthlySavings, 0),
  )
  const totalAnnualSavings = round2(totalMonthlySavings * 12)

  return {
    input,
    results: filteredResults,
    totalMonthlySavings,
    totalAnnualSavings,
    // RULE 5.3: isOptimal when savings < $100/mo
    isOptimal: totalMonthlySavings < 100,
    // RULE 6: showCredex when annual savings > $500
    showCredex: totalAnnualSavings > 500,
  }
}
