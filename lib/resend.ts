import { Resend } from 'resend'
import type { AuditResult, ToolAuditResult } from './types'

const apiKey = process.env.RESEND_API_KEY

if (!apiKey) {
  throw new Error('Missing RESEND_API_KEY')
}

const resend = new Resend(apiKey)

// TODO: Replace with custom domain once DNS is configured
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'

function getActionLabel(action: ToolAuditResult['recommendedAction']): string {
  switch (action) {
    case 'downgrade': return '⬇️ Downgrade'
    case 'switch': return '🔄 Switch'
    case 'cancel-redundant': return '❌ Cancel'
    case 'use-credits': return '💜 Use Credits'
    case 'keep': return '✅ Keep'
  }
}

function buildAuditEmailHtml(audit: AuditResult, auditUrl: string): string {
  const topRecs = audit.results
    .filter((r) => r.monthlySavings > 0)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)
    .slice(0, 3)

  const recsHtml = topRecs.length > 0
    ? topRecs.map((r) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #E5E7EB;font-size:14px;color:#0A0A0A;">
            ${r.tool.replace('-', ' ')}
          </td>
          <td style="padding:8px 12px;border-bottom:1px solid #E5E7EB;font-size:14px;color:#0A0A0A;">
            ${getActionLabel(r.recommendedAction)}
          </td>
          <td style="padding:8px 12px;border-bottom:1px solid #E5E7EB;font-size:14px;font-weight:600;color:#00C853;">
            -$${r.monthlySavings.toFixed(0)}/mo
          </td>
        </tr>`
      ).join('')
    : '<tr><td colspan="3" style="padding:12px;color:#4B5563;font-size:14px;">Your stack is already optimized! No changes recommended.</td></tr>'

  const credexSection = audit.showCredex
    ? `<div style="margin-top:24px;padding:16px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;">
        <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#086841;">💜 Credex Opportunity</p>
        <p style="margin:0 0 12px;font-size:14px;color:#4B5563;">A Credex advisor will review your audit personally and reach out within 48 hours to discuss discounted AI credits.</p>
        <a href="https://credex.rocks" style="display:inline-block;padding:8px 20px;background:#00C853;color:white;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">Learn About Credex →</a>
      </div>`
    : audit.isOptimal
    ? `<div style="margin-top:24px;padding:16px;background:#F8F9FA;border:1px solid #E5E7EB;border-radius:12px;">
        <p style="margin:0;font-size:14px;color:#4B5563;">We'll notify you when new optimization opportunities apply to your stack.</p>
      </div>`
    : ''

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F8F9FA;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-block;width:32px;height:32px;background:#00C853;border-radius:8px;line-height:32px;color:white;font-weight:bold;font-size:14px;">P</div>
      <span style="font-size:18px;font-weight:600;color:#0A0A0A;margin-left:8px;vertical-align:middle;">Prune</span>
    </div>

    <!-- Main card -->
    <div style="background:white;border:1px solid #E5E7EB;border-radius:16px;padding:32px;margin-bottom:24px;">
      <h1 style="margin:0 0 4px;font-size:14px;color:#4B5563;font-weight:500;">Your AI Spend Audit</h1>
      
      <!-- Big number -->
      <div style="margin:16px 0 24px;">
        <span style="font-size:48px;font-weight:700;color:#00C853;">$${audit.totalMonthlySavings.toFixed(0)}</span>
        <span style="font-size:18px;color:#4B5563;">/month in potential savings</span>
        <br>
        <span style="font-size:14px;color:#9CA3AF;">$${audit.totalAnnualSavings.toFixed(0)}/year across ${audit.input.tools.length} tools</span>
      </div>

      <!-- Recommendations table -->
      <table style="width:100%;border-collapse:collapse;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">
        <thead>
          <tr style="background:#F8F9FA;">
            <th style="padding:8px 12px;text-align:left;font-size:12px;color:#4B5563;font-weight:600;border-bottom:1px solid #E5E7EB;">Tool</th>
            <th style="padding:8px 12px;text-align:left;font-size:12px;color:#4B5563;font-weight:600;border-bottom:1px solid #E5E7EB;">Action</th>
            <th style="padding:8px 12px;text-align:left;font-size:12px;color:#4B5563;font-weight:600;border-bottom:1px solid #E5E7EB;">Savings</th>
          </tr>
        </thead>
        <tbody>
          ${recsHtml}
        </tbody>
      </table>

      ${credexSection}

      <!-- CTA -->
      <div style="margin-top:24px;text-align:center;">
        <a href="${auditUrl}" style="display:inline-block;padding:12px 32px;background:#00C853;color:white;text-decoration:none;border-radius:12px;font-size:14px;font-weight:600;">View Full Report →</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;">
      <p style="font-size:12px;color:#9CA3AF;margin:0;">Powered by <a href="https://credex.rocks" style="color:#00C853;text-decoration:none;">Credex</a> · Discounted AI infrastructure credits</p>
    </div>
  </div>
</body>
</html>`
}

export async function sendAuditResultsEmail({
  to,
  audit,
  auditUrl,
}: {
  to: string
  audit: AuditResult
  auditUrl: string
}): Promise<boolean> {
  const savings = audit.totalMonthlySavings
  const subject = savings > 0
    ? `Your AI Spend Audit: $${savings.toFixed(0)}/mo in potential savings`
    : 'Your AI Spend Audit Results'

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html: buildAuditEmailHtml(audit, auditUrl),
    })
    return true
  } catch (error) {
    console.error('Resend email error:', error)
    return false
  }
}
