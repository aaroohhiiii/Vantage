/**
 * ═══════════════════════════════════════════════════════════════
 * ENHANCED AI SUMMARY — Human Consultant Recommendations
 * 
 * Provides expert-level recommendations with deep knowledge of AI tools,
 * their specific strengths, and value-for-money analysis.
 * ═══════════════════════════════════════════════════════════════
 */

import type { AuditResult, ToolName, UseCase } from "@/lib/types"
import { getPlanCapabilities, getRequiredCapabilitiesForUseCase } from "./capabilityData"
import { getOfficialPrice } from "./pricingData"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

type SummaryInput = Omit<AuditResult, "id" | "aiSummary" | "createdAt">

// Tool-specific expertise knowledge base
const toolExpertise = {
  cursor: {
    displayName: "Cursor",
    strengths: ["VS Code integration", "Advanced agent mode", "MCP support", "Local processing", "Privacy-focused"],
    bestFor: ["Professional developers", "Privacy-conscious teams", "Complex codebases"],
    uniqueCapabilities: ["mcp_support", "hooks", "skills"],
    limitations: ["Higher learning curve", "Requires VS Code"]
  },
  windsurf: {
    displayName: "Windsurf",
    strengths: ["Budget-friendly", "Simple interface", "Fast setup", "Good for beginners"],
    bestFor: ["Solo developers", "Startups", "Simple projects"],
    uniqueCapabilities: ["agent_mode", "frontier_models"],
    limitations: ["Fewer advanced features", "Limited customization"]
  },
  "github-copilot": {
    displayName: "GitHub Copilot",
    strengths: ["GitHub integration", "Enterprise features", "Microsoft ecosystem", "Team collaboration"],
    bestFor: ["Enterprise teams", "Microsoft shops", "GitHub-heavy workflows"],
    uniqueCapabilities: ["team_collaboration"],
    limitations: ["Less advanced AI models", "GitHub dependency"]
  },
  chatgpt: {
    displayName: "ChatGPT",
    strengths: ["GPT-5 access", "Deep research", "Image generation", "Large context", "Early features"],
    bestFor: ["Research", "Content creation", "General AI tasks"],
    uniqueCapabilities: ["deep_research", "image_generation", "codex_usage", "early_access"],
    limitations: ["Privacy concerns", "Usage limits"]
  },
  claude: {
    displayName: "Claude",
    strengths: ["Advanced reasoning", "Large context", "Privacy-focused", "Code analysis"],
    bestFor: ["Complex reasoning", "Code review", "Privacy-sensitive work"],
    uniqueCapabilities: ["advanced_reasoning", "expanded_context"],
    limitations: ["No image generation", "Fewer integrations"]
  },
  gemini: {
    displayName: "Gemini",
    strengths: ["Google integration", "Multimodal", "Video generation", "Google ecosystem"],
    bestFor: ["Google users", "Multimedia content", "Research"],
    uniqueCapabilities: ["advanced_reasoning"],
    limitations: ["Less mature", "Google dependency"]
  },
  "anthropic-api": {
    displayName: "Anthropic API",
    strengths: ["Raw model access", "Full control", "Custom applications", "No subscription limits"],
    bestFor: ["Developers", "Custom integrations", "API-heavy workflows"],
    uniqueCapabilities: ["frontier_models", "advanced_reasoning", "expanded_context"],
    limitations: ["Requires development", "No UI", "Complex setup"]
  },
  "openai-api": {
    displayName: "OpenAI API",
    strengths: ["Raw model access", "Full model catalog", "Custom applications", "Enterprise features"],
    bestFor: ["Developers", "Custom integrations", "API-heavy workflows"],
    uniqueCapabilities: ["frontier_models", "advanced_reasoning", "expanded_context"],
    limitations: ["Requires development", "No UI", "Complex setup"]
  }
}

// Value-for-money comparison logic
function compareValueForMoney(
  tool1: ToolName,
  plan1: string,
  tool2: ToolName,
  plan2: string,
  useCase: UseCase
): {
  recommended: ToolName
  reasoning: string
  valueScore: number
} {
  const capabilities1 = getPlanCapabilities(tool1, plan1)
  const capabilities2 = getPlanCapabilities(tool2, plan2)
  const required = getRequiredCapabilitiesForUseCase(useCase)
  
  const price1 = getOfficialPrice(tool1, plan1, 1)
  const price2 = getOfficialPrice(tool2, plan2, 1)
  
  // Calculate value score: (relevant capabilities / price)
  const relevant1 = capabilities1.filter(cap => required.includes(cap)).length
  const relevant2 = capabilities2.filter(cap => required.includes(cap)).length
  
  const valueScore1 = price1 > 0 ? relevant1 / price1 : relevant1
  const valueScore2 = price2 > 0 ? relevant2 / price2 : relevant2
  
  const recommended = valueScore1 >= valueScore2 ? tool1 : tool2
  const winner = recommended === tool1 ? toolExpertise[tool1] : toolExpertise[tool2]
  const loser = recommended === tool1 ? toolExpertise[tool2] : toolExpertise[tool1]
  
  const reasoning = `${winner.displayName} offers better value for ${useCase} with its ${winner.strengths.slice(0, 2).join(" and ")}. While ${loser.displayName} is strong in ${loser.strengths.slice(0, 2).join(" and ")}, the ${winner.displayName.toLowerCase()} features align better with your specific needs.`
  
  return {
    recommended,
    reasoning,
    valueScore: Math.max(valueScore1, valueScore2)
  }
}

// Generate human consultant-style recommendations
function generateConsultantInsights(audit: SummaryInput): string[] {
  const insights: string[] = []
  const { input } = audit
  
  // Find similar tools for comparison
  const ideTools = input.tools.filter(t => ["cursor", "windsurf", "github-copilot"].includes(t.tool))
  const chatTools = input.tools.filter(t => ["chatgpt", "claude", "gemini"].includes(t.tool))
  
  // IDE tool recommendations
  if (ideTools.length >= 2) {
    const codingComparison = compareValueForMoney(
      ideTools[0].tool,
      ideTools[0].plan,
      ideTools[1].tool,
      ideTools[1].plan,
      "coding"
    )
    insights.push(`For coding, I recommend ${codingComparison.recommended} over ${codingComparison.recommended === ideTools[0].tool ? ideTools[1].tool : ideTools[0].tool}. ${codingComparison.reasoning}`)
  }
  
  // Chat tool recommendations
  if (chatTools.length >= 2) {
    const chatComparison = compareValueForMoney(
      chatTools[0].tool,
      chatTools[0].plan,
      chatTools[1].tool,
      chatTools[1].plan,
      input.useCase
    )
    insights.push(`For your ${input.useCase} needs, ${chatComparison.recommended} provides better value. ${chatComparison.reasoning}`)
  }
  
  // Use case specific advice
  if (input.useCase === "coding") {
    insights.push("For development teams, I prioritize tools with strong IDE integration, code-specific features, and privacy. Cursor's advanced agent mode and MCP support typically provide the best ROI for serious development work.")
  } else if (input.useCase === "research") {
    insights.push("For research workflows, I look for strong reasoning capabilities, large context windows, and information synthesis. ChatGPT's deep research and Claude's advanced reasoning are typically worth the premium.")
  } else if (input.useCase === "writing") {
    insights.push("For content creation, I prioritize tools with strong language capabilities, long context, and versatility. Claude's reasoning and ChatGPT's creative features complement each other well.")
  }
  
  return insights
}

function generateEnhancedFallbackSummary(audit: SummaryInput): string {
  const { totalMonthlySavings, input } = audit
  const totalSpend = input.tools.reduce((sum, tool) => sum + tool.monthlySpend, 0)
  const insights = generateConsultantInsights(audit)
  
  if (audit.isOptimal) {
    const insight = insights[0] || "Your current tool mix is well-balanced for your needs."
    return `Your team of ${input.teamSize} is spending $${totalSpend.toFixed(2)}/month efficiently across ${input.tools.length} AI tools. ${insight} Your stack is well-optimized for ${input.useCase} work - I'd recommend monitoring for new features rather than making changes.`
  }
  
  const topInsight = insights[0] || "Focus on consolidating overlapping tools."
  return `Your team is spending $${totalSpend.toFixed(2)}/month across ${input.tools.length} AI tools, with $${totalMonthlySavings.toFixed(2)}/month in savings available. ${topInsight} Based on my analysis of hundreds of AI tool stacks, this consolidation won't impact your workflow - you'll actually get better focused tools for your ${input.useCase} needs.`
}

export async function generateEnhancedAiSummary(audit: SummaryInput): Promise<string> {
  const { totalMonthlySavings, input, isOptimal } = audit
  const totalSpend = input.tools.reduce((sum, tool) => sum + tool.monthlySpend, 0)
  const insights = generateConsultantInsights(audit)
  
  const prompt = `You are a top-tier AI strategy consultant who has optimized hundreds of startup tool stacks. You possess an encyclopedic knowledge of AI tools, their precise capabilities, redundancy risks, and real-world ROI.

Write a single, dense, impactful paragraph (strictly 90-130 words).

Client Profile & Audit Data:
- Team size: ${input.teamSize} employees
- Primary workflow: ${input.useCase}
- Current monthly AI spend: $${totalSpend.toFixed(2)}
- Current stack: ${input.tools.map(t => t.tool).join(", ")}
- Identified monthly savings: $${totalMonthlySavings.toFixed(2)}
- Overall audit status: ${isOptimal ? "Well-optimized" : "Consolidation recommended"}

Specific Expert Insights to weave in:
${insights.map(insight => `- ${insight}`).join("\n")}

Strict Writing Directives:
- Persona: An authoritative, seasoned expert delivering an executive summary.
- Detail & Accuracy: Mention exact dollar figures, specific tool names, and concrete business impacts. Do not invent capabilities not present in the insights.
- Practicality: Focus on workflow efficiency, ROI, and capability overlaps rather than mere feature lists.
- Assurance: If suggesting cuts or tool changes, clearly articulate why their specific workflow (${input.useCase}) will not be degraded.
- Format: One single, cohesive paragraph. No bullet points, no fluff, no introductory filler (e.g., "As an expert...").
- Constraint: Never mention the name "Credex".`

  try {
    if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY not set")

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      max_tokens: 250,
    })

    const responseText = chatCompletion.choices[0]?.message?.content ?? ""

    if (!responseText) throw new Error("Empty response from Groq")

    return responseText
  } catch (error) {
    console.error("[generateEnhancedAiSummary] Fallback triggered. Groq API Error:", error instanceof Error ? error.message : "Unknown error")
    return generateEnhancedFallbackSummary(audit)
  }
}
