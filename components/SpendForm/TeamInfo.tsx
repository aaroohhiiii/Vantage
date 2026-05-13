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
  ChevronRight,
  ArrowLeft
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
  { value: "writing", label: "Writing", icon: PenSquare, desc: "Docs & content" },
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
  visible: { transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] as const } },
}

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
  const clampTeamSize = (value: number) => Math.max(1, Number.isFinite(value) ? value : 1)

  const incrementTeamSize = () => {
    onTeamSizeChange(clampTeamSize(state.teamSize + 1))
  }

  const decrementTeamSize = () => {
    onTeamSizeChange(clampTeamSize(state.teamSize - 1))
  }

  const activeTeamValue = getActiveTeamOption(state.teamSize)

  return (
    <section className="space-y-8" aria-labelledby="team-info-title">
      {/* Header */}
      <div>
        <h2
          id="team-info-title"
          className="text-2xl font-medium text-[#111]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Tell us about your team
        </h2>
        <p className="mt-2 text-[#666] font-medium text-sm">
          This helps us tailor recommendations to your context.
        </p>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-10">
        {/* Team size cards */}
        <motion.fieldset variants={itemVariants} className="space-y-4">
          <legend className="text-[10px] font-bold uppercase tracking-widest text-[#666] mb-4">Team Size</legend>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {TEAM_SIZE_OPTIONS.map((option) => {
              const isActive = activeTeamValue === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isActive}
                  disabled={isSubmitting}
                  onClick={() => onTeamSizeChange(option.value)}
                  className="group relative rounded-[24px] p-5 text-left transition-all duration-300 focus-visible:outline-none border border-black/5 bg-white disabled:opacity-50"
                  style={
                    isActive
                      ? {
                          background: "rgba(0, 200, 83, 0.03)",
                          border: "1px solid rgba(0, 200, 83, 0.3)",
                        }
                      : {}
                  }
                >
                  <div className="mb-3 text-[#111]">
                    <option.icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-[#111]">{option.label}</p>
                  <p className="text-[11px] font-medium text-[#666] mt-0.5">{option.description}</p>
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center gap-3 bg-[#f9fafb] p-2 rounded-2xl border border-black/5">
              <button
                type="button"
                onClick={decrementTeamSize}
                className="h-10 w-10 rounded-xl bg-white border border-black/5 text-lg font-medium text-[#111] transition-all"
              >
                −
              </button>
              <input
                id="team-size"
                type="number"
                min={1}
                value={state.teamSize}
                onChange={(e) => onTeamSizeChange(clampTeamSize(Number(e.target.value)))}
                className="w-16 bg-transparent text-center font-bold text-[#111] outline-none"
              />
              <button
                type="button"
                onClick={incrementTeamSize}
                className="h-10 w-10 rounded-xl bg-white border border-black/5 text-lg font-medium text-[#111] transition-all"
              >
                +
              </button>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#666]">Seats Found</span>
          </div>
        </motion.fieldset>

        {/* Use case pills */}
        <motion.fieldset variants={itemVariants} className="space-y-4">
          <legend className="text-[10px] font-bold uppercase tracking-widest text-[#666] mb-4">Primary Use Case</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {USE_CASE_OPTIONS.map((option) => {
              const isActive = state.useCase === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isActive}
                  disabled={isSubmitting}
                  onClick={() => onUseCaseChange(option.value)}
                  className="group rounded-2xl p-4 text-left transition-all duration-300 border border-black/5 bg-white disabled:opacity-50"
                  style={
                    isActive
                      ? {
                          background: "rgba(0, 200, 83, 0.03)",
                          border: "1px solid rgba(0, 200, 83, 0.3)",
                        }
                      : {}
                  }
                >
                  <div className="mb-2 text-[#111] group-hover:text-[#00C853] transition-colors">
                    <option.icon className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-semibold text-[#111]">{option.label}</p>
                </button>
              )
            })}
          </div>
        </motion.fieldset>

        {/* Navigation */}
        <motion.div variants={itemVariants} className="flex justify-between pt-8 border-t border-black/5">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="text-sm font-bold uppercase tracking-widest text-[#666] hover:text-[#111] transition-all flex items-center gap-2 disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="btn-primary flex items-center gap-2 relative overflow-hidden"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Running Audit...</span>
              </>
            ) : (
              <>
                Run Final Audit <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </motion.div>
        
        {error && (
          <motion.div variants={itemVariants} className="mt-6 rounded-2xl bg-red-50 p-4 text-xs font-bold uppercase tracking-widest text-red-600 text-center">
            {error}
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
