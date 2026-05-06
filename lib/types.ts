export type CurrencyCode = "USD"

export interface SourceCitation {
  label: string
  url: string
  accessedOn: string
}

export interface SpendInput {
  channel: string
  monthlyBudgetUsd: number
}

export interface BusinessContextInput {
  industry: string
  targetGeo: string
  companyStage: "pre-seed" | "seed" | "series-a" | "growth"
}

export interface AuditFormState {
  companyName: string
  websiteUrl: string
  context: BusinessContextInput
  spendByChannel: SpendInput[]
}

export interface ChannelAuditResult {
  channel: string
  score: number
  confidence: number
  notes: string[]
}

export interface PricingAssumption {
  metric: string
  unit: string
  value: number
  currency: CurrencyCode
  sources: SourceCitation[]
}

export interface AuditEngineInput {
  form: AuditFormState
  assumptions: PricingAssumption[]
}

export interface AuditEngineOutput {
  overallScore: number
  estimatedWasteUsd: number
  quickWins: string[]
  channelResults: ChannelAuditResult[]
}
