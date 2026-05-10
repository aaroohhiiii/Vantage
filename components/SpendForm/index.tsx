"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

import { SpendDetails } from "@/components/SpendForm/SpendDetails"
import { TeamInfo } from "@/components/SpendForm/TeamInfo"
import { ToolSelector } from "@/components/SpendForm/ToolSelector"
import type { AuditInput, FormState, StoredFormState, ToolInput, ToolName, UseCase } from "@/lib/types"
import { getOfficialPrice, getToolPricing } from "@/lib/pricingData"

const LOCAL_STORAGE_KEY = "credex-audit-form-state"
const STALE_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000

const ALL_TOOLS: ToolName[] = [
  "cursor",
  "github-copilot",
  "claude",
  "chatgpt",
  "anthropic-api",
  "openai-api",
  "gemini",
  "windsurf",
]

const STEPS = [
  { number: 1, label: "Select tools" },
  { number: 2, label: "Add spend" },
  { number: 3, label: "Team context" },
] as const

function createDefaultToolInput(tool: ToolName): ToolInput {
  const pricing = getToolPricing(tool)
  const firstPlan = pricing?.plans[0]?.planName ?? ""
  const monthlySpend = firstPlan ? getOfficialPrice(tool, firstPlan, 1) : 0

  return { tool, plan: firstPlan, monthlySpend, seats: 1 }
}

function createInitialFormState(): FormState {
  const toolInputs = ALL_TOOLS.reduce<Record<ToolName, ToolInput>>((acc, tool) => {
    acc[tool] = createDefaultToolInput(tool)
    return acc
  }, {} as Record<ToolName, ToolInput>)

  return { step: 1, selectedTools: [], toolInputs, teamSize: 1, useCase: "coding" }
}

const stepVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 40 : -40,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -40 : 40,
    transition: { duration: 0.25, ease: [0.55, 0.06, 0.68, 0.19] as [number, number, number, number] },
  }),
}

export default function SpendForm() {
  const [state, setState] = useState<FormState>(createInitialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [direction, setDirection] = useState(1)
  const router = useRouter()

  useEffect(() => {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as StoredFormState
      const lastUpdated = new Date(parsed.lastUpdated).getTime()
      if (!Number.isFinite(lastUpdated) || Date.now() - lastUpdated > STALE_THRESHOLD_MS) {
        window.localStorage.removeItem(LOCAL_STORAGE_KEY)
        return
      }
      setState({
        step: parsed.step,
        selectedTools: parsed.selectedTools,
        toolInputs: parsed.toolInputs,
        teamSize: parsed.teamSize,
        useCase: parsed.useCase,
      })
    } catch {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    const payload: StoredFormState = { ...state, lastUpdated: new Date().toISOString() }
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload))
  }, [state])

  const progressPct = useMemo(() => (state.step / 3) * 100, [state.step])

  function goTo(step: FormState["step"], dir: number) {
    setDirection(dir)
    setState((prev) => ({ ...prev, step }))
  }

  function toggleTool(tool: ToolName) {
    setState((prev) => ({
      ...prev,
      selectedTools: prev.selectedTools.includes(tool)
        ? prev.selectedTools.filter((s) => s !== tool)
        : [...prev.selectedTools, tool],
    }))
  }

  function updateToolInput(tool: ToolName, next: Partial<ToolInput>) {
    setState((prev) => {
      const current = prev.toolInputs[tool]
      const plan = next.plan ?? current.plan
      const seats = next.seats ?? current.seats
      const shouldRecalculate =
        next.monthlySpend === undefined && (next.plan !== undefined || next.seats !== undefined)

      return {
        ...prev,
        toolInputs: {
          ...prev.toolInputs,
          [tool]: {
            ...current,
            ...next,
            monthlySpend:
              next.monthlySpend !== undefined
                ? next.monthlySpend
                : shouldRecalculate
                ? getOfficialPrice(tool, plan, seats)
                : current.monthlySpend,
            tool,
          },
        },
      }
    })
  }

  async function submitAudit() {
    setIsSubmitting(true)
    setError(null)
    try {
      const payload: AuditInput = {
        tools: state.selectedTools.map((tool) => state.toolInputs[tool]),
        teamSize: state.teamSize,
        useCase: state.useCase,
      }
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error("Failed to run audit")
      const data = (await response.json()) as { id: string }
      window.localStorage.removeItem(LOCAL_STORAGE_KEY)
      router.push(`/audit/${data.id}`)
    } catch {
      setError("Something went wrong — please try again")
    } finally {
      setIsSubmitting(false)
    }
  }

  function setUseCase(useCase: UseCase) {
    setState((prev) => ({ ...prev, useCase }))
  }

  return (
    <div
      id="spend-form"
      className="mx-auto w-full max-w-4xl rounded-3xl"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      {/* ── Step indicator ── */}
      <div className="px-6 pt-6 pb-5 sm:px-8 sm:pt-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, i) => {
            const isCompleted = state.step > step.number
            const isActive = state.step === step.number
            return (
              <div key={step.number} className="flex flex-1 items-center">
                {/* Step dot + label */}
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300"
                    style={
                      isCompleted
                        ? { background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#00C853" }
                        : isActive
                        ? { background: "#00C853", color: "#fff", boxShadow: "0 0 20px rgba(0,200,83,0.25)" }
                        : { background: "#FFFFFF", border: "1px solid #E5E7EB", color: "#9CA3AF" }
                    }
                  >
                    {isCompleted ? "✓" : step.number}
                  </div>
                  <span
                    className="text-[11px] font-medium transition-colors duration-300"
                    style={{ color: isActive ? "#00C853" : isCompleted ? "#00C853" : "#9CA3AF" }}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector line (not after last step) */}
                {i < STEPS.length - 1 && (
                  <div className="mx-2 mb-5 h-px flex-1 transition-all duration-500" style={{ background: isCompleted ? "#00C853" : "#E5E7EB" }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Slim progress bar */}
        <div className="mt-4 h-0.5 w-full overflow-hidden rounded-full" style={{ background: "#E5E7EB" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPct}%`,
              background: "#00C853",
              boxShadow: "0 0 12px rgba(0,200,83,0.35)",
            }}
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Form progress ${Math.round(progressPct)}%`}
          />
        </div>
      </div>

      {/* ── Step content ── */}
      <div className="relative overflow-hidden px-6 pb-8 sm:px-8">
        <AnimatePresence mode="wait" custom={direction}>
          {state.step === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <ToolSelector
                selectedTools={state.selectedTools}
                onToggle={toggleTool}
                onNext={() => goTo(2, 1)}
              />
            </motion.div>
          )}

          {state.step === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <SpendDetails
                selectedTools={state.selectedTools}
                toolInputs={state.toolInputs}
                onToolInputChange={updateToolInput}
                onBack={() => goTo(1, -1)}
                onNext={() => goTo(3, 1)}
              />
            </motion.div>
          )}

          {state.step === 3 && (
            <motion.div
              key="step-3"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <TeamInfo
                state={state}
                isSubmitting={isSubmitting}
                error={error}
                onBack={() => goTo(2, -1)}
                onTeamSizeChange={(teamSize) => setState((prev) => ({ ...prev, teamSize }))}
                onUseCaseChange={setUseCase}
                onSubmit={submitAudit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
