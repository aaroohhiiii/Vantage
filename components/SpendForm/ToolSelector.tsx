"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ToolName } from "@/lib/types"

const TOOL_OPTIONS: Array<{ tool: ToolName; label: string; emoji: string }> = [
  { tool: "cursor", label: "Cursor", emoji: "🖥️" },
  { tool: "github-copilot", label: "GitHub Copilot", emoji: "🐙" },
  { tool: "claude", label: "Claude (Anthropic)", emoji: "🔮" },
  { tool: "chatgpt", label: "ChatGPT (OpenAI)", emoji: "💬" },
  { tool: "anthropic-api", label: "Anthropic API", emoji: "🤖" },
  { tool: "openai-api", label: "OpenAI API", emoji: "⚡" },
  { tool: "gemini", label: "Gemini (Google)", emoji: "💎" },
  { tool: "windsurf", label: "Windsurf", emoji: "🏄" },
]

type ToolSelectorProps = {
  selectedTools: ToolName[]
  onToggle: (tool: ToolName) => void
  onNext: () => void
}

export function ToolSelector({ selectedTools, onToggle, onNext }: ToolSelectorProps) {
  return (
    <section className="space-y-4" aria-labelledby="tool-selector-title">
      <h2 id="tool-selector-title" className="text-xl font-semibold">
        Step 1: Select your AI tools
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {TOOL_OPTIONS.map((toolOption) => {
          const selected = selectedTools.includes(toolOption.tool)
          return (
            <button
              type="button"
              key={toolOption.tool}
              onClick={() => onToggle(toolOption.tool)}
              className="text-left"
              aria-pressed={selected}
            >
              <Card
                className={selected ? "ring-2 ring-primary" : "ring-1 ring-border"}
                size="sm"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <span aria-hidden="true">{toolOption.emoji}</span>
                    {toolOption.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-xs text-muted-foreground">
                  {selected ? "Selected" : "Click to select"}
                </CardContent>
              </Card>
            </button>
          )
        })}
      </div>
      <div className="flex justify-end">
        <Button type="button" onClick={onNext} disabled={selectedTools.length === 0}>
          Next →
        </Button>
      </div>
    </section>
  )
}
