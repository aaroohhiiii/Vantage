import { describe, expect, it } from "vitest"

import { runAudit } from "@/lib/auditEngine"
import type { AuditInput } from "@/lib/types"

describe("runAudit", () => {
  it("recommends downgrade from Team to Pro when only 1 seat used", () => {
    const input: AuditInput = {
      tools: [{ tool: "claude", plan: "Team", monthlySpend: 30, seats: 1 }],
      teamSize: 1,
      useCase: "writing",
    }

    const result = runAudit(input)
    expect(result.results[0]?.recommendedAction).toBe("downgrade")
    expect(result.results[0]?.monthlySavings).toBe(10)
  })

  it("flags Cursor + GitHub Copilot as redundant for coding use case", () => {
    const input: AuditInput = {
      tools: [
        { tool: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "github-copilot", plan: "Individual", monthlySpend: 10, seats: 1 },
      ],
      teamSize: 2,
      useCase: "coding",
    }

    const result = runAudit(input)
    const copilotResult = result.results.find((item) => item.tool === "github-copilot")
    expect(copilotResult?.recommendedAction).toBe("cancel-redundant")
  })

  it("correctly calculates annual savings as 12x monthly", () => {
    const input: AuditInput = {
      tools: [{ tool: "claude", plan: "Team", monthlySpend: 30, seats: 1 }],
      teamSize: 1,
      useCase: "writing",
    }

    const result = runAudit(input)
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12)
  })

  it("does not manufacture savings when spend is already optimal", () => {
    const input: AuditInput = {
      tools: [{ tool: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 }],
      teamSize: 1,
      useCase: "coding",
    }

    const result = runAudit(input)
    expect(result.results[0]?.recommendedAction).toBe("keep")
    expect(result.results[0]?.monthlySavings).toBe(0)
  })

  it("sets showCredex true when total savings exceed $500/mo", () => {
    const input: AuditInput = {
      tools: [
        { tool: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "github-copilot", plan: "Individual", monthlySpend: 600, seats: 1 },
      ],
      teamSize: 2,
      useCase: "coding",
    }

    const result = runAudit(input)
    expect(result.showCredex).toBe(true)
  })

  it("sets isOptimal true when total savings below $100/mo", () => {
    const input: AuditInput = {
      tools: [{ tool: "claude", plan: "Team", monthlySpend: 30, seats: 1 }],
      teamSize: 1,
      useCase: "mixed",
    }

    const result = runAudit(input)
    expect(result.totalMonthlySavings).toBe(10)
    expect(result.isOptimal).toBe(true)
  })

  it("filters out recommendations with savings below $10", () => {
    const input: AuditInput = {
      tools: [{ tool: "cursor", plan: "Business", monthlySpend: 45, seats: 1 }],
      teamSize: 1,
      useCase: "coding",
    }

    const result = runAudit(input)
    expect(result.results[0]?.recommendedAction).toBe("keep")
    expect(result.results[0]?.monthlySavings).toBe(0)
  })

  it("handles empty tools array without throwing", () => {
    const input: AuditInput = { tools: [], teamSize: 5, useCase: "mixed" }
    const result = runAudit(input)
    expect(result.totalMonthlySavings).toBe(0)
    expect(result.results).toEqual([])
  })
})
