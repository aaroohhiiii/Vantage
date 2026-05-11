export type Capability =
  | "frontier_models"
  | "advanced_reasoning"
  | "agent_mode"
  | "deep_research"
  | "image_generation"
  | "memory"
  | "projects"
  | "custom_gpts"
  | "ide_integration"
  | "code_assistant"
  | "mcp_support"
  | "hooks"
  | "skills"
  | "team_collaboration"
  | "high_usage_limits"
  | "expanded_context"
  | "expanded_uploads"
  | "codex_usage"
  | "early_access"
  | "admin_controls"
  | "usage_analytics"
  | "extended_context"
  | "voice_input"
  | "image_analysis"
  | "multimodal_vision"

export type ToolName =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf"

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed"

export type ToolInput = {
  tool: ToolName
  plan: string
  monthlySpend: number
  seats: number
  _priceDiscrepancy?: number // % difference from official pricing
  _officialPrice?: number // Official price from pricing data
}

export type PlanCapabilityProfile = {
  tool: ToolName
  plan: string
  capabilities: Capability[]
  category: "chat" | "coding" | "research" | "image" | "workspace" | "api"
  sourceUrl?: string
  verifiedDate?: string
}

export type AuditFinding = {
  ruleId: string
  severity: "low" | "medium" | "high"
  type: "pricing" | "fit" | "overlap" | "switch" | "data-quality"
  message: string
  evidence: {
    overlap?: Capability[]
    unique?: Capability[]
    score?: number
  }
}

export type AuditInput = {
  tools: ToolInput[]
  teamSize: number
  useCase: UseCase
}

export type ToolAuditResult = {
  tool: ToolName
  currentPlan: string
  currentSpend: number
  recommendedAction: "keep" | "remove" | "downgrade" | "upgrade" | "consolidate" | "switch" | "cancel-redundant"
  recommendedPlan?: string
  recommendedTool?: string
  monthlySavings: number
  annualSavings: number
  reason: string
  credexOpportunity: boolean
  
  // NEW FIELDS
  confidence: "low" | "medium" | "high"
  overlapScore: number // 0-1: how much overlaps with rest of stack
  uniqueValueScore: number // 0-1: how much unique value this plan adds
  needAlignmentScore: number // 0-1: how well unique features match user needs
  findings: AuditFinding[]
  rationale: string[] // Bullet points explaining the recommendation
  
  // AI ENHANCEMENTS
  aiInsight?: string // 2-3 line summary from Groq
  strengths?: string[]
  weaknesses?: string[]
  alternativeTool?: string // Primary alternative tool name
  uniqueCapabilityAnalysis?: string // Paragraph on how to use unique features for the use case

  marginalUtility: {
    capabilities: Capability[]
    description: string
  }
}

export type AuditStackSummary = {
  currentMonthlySpend: number
  optimizedMonthlySpend: number
  estimatedMonthlySavings: number
  duplicateCapabilities: Capability[]
  uncoveredCapabilities: Capability[]
  stackStatus: "optimized" | "overlapping" | "underprovided" | "mixed"
  primaryConsolidationOpportunity?: string
  biggestValueAdder?: string
}

export type AuditOutput = Omit<AuditResult, "id" | "aiSummary" | "createdAt">

export type AuditResult = {
  id: string
  input: AuditInput
  results: ToolAuditResult[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  aiSummary: string
  isOptimal: boolean
  showCredex: boolean
  createdAt: string
  
  // Computed scores
  summary?: AuditStackSummary
  efficiencyScore?: number // 0–100
}

export type Lead = {
  id: string
  auditId: string
  email: string
  companyName?: string
  role?: string
  teamSize?: number
  createdAt: string
}

export type FormStep = 1 | 2 | 3

export type FormState = {
  step: FormStep
  selectedTools: ToolName[]
  toolInputs: Record<ToolName, ToolInput>
  teamSize: number
  useCase: UseCase
}

export type StoredFormState = FormState & {
  lastUpdated: string
}
