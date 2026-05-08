"use client"

import { motion } from "framer-motion"

const MOCK_TOOLS = [
  { name: "Cursor Pro", spend: 40, status: "keep", color: "#4F8CFF" },
  { name: "GitHub Copilot", spend: 19, status: "cancel", color: "#EF4444" },
  { name: "Claude Pro", spend: 20, status: "keep", color: "#CC785C" },
  { name: "ChatGPT Team", spend: 60, status: "downgrade", color: "#F59E0B" },
  { name: "OpenAI API", spend: 180, status: "keep", color: "#10A37F" },
]

const SAVINGS_ITEMS = [
  { label: "Redundant tools", amount: "$228/yr", icon: "🔁" },
  { label: "Plan overpay", amount: "$360/yr", icon: "💸" },
  { label: "Credex credits", amount: "$720/yr", icon: "⚡" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
}

export default function HeroDashboard() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative w-full max-w-[480px] select-none"
      aria-hidden="true"
    >
      {/* Floating glow behind the dashboard */}
      <div
        className="absolute inset-0 rounded-3xl opacity-30 blur-3xl"
        style={{ background: "radial-gradient(ellipse at 60% 40%, #4F8CFF 0%, #8B5CF6 50%, transparent 80%)" }}
      />

      {/* Main dashboard card */}
      <motion.div
        variants={itemVariants}
        className="animate-float relative rounded-2xl glass-card p-5 glow-blue"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-widest">AI Spend Report</p>
            <p className="mt-0.5 text-sm font-medium text-white/80">May 2026 · 5 tools</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-[#34D399]/15 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] animate-pulse-glow" />
            <span className="text-xs font-medium text-[#34D399]">Live audit</span>
          </div>
        </div>

        {/* Annual savings hero number */}
        <motion.div
          variants={itemVariants}
          className="mb-4 rounded-xl p-4"
          style={{ background: "linear-gradient(135deg, rgba(79,140,255,0.12) 0%, rgba(139,92,246,0.12) 100%)", border: "1px solid rgba(79,140,255,0.2)" }}
        >
          <p className="text-xs text-[#76A9FF] font-medium mb-1">Estimated Annual Savings</p>
          <p
            className="text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)", background: "linear-gradient(135deg, #fff 0%, #76A9FF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            $1,308
          </p>
          <p className="mt-1 text-xs text-[#94A3B8]">Across 3 optimization opportunities</p>
        </motion.div>

        {/* Tool rows */}
        <div className="space-y-2 mb-4">
          {MOCK_TOOLS.map((tool, i) => (
            <motion.div
              key={tool.name}
              variants={itemVariants}
              custom={i}
              className="flex items-center justify-between rounded-lg px-3 py-2.5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="h-2 w-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: tool.color }}
                />
                <span className="text-sm text-white/80">{tool.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#94A3B8]">${tool.spend}/mo</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    background:
                      tool.status === "cancel"
                        ? "rgba(239,68,68,0.15)"
                        : tool.status === "downgrade"
                        ? "rgba(245,158,11,0.15)"
                        : "rgba(52,211,153,0.15)",
                    color:
                      tool.status === "cancel"
                        ? "#EF4444"
                        : tool.status === "downgrade"
                        ? "#F59E0B"
                        : "#34D399",
                  }}
                >
                  {tool.status === "cancel" ? "Cancel" : tool.status === "downgrade" ? "Downgrade" : "Optimal"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Savings breakdown */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl p-3"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs font-medium text-[#94A3B8] mb-2.5">Savings breakdown</p>
          <div className="space-y-2">
            {SAVINGS_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-xs text-white/60">{item.label}</span>
                </div>
                <span className="text-xs font-semibold text-[#34D399]">{item.amount}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Floating mini card — bottom right */}
      <motion.div
        variants={itemVariants}
        className="animate-float-delayed absolute -bottom-6 -right-4 rounded-xl glass-card px-4 py-3 shadow-xl"
        style={{ border: "1px solid rgba(139,92,246,0.25)", background: "rgba(139,92,246,0.08)" }}
      >
        <p className="text-[10px] text-[#C4B5FD] uppercase tracking-widest font-medium">Monthly burn</p>
        <p className="text-xl font-bold text-white mt-0.5" style={{ fontFamily: "var(--font-heading)" }}>
          $319<span className="text-sm font-normal text-white/40">/mo</span>
        </p>
      </motion.div>

      {/* Floating mini card — top right */}
      <motion.div
        variants={itemVariants}
        className="absolute -top-5 -right-2 rounded-xl glass-card px-3 py-2 shadow-xl"
        style={{ border: "1px solid rgba(52,211,153,0.2)", background: "rgba(52,211,153,0.06)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">✂️</span>
          <div>
            <p className="text-[10px] text-[#6EE7B7] font-medium">Redundant found</p>
            <p className="text-xs font-bold text-white">GitHub Copilot</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
