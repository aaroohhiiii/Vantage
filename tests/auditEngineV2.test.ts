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
  
  // ── CAPABILITY OVERLAP TESTS ──────────────────────────────

  it("detects overlap between Cursor Pro and GitHub Copilot Pro for coding", () => {
    const input: AuditInput = {
      tools: [
        { tool: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "github-copilot", plan: "Pro", monthlySpend: 10, seats: 1 }
      ],
      teamSize: 1,
      useCase: "coding",
    }
    
    const result = runAudit(input)
    const copilotResult = result.results.find(r => r.tool === "github-copilot")
    
    expect(copilotResult?.recommendedAction).toBe("remove")
    expect(copilotResult?.overlapScore).toBeGreaterThan(0.7)
    expect(copilotResult?.uniqueValueScore).toBeLessThan(0.3)
    expect(copilotResult?.monthlySavings).toBe(10)
    expect(copilotResult?.confidence).toBe("high")
    expect(copilotResult?.rationale).toContain("overlap")
  })

  it("detects partial overlap between ChatGPT Pro and Claude Pro", () => {
    const input: AuditInput = {
      tools: [
        { tool: "chatgpt", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "claude", plan: "Pro", monthlySpend: 20, seats: 1 }
      ],
      teamSize: 1,
      useCase: "writing",
    }
    
    const result = runAudit(input)
    const claudeResult = result.results.find(r => r.tool === "claude")
    
    expect(claudeResult?.overlapScore).toBeGreaterThan(0.3)
    expect(claudeResult?.overlapScore).toBeLessThan(0.8)
    expect(claudeResult?.uniqueValueScore).toBeLessThan(0.5)
    expect(claudeResult?.confidence).toBe("medium")
  })

  it("keeps both chat tools when use case justifies (writing + research + automation)", () => {
    const input: AuditInput = {
      tools: [
        { tool: "chatgpt", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "claude", plan: "Max", monthlySpend: 40, seats: 1 }
      ],
      teamSize: 1,
      useCase: "research",
    }
    
    const result = runAudit(input)
    const chatgptResult = result.results.find(r => r.tool === "chatgpt")
    const claudeResult = result.results.find(r => r.tool === "claude")
    
    // ChatGPT Pro has unique capabilities (deep_research, image_generation, etc.)
    expect(chatgptResult?.uniqueValueScore).toBeGreaterThan(0.5)
    expect(chatgptResult?.recommendedAction).toBe("keep")
    
    // Claude Max has projects capability
    expect(claudeResult?.uniqueValueScore).toBeGreaterThan(0.2)
    expect(claudeResult?.recommendedAction).toBe("keep")
  })

  // ── API + SUBSCRIPTION OVERLAP TESTS ─────────────────────

  it("recommends removing chat plan when API spend is high", () => {
    const input: AuditInput = {
      tools: [
        { tool: "claude", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "anthropic-api", plan: "Usage-based", monthlySpend: 100, seats: 1 }
      ],
      teamSize: 1,
      useCase: "coding",
    }
    
    const result = runAudit(input)
    const claudeResult = result.results.find(r => r.tool === "claude")
    
    expect(claudeResult?.recommendedAction).toBe("remove")
    expect(claudeResult?.overlapScore).toBeGreaterThan(0.7)
    expect(claudeResult?.monthlySavings).toBe(20)
    expect(claudeResult?.rationale).toContain("API")
  })

  // ── LOW OVERLAP, HIGH VALUE TESTS ─────────────────────

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
    
    // Cursor provides unique coding capabilities
    expect(cursorResult?.overlapScore).toBeLessThan(0.3)
    expect(cursorResult?.uniqueValueScore).toBeGreaterThan(0.7)
    expect(cursorResult?.recommendedAction).toBe("keep")
    
    // ChatGPT provides unique chat/research capabilities
    expect(chatgptResult?.overlapScore).toBeLessThan(0.3)
    expect(chatgptResult?.uniqueValueScore).toBeGreaterThan(0.7)
    expect(chatgptResult?.recommendedAction).toBe("keep")
  })

  it("scores marginal utility correctly for high-overlap stack", () => {
    const input: AuditInput = {
      tools: [
        { tool: "chatgpt", plan: "Plus", monthlySpend: 20, seats: 1 },
        { tool: "claude", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "gemini", plan: "Pro", monthlySpend: 20, seats: 1 }
      ],
      teamSize: 1,
      useCase: "writing",
    }
    
    const result = runAudit(input)
    
    // All three are general chat tools with high overlap
    const chatgptResult = result.results.find(r => r.tool === "chatgpt")
    const claudeResult = result.results.find(r => r.tool === "claude")
    const geminiResult = result.results.find(r => r.tool === "gemini")
    
    // At least one should be recommended for removal
    const removals = result.results.filter(r => r.recommendedAction === "remove")
    expect(removals.length).toBeGreaterThan(0)
    
    // High overlap scores
    expect(chatgptResult?.overlapScore).toBeGreaterThan(0.6)
    expect(claudeResult?.overlapScore).toBeGreaterThan(0.6)
    expect(geminiResult?.overlapScore).toBeGreaterThan(0.6)
  })

  // ── DATA QUALITY TESTS ─────────────────────────────────

  it("handles unknown plan with low confidence", () => {
    const input: AuditInput = {
      tools: [
        { tool: "cursor", plan: "Unknown Plan", monthlySpend: 25, seats: 1 }
      ],
      teamSize: 1,
      useCase: "coding",
    }
    
    const result = runAudit(input)
    const cursorResult = result.results[0]
    
    expect(cursorResult?.confidence).toBe("low")
    expect(cursorResult?.recommendedAction).toBe("keep")
    expect(cursorResult?.findings.some(f => f.ruleId === "unknown-plan")).toBe(true)
  })

  it("flags spend mismatch separately from capability analysis", () => {
    const input: AuditInput = {
      tools: [
        { tool: "cursor", plan: "Pro", monthlySpend: 55, seats: 1 }
      ],
      teamSize: 1,
      useCase: "coding",
    }
    
    const result = runAudit(input)
    const cursorResult = result.results[0]
    
    // Should have pricing finding
    expect(cursorResult?.findings.some(f => f.ruleId === "spend-mismatch")).toBe(true)
    expect(cursorResult?.findings.some(f => f.type === "pricing")).toBe(true)
  })

  // ── TEAM SIZE AND PLAN FIT TESTS ─────────────────────

  it("recommends upgrade when underprovided", () => {
    const input: AuditInput = {
      tools: [
        { tool: "chatgpt", plan: "Plus", monthlySpend: 20, seats: 5 },
        { tool: "claude", plan: "Pro", monthlySpend: 20, seats: 5 }
      ],
      teamSize: 5,
      useCase: "mixed",
    }
    
    const result = runAudit(input)
    
    // Should identify team collaboration needs
    expect(result.summary?.uncoveredCapabilities).toContain("team_collaboration")
    expect(result.summary?.stackStatus).toBe("underprovided")
  })

  // ── STACK SUMMARY TESTS ─────────────────────────────────

  it("generates correct stack summary for optimized stack", () => {
    const input: AuditInput = {
      tools: [
        { tool: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "chatgpt", plan: "Pro", monthlySpend: 20, seats: 1 }
      ],
      teamSize: 1,
      useCase: "mixed",
    }
    
    const result = runAudit(input)
    
    expect(result.summary?.stackStatus).toBe("optimized")
    expect(result.summary?.duplicateCapabilities).toHaveLength(0)
    expect(result.summary?.currentMonthlySpend).toBe(40)
    expect(result.summary?.optimizedMonthlySpend).toBe(40)
    expect(result.summary?.estimatedMonthlySavings).toBe(0)
  })

  it("identifies primary consolidation opportunity", () => {
    const input: AuditInput = {
      tools: [
        { tool: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "github-copilot", plan: "Pro", monthlySpend: 10, seats: 1 },
        { tool: "chatgpt", plan: "Plus", monthlySpend: 20, seats: 1 }
      ],
      teamSize: 1,
      useCase: "coding",
    }
    
    const result = runAudit(input)
    
    expect(result.summary?.stackStatus).toBe("overlapping")
    expect(result.summary?.primaryConsolidationOpportunity).toBe("github-copilot")
    expect(result.summary?.duplicateCapabilities.length).toBeGreaterThan(0)
  })

  // ── CONFIDENCE LEVEL TESTS ─────────────────────────────

  it("assigns high confidence for clear overlap cases", () => {
    const input: AuditInput = {
      tools: [
        { tool: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "github-copilot", plan: "Pro", monthlySpend: 10, seats: 1 }
      ],
      teamSize: 1,
      useCase: "coding",
    }
    
    const result = runAudit(input)
    const copilotResult = result.results.find(r => r.tool === "github-copilot")
    
    expect(copilotResult?.confidence).toBe("high")
    expect(copilotResult?.overlapScore).toBeGreaterThan(0.8)
  })

  it("assigns medium confidence for moderate overlap", () => {
    const input: AuditInput = {
      tools: [
        { tool: "chatgpt", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "claude", plan: "Pro", monthlySpend: 20, seats: 1 }
      ],
      teamSize: 1,
      useCase: "writing",
    }
    
    const result = runAudit(input)
    const claudeResult = result.results.find(r => r.tool === "claude")
    
    expect(claudeResult?.confidence).toBe("medium")
    expect(claudeResult?.overlapScore).toBeGreaterThan(0.4)
    expect(claudeResult?.overlapScore).toBeLessThan(0.8)
  })

  // ── RATIONALE AND MARGINAL UTILITY TESTS ───────────────

  it("provides detailed rationale for recommendations", () => {
    const input: AuditInput = {
      tools: [
        { tool: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "github-copilot", plan: "Pro", monthlySpend: 10, seats: 1 }
      ],
      teamSize: 1,
      useCase: "coding",
    }
    
    const result = runAudit(input)
    const copilotResult = result.results.find(r => r.tool === "github-copilot")
    
    expect(copilotResult?.rationale.length).toBeGreaterThan(0)
    expect(copilotResult?.rationale[0]).toContain("overlap")
    expect(copilotResult?.marginalUtility.capabilities).toHaveLength(0)
    expect(copilotResult?.marginalUtility.description).toContain("no unique")
  })

  it("identifies unique capabilities correctly", () => {
    const input: AuditInput = {
      tools: [
        { tool: "chatgpt", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 }
      ],
      teamSize: 1,
      useCase: "mixed",
    }
    
    const result = runAudit(input)
    const chatgptResult = result.results.find(r => r.tool === "chatgpt")
    
    expect(chatgptResult?.marginalUtility.capabilities).toContain("deep_research")
    expect(chatgptResult?.marginalUtility.capabilities).toContain("image_generation")
    expect(chatgptResult?.marginalUtility.description).toContain("unique capabilities")
  })

  // ── EDGE CASE TESTS ─────────────────────────────────

  it("handles empty tools array gracefully", () => {
    const input: AuditInput = {
      tools: [],
      teamSize: 1,
      useCase: "coding",
    }
    
    const result = runAudit(input)
    
    expect(result.results).toHaveLength(0)
    expect(result.totalMonthlySavings).toBe(0)
    expect(result.isOptimal).toBe(true)
    expect(result.summary?.uncoveredCapabilities.length).toBeGreaterThan(0)
  })

  it("filters out small savings (< $10/mo)", () => {
    const input: AuditInput = {
      tools: [
        { tool: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 },
        { tool: "github-copilot", plan: "Pro", monthlySpend: 5, seats: 1 }
      ],
      teamSize: 1,
      useCase: "coding",
    }
    
    const result = runAudit(input)
    const copilotResult = result.results.find(r => r.tool === "github-copilot")
    
    // Should filter out small savings
    expect(copilotResult?.recommendedAction).toBe("keep")
    expect(copilotResult?.monthlySavings).toBe(0)
  })

  it("handles multiple seats correctly", () => {
    const input: AuditInput = {
      tools: [
        { tool: "chatgpt", plan: "Team", monthlySpend: 60, seats: 2 },
        { tool: "claude", plan: "Pro", monthlySpend: 40, seats: 2 }
      ],
      teamSize: 2,
      useCase: "writing",
    }
    
    const result = runAudit(input)
    
    expect(result.summary?.currentMonthlySpend).toBe(100)
    expect(result.results.length).toBe(2)
  })
})
