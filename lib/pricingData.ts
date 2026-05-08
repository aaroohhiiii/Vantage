import type { ToolName } from "@/lib/types"

export type PricingPlan = {
  planName: string
  pricePerUserPerMonth: number
  isPerUser: boolean
  minSeats?: number
  sourceUrl: string
  verifiedDate: string
}

export type ToolPricing = {
  toolName: ToolName
  displayName: string
  plans: PricingPlan[]
}

const VERIFIED_DATE = "2026-05-08"

export const pricingData: ToolPricing[] = [
  {
    toolName: "cursor",
    displayName: "Cursor",
    plans: [
      {
        planName: "Hobby",
        pricePerUserPerMonth: 0,
        isPerUser: false,
        sourceUrl: "https://cursor.com/pricing",
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Pro",
        pricePerUserPerMonth: 20,
        isPerUser: true,
        sourceUrl: "https://cursor.com/pricing",
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Business",
        pricePerUserPerMonth: 40,
        isPerUser: true,
        sourceUrl: "https://cursor.com/pricing",
        verifiedDate: VERIFIED_DATE,
      },
    ],
  },
  {
    toolName: "github-copilot",
    displayName: "GitHub Copilot",
    plans: [
      {
        planName: "Individual",
        pricePerUserPerMonth: 10,
        isPerUser: true,
        sourceUrl: "https://github.com/features/copilot/plans",
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Business",
        pricePerUserPerMonth: 19,
        isPerUser: true,
        sourceUrl: "https://github.com/features/copilot/plans",
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Enterprise",
        pricePerUserPerMonth: 39,
        isPerUser: true,
        sourceUrl: "https://github.com/features/copilot/plans",
        verifiedDate: VERIFIED_DATE,
      },
    ],
  },
  {
    toolName: "claude",
    displayName: "Claude",
    plans: [
      {
        planName: "Free",
        pricePerUserPerMonth: 0,
        isPerUser: false,
        sourceUrl: "https://www.anthropic.com/pricing",
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Pro",
        pricePerUserPerMonth: 20,
        isPerUser: false,
        sourceUrl: "https://www.anthropic.com/pricing",
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Max",
        pricePerUserPerMonth: 100,
        isPerUser: false,
        sourceUrl: "https://www.anthropic.com/pricing",
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Team",
        pricePerUserPerMonth: 30,
        isPerUser: true,
        minSeats: 2,
        sourceUrl: "https://www.anthropic.com/pricing",
        verifiedDate: VERIFIED_DATE,
      },
    ],
  },
  {
    toolName: "chatgpt",
    displayName: "ChatGPT",
    plans: [
      {
        planName: "Free",
        pricePerUserPerMonth: 0,
        isPerUser: false,
        sourceUrl: "https://openai.com/chatgpt/pricing",
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Plus",
        pricePerUserPerMonth: 20,
        isPerUser: false,
        sourceUrl: "https://openai.com/chatgpt/pricing",
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Team",
        pricePerUserPerMonth: 30,
        isPerUser: true,
        minSeats: 2,
        sourceUrl: "https://openai.com/chatgpt/pricing",
        verifiedDate: VERIFIED_DATE,
      },
    ],
  },
  {
    toolName: "anthropic-api",
    displayName: "Anthropic API",
    plans: [
      {
        planName: "Usage-based",
        pricePerUserPerMonth: 0,
        isPerUser: false,
        sourceUrl: "https://www.anthropic.com/pricing#api",
        verifiedDate: VERIFIED_DATE,
      },
    ],
  },
  {
    toolName: "openai-api",
    displayName: "OpenAI API",
    plans: [
      {
        planName: "Usage-based",
        pricePerUserPerMonth: 0,
        isPerUser: false,
        sourceUrl: "https://openai.com/api/pricing",
        verifiedDate: VERIFIED_DATE,
      },
    ],
  },
  {
    toolName: "gemini",
    displayName: "Gemini",
    plans: [
      {
        planName: "Free",
        pricePerUserPerMonth: 0,
        isPerUser: false,
        sourceUrl: "https://one.google.com/about/plans",
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Advanced",
        pricePerUserPerMonth: 19.99,
        isPerUser: false,
        sourceUrl: "https://one.google.com/about/plans",
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "API",
        pricePerUserPerMonth: 0,
        isPerUser: false,
        sourceUrl: "https://ai.google.dev/pricing",
        verifiedDate: VERIFIED_DATE,
      },
    ],
  },
  {
    toolName: "windsurf",
    displayName: "Windsurf",
    plans: [
      {
        planName: "Free",
        pricePerUserPerMonth: 0,
        isPerUser: false,
        sourceUrl: "https://windsurf.com/pricing",
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Pro",
        pricePerUserPerMonth: 15,
        isPerUser: true,
        sourceUrl: "https://windsurf.com/pricing",
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Teams",
        pricePerUserPerMonth: 35,
        isPerUser: true,
        sourceUrl: "https://windsurf.com/pricing",
        verifiedDate: VERIFIED_DATE,
      },
    ],
  },
]

export function getToolPricing(tool: ToolName): ToolPricing | undefined {
  return pricingData.find((item) => item.toolName === tool)
}

export function getOfficialPrice(tool: ToolName, plan: string, seats: number): number {
  const toolPricing = getToolPricing(tool)
  if (!toolPricing) return 0

  const matchedPlan = toolPricing.plans.find(
    (pricingPlan) => pricingPlan.planName.toLowerCase() === plan.toLowerCase(),
  )

  if (!matchedPlan) return 0

  const effectiveSeats = Math.max(seats, matchedPlan.minSeats ?? seats)
  if (matchedPlan.isPerUser) {
    return matchedPlan.pricePerUserPerMonth * effectiveSeats
  }

  return matchedPlan.pricePerUserPerMonth
}
