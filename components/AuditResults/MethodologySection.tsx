"use client"

import type { AuditResult } from "@/lib/types"
import { EmailCapture } from "./ResultsClient"
import { ShieldCheck, Mail, TrendingUp, DollarSign, Users, Bell } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

type Props = { audit: AuditResult }

export function MethodologySection({ audit }: Props) {
  const hasHighSavings = audit.totalMonthlySavings >= 500
  const hasLowSavings = audit.totalMonthlySavings < 100
  const isOptimal = audit.isOptimal

  return (
    <div className="space-y-6">
      {/* Prominent Credex for High Savings */}
      {hasHighSavings && (
        <div className="rounded-2xl border-2 border-[#7c3aed] bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-white/10 blur-xl" />
          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white"> Capture More Savings</h3>
                <p className="text-sm text-white/90">You&apos;re leaving ${(audit.totalMonthlySavings * 0.4).toFixed(0)}/mo on the table</p>
              </div>
            </div>

            <div className="mb-4 rounded-xl bg-white/10 backdrop-blur-sm p-4">
              <p className="mb-2 text-sm font-semibold text-white">Your ${audit.totalMonthlySavings.toFixed(0)}/mo savings can grow upto:</p>
              <p className="text-3xl font-bold text-white">${(audit.totalMonthlySavings * 1.4).toFixed(0)}/mo</p>
              <p className="text-xs text-white/80">With Credex discounted AI credits</p>
            </div>

            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('credex_cta_clicked', audit.id)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#7c3aed] transition-all hover:bg-white/90 hover:scale-[1.02]"
            >
              Get Discounted Credits <TrendingUp className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}

      {/* Email Capture */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-6 shadow-sm">
        <div className="mb-6 flex items-start justify-between">
          <div>
            {hasLowSavings || isOptimal ? (
              <>
                <h2 className="text-lg font-bold text-[#0A0A0A] tracking-tight">Stay Optimized</h2>
                <p className="text-xs text-[#6b7280]">
                  {hasLowSavings
                    ? "You are spending well! We&apos;ll notify you when new optimizations apply."
                    : "Your stack is optimal. We'll alert you to new opportunities."
                  }
                </p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-[#0A0A0A] tracking-tight">Get This Report</h2>
                <p className="text-xs text-[#6b7280]">We will email you a copy of this audit.</p>
                <p className="text-xs text-[#6b7280]">A Credex advisor will review your audit and reach out to you.</p>

              </>
            )}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dcfce7] text-[#16a34a]">
            {hasLowSavings || isOptimal ? <Bell className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
          </div>
        </div>

        <EmailCapture
          auditId={audit.id}
          showCredex={audit.showCredex}
          isOptimal={audit.isOptimal}
        />

        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-medium text-[#9ca3af]">
          <ShieldCheck className="h-3 w-3" />
          Your data is secure and never stored without permission.
        </div>
      </div>

      {/* Standard CredEx for non-high savings */}
      {!hasHighSavings && !hasLowSavings && (
        <div className="rounded-2xl border border-[#e5e7eb] bg-gradient-to-br from-[#f8f4ff] to-[#f0e6ff] p-6 shadow-sm">
          <div className="mb-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#7c3aed] text-white">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0A0A0A]">Unlock Bigger Savings with Credex</h3>
                <p className="text-xs text-[#6b7280]">Get discounted AI credits from enterprise companies</p>
              </div>
            </div>
          </div>

          <div className="mb-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#7c3aed]/20 text-[#7c3aed]">
                <DollarSign className="h-3 w-3" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0A0A0A]">Save 40-60% on AI credits</p>
                <p className="text-xs text-[#6b7280]">Buy excess credits from companies that overestimated their needs</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#7c3aed]/20 text-[#7c3aed]">
                <Users className="h-3 w-3" />
              </div>
              <div>
                <p className="text-xs text-[#6b7280]">Enterprise-grade security and instant delivery</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#7c3aed]/20 bg-white/50 p-4">
            <p className="mb-3 text-xs font-bold text-[#7c3aed]">Your team qualifies for:</p>
            <p className="mb-4 text-2xl font-bold text-[#0A0A0A]">Up to <span className="text-[#7c3aed]">${(audit.totalMonthlySavings * 0.5).toFixed(0)}</span>/mo savings</p>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('credex_cta_clicked', audit.id)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7c3aed] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6d28d9]"
            >
              Get Discounted Credits <TrendingUp className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
