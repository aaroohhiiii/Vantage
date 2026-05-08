"use client"

import { motion } from "framer-motion"
import { ToolIcon, TOOL_DISPLAY_NAMES } from "@/components/ui/ToolIcon"
import { getOfficialPrice, getToolPricing } from "@/lib/pricingData"
import type { ToolInput, ToolName } from "@/lib/types"

type SpendDetailsProps = {
  selectedTools: ToolName[]
  toolInputs: Record<ToolName, ToolInput>
  onToolInputChange: (tool: ToolName, next: Partial<ToolInput>) => void
  onBack: () => void
  onNext: () => void
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
}

const inputClass =
  "w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#475569] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#4F8CFF]/60"

const inputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
}

export function SpendDetails({
  selectedTools,
  toolInputs,
  onToolInputChange,
  onBack,
  onNext,
}: SpendDetailsProps) {
  const totalSpend = selectedTools.reduce(
    (sum, tool) => sum + (toolInputs[tool]?.monthlySpend ?? 0),
    0,
  )

  return (
    <section className="space-y-5" aria-labelledby="spend-details-title">
      {/* Header */}
      <div>
        <h2
          id="spend-details-title"
          className="text-xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          How much do you spend on each?
        </h2>
        <p className="mt-1 text-sm text-[#64748B]">
          Enter your current plan and monthly cost. We&apos;ll compare against official pricing.
        </p>
      </div>

      {/* Tool cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {selectedTools.map((tool) => {
          const pricing = getToolPricing(tool)
          const input = toolInputs[tool] || { tool, plan: "", monthlySpend: 0, seats: 1 }
          const listPrice = getOfficialPrice(tool, input.plan, input.seats)
          const selectedPlan = pricing?.plans.find(
            (p) => p.planName.toLowerCase() === (input.plan || "").toLowerCase(),
          )

          const isOverpaying = listPrice > 0 && input.monthlySpend > listPrice * 1.15
          const isUnderList = listPrice > 0 && input.monthlySpend > 0 && input.monthlySpend <= listPrice * 1.05

          return (
            <motion.div
              key={tool}
              variants={cardVariants}
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Tool header */}
              <div className="mb-4 flex items-center gap-3">
                <ToolIcon tool={tool} size={32} />
                <div>
                  <p className="text-sm font-semibold text-white">{TOOL_DISPLAY_NAMES[tool]}</p>
                  {selectedPlan && listPrice > 0 && (
                    <p className="text-xs" style={{ color: "#475569" }}>
                      List: ${listPrice}{selectedPlan.isPerUser ? "/user" : ""}/mo
                    </p>
                  )}
                </div>

                {isOverpaying && (
                  <div
                    className="ml-auto rounded-full px-2.5 py-1 text-[11px] font-medium"
                    style={{ background: "rgba(245,158,11,0.12)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.2)" }}
                  >
                    ⚠ Overpaying
                  </div>
                )}
                {isUnderList && !isOverpaying && (
                  <div
                    className="ml-auto rounded-full px-2.5 py-1 text-[11px] font-medium"
                    style={{ background: "rgba(52,211,153,0.1)", color: "#34D399", border: "1px solid rgba(52,211,153,0.2)" }}
                  >
                    ✓ At list price
                  </div>
                )}
              </div>

              {/* Inputs row */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Plan selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#64748B]" htmlFor={`${tool}-plan`}>
                    Plan
                  </label>
                  <select
                    id={`${tool}-plan`}
                    value={input.plan ?? ""}
                    onChange={(e) => {
                      onToolInputChange(tool, { plan: e.target.value })
                    }}
                    className={inputClass}
                    style={inputStyle}
                  >
                    <option value="">Select a plan</option>
                    {pricing?.plans && pricing.plans.length > 0 ? (
                      pricing.plans.map((plan) => (
                        <option key={plan.planName} value={plan.planName}>
                          {plan.planName}
                        </option>
                      ))
                    ) : (
                      <option disabled>No plans available</option>
                    )}
                  </select>
                </div>

                {/* Monthly spend */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#64748B]" htmlFor={`${tool}-spend`}>
                    Monthly spend
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#475569]">
                      $
                    </span>
                    <input
                      id={`${tool}-spend`}
                      type="number"
                      min={0}
                      placeholder="0"
                      value={input.monthlySpend || ""}
                      onChange={(e) =>
                        onToolInputChange(tool, { monthlySpend: Number(e.target.value) || 0 })
                      }
                      className={inputClass}
                      style={{ ...inputStyle, paddingLeft: "1.75rem" }}
                    />
                  </div>
                </div>

                {/* Seats */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#64748B]" htmlFor={`${tool}-seats`}>
                    Seats / users
                  </label>
                  <input
                    id={`${tool}-seats`}
                    type="number"
                    min={1}
                    value={input.seats}
                    onChange={(e) =>
                      onToolInputChange(tool, {
                        seats: Math.max(1, Number(e.target.value) || 1),
                      })
                    }
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Source link */}
              {selectedPlan && (
                <p className="mt-3 text-[11px]" style={{ color: "#334155" }}>
                  Pricing verified{" "}
                  <a
                    href={selectedPlan.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#4F8CFF] transition-colors underline underline-offset-2"
                  >
                    {new URL(selectedPlan.sourceUrl).hostname}
                  </a>
                </p>
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Total spend bar */}
      <div
        className="flex items-center justify-between rounded-2xl px-5 py-4"
        style={{
          background: "rgba(79,140,255,0.06)",
          border: "1px solid rgba(79,140,255,0.15)",
        }}
      >
        <div>
          <p className="text-xs font-medium text-[#64748B]">Total monthly spend</p>
          <p
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            ${totalSpend.toFixed(2)}
            <span className="text-sm font-normal text-[#475569]">/mo</span>
          </p>
        </div>
        {totalSpend > 0 && (
          <div className="text-right">
            <p className="text-xs text-[#64748B]">Annual run rate</p>
            <p className="text-lg font-semibold text-[#76A9FF]">
              ${(totalSpend * 12).toFixed(0)}/yr
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-1">
        <button
          type="button"
          onClick={onBack}
          className="btn-ghost rounded-xl px-5 py-2.5 text-sm font-medium text-white/70"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="btn-primary rounded-xl px-6 py-2.5 text-sm font-semibold text-white"
        >
          Next: Team context →
        </button>
      </div>
    </section>
  )
}