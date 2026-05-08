"use client"

import { motion } from "framer-motion"
import { BadgeDollarSign, RefreshCw, Scissors, Zap } from "lucide-react"

const MOCK_TOOLS = [
  { name: "Cursor Pro", spend: 40, status: "keep", color: "#00C853" },
  { name: "GitHub Copilot", spend: 19, status: "cancel", color: "#EF4444" },
  { name: "Claude Pro", spend: 20, status: "keep", color: "#CC785C" },
  { name: "ChatGPT Team", spend: 60, status: "downgrade", color: "#F59E0B" },
  { name: "OpenAI API", spend: 180, status: "keep", color: "#00C853" },
]

const SAVINGS_ITEMS = [
  { label: "Redundant tools", amount: "$228/yr", icon: RefreshCw },
  { label: "Plan overpay", amount: "$360/yr", icon: BadgeDollarSign },
  { label: "Credex credits", amount: "$720/yr", icon: Zap },
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
      <div className="absolute inset-0 rounded-3xl opacity-20 blur-3xl" style={{ background: "radial-gradient(ellipse at 60% 40%, #00C853 0%, #7C3AED 45%, transparent 80%)" }} />

      {/* Main dashboard card */}
      <motion.div
        variants={itemVariants}
        className="animate-float relative rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#4B5563]">AI Spend Report</p>
            <p className="mt-0.5 text-sm font-medium text-[#4B5563]">May 2026 · 5 tools</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-[#00C853] px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-glow" />
            <span className="text-xs font-medium text-white">Live audit</span>
          </div>
        </div>

        {/* Annual savings hero number */}
        <motion.div
          variants={itemVariants}
          className="mb-4 rounded-xl p-4"
          style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}
        >
          <p className="mb-1 text-xs font-medium text-[#4B5563]">Estimated Annual Savings</p>
          <p
            className="text-4xl font-bold tracking-tight text-[#0A0A0A]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            $1,308
          </p>
          <p className="mt-1 text-xs text-[#4B5563]">Across 3 optimization opportunities</p>
        </motion.div>

        {/* Tool rows */}
        <div className="space-y-2 mb-4">
          {MOCK_TOOLS.map((tool, i) => (
            <motion.div
              key={tool.name}
              variants={itemVariants}
              custom={i}
              className="flex items-center justify-between rounded-lg px-3 py-2.5"
              style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="h-2 w-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: tool.color }}
                />
                <span className="text-sm text-[#0A0A0A]">{tool.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#4B5563]">${tool.spend}/mo</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    background:
                      tool.status === "cancel"
                        ? "#FEF2F2"
                        : tool.status === "downgrade"
                        ? "#FFFBEB"
                        : "#F0FDF4",
                    color:
                      tool.status === "cancel"
                        ? "#EF4444"
                        : tool.status === "downgrade"
                        ? "#F59E0B"
                        : "#00C853",
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
          style={{ background: "#F8F9FA", border: "1px solid #E5E7EB" }}
        >
          <p className="mb-2.5 text-xs font-medium text-[#4B5563]">Savings breakdown</p>
          <div className="space-y-2">
            {SAVINGS_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <item.icon className="h-3.5 w-3.5 text-[#4B5563]" />
                  <span className="text-xs text-[#4B5563]">{item.label}</span>
                </div>
                <span className="text-xs font-semibold text-[#00C853]">{item.amount}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Floating mini card — bottom right */}
      <motion.div
        variants={itemVariants}
        className="animate-float-delayed absolute -bottom-6 -right-4 rounded-xl border border-[#E5E7EB] bg-[#F8F9FA] px-4 py-3 shadow-sm"
      >
        <p className="text-[10px] font-medium uppercase tracking-widest text-[#0A0A0A]">Monthly burn</p>
        <p className="mt-0.5 text-xl font-bold text-[#0A0A0A]" style={{ fontFamily: "var(--font-heading)" }}>
          $319<span className="text-sm font-normal text-[#4B5563]">/mo</span>
        </p>
      </motion.div>

      {/* Floating mini card — top right */}
      <motion.div
        variants={itemVariants}
        className="absolute -top-5 -right-2 rounded-xl border border-[#EF4444] bg-[#EF4444] px-3 py-2 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <Scissors className="h-3.5 w-3.5 text-white" />
          <div>
            <p className="text-[10px] font-medium text-white">Redundant found</p>
            <p className="text-xs font-bold text-white">GitHub Copilot</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
