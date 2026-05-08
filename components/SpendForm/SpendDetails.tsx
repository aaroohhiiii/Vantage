"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getOfficialPrice, getToolPricing } from "@/lib/pricingData"
import type { ToolInput, ToolName } from "@/lib/types"

type SpendDetailsProps = {
  selectedTools: ToolName[]
  toolInputs: Record<ToolName, ToolInput>
  onToolInputChange: (tool: ToolName, next: Partial<ToolInput>) => void
  onBack: () => void
  onNext: () => void
}

export function SpendDetails({
  selectedTools,
  toolInputs,
  onToolInputChange,
  onBack,
  onNext,
}: SpendDetailsProps) {
  const totalSpend = selectedTools.reduce((sum, tool) => sum + (toolInputs[tool]?.monthlySpend ?? 0), 0)

  return (
    <section className="space-y-4" aria-labelledby="spend-details-title">
      <h2 id="spend-details-title" className="text-xl font-semibold">
        Step 2: Add plan and spend details
      </h2>
      <div className="space-y-4">
        {selectedTools.map((tool) => {
          const pricing = getToolPricing(tool)
          const input = toolInputs[tool]
          const listPrice = getOfficialPrice(tool, input.plan, input.seats)
          const selectedPlan = pricing?.plans.find(
            (plan) => plan.planName.toLowerCase() === input.plan.toLowerCase(),
          )

          return (
            <Card key={tool}>
              <CardHeader>
                <CardTitle className="capitalize">{tool.replace("-", " ")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor={`${tool}-plan`}>Plan</Label>
                  <Select
                    value={input.plan}
                    onValueChange={(value) => onToolInputChange(tool, { plan: value ?? "" })}
                  >
                    <SelectTrigger id={`${tool}-plan`} className="w-full">
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {(pricing?.plans ?? []).map((plan) => (
                        <SelectItem key={plan.planName} value={plan.planName}>
                          {plan.planName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`${tool}-spend`}>Monthly spend (USD)</Label>
                  <Input
                    id={`${tool}-spend`}
                    type="number"
                    min={0}
                    placeholder="0"
                    value={input.monthlySpend}
                    onChange={(event) =>
                      onToolInputChange(tool, {
                        monthlySpend: Number(event.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`${tool}-seats`}>Seats/users</Label>
                  <Input
                    id={`${tool}-seats`}
                    type="number"
                    min={1}
                    value={input.seats}
                    onChange={(event) =>
                      onToolInputChange(tool, {
                        seats: Math.max(1, Number(event.target.value) || 1),
                      })
                    }
                  />
                </div>

                {selectedPlan ? (
                  <p className="text-xs text-muted-foreground">
                    List price: ${listPrice}
                    {selectedPlan.isPerUser ? "/user/mo" : "/mo"} - {selectedPlan.sourceUrl}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex items-center justify-between rounded-lg bg-muted p-3 text-sm">
        <span>Total monthly spend:</span>
        <span className="font-semibold">${totalSpend.toFixed(2)}</span>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <Button type="button" onClick={onNext}>
          Next →
        </Button>
      </div>
    </section>
  )
}
