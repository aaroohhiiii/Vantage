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
  visible: { transition: { staggerChildren: 0.05 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] as const } },
}

export function ToolSelector({ selectedTools, onToggle, onNext }: ToolSelectorProps) {
  const count = selectedTools.length

  return (
    <section className="space-y-8" aria-labelledby="tool-selector-title">
      {/* Header */}
      <div>
        <h2
          id="tool-selector-title"
          className="text-2xl font-medium text-[#111]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Which AI tools does your team pay for?
        </h2>
        <p className="mt-2 text-[#666] font-medium text-sm">
          Select all that apply — we&apos;ll audit each one.
        </p>
      </div>

      {/* Tool grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
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
              className="group relative w-full text-left focus-visible:outline-none"
            >
              <div
                className="relative flex items-center gap-4 rounded-3xl p-5 transition-all duration-300"
                style={
                  selected
                    ? {
                        background: "rgba(0, 200, 83, 0.03)",
                        border: "1px solid rgba(0, 200, 83, 0.3)",
                      }
                    : {
                        background: "#FFFFFF",
                        border: "1px solid rgba(0, 0, 0, 0.05)",
                      }
                }
              >
                {/* Tool icon */}
                <div className="flex-shrink-0 transition-all">
                  <ToolIcon tool={tool} size={40} />
                </div>

                {/* Tool info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#111]">
                    {TOOL_DISPLAY_NAMES[tool]}
                  </p>
                  <p className="truncate text-xs font-medium text-[#666] mt-0.5">
                    {TOOL_DESCRIPTIONS[tool]}
                  </p>
                </div>

                {/* Checkmark indicator */}
                <div
                  className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300"
                  style={
                    selected
                      ? { background: "#00C853" }
                      : { background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)" }
                  }
                >
                  {selected && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Footer: count badge + next button */}
      <div className="flex items-center justify-between pt-6 border-t border-black/5">
        <div className="text-xs font-bold uppercase tracking-widest text-[#666]">
          {count === 0 ? "Select tools to continue" : `${count} tool${count !== 1 ? "s" : ""} selected`}
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={count === 0}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:grayscale transition-all flex items-center gap-2"
        >
          Next: Add spend <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </section>
  )
}
