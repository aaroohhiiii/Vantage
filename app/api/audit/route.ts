import { NextResponse } from "next/server"

import { runAudit } from "@/lib/auditEngineV2"
import { generateAiSummary } from "@/lib/aiSummary"
import { getSupabaseServerClient } from "@/lib/supabase"
import type { AuditInput, ToolInput, UseCase } from "@/lib/types"

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
    const payload = await request.json()
    console.log('[api/audit] incoming payload:', JSON.stringify(payload).slice(0, 2000))

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
    const aiSummaryText = await generateAiSummary({
      input: validation.data,
      results: audit.results,
      totalMonthlySavings: audit.totalMonthlySavings,
      totalAnnualSavings: audit.totalAnnualSavings,
      isOptimal: audit.isOptimal,
      showCredex: audit.showCredex,
    })

    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("audits")
      .insert({
        input: validation.data,
        results: audit.results,
        total_monthly_savings: audit.totalMonthlySavings,
        total_annual_savings: audit.totalAnnualSavings,
        ai_summary: aiSummaryText,
        is_optimal: audit.isOptimal,
        show_credex: audit.showCredex,
      })
      .select("id")
      .single()

    if (error || !data) {
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
