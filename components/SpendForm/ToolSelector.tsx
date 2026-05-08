"use client"

import { motion } from "framer-motion"
import { ToolIcon, TOOL_DISPLAY_NAMES, TOOL_DESCRIPTIONS } from "@/components/ui/ToolIcon"
import type { ToolName } from "@/lib/types"

const TOOL_OPTIONS: ToolName[] = [
  "cursor",
  "github-copilot",
  "claude",
  "chatgpt",
  "anthropic-api",
  "openai-api",
  "gemini",
  "windsurf",
]

type ToolSelectorProps = {
  selectedTools: ToolName[]
  onToggle: (tool: ToolName) => void
  onNext: () => void
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
}

export function ToolSelector({ selectedTools, onToggle, onNext }: ToolSelectorProps) {
  const count = selectedTools.length

  return (
    <section className="space-y-6" aria-labelledby="tool-selector-title">
      {/* Header */}
      <div>
        <h2
          id="tool-selector-title"
          className="text-xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Which AI tools does your team pay for?
        </h2>
        <p className="mt-1 text-sm text-[#64748B]">
          Select all that apply — we&apos;ll audit each one.
        </p>
      </div>

      {/* Tool grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {TOOL_OPTIONS.map((tool) => {
          const selected = selectedTools.includes(tool)
          return (
            <motion.button
              key={tool}
              type="button"
              variants={cardVariants}
              onClick={() => onToggle(tool)}
              aria-pressed={selected}
              className="group relative w-full text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F8CFF] rounded-2xl"
            >
              <div
                className="relative flex items-center gap-3.5 rounded-2xl p-4 transition-all duration-200"
                style={
                  selected
                    ? {
                        background: "rgba(79,140,255,0.1)",
                        border: "1px solid rgba(79,140,255,0.35)",
                        boxShadow: "0 0 24px rgba(79,140,255,0.1)",
                      }
                    : {
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }
                }
              >
                {/* Tool icon */}
                <div className="flex-shrink-0">
                  <ToolIcon tool={tool} size={36} />
                </div>

                {/* Tool info */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold transition-colors duration-200"
                    style={{ color: selected ? "#fff" : "rgba(255,255,255,0.8)" }}
                  >
                    {TOOL_DISPLAY_NAMES[tool]}
                  </p>
                  <p className="text-xs truncate" style={{ color: selected ? "#76A9FF" : "#475569" }}>
                    {TOOL_DESCRIPTIONS[tool]}
                  </p>
                </div>

                {/* Checkmark */}
                <div
                  className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full transition-all duration-200"
                  style={
                    selected
                      ? { background: "linear-gradient(135deg, #4F8CFF 0%, #8B5CF6 100%)", boxShadow: "0 0 12px rgba(79,140,255,0.4)" }
                      : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }
                  }
                >
                  {selected && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Footer: count badge + next button */}
      <div className="flex items-center justify-between pt-2">
        <div
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm"
          style={{
            background: count > 0 ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.04)",
            border: count > 0 ? "1px solid rgba(52,211,153,0.25)" : "1px solid rgba(255,255,255,0.08)",
            color: count > 0 ? "#34D399" : "#475569",
            transition: "all 0.3s ease",
          }}
        >
          {count === 0 ? "No tools selected yet" : `${count} tool${count !== 1 ? "s" : ""} selected`}
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={count === 0}
          className="btn-primary rounded-xl px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          Next: Add spend →
        </button>
      </div>
    </section>
  )
}
