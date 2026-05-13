/**
 * ═══════════════════════════════════════════════════════════════
 * AUDIT ENGINE V2 TESTS — Capability Analysis
 *
 * Tests for capability overlap analysis, scoring, and recommendations.
 * Each test validates overlap scores, unique value, and need alignment.
 * ═══════════════════════════════════════════════════════════════
 */

import { describe, expect, it } from "vitest"
import { runAudit } from "@/lib/auditEngineV2"
import type { AuditInput } from "@/lib/types"

describe("runAudit V2", () => {
  
  it("detects high overlap between ChatGPT Pro and Claude Pro", () => {
    const input: AuditInput = {
      tools: [
        { tool: "chatgpt", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "claude", plan: "Pro", monthlySpend: 20, seats: 1 }
      ],
      teamSize: 1,
      useCase: "writing",
    }
    
    const result = runAudit(input)
    // One will be the winner, the other will be redundant (0.95)
    const redundantTool = result.results.find(r => r.recommendedAction === "remove")
    expect(redundantTool?.overlapScore).toBe(0.95)
  })

  it("recommends removing redundant tool in the same category", () => {
    const input: AuditInput = {
      tools: [
        { tool: "claude", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "chatgpt", plan: "Pro", monthlySpend: 20, seats: 1 }
      ],
      teamSize: 1,
      useCase: "coding",
    }
    
    const result = runAudit(input)
    expect(result.results.some(r => r.recommendedAction === "remove")).toBe(true)
    expect(result.totalMonthlySavings).toBeGreaterThan(0)
  })

  it("scores marginal utility correctly for low-overlap stack", () => {
    const input: AuditInput = {
      tools: [
        { tool: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "chatgpt", plan: "Pro", monthlySpend: 20, seats: 1 }
      ],
      teamSize: 1,
      useCase: "mixed",
    }
    
    const result = runAudit(input)
    const cursorResult = result.results.find(r => r.tool === "cursor")
    const chatgptResult = result.results.find(r => r.tool === "chatgpt")
    
    // IDE and Chat are different categories
    expect(cursorResult?.overlapScore).toBeLessThan(0.7)
    expect(chatgptResult?.overlapScore).toBeLessThan(0.7)
    expect(cursorResult?.recommendedAction).toBe("keep")
  })

  it("identifies primary consolidation opportunity in an overlapping stack", () => {
    const input: AuditInput = {
      tools: [
        { tool: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "github-copilot", plan: "Individual", monthlySpend: 10, seats: 1 }
      ],
      teamSize: 1,
      useCase: "coding",
    }
    
    const result = runAudit(input)
    // Cursor ($20) processed first -> Winner. Copilot ($10) processed second -> Redundant.
    expect(result.summary?.primaryConsolidationOpportunity).toBe("github-copilot")
    // Status might be "underprovided" if some capabilities are missing for "coding"
    expect(["overlapping", "underprovided", "mixed"]).toContain(result.summary?.stackStatus)
  })

  it("provides specific rationale for category conflict", () => {
    const input: AuditInput = {
      tools: [
        { tool: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "github-copilot", plan: "Individual", monthlySpend: 10, seats: 1 }
      ],
      teamSize: 1,
      useCase: "coding",
    }
    
    const result = runAudit(input)
    const copilotResult = result.results.find(r => r.tool === "github-copilot")
    expect(copilotResult?.rationale[0]).toContain("Category Conflict: Multiple IDE tools detected.")
  })

  it("handles empty tools array", () => {
    const input: AuditInput = {
      tools: [],
      teamSize: 1,
      useCase: "coding",
    }
    
    const result = runAudit(input)
    expect(result.results).toHaveLength(0)
    expect(result.totalMonthlySavings).toBe(0)
  })

  it("calculates overlap correctly for large teams", () => {
    const input: AuditInput = {
      tools: [
        { tool: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "github-copilot", plan: "Individual", monthlySpend: 10, seats: 1 }
      ],
      teamSize: 50, // Large team size disables forced redundancy (normalized.teamSize <= 15)
      useCase: "coding",
    }
    
    const result = runAudit(input)
    const copilotResult = result.results.find(r => r.tool === "github-copilot")
    
    // It should NOT be the forced 0.95 value
    expect(copilotResult?.overlapScore).not.toBe(0.95)
  })
})
