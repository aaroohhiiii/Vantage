/**
 * ═══════════════════════════════════════════════════════════════
 * VERIFIED PRICING DATA — Last verified: 2026-05-09
 * ═══════════════════════════════════════════════════════════════
 */

import type { ToolName } from "@/lib/types"

export type PricingPlan = {
  planName: string
  /** Price per user (or flat) per month */
  pricePerUserPerMonth: number
  /** If true, total cost = price × seats. If false, price is flat. */
  isPerUser: boolean
  /** Minimum seats required for this plan */
  minSeats?: number
  /** Official pricing page URL */
  sourceUrl: string
  /** Date pricing was last verified */
  verifiedDate: string
  /** Usage-based or enterprise custom pricing */
  allowCustomAmount?: boolean
}

export type ToolPricing = {
  toolName: ToolName
  displayName: string
  category: "ide" | "chat" | "api"
  plans: PricingPlan[]
}

const VERIFIED_DATE = "2026-05-09"

// ──────────────────────────────────────────────────────────────
// Official pricing URLs
// ──────────────────────────────────────────────────────────────

const CURSOR_URL = "https://cursor.com/pricing"
const COPILOT_URL = "https://github.com/features/copilot/plans"
const CLAUDE_URL = "https://claude.ai/pricing"
const ANTHROPIC_API_URL = "https://www.anthropic.com/pricing#api"
const CHATGPT_URL = "https://openai.com/chatgpt/pricing"
const OPENAI_API_URL = "https://openai.com/api/pricing"
const GEMINI_URL = "https://gemini.google/subscriptions"
const GEMINI_API_URL = "https://ai.google.dev/pricing"
const WINDSURF_URL = "https://windsurf.com/pricing"

// ──────────────────────────────────────────────────────────────
// Pricing Data
// ──────────────────────────────────────────────────────────────

export const pricingData: ToolPricing[] = [
  // ─── Cursor ────────────────────────────────────────────────
  {
    toolName: "cursor",
    displayName: "Cursor",
    category: "ide",
    plans: [
      {
        planName: "Hobby",
        pricePerUserPerMonth: 0,
        isPerUser: false,
        sourceUrl: CURSOR_URL,
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Pro",
        pricePerUserPerMonth: 20,
        isPerUser: true,
        sourceUrl: CURSOR_URL,
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Business",
        pricePerUserPerMonth: 40,
        isPerUser: true,
        minSeats: 2,
        sourceUrl: CURSOR_URL,
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Enterprise",
        pricePerUserPerMonth: 0,
        isPerUser: true,
        allowCustomAmount: true,
        sourceUrl: CURSOR_URL,
        verifiedDate: VERIFIED_DATE,
      },
    ],
  },

  // ─── GitHub Copilot ────────────────────────────────────────
  {
    toolName: "github-copilot",
    displayName: "GitHub Copilot",
    category: "ide",
    plans: [
      {
        planName: "Free",
        pricePerUserPerMonth: 0,
        isPerUser: false,
        sourceUrl: COPILOT_URL,
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Individual",
        pricePerUserPerMonth: 10,
        isPerUser: false,
        sourceUrl: COPILOT_URL,
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Business",
        pricePerUserPerMonth: 19,
        isPerUser: true,
        minSeats: 2,
        sourceUrl: COPILOT_URL,
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Enterprise",
        pricePerUserPerMonth: 39,
        isPerUser: true,
        minSeats: 2,
        sourceUrl: COPILOT_URL,
        verifiedDate: VERIFIED_DATE,
      },
    ],
  },

  // ─── Claude ────────────────────────────────────────────────
  {
    toolName: "claude",
    displayName: "Claude",
    category: "chat",
    plans: [
      {
        planName: "Free",
        pricePerUserPerMonth: 0,
        isPerUser: false,
        sourceUrl: CLAUDE_URL,
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Pro",
        pricePerUserPerMonth: 17,
        isPerUser: false,
        sourceUrl: CLAUDE_URL,
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Max",
        pricePerUserPerMonth: 100,
        isPerUser: false,
        sourceUrl: CLAUDE_URL,
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Team",
        pricePerUserPerMonth: 20,
        isPerUser: true,
        minSeats: 2,
        sourceUrl: CLAUDE_URL,
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Enterprise",
        pricePerUserPerMonth: 0,
        isPerUser: true,
        allowCustomAmount: true,
        sourceUrl: CLAUDE_URL,
        verifiedDate: VERIFIED_DATE,
      },
    ],
  },

  // ─── ChatGPT ───────────────────────────────────────────────
  {
    toolName: "chatgpt",
    displayName: "ChatGPT",
    category: "chat",
    plans: [
      {
        planName: "Free",
        pricePerUserPerMonth: 0,
        isPerUser: false,
        sourceUrl: CHATGPT_URL,
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Plus",
        pricePerUserPerMonth: 21.17,
        isPerUser: false,
        sourceUrl: CHATGPT_URL,
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Pro",
        pricePerUserPerMonth: 113.31,
        isPerUser: false,
        sourceUrl: CHATGPT_URL,
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Team",
        pricePerUserPerMonth: 19.60,
        isPerUser: true,
        minSeats: 2,
        sourceUrl: CHATGPT_URL,
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Enterprise",
        pricePerUserPerMonth: 0,
        isPerUser: true,
        allowCustomAmount: true,
        sourceUrl: CHATGPT_URL,
        verifiedDate: VERIFIED_DATE,
      },
    ],
  },

  // ─── Anthropic API ─────────────────────────────────────────
  {
    toolName: "anthropic-api",
    displayName: "Anthropic API",
    category: "api",
    plans: [
      {
        planName: "Usage-based",
        pricePerUserPerMonth: 0,
        isPerUser: false,
        allowCustomAmount: true,
        sourceUrl: ANTHROPIC_API_URL,
        verifiedDate: VERIFIED_DATE,
      },
    ],
  },

  // ─── OpenAI API ────────────────────────────────────────────
  {
    toolName: "openai-api",
    displayName: "OpenAI API",
    category: "api",
    plans: [
      {
        planName: "Usage-based",
        pricePerUserPerMonth: 0,
        isPerUser: false,
        allowCustomAmount: true,
        sourceUrl: OPENAI_API_URL,
        verifiedDate: VERIFIED_DATE,
      },
    ],
  },

  // ─── Gemini ────────────────────────────────────────────────
  {
    toolName: "gemini",
    displayName: "Gemini",
    category: "chat",
    plans: [
      {
        planName: "Free",
        pricePerUserPerMonth: 0,
        isPerUser: false,
        sourceUrl: GEMINI_URL,
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Pro",
        pricePerUserPerMonth: 19.99,
        isPerUser: false,
        sourceUrl: GEMINI_URL,
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Ultra",
        pricePerUserPerMonth: 249.99,
        isPerUser: false,
        sourceUrl: GEMINI_URL,
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "API",
        pricePerUserPerMonth: 0,
        isPerUser: false,
        allowCustomAmount: true,
        sourceUrl: GEMINI_API_URL,
        verifiedDate: VERIFIED_DATE,
      },
    ],
  },

  // ─── Windsurf ──────────────────────────────────────────────
  {
    toolName: "windsurf",
    displayName: "Windsurf",
    category: "ide",
    plans: [
      {
        planName: "Free",
        pricePerUserPerMonth: 0,
        isPerUser: false,
        sourceUrl: WINDSURF_URL,
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Pro",
        pricePerUserPerMonth: 20,
        isPerUser: true,
        sourceUrl: WINDSURF_URL,
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Teams",
        pricePerUserPerMonth: 40,
        isPerUser: true,
        minSeats: 2,
        sourceUrl: WINDSURF_URL,
        verifiedDate: VERIFIED_DATE,
      },
      {
        planName: "Enterprise",
        pricePerUserPerMonth: 0,
        isPerUser: true,
        allowCustomAmount: true,
        sourceUrl: WINDSURF_URL,
        verifiedDate: VERIFIED_DATE,
      },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════

export function getToolPricing(tool: ToolName): ToolPricing | undefined {
  return pricingData.find((item) => item.toolName === tool)
}

export function getPlanPricing(
  tool: ToolName,
  plan: string,
): PricingPlan | undefined {
  const toolPricing = getToolPricing(tool)
  if (!toolPricing) return undefined

  return toolPricing.plans.find(
    (p) => p.planName.toLowerCase() === plan.toLowerCase(),
  )
}

export function getOfficialPrice(
  tool: ToolName,
  plan: string,
  seats: number,
): number {
  const matchedPlan = getPlanPricing(tool, plan)

  if (!matchedPlan) return 0

  if (
    matchedPlan.allowCustomAmount &&
    matchedPlan.pricePerUserPerMonth === 0
  ) {
    return 0
  }

  const effectiveSeats = Math.max(
    seats,
    matchedPlan.minSeats ?? seats,
  )

  if (matchedPlan.isPerUser) {
    return matchedPlan.pricePerUserPerMonth * effectiveSeats
  }

  return matchedPlan.pricePerUserPerMonth
}

export function isCustomAmountAllowed(
  tool: ToolName,
  plan: string,
): boolean {
  const matchedPlan = getPlanPricing(tool, plan)
  return !!matchedPlan?.allowCustomAmount
}