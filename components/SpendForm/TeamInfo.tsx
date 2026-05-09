"use client"

import { motion } from "framer-motion"
import {
  Building,
  Building2,
  ChartColumn,
  Code2,
  GitMerge,
  PenSquare,
  Search,
  UserRound,
  Users,
} from "lucide-react"
import type { FormState, UseCase } from "@/lib/types"

const TEAM_SIZE_OPTIONS = [
  { label: "Solo", description: "Just me", value: 1, icon: UserRound },
  { label: "Small", description: "2–10 people", value: 5, icon: Users },
  { label: "Mid-size", description: "11–50 people", value: 25, icon: Building2 },
  { label: "Enterprise", description: "50+ people", value: 100, icon: Building },
] as const

const USE_CASE_OPTIONS: { value: UseCase; label: string; icon: typeof Code2; desc: string }[] = [
  { value: "coding", label: "Coding", icon: Code2, desc: "Dev tools & code gen" },
  { value: "writing", label: "Writing", icon: PenSquare, desc: "Docs, emails, content" },
  { value: "data", label: "Data", icon: ChartColumn, desc: "Analysis & reporting" },
  { value: "research", label: "Research", icon: Search, desc: "Knowledge & synthesis" },
  { value: "mixed", label: "Mixed", icon: GitMerge, desc: "Multiple use cases" },
]

type TeamInfoProps = {
  state: FormState
  isSubmitting: boolean
  error?: string | null
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
  error,
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
          className="text-xl font-bold text-[#0A0A0A]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Tell us about your team
        </h2>
        <p className="mt-1 text-sm text-[#4B5563]">
          This helps us tailor recommendations to your context.
        </p>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        {/* Team size cards */}
        <motion.fieldset variants={itemVariants} className="space-y-3">
          <legend className="text-sm font-semibold text-[#0A0A0A]">Team size</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TEAM_SIZE_OPTIONS.map((option) => {
              const isActive = activeTeamValue === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isActive}
                  disabled={isSubmitting}
                  onClick={() => onTeamSizeChange(option.value)}
                  className="group relative rounded-2xl p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00C853] disabled:opacity-50"
                  style={
                    isActive
                      ? {
                          background: "#F0FDF4",
                          border: "1px solid #00C853",
                          boxShadow: "0 0 20px rgba(0,200,83,0.12)",
                        }
                      : {
                          background: "#FFFFFF",
                          border: "1px solid #E5E7EB",
                        }
                  }
                >
                  <div className="mb-2 text-[#00C853]">
                    <option.icon className="h-5 w-5" />
                  </div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#0A0A0A" }}
                  >
                    {option.label}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "#4B5563" }}
                  >
                    {option.description}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Custom numeric input for exact team size */}
          <div className="flex items-center gap-3">
            <label htmlFor="team-size-exact" className="whitespace-nowrap text-xs text-[#4B5563]">
              Exact count:
            </label>
            <input
              id="team-size-exact"
              type="number"
              min={1}
              value={state.teamSize}
              disabled={isSubmitting}
              onChange={(e) => onTeamSizeChange(Number(e.target.value) || 0)}
              onBlur={(e) => onTeamSizeChange(Math.max(1, Number(e.target.value) || 1))}
              className="w-24 rounded-xl px-3 py-2 text-sm text-[#0A0A0A] outline-none transition-all focus:ring-2 focus:ring-[#00C853]/40 disabled:opacity-50"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
              }}
            />
            <span className="text-xs text-[#4B5563]">people</span>
          </div>
        </motion.fieldset>

        {/* Use case pills */}
        <motion.fieldset variants={itemVariants} className="space-y-3">
          <legend className="text-sm font-semibold text-[#0A0A0A]">Primary use case</legend>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
            {USE_CASE_OPTIONS.map((option) => {
              const isActive = state.useCase === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isActive}
                  disabled={isSubmitting}
                  onClick={() => onUseCaseChange(option.value)}
                  className="group rounded-xl p-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00C853] disabled:opacity-50"
                  style={
                    isActive
                      ? {
                          background: "#F0FDF4",
                          border: "1px solid #00C853",
                          boxShadow: "0 0 16px rgba(0,200,83,0.12)",
                        }
                      : {
                          background: "#FFFFFF",
                          border: "1px solid #E5E7EB",
                        }
                  }
                >
                  <div className="mb-1.5 text-[#00C853]">
                    <option.icon className="h-4 w-4" />
                  </div>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "#0A0A0A" }}
                  >
                    {option.label}
                  </p>
                  <p className="text-[10px] leading-tight" style={{ color: "#4B5563" }}>
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
            background: "#F8F9FA",
            border: "1px solid #E5E7EB",
          }}
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#4B5563]">
            Audit summary
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-[#4B5563]">Tools</p>
              <p className="text-base font-semibold text-[#0A0A0A]">{state.selectedTools.length}</p>
            </div>
            <div>
              <p className="text-xs text-[#4B5563]">Team size</p>
              <p className="text-base font-semibold text-[#0A0A0A]">{state.teamSize}</p>
            </div>
            <div>
              <p className="text-xs text-[#4B5563]">Use case</p>
              <p className="text-base font-semibold capitalize text-[#0A0A0A]">{state.useCase}</p>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div variants={itemVariants} className="flex justify-between pt-1">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="rounded-xl border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-medium text-[#4B5563] hover:bg-[#F8F9FA] disabled:opacity-40"
          >
            ← Back
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="relative rounded-2xl bg-[#00C853] px-8 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 hover:bg-[#00A846]"
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
                Analyzing your spend...
              </span>
            ) : (
              "Run My Audit →"
            )}
          </button>
        </motion.div>
        
        {/* Error message */}
        {error && (
          <motion.div variants={itemVariants} className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 text-center">
            {error}
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
