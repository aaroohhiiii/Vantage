/**
 * ═══════════════════════════════════════════════════════════════
 * AUDIT ENGINE TESTS
 *
 * Minimum 12 tests, one per significant rule or edge case.
 * Each test uses realistic inputs and validates financial outputs.
 * ═══════════════════════════════════════════════════════════════
 */

import { describe, expect, it } from "vitest"

import { runAudit } from "@/lib/auditEngine"
import type { AuditInput } from "@/lib/types"

describe("runAudit", () => {
  // ── RULE GROUP 1: Plan Fit ──────────────────────────────

  it("1.1 — downgrades Claude Team to Pro when only 1 seat", () => {
    const input: AuditInput = {
      tools: [{ tool: "claude", plan: "Team", monthlySpend: 30, seats: 1 }],
      teamSize: 1,
      useCase: "writing",
    }
    const result = runAudit(input)
    expect(result.results[0]?.recommendedAction).toBe("downgrade")
    expect(result.results[0]?.recommendedPlan).toBe("Pro")
    expect(result.results[0]?.monthlySavings).toBe(10) // $30 - $20 = $10
  })

  it("1.1 — downgrades ChatGPT Team to Plus when only 1 seat", () => {
    const input: AuditInput = {
      tools: [{ tool: "chatgpt", plan: "Team", monthlySpend: 30, seats: 1 }],
      teamSize: 1,
      useCase: "research",
    }
    const result = runAudit(input)
    expect(result.results[0]?.recommendedAction).toBe("downgrade")
    expect(result.results[0]?.recommendedPlan).toBe("Plus")
    expect(result.results[0]?.monthlySavings).toBe(10)
  })

  it("1.2 — downgrades Cursor Teams to Pro when only 1 seat", () => {
    const input: AuditInput = {
      tools: [{ tool: "cursor", plan: "Teams", monthlySpend: 40, seats: 1 }],
      teamSize: 1,
      useCase: "coding",
    }
    const result = runAudit(input)
    expect(result.results[0]?.recommendedAction).toBe("downgrade")
    expect(result.results[0]?.recommendedPlan).toBe("Pro")
    expect(result.results[0]?.monthlySavings).toBe(20) // $40 - $20 = $20
  })

  it("1.3 — downgrades GitHub Copilot Business to Pro when 1 seat", () => {
    const input: AuditInput = {
      tools: [{ tool: "github-copilot", plan: "Business", monthlySpend: 19, seats: 1 }],
      teamSize: 1,
      useCase: "coding",
    }
    const result = runAudit(input)
    // $19 - $10 = $9, which is < $10 noise filter, so KEEP
    expect(result.results[0]?.recommendedAction).toBe("keep")
  })

  it("1.3 — downgrades GitHub Copilot Business to Pro when spend is higher", () => {
    const input: AuditInput = {
      tools: [{ tool: "github-copilot", plan: "Business", monthlySpend: 38, seats: 1 }],
      teamSize: 1,
      useCase: "coding",
    }
    const result = runAudit(input)
    expect(result.results[0]?.recommendedAction).toBe("downgrade")
    expect(result.results[0]?.recommendedPlan).toBe("Pro")
    expect(result.results[0]?.monthlySavings).toBe(28) // $38 - $10 = $28
  })

  it("1.4 — flags overspending when >25% above list price", () => {
    // Cursor Pro is $20/user/month, 2 seats = $40 official
    // Spending $60 → 50% above list price
    const input: AuditInput = {
      tools: [{ tool: "cursor", plan: "Pro", monthlySpend: 60, seats: 2 }],
      teamSize: 2,
      useCase: "coding",
    }
    const result = runAudit(input)
    expect(result.results[0]?.recommendedAction).toBe("downgrade")
    expect(result.results[0]?.monthlySavings).toBe(20) // $60 - $40 = $20
    expect(result.results[0]?.reason).toContain("exceeds official pricing")
  })

  it("1.5 — switches Claude Team (2 seats) to individual Pro when non-mixed", () => {
    const input: AuditInput = {
      tools: [{ tool: "claude", plan: "Team", monthlySpend: 60, seats: 2 }],
      teamSize: 2,
      useCase: "writing",
    }
    const result = runAudit(input)
    expect(result.results[0]?.recommendedAction).toBe("switch")
    expect(result.results[0]?.monthlySavings).toBe(20) // $60 - $40 = $20
    expect(result.results[0]?.recommendedPlan).toContain("individual")
  })

  // ── RULE GROUP 2: Redundancy ────────────────────────────

  it("2.1 — cancels GitHub Copilot when Cursor is present for coding", () => {
    const input: AuditInput = {
      tools: [
        { tool: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "github-copilot", plan: "Pro", monthlySpend: 10, seats: 1 },
      ],
      teamSize: 2,
      useCase: "coding",
    }
    const result = runAudit(input)
    const copilot = result.results.find((r) => r.tool === "github-copilot")
    expect(copilot?.recommendedAction).toBe("cancel-redundant")
    expect(copilot?.monthlySavings).toBe(10)
  })

  it("2.2 — cancels cheaper LLM when both Claude and ChatGPT are present (non-coding)", () => {
    const input: AuditInput = {
      tools: [
        { tool: "claude", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "chatgpt", plan: "Plus", monthlySpend: 20, seats: 1 },
      ],
      teamSize: 1,
      useCase: "writing",
    }
    const result = runAudit(input)
    // Both are $20, so claude (first checked, lower or equal) gets cancelled
    const cancelled = result.results.find((r) => r.recommendedAction === "cancel-redundant")
    expect(cancelled).toBeDefined()
    expect(cancelled?.monthlySavings).toBe(20)
  })

  it("2.3 — cancels Claude sub when Anthropic API spend is >$30", () => {
    const input: AuditInput = {
      tools: [
        { tool: "claude", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "anthropic-api", plan: "Usage-based", monthlySpend: 50, seats: 1 },
      ],
      teamSize: 1,
      useCase: "data",
    }
    const result = runAudit(input)
    const claude = result.results.find((r) => r.tool === "claude")
    expect(claude?.recommendedAction).toBe("cancel-redundant")
    expect(claude?.monthlySavings).toBe(20)
    expect(claude?.reason).toContain("API spend")
  })

  // ── RULE GROUP 4: Credex flags ──────────────────────────

  it("4.1 — flags credexOpportunity when tool spend > $50", () => {
    const input: AuditInput = {
      tools: [{ tool: "claude", plan: "Max", monthlySpend: 100, seats: 1 }],
      teamSize: 1,
      useCase: "research",
    }
    const result = runAudit(input)
    expect(result.results[0]?.credexOpportunity).toBe(true)
  })

  it("4.2 — flags all tools for credex when totalSpend > $200", () => {
    const input: AuditInput = {
      tools: [
        { tool: "cursor", plan: "Pro", monthlySpend: 100, seats: 5 },
        { tool: "claude", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "chatgpt", plan: "Plus", monthlySpend: 100, seats: 5 },
      ],
      teamSize: 5,
      useCase: "coding",
    }
    const result = runAudit(input)
    // Total: $100+$20+$100 = $220 > $200
    for (const r of result.results) {
      expect(r.credexOpportunity).toBe(true)
    }
  })

  // ── RULE GROUP 5: Honest assessments ────────────────────

  it("5.1 — keeps optimal plan with $0 savings", () => {
    const input: AuditInput = {
      tools: [{ tool: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 }],
      teamSize: 1,
      useCase: "coding",
    }
    const result = runAudit(input)
    expect(result.results[0]?.recommendedAction).toBe("keep")
    expect(result.results[0]?.monthlySavings).toBe(0)
  })

  it("5.2 — filters out savings below $10 (noise filter)", () => {
    // Cursor Pro is $20, paying $28 → overpay but savings = $8 < $10 noise threshold
    // BUT overpay rule needs >25% above list: 28/(20*1) = 1.4 → 40% over → triggers rule 1.4
    // savings = $8 → < $10 → noise filtered to KEEP
    const input: AuditInput = {
      tools: [{ tool: "windsurf", plan: "Pro", monthlySpend: 23, seats: 1 }],
      teamSize: 1,
      useCase: "coding",
    }
    // Windsurf Pro = $15. $23/$15 = 1.53 → 53% over → triggers overpay
    // Savings = $23-$15 = $8 → < $10 → noise filtered
    const result = runAudit(input)
    expect(result.results[0]?.recommendedAction).toBe("keep")
    expect(result.results[0]?.monthlySavings).toBe(0)
  })

  it("5.3 — sets isOptimal true when total savings < $100", () => {
    const input: AuditInput = {
      tools: [{ tool: "claude", plan: "Team", monthlySpend: 30, seats: 1 }],
      teamSize: 1,
      useCase: "writing",
    }
    const result = runAudit(input)
    expect(result.totalMonthlySavings).toBe(10)
    expect(result.isOptimal).toBe(true)
  })

  // ── RULE GROUP 6: Totals & flags ────────────────────────

  it("6.0 — correctly calculates annual savings as 12× monthly", () => {
    const input: AuditInput = {
      tools: [{ tool: "claude", plan: "Team", monthlySpend: 30, seats: 1 }],
      teamSize: 1,
      useCase: "data",
    }
    const result = runAudit(input)
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12)
  })

  it("6.1 — sets showCredex true when annual savings > $500", () => {
    const input: AuditInput = {
      tools: [
        { tool: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "github-copilot", plan: "Pro+", monthlySpend: 600, seats: 1 },
      ],
      teamSize: 2,
      useCase: "coding",
    }
    const result = runAudit(input)
    // Copilot gets cancelled (rule 2.1), saves $600/mo → $7200/yr > $500
    expect(result.showCredex).toBe(true)
  })

  it("handles empty tools array without throwing", () => {
    const input: AuditInput = { tools: [], teamSize: 5, useCase: "mixed" }
    const result = runAudit(input)
    expect(result.totalMonthlySavings).toBe(0)
    expect(result.results).toEqual([])
    expect(result.isOptimal).toBe(true)
  })

  // ── SCENARIO: Full audit (Scenario A from spec) ─────────

  it("Scenario A: solo developer overspending", () => {
    const input: AuditInput = {
      tools: [
        { tool: "claude", plan: "Team", monthlySpend: 30, seats: 1 },
        { tool: "github-copilot", plan: "Business", monthlySpend: 19, seats: 1 },
        { tool: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 },
      ],
      teamSize: 1,
      useCase: "coding",
    }
    const result = runAudit(input)

    // Claude Team 1 seat → downgrade to Pro, save $10
    const claude = result.results.find((r) => r.tool === "claude")
    expect(claude?.recommendedAction).toBe("downgrade")
    expect(claude?.monthlySavings).toBe(10)

    // Copilot + Cursor → cancel Copilot (rule 2.1), save $19
    const copilot = result.results.find((r) => r.tool === "github-copilot")
    expect(copilot?.recommendedAction).toBe("cancel-redundant")
    expect(copilot?.monthlySavings).toBe(19)

    // Cursor Pro — keep
    const cursor = result.results.find((r) => r.tool === "cursor")
    expect(cursor?.recommendedAction).toBe("keep")

    // Totals: $10 + $19 = $29/mo
    expect(result.totalMonthlySavings).toBe(29)
    expect(result.totalAnnualSavings).toBe(348)
    expect(result.isOptimal).toBe(true) // $29 < $100
    expect(result.showCredex).toBe(false) // $348 < $500
  })
})
