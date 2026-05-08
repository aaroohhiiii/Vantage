"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FormState, UseCase } from "@/lib/types"

const USE_CASE_OPTIONS: UseCase[] = ["coding", "writing", "data", "research", "mixed"]

type TeamInfoProps = {
  state: FormState
  isSubmitting: boolean
  onBack: () => void
  onTeamSizeChange: (teamSize: number) => void
  onUseCaseChange: (useCase: UseCase) => void
  onSubmit: () => Promise<void>
}

export function TeamInfo({
  state,
  isSubmitting,
  onBack,
  onTeamSizeChange,
  onUseCaseChange,
  onSubmit,
}: TeamInfoProps) {
  return (
    <section className="space-y-4" aria-labelledby="team-info-title">
      <h2 id="team-info-title" className="text-xl font-semibold">
        Step 3: Team context
      </h2>

      <div className="space-y-1">
        <Label htmlFor="team-size">Team size</Label>
        <Input
          id="team-size"
          type="number"
          min={1}
          value={state.teamSize}
          onChange={(event) => onTeamSizeChange(Math.max(1, Number(event.target.value) || 1))}
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Primary use case</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {USE_CASE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={state.useCase === option}
              className={`rounded-md border px-3 py-2 text-sm capitalize ${
                state.useCase === option ? "border-primary bg-primary/10" : "border-input"
              }`}
              onClick={() => onUseCaseChange(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <details className="rounded-md border p-3">
        <summary className="cursor-pointer text-sm font-medium">Review your entries</summary>
        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <p>Selected tools: {state.selectedTools.length}</p>
          <p>Team size: {state.teamSize}</p>
          <p className="capitalize">Use case: {state.useCase}</p>
        </div>
      </details>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
          ← Back
        </Button>
        <Button type="button" size="lg" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Running audit..." : "Run My Audit →"}
        </Button>
      </div>
    </section>
  )
}
