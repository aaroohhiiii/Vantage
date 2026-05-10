import type { ToolName, Capability, PlanCapabilityProfile } from "@/lib/types"

export const PLAN_CAPABILITY_DATA: PlanCapabilityProfile[] = [
  {
    tool: "cursor",
    plan: "Pro",
    capabilities: [
      "ide_integration",
      "code_assistant",
      "mcp_support",
      "hooks",
      "skills",
      "agent_mode",
      "frontier_models",
      "high_usage_limits",
    ],
    category: "coding",
    sourceUrl: "https://cursor.com/pricing",
    verifiedDate: "2026-05-10",
  },
  {
    tool: "cursor",
    plan: "Hobby",
    capabilities: [
      "ide_integration",
      "code_assistant",
    ],
    category: "coding",
    sourceUrl: "https://cursor.com/pricing",
    verifiedDate: "2026-05-10",
  },
  {
    tool: "cursor",
    plan: "Business",
    capabilities: [
      "ide_integration",
      "code_assistant",
      "mcp_support",
      "hooks",
      "skills",
      "agent_mode",
      "frontier_models",
      "high_usage_limits",
      "team_collaboration",
    ],
    category: "coding",
    sourceUrl: "https://cursor.com/pricing",
    verifiedDate: "2026-05-10",
  },
  {
    tool: "github-copilot",
    plan: "Individual",
    capabilities: [
      "ide_integration",
      "code_assistant",
    ],
    category: "coding",
    sourceUrl: "https://github.com/features/copilot/pricing",
    verifiedDate: "2026-05-10",
  },
  {
    tool: "github-copilot",
    plan: "Pro",
    capabilities: [
      "ide_integration",
      "code_assistant",
      "team_collaboration",
    ],
    category: "coding",
    sourceUrl: "https://github.com/features/copilot/pricing",
    verifiedDate: "2026-05-10",
  },
  {
    tool: "github-copilot",
    plan: "Business",
    capabilities: [
      "ide_integration",
      "code_assistant",
      "team_collaboration",
      "high_usage_limits",
    ],
    category: "coding",
    sourceUrl: "https://github.com/features/copilot/pricing",
    verifiedDate: "2026-05-10",
  },
  {
    tool: "chatgpt",
    plan: "Plus",
    capabilities: [
      "frontier_models",
      "advanced_reasoning",
      "agent_mode",
      "high_usage_limits",
    ],
    category: "chat",
    sourceUrl: "https://openai.com/chatgpt/pricing",
    verifiedDate: "2026-05-10",
  },
  {
    tool: "chatgpt",
    plan: "Pro",
    capabilities: [
      "frontier_models",
      "advanced_reasoning",
      "deep_research",
      "image_generation",
      "memory",
      "projects",
      "custom_gpts",
      "expanded_context",
      "expanded_uploads",
      "codex_usage",
      "early_access",
      "agent_mode",
      "high_usage_limits",
    ],
    category: "chat",
    sourceUrl: "https://openai.com/chatgpt/pricing",
    verifiedDate: "2026-05-10",
  },
  {
    tool: "chatgpt",
    plan: "Team",
    capabilities: [
      "frontier_models",
      "advanced_reasoning",
      "deep_research",
      "image_generation",
      "memory",
      "projects",
      "custom_gpts",
      "expanded_context",
      "expanded_uploads",
      "codex_usage",
      "early_access",
      "agent_mode",
      "high_usage_limits",
      "team_collaboration",
    ],
    category: "chat",
    sourceUrl: "https://openai.com/chatgpt/pricing",
    verifiedDate: "2026-05-10",
  },
  {
    tool: "claude",
    plan: "Pro",
    capabilities: [
      "frontier_models",
      "advanced_reasoning",
      "agent_mode",
      "high_usage_limits",
      "expanded_context",
    ],
    category: "chat",
    sourceUrl: "https://claude.ai/pricing",
    verifiedDate: "2026-05-10",
  },
  {
    tool: "claude",
    plan: "Team",
    capabilities: [
      "frontier_models",
      "advanced_reasoning",
      "agent_mode",
      "high_usage_limits",
      "expanded_context",
      "team_collaboration",
    ],
    category: "chat",
    sourceUrl: "https://claude.ai/pricing",
    verifiedDate: "2026-05-10",
  },
  {
    tool: "claude",
    plan: "Max",
    capabilities: [
      "frontier_models",
      "advanced_reasoning",
      "agent_mode",
      "high_usage_limits",
      "expanded_context",
      "projects",
    ],
    category: "chat",
    sourceUrl: "https://claude.ai/pricing",
    verifiedDate: "2026-05-10",
  },
  {
    tool: "anthropic-api",
    plan: "Usage-based",
    capabilities: [
      "frontier_models",
      "advanced_reasoning",
      "expanded_context",
      "high_usage_limits",
    ],
    category: "api",
    sourceUrl: "https://docs.anthropic.com/en/api/pricing",
    verifiedDate: "2026-05-10",
  },
  {
    tool: "openai-api",
    plan: "Usage-based",
    capabilities: [
      "frontier_models",
      "advanced_reasoning",
      "expanded_context",
      "high_usage_limits",
    ],
    category: "api",
    sourceUrl: "https://openai.com/pricing",
    verifiedDate: "2026-05-10",
  },
  {
    tool: "gemini",
    plan: "Pro",
    capabilities: [
      "frontier_models",
      "advanced_reasoning",
      "high_usage_limits",
      "expanded_context",
    ],
    category: "chat",
    sourceUrl: "https://ai.google.dev/pricing",
    verifiedDate: "2026-05-10",
  },
  {
    tool: "windsurf",
    plan: "Pro",
    capabilities: [
      "ide_integration",
      "code_assistant",
      "agent_mode",
      "frontier_models",
    ],
    category: "coding",
    sourceUrl: "https://windsurf.dev/pricing",
    verifiedDate: "2026-05-10",
  },
]

export function getPlanCapabilities(tool: ToolName, plan: string): Capability[] {
  const entry = PLAN_CAPABILITY_DATA.find(
    (p) => p.tool === tool && p.plan.toLowerCase() === plan.toLowerCase()
  )
  return entry?.capabilities ?? []
}

export function getRequiredCapabilitiesForUseCase(useCase: "coding" | "writing" | "data" | "research" | "mixed"): Capability[] {
  switch (useCase) {
    case "coding":
      return [
        "ide_integration",
        "code_assistant",
        "frontier_models",
        "advanced_reasoning",
      ]
    case "writing":
      return [
        "frontier_models",
        "advanced_reasoning",
        "memory",
        "projects",
        "high_usage_limits",
      ]
    case "data":
      return [
        "frontier_models",
        "advanced_reasoning",
        "expanded_context",
        "expanded_uploads",
        "high_usage_limits",
      ]
    case "research":
      return [
        "frontier_models",
        "advanced_reasoning",
        "deep_research",
        "memory",
        "expanded_context",
      ]
    case "mixed":
      return [
        "frontier_models",
        "advanced_reasoning",
        "ide_integration",
        "code_assistant",
        "memory",
        "projects",
        "high_usage_limits",
      ]
    default:
      return []
  }
}
