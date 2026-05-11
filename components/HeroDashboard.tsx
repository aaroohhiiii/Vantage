"use client"
import { ToolIcon, TOOL_DISPLAY_NAMES } from "@/components/ui/ToolIcon"
import { BadgeDollarSign, RefreshCw, Scissors, Zap } from "lucide-react"

const MOCK_TOOLS = [
  { toolName: "cursor" as const, spend: 40, status: "keep" },
  { toolName: "github-copilot" as const, spend: 19, status: "cancel" },
  { toolName: "claude" as const, spend: 20, status: "keep" },
  { toolName: "chatgpt" as const, spend: 60, status: "downgrade" },
]

const SAVINGS_ITEMS = [
  { label: "Redundant tools", amount: "$228/yr", icon: RefreshCw },
  { label: "Plan overpay", amount: "$360/yr", icon: BadgeDollarSign },
  { label: "Credex credits", amount: "$720/yr", icon: Zap },
]


export default function HeroDashboard() {
  return (
    <div
      className="relative w-full max-w-[480px] select-none"
      aria-hidden="true"
    >
      {/* Floating glow behind the dashboard */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-25 blur-3xl" 
        style={{ background: "radial-gradient(ellipse at 60% 40%, #00C853 0%, #7C3AED 45%, transparent 80%)" }}
      />

      {/* Main dashboard card */}
      <div
        className="animate-float relative rounded-2xl border border-[#E5E7EB] bg-white/95 backdrop-blur-lg p-5 shadow-lg"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#4B5563]">AI Spend Report</p>
            <p className="mt-0.5 text-sm font-medium text-[#4B5563]">May 2026 · 6 tools</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#00C853] to-[#00A846] px-3 py-1 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-glow" />
            <span className="text-xs font-medium text-white">Live audit</span>
          </div>
        </div>

        {/* Annual savings hero number */}
        <div className="mb-4 rounded-xl p-4 bg-gradient-to-br from-[#F0FDF4] to-[#E6FFFA] border border-[#00C85320] shadow-sm">
          <p className="mb-1 text-xs font-medium text-[#4B5563]">Estimated Annual Savings</p>
          <p
            className="text-4xl font-bold tracking-tight text-[#0A0A0A]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            $1,308
          </p>
          <p className="mt-1 text-xs text-[#4B5563]">Across 3 optimization opportunities</p>
        </div>

        {/* Tool rows */}
        <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
          {MOCK_TOOLS.map((tool) => (
            <div
              key={tool.toolName}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 bg-white border border-[#E5E7EB] hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-2.5">
                <ToolIcon tool={tool.toolName} size={24} />
                <span className="text-sm text-[#0A0A0A] font-medium">{TOOL_DISPLAY_NAMES[tool.toolName]}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#4B5563] font-medium">${tool.spend}/mo</span>
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
            </div>
          ))}
        </div>

        {/* Savings breakdown */}
        <div className="rounded-xl p-3" style={{ background: "#F8F9FA", border: "1px solid #E5E7EB" }}>
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
        </div>
      </div>

      {/* Floating mini card — bottom right */}
      <div className="animate-float-delayed absolute -bottom-6 -right-4 rounded-xl border border-[#E5E7EB] bg-gradient-to-br from-[#F8F9FA] to-[#FFFFFF] px-4 py-3 shadow-lg">
        <p className="text-[10px] font-medium uppercase tracking-widest text-[#0A0A0A]">Monthly burn</p>
        <p 
          className="mt-0.5 text-xl font-bold text-[#0A0A0A]" 
          style={{ fontFamily: "var(--font-heading)" }}
        >
          $414<span className="text-sm font-normal text-[#4B5563]">/mo</span>
        </p>
      </div>

      {/* Floating mini card — top right */}
      <div className="absolute -top-5 -right-2 rounded-xl border border-[#EF4444] bg-gradient-to-r from-[#EF4444] to-[#DC2626] px-3 py-2 shadow-lg">
        <div className="flex items-center gap-2">
          <Scissors className="h-3.5 w-3.5 text-white" />
          <div>
            <p className="text-[10px] font-medium text-white">Redundant found</p>
            <p className="text-xs font-bold text-white">GitHub Copilot</p>
          </div>
        </div>
      </div>
    </div>
  )
}
