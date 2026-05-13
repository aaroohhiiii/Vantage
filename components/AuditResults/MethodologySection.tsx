"use client"

import type { AuditResult } from "@/lib/types"
import { EmailCapture } from "./ResultsClient"
import { Mail, TrendingUp, DollarSign, Users, Bell } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

type Props = { audit: AuditResult }

export function MethodologySection({ audit }: Props) {
  const hasHighSavings = audit.totalMonthlySavings >= 500
  const hasLowSavings = audit.totalMonthlySavings < 100
  const isOptimal = audit.isOptimal

  return (
    <div className="flex flex-col gap-8">
      {/* Prominent Credex for High Savings */}
      {hasHighSavings && (
        <div className="rounded-[32px] border border-[#111] bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] p-8 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/10">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">Capture More Savings</h3>
                <p className="text-sm text-white/90">You are leaving ${(audit.totalMonthlySavings * 0.4).toFixed(0)}/mo on the table</p>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-white/10 backdrop-blur-md p-6 border border-white/10">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/60">Current Waste Potential</p>
                <p className="text-4xl font-black text-white">${audit.totalMonthlySavings.toFixed(0)}<span className="text-sm font-medium opacity-60 ml-1">/mo</span></p>
              </div>
              <div className="rounded-2xl bg-[#00C853]/20 backdrop-blur-md p-6 border border-[#00C853]/30">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/60">Potential Savings with Credex</p>
                <p className="text-4xl font-black text-white">${(audit.totalMonthlySavings * 1.4).toFixed(0)}<span className="text-sm font-medium opacity-60 ml-1">/mo</span></p>
              </div>
            </div>

            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('credex_cta_clicked', audit.id)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-[#7c3aed] transition-all hover:bg-white/90 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-black/10"
            >
              Get Discounted Credits <TrendingUp className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}

      {/* Email Capture */}
      <div className="rounded-[32px] border border-[#111] bg-[#1936F0D] p-8 shadow-xl relative overflow-hidden group">
        {/* Subtle decorative element */}
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-[#00C853]/10 blur-3xl group-hover:bg-[#00C853]/20 transition-all duration-500" />

        <div className="relative z-10">
          <div className="mb-8 flex items-start justify-between">
            <div className="max-w-[70%]">
              {hasLowSavings || isOptimal ? (
                <>
                  <h2 className="text-2xl font-bold text-black tracking-tight leading-tight">Stay Optimized</h2>
                  <p className="mt-2 text-sm text-black/60 font-medium">
                    {hasLowSavings
                      ? "You are spending well! We will notify you as soon as new AI price drops or optimizations apply to your stack."
                      : "Your stack is world-class. We will alert you to new opportunities to keep your edge."
                    }
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-black tracking-tight leading-tight">Lock in Your ${audit.totalMonthlySavings.toFixed(0)}/mo Savings</h2>
                  <p className="mt-2 text-sm text-black/60 font-medium leading-relaxed">
                    We will email you a professional copy of this audit. A Credex advisor will review your specific stack to find even deeper discounts.
                  </p>
                </>
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/10 text-[#00C853] backdrop-blur-sm border border-black/5">
              {hasLowSavings || isOptimal ? <Bell className="h-6 w-6" /> : <Mail className="h-6 w-6" />}
            </div>
          </div>

          <div className="space-y-6">
            <EmailCapture
              auditId={audit.id}
              showCredex={audit.showCredex}
              isOptimal={audit.isOptimal}
              variant="light"
            />
          </div>
        </div>
      </div>

      {/* Standard CredEx for non-high savings */}
      {!hasHighSavings && !hasLowSavings && (
        <div className="rounded-[32px] border border-[#111] bg-white p-8 shadow-xl relative overflow-hidden">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7c3aed] text-white shadow-lg shadow-[#7c3aed]/20">
              <TrendingUp className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#111] tracking-tight leading-tight">Unlock Bigger Savings with Credex</h3>
              <p className="text-sm text-[#666] font-medium">Get discounted AI credits from enterprise companies</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#7c3aed]/10 text-[#7c3aed]">
                  <DollarSign className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#111]">Save 40-60% on AI credits</p>
                  <p className="text-xs text-[#666] font-medium mt-1 leading-relaxed">Buy excess credits from companies that overestimated their needs</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#7c3aed]/10 text-[#7c3aed]">
                  <Users className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#111]">Enterprise-Grade Security</p>
                  <p className="text-xs text-[#666] font-medium mt-1 leading-relaxed">Secure, instant delivery with full governance compliance.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#7c3aed]/10 bg-[#7c3aed]/5 p-6 flex flex-col justify-center">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#7c3aed]">Your team qualifies for:</p>
              <p className="mb-4 text-3xl font-black text-[#111]">Up to <span className="text-[#7c3aed]">${((audit.totalMonthlySavings || 0) * 0.5).toFixed(0)}</span>/mo savings</p>
              <a
                href="https://credex.rocks"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('credex_cta_clicked', audit.id)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7c3aed] px-6 py-4 text-sm font-bold text-white transition-all hover:bg-[#6d28d9] hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-[#7c3aed]/20"
              >
                Claim Credits <TrendingUp className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
