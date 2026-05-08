"use client"

import { motion } from "framer-motion"
import type { FormState, UseCase } from "@/lib/types"

const TEAM_SIZE_OPTIONS = [
  { label: "Solo", description: "Just me", value: 1, icon: "🧑‍💻" },
  { label: "Small", description: "2–10 people", value: 5, icon: "👥" },
  { label: "Mid-size", description: "11–50 people", value: 25, icon: "🏢" },
  { label: "Enterprise", description: "50+ people", value: 100, icon: "🏗️" },
] as const

const USE_CASE_OPTIONS: { value: UseCase; label: string; icon: string; desc: string }[] = [
  { value: "coding", label: "Coding", icon: "💻", desc: "Dev tools & code gen" },
  { value: "writing", label: "Writing", icon: "✍️", desc: "Docs, emails, content" },
  { value: "data", label: "Data", icon: "📊", desc: "Analysis & reporting" },
  { value: "research", label: "Research", icon: "🔍", desc: "Knowledge & synthesis" },
  { value: "mixed", label: "Mixed", icon: "🔀", desc: "Multiple use cases" },
]

type TeamInfoProps = {
  state: FormState
  isSubmitting: boolean
  onBack: () => void
  onTeamSizeChange: (teamSize: number) => void
  onUseCaseChange: (useCase: UseCase) => void
  onSubmit: () => Promise<void>
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
}

/** Match team size option to the current teamSize value */
function getActiveTeamOption(teamSize: number) {
  if (teamSize <= 1) return 1
  if (teamSize <= 10) return 5
  if (teamSize <= 50) return 25
  return 100
}

export function TeamInfo({
  state,
  isSubmitting,
  onBack,
  onTeamSizeChange,
  onUseCaseChange,
  onSubmit,
}: TeamInfoProps) {
  const activeTeamValue = getActiveTeamOption(state.teamSize)

  return (
    <section className="space-y-6" aria-labelledby="team-info-title">
      {/* Header */}
      <div>
        <h2
          id="team-info-title"
          className="text-xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Tell us about your team
        </h2>
        <p className="mt-1 text-sm text-[#64748B]">
          This helps us tailor recommendations to your context.
        </p>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        {/* Team size cards */}
        <motion.fieldset variants={itemVariants} className="space-y-3">
          <legend className="text-sm font-semibold text-white/80">Team size</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TEAM_SIZE_OPTIONS.map((option) => {
              const isActive = activeTeamValue === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onTeamSizeChange(option.value)}
                  className="group relative rounded-2xl p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F8CFF]"
                  style={
                    isActive
                      ? {
                          background: "rgba(79,140,255,0.1)",
                          border: "1px solid rgba(79,140,255,0.35)",
                          boxShadow: "0 0 20px rgba(79,140,255,0.1)",
                        }
                      : {
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.07)",
                        }
                  }
                >
                  <div className="mb-2 text-xl">{option.icon}</div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.7)" }}
                  >
                    {option.label}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: isActive ? "#76A9FF" : "#475569" }}
                  >
                    {option.description}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Custom numeric input for exact team size */}
          <div className="flex items-center gap-3">
            <label htmlFor="team-size-exact" className="text-xs text-[#475569] whitespace-nowrap">
              Exact count:
            </label>
            <input
              id="team-size-exact"
              type="number"
              min={1}
              value={state.teamSize}
              onChange={(e) => onTeamSizeChange(Math.max(1, Number(e.target.value) || 1))}
              className="w-24 rounded-xl px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#4F8CFF]/60 transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
            <span className="text-xs text-[#334155]">people</span>
          </div>
        </motion.fieldset>

        {/* Use case pills */}
        <motion.fieldset variants={itemVariants} className="space-y-3">
          <legend className="text-sm font-semibold text-white/80">Primary use case</legend>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
            {USE_CASE_OPTIONS.map((option) => {
              const isActive = state.useCase === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onUseCaseChange(option.value)}
                  className="group rounded-xl p-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F8CFF]"
                  style={
                    isActive
                      ? {
                          background: "rgba(139,92,246,0.12)",
                          border: "1px solid rgba(139,92,246,0.35)",
                          boxShadow: "0 0 16px rgba(139,92,246,0.1)",
                        }
                      : {
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.07)",
                        }
                  }
                >
                  <div className="mb-1.5 text-lg">{option.icon}</div>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.7)" }}
                  >
                    {option.label}
                  </p>
                  <p className="text-[10px] leading-tight" style={{ color: isActive ? "#C4B5FD" : "#334155" }}>
                    {option.desc}
                  </p>
                </button>
              )
            })}
          </div>
        </motion.fieldset>

        {/* Summary review */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl px-5 py-4"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#475569]">
            Audit summary
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-[#475569]">Tools</p>
              <p className="text-base font-semibold text-white">{state.selectedTools.length}</p>
            </div>
            <div>
              <p className="text-xs text-[#475569]">Team size</p>
              <p className="text-base font-semibold text-white">{state.teamSize}</p>
            </div>
            <div>
              <p className="text-xs text-[#475569]">Use case</p>
              <p className="text-base font-semibold capitalize text-white">{state.useCase}</p>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div variants={itemVariants} className="flex justify-between pt-1">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="btn-ghost rounded-xl px-5 py-2.5 text-sm font-medium text-white/70 disabled:opacity-40"
          >
            ← Back
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="btn-primary relative rounded-2xl px-8 py-3 text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed"
            id="submit-audit-btn"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2.5">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Running audit…
              </span>
            ) : (
              "Run My Audit →"
            )}
          </button>
        </motion.div>
      </motion.div>
    </section>
  )
}
