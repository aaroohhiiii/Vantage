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
  "w-full rounded-xl px-3.5 py-2.5 text-sm text-[#0A0A0A] placeholder-[#9CA3AF] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#00C853]/40"

const inputStyle = {
  background: "#FFFFFF",
  border: "1px solid #E5E7EB",
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
          className="text-xl font-bold text-[#0A0A0A]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          How much do you spend on each?
        </h2>
        <p className="mt-1 text-sm text-[#4B5563]">
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
          const officialMonthlySpend = getOfficialPrice(tool, input.plan, input.seats)
          const selectedPlan = pricing?.plans.find(
            (p) => p.planName.toLowerCase() === (input.plan || "").toLowerCase(),
          )

          const isOverpaying = officialMonthlySpend > 0 && input.monthlySpend > officialMonthlySpend * 1.15
          const isUnderList =
            officialMonthlySpend > 0 && input.monthlySpend > 0 && input.monthlySpend <= officialMonthlySpend * 1.05

          return (
            <motion.div
              key={tool}
              variants={cardVariants}
              className="rounded-2xl p-5"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
              }}
            >
              {/* Tool header */}
              <div className="mb-4 flex items-center gap-3">
                <ToolIcon tool={tool} size={32} />
                <div>
                  <p className="text-sm font-semibold text-[#0A0A0A]">{TOOL_DISPLAY_NAMES[tool]}</p>
                  {selectedPlan && officialMonthlySpend > 0 && (
                    <p className="text-xs" style={{ color: "#4B5563" }}>
                      List: ${officialMonthlySpend}{selectedPlan.isPerUser ? "/user" : ""}/mo
                    </p>
                  )}
                </div>

                {isOverpaying && (
                  <div
                    className="ml-auto rounded-full px-2.5 py-1 text-[11px] font-medium"
                    style={{ background: "#FFFBEB", color: "#F59E0B", border: "1px solid #FCD34D" }}
                  >
                    ⚠ Overpaying
                  </div>
                )}
                {isUnderList && !isOverpaying && (
                  <div
                    className="ml-auto rounded-full px-2.5 py-1 text-[11px] font-medium"
                    style={{ background: "#F0FDF4", color: "#00C853", border: "1px solid #BBF7D0" }}
                  >
                    ✓ At list price
                  </div>
                )}
              </div>

              {/* Inputs row */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Plan selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#4B5563]" htmlFor={`${tool}-plan`}>
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
                  <label className="text-xs font-medium text-[#4B5563]" htmlFor={`${tool}-spend`}>
                    Monthly spend
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#4B5563]">
                      $
                    </span>
                    <input
                      id={`${tool}-spend`}
                      type="number"
                      min={0}
                      value={input.monthlySpend}
                      onChange={(e) =>
                        onToolInputChange(tool, {
                          monthlySpend: Number(e.target.value),
                        })
                      }
                      className={inputClass}
                      style={{ ...inputStyle, paddingLeft: "1.75rem" }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-[#64748B]">
                    {input.monthlySpend === officialMonthlySpend && officialMonthlySpend > 0
                      ? "Auto-filled from official pricing"
                      : "Custom spend entered"}
                  </p>
                </div>

                {/* Seats */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#4B5563]" htmlFor={`${tool}-seats`}>
                    Seats / users
                  </label>
                  <input
                    id={`${tool}-seats`}
                    type="number"
                    min={1}
                    value={input.seats || ""}
                    placeholder="e.g. 5 users"
                    onChange={(e) =>
                      onToolInputChange(tool, {
                        seats: Number(e.target.value) || 0,
                      })
                    }
                    onBlur={(e) =>
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
                <p className="mt-3 text-[11px]" style={{ color: "#4B5563" }}>
                  Pricing verified{" "}
                  <a
                    href={selectedPlan.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 transition-colors hover:text-[#00C853]"
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
          background: "#F8F9FA",
          border: "1px solid #E5E7EB",
        }}
      >
        <div>
          <p className="text-xs font-medium text-[#4B5563]">Total monthly spend</p>
          <p
            className="text-2xl font-bold text-[#0A0A0A]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            ${totalSpend.toFixed(2)}
            <span className="text-sm font-normal text-[#4B5563]">/mo</span>
          </p>
        </div>
        {totalSpend > 0 && (
          <div className="text-right">
            <p className="text-xs text-[#4B5563]">Annual run rate</p>
            <p className="text-lg font-semibold text-[#00C853]">
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
          className="rounded-xl border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-medium text-[#4B5563] hover:bg-[#F8F9FA]"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-xl bg-[#00C853] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#00A846]"
        >
          Next: Team context →
        </button>
      </div>
    </section>
  )
}