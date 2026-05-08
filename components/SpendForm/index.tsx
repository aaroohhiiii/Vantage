"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { SpendDetails } from "@/components/SpendForm/SpendDetails"
import { TeamInfo } from "@/components/SpendForm/TeamInfo"
import { ToolSelector } from "@/components/SpendForm/ToolSelector"
import type { AuditInput, FormState, StoredFormState, ToolInput, ToolName, UseCase } from "@/lib/types"

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

function createDefaultToolInput(tool: ToolName): ToolInput {
  return {
    tool,
    plan: "",
    monthlySpend: 0,
    seats: 1,
  }
}

function createInitialFormState(): FormState {
  const toolInputs = ALL_TOOLS.reduce<Record<ToolName, ToolInput>>((acc, tool) => {
    acc[tool] = createDefaultToolInput(tool)
    return acc
  }, {} as Record<ToolName, ToolInput>)

  return {
    step: 1,
    selectedTools: [],
    toolInputs,
    teamSize: 1,
    useCase: "coding",
  }
}

export default function SpendForm() {
  const [state, setState] = useState<FormState>(createInitialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
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
    const payload: StoredFormState = {
      ...state,
      lastUpdated: new Date().toISOString(),
    }
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload))
  }, [state])

  const progressValue = useMemo(() => (state.step / 3) * 100, [state.step])

  function toggleTool(tool: ToolName) {
    setState((prev) => ({
      ...prev,
      selectedTools: prev.selectedTools.includes(tool)
        ? prev.selectedTools.filter((selected) => selected !== tool)
        : [...prev.selectedTools, tool],
    }))
  }

  function updateToolInput(tool: ToolName, next: Partial<ToolInput>) {
    setState((prev) => ({
      ...prev,
      toolInputs: {
        ...prev.toolInputs,
        [tool]: {
          ...prev.toolInputs[tool],
          ...next,
          tool,
        },
      },
    }))
  }

  async function submitAudit() {
    setIsSubmitting(true)
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

      if (!response.ok) {
        throw new Error("Failed to run audit")
      }

      const data = (await response.json()) as { id: string }
      window.localStorage.removeItem(LOCAL_STORAGE_KEY)
      router.push(`/audit/${data.id}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  function setUseCase(useCase: UseCase) {
    setState((prev) => ({ ...prev, useCase }))
  }

  return (
    <Card id="spend-form" className="mx-auto w-full max-w-4xl">
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Step {state.step} of 3</p>
          <Progress value={progressValue} aria-label={`Form progress ${progressValue}%`} />
        </div>

        {state.step === 1 ? (
          <ToolSelector
            selectedTools={state.selectedTools}
            onToggle={toggleTool}
            onNext={() => setState((prev) => ({ ...prev, step: 2 }))}
          />
        ) : null}

        {state.step === 2 ? (
          <SpendDetails
            selectedTools={state.selectedTools}
            toolInputs={state.toolInputs}
            onToolInputChange={updateToolInput}
            onBack={() => setState((prev) => ({ ...prev, step: 1 }))}
            onNext={() => setState((prev) => ({ ...prev, step: 3 }))}
          />
        ) : null}

        {state.step === 3 ? (
          <TeamInfo
            state={state}
            isSubmitting={isSubmitting}
            onBack={() => setState((prev) => ({ ...prev, step: 2 }))}
            onTeamSizeChange={(teamSize) => setState((prev) => ({ ...prev, teamSize }))}
            onUseCaseChange={setUseCase}
            onSubmit={submitAudit}
          />
        ) : null}
      </CardContent>
    </Card>
  )
}
