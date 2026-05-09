import type { Metadata } from "next"
import Link from "next/link"
import { Tag, Check, X, Heart, PiggyBank, Sparkles, Mail } from "lucide-react"

import { getAuditById } from "@/lib/supabase"
import { ToolIcon, TOOL_DISPLAY_NAMES } from "@/components/ui/ToolIcon"
import { EmailCapture, ShareButton } from "@/components/AuditResults/ResultsClient"

type PageProps = {
  params: Promise<{ id: string }>
}

/* ─── Metadata ─── */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const audit = await getAuditById(id)

  if (!audit) {
    return { title: "Audit Not Found — Prune" }
  }

  const savings = audit.totalMonthlySavings
  const title =
    savings > 0
      ? `I found $${savings.toFixed(0)}/mo in AI tool savings`
      : "My AI tool spend is optimized"

  return {
    title: `AI Spend Audit — ${title}`,
    description:
      "Free AI spend audit powered by Credex. See where your team is overspending on AI tools.",
    openGraph: {
      title,
      description: "Run your free AI spend audit at Prune",
      images: [
        {
          url: `/api/og?savings=${savings.toFixed(0)}&tools=${audit.input.tools.length}`,
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: "Free AI spend audit — see where you’re overspending",
      images: [
        `/api/og?savings=${savings.toFixed(0)}&tools=${audit.input.tools.length}`,
      ],
    },
  }
}

/* ─── Page component ─── */
export default async function AuditPage({ params }: PageProps) {
  const { id } = await params
  const audit = await getAuditById(id)

  if (!audit) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f9fafb] px-6">
        <div className="max-w-md text-center">
          <div className="mb-4 text-5xl">🔍</div>
          <h1 className="mb-2 text-2xl font-bold text-[#0A0A0A]">
            Audit not found
          </h1>
          <p className="mb-6 text-[#4B5563]">
            This audit doesn&apos;t exist or has expired.
          </p>
          <Link
            href="/"
            className="inline-block rounded-xl bg-[#00C853] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#00A846]"
          >
            Run a New Audit →
          </Link>
        </div>
      </main>
    )
  }

  const hasSavings = audit.totalMonthlySavings > 0
  const totalSpend = audit.input.tools.reduce((acc, t) => acc + Math.max(0, t.monthlySpend), 0)

  return (
    <main className="min-h-screen bg-[#f9fafb] px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        {/* ── Navbar ── */}
        <header className="flex items-center justify-between border-b border-[#f3f4f6] px-6 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-bold"
              style={{ background: "#00C853" }}
            >
              P
            </div>
            <span className="text-base font-bold text-[#0A0A0A]">Prune</span>
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#4B5563] shadow-sm transition-colors hover:bg-[#F8F9FA]"
          >
            ← New Audit
          </Link>
        </header>

        <div className="p-6 sm:p-8">
          {/* ════════════════════════════════════
              HERO SECTION
          ════════════════════════════════════ */}
          <section className="mb-8 overflow-hidden rounded-[20px] bg-[#032e21] text-white">
            <div className="grid grid-cols-1 items-center gap-10 p-8 sm:p-10 lg:grid-cols-[1fr_auto_1.2fr]">
              {/* Left: Savings */}
              <div>
                <p className="mb-3 text-sm font-medium text-white/90">Your estimated savings</p>
                {hasSavings ? (
                  <>
                    <h1 className="mb-1 text-6xl font-bold tracking-tight text-[#00C853] sm:text-[80px]">
                      ${audit.totalMonthlySavings.toFixed(0)}
                      <span className="text-3xl font-medium text-white sm:text-4xl">/mo</span>
                    </h1>
                    <p className="mb-6 mt-2 text-base text-white/90">
                      ${audit.totalAnnualSavings.toFixed(0)}/year across {audit.input.tools.length} tools
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className="mb-1 text-4xl font-bold tracking-tight text-white sm:text-6xl">
                      Stack optimized.
                    </h1>
                    <p className="mb-6 mt-2 text-base text-white/90">
                      You&apos;re spending efficiently across {audit.input.tools.length} AI tools.
                    </p>
                  </>
                )}
                <ShareButton url={`https://prune.vercel.app/audit/${id}`} label="Share results" variant="dark" />
              </div>

              {/* Center: Glowing Circle */}
              <div className="relative mx-auto flex h-36 w-36 shrink-0 items-center justify-center rounded-full bg-[#00C853] shadow-[0_0_60px_rgba(0,200,83,0.3)] sm:h-44 sm:w-44 lg:mx-6">
                {/* Decorative concentric rings */}
                <div className="absolute inset-[-15%] rounded-full border border-[#00C853]/40" />
                <div className="absolute inset-[-30%] rounded-full border border-[#00C853]/20" />
                <div className="absolute inset-[-45%] rounded-full border border-[#00C853]/10" />
                {hasSavings ? (
                  <Tag className="h-16 w-16 -rotate-45 text-white sm:h-20 sm:w-20" />
                ) : (
                  <Check className="h-16 w-16 text-white sm:h-20 sm:w-20" />
                )}
              </div>

              {/* Right: AI Summary */}
              <div className="rounded-xl border border-white/10 bg-[#053d2c]/60 p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
                  <Sparkles className="h-4 w-4 text-[#F59E0B]" />
                  Your personalized summary
                </h3>
                <p className="mb-5 text-sm leading-relaxed text-white/80">
                  You&apos;re spending <span className="font-bold text-white">${totalSpend.toFixed(2)}/mo</span> across {audit.input.tools.length} AI tools.
                  {hasSavings ? (
                    <> We found <span className="font-bold text-white">${audit.totalMonthlySavings.toFixed(2)}/mo</span> in potential savings.</>
                  ) : (
                    <> Your current stack is well-matched to your needs.</>
                  )}
                </p>
                <div className="my-5 h-px w-full bg-white/10" />
                <p className="mb-2 text-sm font-bold text-white">Top recommendation</p>
                <p className="text-sm leading-relaxed text-white/80">
                  {audit.aiSummary || "Review your current plans to ensure they align with your team size and use cases."}
                </p>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════
              BODY GRID
          ════════════════════════════════════ */}
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.6fr_1fr]">
            {/* Left Column: Tool Breakdown */}
            <section>
              <h2 className="mb-5 text-lg font-bold text-[#0A0A0A]">Tool breakdown</h2>
              <div className="space-y-4">
                {audit.results.map((result) => {
                  const isKeep = result.recommendedAction === "keep"
                  const borderColorClass = isKeep ? "border-l-[#00C853]" : "border-l-[#ef4444]"
                  const actionTextColorClass = isKeep ? "text-[#00C853]" : "text-[#ef4444]"
                  const ActionIcon = isKeep ? Check : X
                  
                  let actionText = "Keep"
                  if (result.recommendedAction === "cancel-redundant") actionText = "Consider removing"
                  if (result.recommendedAction === "switch") actionText = "Consider switching"
                  if (result.recommendedAction === "downgrade") actionText = "Consider downgrading"

                  return (
                    <div
                      key={result.tool}
                      className={`overflow-hidden rounded-xl border border-[#e5e7eb] border-l-4 bg-white shadow-sm ${borderColorClass}`}
                    >
                      <div className="p-5 sm:p-6">
                        {/* Top Row: Icon + Name + Price */}
                        <div className="mb-4 flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <ToolIcon tool={result.tool} size={36} />
                            <div>
                              <p className="text-base font-bold text-[#0A0A0A]">
                                {TOOL_DISPLAY_NAMES[result.tool]}
                                <span className="ml-2 text-xs font-normal text-[#9ca3af]">
                                  {result.currentPlan}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-base font-bold text-[#0A0A0A]">
                              ${result.currentSpend.toFixed(0)}/mo
                            </p>
                            <p className={`mt-0.5 text-[11px] font-bold ${actionTextColorClass}`}>
                              {actionText}
                            </p>
                          </div>
                        </div>

                        {/* Middle Row: Recommendation Text */}
                        <div className="mb-5 flex items-start gap-2.5">
                          <ActionIcon className={`mt-[3px] h-4 w-4 shrink-0 stroke-[3] ${actionTextColorClass}`} />
                          <div className="flex-1">
                            <p className="text-sm font-bold text-[#111827]">
                              {isKeep ? "No action needed" : "Recommendation"}
                            </p>
                            <p className="mt-1 text-sm text-[#4b5563]">
                              {isKeep ? "Plan and pricing are appropriate for your team size and use case." : result.reason}
                            </p>
                            {!isKeep && result.monthlySavings > 0 && (
                              <p className="mt-2 text-sm font-bold text-[#00C853]">
                                You save: ${result.monthlySavings.toFixed(0)}/mo • ${result.annualSavings.toFixed(0)}/yr
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Bottom Row: Credex Pill */}
                        {result.credexOpportunity && (
                          <div className="inline-flex w-full items-center gap-2 rounded-lg bg-[#f5f3ff] px-4 py-2.5">
                            <Heart className="h-4 w-4 shrink-0 fill-[#7c3aed] text-[#7c3aed]" />
                            <span className="text-xs font-bold text-[#7c3aed]">
                              Available via Credex at a discount
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Right Column: Sidebar */}
            <div className="space-y-6">
              {/* Savings Summary Card */}
              <section className="rounded-[20px] border border-[#e5e7eb] bg-[#fafafa] p-6 shadow-sm">
                <h3 className="mb-5 text-sm font-bold text-[#0A0A0A]">Savings summary</h3>
                
                <div className="mb-5 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[#4b5563]">Current spend</span>
                    <span className="font-bold text-[#111827]">${totalSpend.toFixed(2)}/mo</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[#4b5563]">Potential savings</span>
                    <span className="font-bold text-[#111827]">${audit.totalMonthlySavings.toFixed(2)}/mo</span>
                  </div>
                </div>

                <div className="my-5 h-px w-full bg-[#e5e7eb]" />

                <div className="mb-6">
                  <p className="mb-2 text-sm font-medium text-[#4b5563]">Your savings</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-[#00C853]">${audit.totalMonthlySavings.toFixed(2)}</span>
                    <span className="text-xl font-bold text-[#00C853]">/mo</span>
                  </div>
                  {hasSavings && (
                    <div className="mt-3 inline-block rounded-md bg-[#dcfce7] px-2.5 py-1 text-xs font-bold text-[#16a34a]">
                      ${audit.totalAnnualSavings.toFixed(0)}/year
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-[#e5e7eb] bg-white p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                    <PiggyBank className="h-10 w-10 text-[#00C853]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111827]">Nice work!</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[#4b5563]">
                      You&apos;re on track to save money without sacrificing productivity.
                    </p>
                  </div>
                </div>
              </section>

              {/* Credex Promo Card */}
              {audit.showCredex && (
                <section className="relative overflow-hidden rounded-[20px] border border-[#e5e7eb] bg-[#f5f3ff] p-6 shadow-sm">
                  {/* Decorative background shapes mimicking chart/percentages */}
                  <div className="absolute -bottom-2 right-2 flex items-end gap-1 opacity-80">
                    <div className="h-16 w-8 rounded-t-sm bg-[#c4b5fd]" />
                    <div className="h-24 w-8 rounded-t-sm bg-[#a78bfa]" />
                    <div className="h-10 w-8 rounded-t-sm bg-[#ddd6fe]" />
                  </div>
                  <div className="absolute right-4 top-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#00C853] shadow-md">
                    <span className="text-lg font-bold text-white">%</span>
                  </div>

                  <div className="relative z-10 w-[75%]">
                    <h3 className="mb-2 text-base font-bold text-[#111827]">Unlock larger savings with Credex</h3>
                    <p className="mb-5 text-xs leading-relaxed text-[#4b5563]">
                      You&apos;re spending enough on AI tools to qualify for wholesale discounts. Credex sells excess AI credits from enterprise companies that overestimated their needs.
                    </p>
                    <a
                      href="https://credex.rocks"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-[#111827] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-black"
                    >
                      <Heart className="h-3 w-3 fill-white" />
                      Get Discounted Credits →
                    </a>
                  </div>
                </section>
              )}

              {/* Email Capture Card */}
              <section className="relative overflow-hidden rounded-[20px] border border-[#e5e7eb] bg-[#f9fafb] p-6 shadow-sm">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="mb-2 text-sm font-bold text-[#111827]">Get this report in your inbox</h3>
                    <p className="text-xs text-[#4b5563]">
                      A Credex advisor will review your audit personally and reach out within 48 hours.
                    </p>
                  </div>
                  <div className="shrink-0 rounded-xl bg-[#dcfce7] p-2">
                    <Mail className="h-6 w-6 text-[#16a34a]" />
                  </div>
                </div>
                <EmailCapture
                  auditId={id}
                  showCredex={audit.showCredex}
                  isOptimal={audit.isOptimal}
                />
              </section>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="mt-8 border-t border-[#f3f4f6] px-8 py-6 text-center">
          <p className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[#9ca3af]">
            <span className="flex items-center gap-1.5"><span className="text-sm">🔒</span> Private and secure</span>
            <span className="hidden sm:inline">·</span>
            <span>Recommendations are based on tool usage and pricing data</span>
            <span className="hidden sm:inline">·</span>
            <span>Identifying details are never shown in shared links.</span>
          </p>
        </footer>
      </div>
    </main>
  )
}
