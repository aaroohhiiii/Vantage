import { NextResponse } from "next/server"
import { generateEnhancedAiSummary } from "@/lib/enhancedAiSummary"
import type { AuditResult } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { auditResult?: AuditResult }
    
    if (!body.auditResult) {
      return NextResponse.json(
        { message: "Missing auditResult in request body" },
        { status: 400 }
      )
    }

    const aiSummaryText = await generateEnhancedAiSummary(body.auditResult)
    
    return NextResponse.json({ summary: aiSummaryText })
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to generate summary",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
