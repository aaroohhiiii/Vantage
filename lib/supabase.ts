import { createClient } from '@supabase/supabase-js'
import { AuditResult } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl) {
	throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
}

// ============================================
// PUBLIC CLIENT
// Use this for: reading audit results on the
// public results page (server component)
// ============================================
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey)

// ============================================
// SERVICE CLIENT
// Use this for: writing audits and leads
// from API routes ONLY — never expose this
// to the browser
// ============================================
export const supabaseService = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// ============================================
// HELPER FUNCTIONS
// ============================================

// Fetch a single audit by ID (used on results page)
// Returns null if not found — caller handles the 404
export async function getAuditById(id: string): Promise<AuditResult | null> {
  const { data, error } = await supabasePublic
    .from('audits')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    input: data.input,
    results: (data.results as Record<string, unknown>[]).map((r) => ({
      ...r,
      // Ensure these specific AI fields are mapped correctly if they exist in the JSON
      strengths: (r.strengths as string[]) || [],
      weaknesses: (r.weaknesses as string[]) || [],
      alternativeTool: (r.alternativeTool as string) || "",
      uniqueCapabilityAnalysis: (r.uniqueCapabilityAnalysis as string) || ""
    })) as AuditResult['results'],
    totalMonthlySavings: data.total_monthly_savings,
    totalAnnualSavings: data.total_annual_savings,
    aiSummary: data.ai_summary,
    isOptimal: data.is_optimal,
    showCredex: data.show_credex,
    createdAt: data.created_at,
    summary: data.summary ?? undefined,
    efficiencyScore: data.efficiency_score ?? undefined,
    referralCode: data.referral_code ?? undefined,
  }
}

// Save a new audit (used in /api/audit route)
export async function saveAudit(audit: Omit<AuditResult, 'id' | 'createdAt'>): 
  Promise<string | null> {
  const { data, error } = await supabaseService
    .from('audits')
    .insert({
      input: audit.input,
      results: audit.results,
      total_monthly_savings: audit.totalMonthlySavings,
      total_annual_savings: audit.totalAnnualSavings,
      ai_summary: audit.aiSummary,
      is_optimal: audit.isOptimal,
      show_credex: audit.showCredex,
      summary: audit.summary ?? null,
      efficiency_score: audit.efficiencyScore ?? null,
    })
    .select('id')
    .single()

  if (error || !data) {
    console.error('Supabase save error:', error)
    return null
  }

  return data.id
}

// Save a lead (used in /api/capture-lead route)
export async function saveLead(lead: {
  auditId: string
  email: string
  companyName?: string
  role?: string
  teamSize?: number
}): Promise<boolean> {
  const { error } = await supabaseService
    .from('leads')
    .insert({
      audit_id: lead.auditId,
      email: lead.email,
      company_name: lead.companyName,
      role: lead.role,
      team_size: lead.teamSize
    })

  if (error) {
    console.error('Lead save error:', error)
    return false
  }

  return true
}

export function getSupabaseServerClient() {
	const key = supabaseServiceRoleKey ?? supabaseAnonKey;

	if (!key) {
		throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY')
	}

	return createClient(supabaseUrl, key, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	})
}