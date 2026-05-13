import { NextResponse } from "next/server"

import { runAudit } from "@/lib/auditEngineV2"
import { generateEnhancedAiSummary, generatePerToolInsights } from "@/lib/enhancedAiSummary"
import { getSupabaseServerClient } from "@/lib/supabase"
import { auditRateLimit } from "@/lib/ratelimit"
import type { AuditInput, ToolInput, UseCase } from "@/lib/types"
import { headers } from "next/headers"

const VALID_USE_CASES: UseCase[] = ["coding", "writing", "data", "research", "mixed"]

function sanitizeToolInput(value: unknown): ToolInput | null {
  if (typeof value !== "object" || value === null) return null

  const candidate = value as Partial<ToolInput>
  if (
    typeof candidate.tool !== "string" ||
    typeof candidate.plan !== "string" ||
    typeof candidate.monthlySpend !== "number" ||
    typeof candidate.seats !== "number"
  ) {
    return null
  }

  return {
    tool: candidate.tool as ToolInput["tool"],
    plan: candidate.plan.trim(),
    monthlySpend: Math.max(0, candidate.monthlySpend),
    seats: Math.max(1, Math.floor(candidate.seats)),
  }
}

function sanitizeAuditInput(value: unknown): { data?: AuditInput; errors?: string[] } {
  if (typeof value !== "object" || value === null) {
    return { errors: ["Request body must be a JSON object"] }
  }

  const candidate = value as Partial<AuditInput>
  if (!Array.isArray(candidate.tools)) {
    return { errors: ["tools must be an array"] }
  }

  if (typeof candidate.teamSize !== "number" || candidate.teamSize < 1) {
    return { errors: ["teamSize must be a positive number"] }
  }

  if (typeof candidate.useCase !== "string" || !VALID_USE_CASES.includes(candidate.useCase as UseCase)) {
    return { errors: ["useCase is invalid"] }
  }

  const sanitizedTools = candidate.tools.map((tool) => sanitizeToolInput(tool))
  if (sanitizedTools.some((tool) => tool === null)) {
    return { errors: ["Each tool entry must include tool, plan, monthlySpend, and seats"] }
  }

  return {
    data: {
      tools: sanitizedTools as ToolInput[],
      teamSize: Math.floor(candidate.teamSize),
      useCase: candidate.useCase as UseCase,
    },
  }
}

export async function POST(request: Request) {
  try {
    const headerList = headers()
    const ip = headerList.get("x-forwarded-for") || "127.0.0.1"

    // Rate limiting check
    const { success, limit, reset, remaining } = await auditRateLimit.limit(ip)
    
    // Bypass rate limiting in local development
    if (!success && process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { 
          error: "Too many requests. You can run 5 audits per hour.",
          limit,
          remaining,
          reset
        },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          }
        }
      )
    }

    const payload = await request.json()
    const validation = sanitizeAuditInput(payload)

    if (!validation.data) {
      return NextResponse.json(
        {
          message: "Invalid audit input",
          errors: validation.errors ?? ["Unknown validation error"],
        },
        { status: 400 },
      )
    }

    const audit = runAudit(validation.data)
    // Generate AI analysis in parallel to speed up response time on Vercel
    const [aiSummaryText, perToolInsights] = await Promise.all([
      generateEnhancedAiSummary({
        input: validation.data,
        results: audit.results,
        totalMonthlySavings: audit.totalMonthlySavings,
        totalAnnualSavings: audit.totalAnnualSavings,
        isOptimal: audit.isOptimal,
        showCredex: audit.showCredex,
      }),
      generatePerToolInsights({
        input: validation.data,
        results: audit.results,
        totalMonthlySavings: audit.totalMonthlySavings,
        totalAnnualSavings: audit.totalAnnualSavings,
        isOptimal: audit.isOptimal,
        showCredex: audit.showCredex,
      })
    ])

    // Merge insights into results
    // 1. REFINEMENT STEP: Sync Engine with AI Insights
    // If AI identified a tool as redundant, force the rule-based engine to mark it as such.
    const enrichedResults = audit.results.map(r => {
      const insight = perToolInsights[r.tool]
      if (!insight) return r

      let action = r.recommendedAction
      let monthlySavings = r.monthlySavings
      let reason = r.reason

      // If AI suggests removal/consolidation but engine didn't catch it
      if ((insight.suggestedAction === "remove" || insight.suggestedAction === "consolidate") && action === "keep") {
         action = insight.suggestedAction
         monthlySavings = r.currentSpend // Full savings if tool is cut
         reason = `Expert AI Analysis identified critical functional overlap: ${insight.uniqueCapabilityAnalysis.split('.')[0]}.`
      }

      return {
        ...r,
        recommendedAction: action,
        monthlySavings: monthlySavings,
        annualSavings: monthlySavings * 12,
        reason: reason,
        strengths: insight.strengths,
        weaknesses: insight.weaknesses,
        alternativeTool: insight.alternativeTool,
        uniqueCapabilityAnalysis: insight.uniqueCapabilityAnalysis
      }
    })

    // 2. RECALCULATE AGGREGATE METRICS
    const totalMonthlySavings = enrichedResults.reduce((sum, r) => sum + r.monthlySavings, 0)
    const totalAnnualSavings = totalMonthlySavings * 12
    const isOptimal = totalMonthlySavings === 0

    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("audits")
      .insert({
        input: validation.data,
        results: enrichedResults,
        total_monthly_savings: totalMonthlySavings,
        total_annual_savings: totalAnnualSavings,
        ai_summary: aiSummaryText,
        is_optimal: isOptimal,
        show_credex: audit.showCredex,
        summary: audit.summary ?? null,
        efficiency_score: audit.efficiencyScore ?? null,
        referral_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
      })
      .select("id")
      .single()

    if (error || !data) {
      console.error('[api/audit] Supabase error:', error)
      return NextResponse.json(
        {
          message: "Failed to save audit",
          error: error?.message ?? "No audit ID returned",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      id: data.id,
      totalMonthlySavings: audit.totalMonthlySavings,
      totalAnnualSavings: audit.totalAnnualSavings,
      isOptimal: audit.isOptimal,
      showCredex: audit.showCredex,
    })
  } catch (err) {
    // Log full error on server for debugging
    console.error('[api/audit] Unhandled error:', err)

    const isDev = process.env.NODE_ENV !== 'production'
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : undefined

    const body: Record<string, unknown> = { error: isDev ? message : 'Internal Server Error' }
    if (isDev && stack) body.stack = stack

    return new Response(JSON.stringify(body), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
