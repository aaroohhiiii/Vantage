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
  recommendedAction: "downgrade" | "switch" | "cancel-redundant" | "keep" | "use-credits"
  recommendedPlan?: string
  recommendedTool?: string
  monthlySavings: number
  annualSavings: number
  reason: string
  credexOpportunity: boolean
}

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
