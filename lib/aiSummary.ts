import Anthropic from "@anthropic-ai/sdk"
import type { AuditResult } from "@/lib/types"

// We use the edge-compatible client initialization (or the global one, it will handle it)
// It defaults to process.env.ANTHROPIC_API_KEY
const client = new Anthropic()

type SummaryInput = Omit<AuditResult, "id" | "aiSummary" | "createdAt">

function generateFallbackSummary(audit: SummaryInput): string {
  const { totalMonthlySavings, input, results } = audit
  const totalSpend = input.tools.reduce((sum, tool) => sum + tool.monthlySpend, 0)
  const topResult = results
    .filter((r) => r.recommendedAction !== "keep")
    .sort((a, b) => b.monthlySavings - a.monthlySavings)[0]

  if (audit.isOptimal) {
    return `Your team of ${input.teamSize} is spending efficiently across ${input.tools.length} AI tools, with no major optimization opportunities identified at this time. Your current stack is well-matched to your ${input.useCase} use case. We'll flag any new savings opportunities as pricing and product landscapes evolve.`
  }

  return `Your team is spending $${totalSpend.toFixed(2)}/month across ${input.tools.length} AI tools. Our analysis identified $${totalMonthlySavings.toFixed(2)}/month in savings — $${audit.totalAnnualSavings.toFixed(2)}/year. The highest-impact change: ${topResult?.reason ?? "reviewing plan tiers for seat count fit"}. Implementing these recommendations requires no change to your workflow, only to which plans and vendors you pay.`
}

export async function generateAiSummary(audit: SummaryInput): Promise<string> {
  const { totalMonthlySavings, input, results, isOptimal } = audit
  const totalSpend = input.tools.reduce((sum, tool) => sum + tool.monthlySpend, 0)
  const toolList = input.tools.map((t) => t.tool).join(", ")
  const topResult = results
    .filter((r) => r.recommendedAction !== "keep")
    .sort((a, b) => b.monthlySavings - a.monthlySavings)[0]
  const topRecommendation = topResult?.reason ?? "None"

  const prompt = `You are an AI spend optimization advisor reviewing a startup's AI tool usage. Write a single paragraph of exactly 80-100 words.

Team profile:
- Team size: ${input.teamSize} people
- Primary use case: ${input.useCase}
- Monthly AI tool spend: $${totalSpend.toFixed(2)}
- Tools used: ${toolList}

Audit findings:
- Total potential savings: $${totalMonthlySavings.toFixed(2)}/month
- Top recommendation: ${topRecommendation}
- Overall status: ${isOptimal ? "spending efficiently" : "overspending identified"}

Instructions:
- Be direct and specific. Use actual dollar amounts.
- Do not use bullet points. Write flowing prose only.
- If savings are minimal, acknowledge they're spending well — don't invent savings.
- Mention the single highest-impact change they can make.
- Tone: a knowledgeable advisor talking to a founder, not a sales pitch.
- Do not mention Credex by name.`

  try {
    const message = await client.messages.create({
      model: "claude-3-5-haiku-latest", // Use the valid haiku 3.5 identifier, or claude-3-haiku-20240307
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    })
    
    // Check if the response contains text
    const responseText = message.content[0]?.type === "text" ? message.content[0].text : ""
    if (!responseText) throw new Error("Empty response from Anthropic")
    
    return responseText
  } catch (error) {
    console.error("[generateAiSummary] Fallback triggered. Anthropic API Error:", error instanceof Error ? error.message : "Unknown error")
    return generateFallbackSummary(audit)
  }
}
