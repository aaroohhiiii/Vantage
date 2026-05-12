import { supabasePublic } from "./supabase"

export type EventName = 
  | 'page_view_landing'
  | 'audit_start'
  | 'audit_step_1_complete'
  | 'audit_step_2_complete'
  | 'audit_submitted'
  | 'results_viewed'
  | 'email_capture_submitted'
  | 'share_button_clicked'
  | 'credex_cta_clicked'

export async function trackEvent(
  eventName: EventName, 
  auditId?: string, 
  metadata: Record<string, unknown> = {}
) {
  try {
    const { error } = await supabasePublic
      .from('analytics_events')
      .insert({
        event_name: eventName,
        audit_id: auditId,
        metadata: {
          ...metadata,
          url: typeof window !== 'undefined' ? window.location.href : '',
          referrer: typeof document !== 'undefined' ? document.referrer : '',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        }
      })
    
    if (error) console.error('[Analytics] Error tracking event:', error)
  } catch (e) {
    console.error('[Analytics] tracking failed:', e)
  }
}
