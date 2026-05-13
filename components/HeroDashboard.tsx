"use client"
import { ToolIcon, TOOL_DISPLAY_NAMES } from "@/components/ui/ToolIcon"
import { Zap, ShieldCheck, ArrowUpRight } from "lucide-react"

const MOCK_TOOLS = [
  { toolName: "cursor" as const, spend: 40, status: "keep" },
  { toolName: "github-copilot" as const, spend: 19, status: "cancel" },
  { toolName: "claude" as const, spend: 20, status: "keep" },
  { toolName: "chatgpt" as const, spend: 60, status: "downgrade" },
]

export default function HeroDashboard() {
  return (
    <div
      className="relative w-full max-w-[520px] select-none"
      aria-hidden="true"
    >
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none credex-grid" />

      <div
        className="animate-float relative rounded-[32px] border border-black/5 bg-white p-6 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]"
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#00C853]/10 border border-[#00C853]/20">
              <ShieldCheck className="h-4 w-4 text-[#00C853]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#111]">Vantage Snapshot</p>
              <p className="text-[11px] font-medium text-[#666]">Verified Stack Analysis &middot; 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#f3f4f6] px-3 py-1 border border-black/5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#00C853] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#111]">LIVE AUDIT</span>
          </div>
        </div>

        {/* Annual savings hero number */}
        <div className="mb-6 rounded-2xl p-6 bg-[#0d1b16] text-white border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 opacity-10 credex-grid pointer-events-none" />
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/40 relative z-10">Annual Savings Opportunity</p>
          <div className="flex items-center gap-2 relative z-10">
            <p className="text-5xl font-bold tracking-tighter text-[#00C853]">
              $1,308
            </p>
            <ArrowUpRight className="h-6 w-6 text-white/20 group-hover:text-[#00C853] transition-colors" />
          </div>
          <p className="mt-2 text-xs font-medium text-white/50 relative z-10">Optimizing 4 redundant subscriptions</p>
        </div>

        {/* Tool rows */}
        <div className="space-y-3 mb-6">
          {MOCK_TOOLS.map((tool) => (
            <div
              key={tool.toolName}
              className="flex items-center justify-between rounded-xl px-4 py-3 bg-[#f9fafb] border border-black/5 hover:bg-[#f3f4f6] transition-colors"
            >
              <div className="flex items-center gap-3">
                <ToolIcon tool={tool.toolName} size={28} />
                <div>
                  <span className="text-xs text-[#111] font-bold block">{TOOL_DISPLAY_NAMES[tool.toolName]}</span>
                  <span className="text-[10px] text-[#666] font-medium uppercase tracking-wider">Active Subscription</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-[#111] font-bold">${tool.spend}<span className="text-[10px] text-[#666]">/mo</span></span>
                <span
                  className="rounded-lg px-2 py-1 text-[9px] font-bold uppercase tracking-widest border"
                  style={{
                    backgroundColor:
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
                    borderColor:
                      tool.status === "cancel"
                        ? "#EF444420"
                        : tool.status === "downgrade"
                        ? "#F59E0B20"
                        : "#00C85320",
                  }}
                >
                  {tool.status === "cancel" ? "Redundant" : tool.status === "downgrade" ? "Downgrade" : "Aligned"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Note */}
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-black/5 opacity-40 grayscale group-hover:grayscale-0 transition-all">
           <Zap className="h-4 w-4 text-[#111]" />
           <ShieldCheck className="h-4 w-4 text-[#111]" />
           <p className="text-[10px] font-bold uppercase tracking-widest text-[#111]">Vantage Security Verified</p>
        </div>
      </div>

      {/* Floating mini card — bottom right */}
      <div className="animate-float-delayed absolute -bottom-8 -right-6 rounded-2xl border border-black/5 bg-white px-6 py-4 shadow-2xl z-20">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#666]">Monthly Burn</p>
        <p className="mt-1 text-2xl font-bold text-[#111] tracking-tight">
          $414<span className="text-xs font-bold text-[#666] ml-1">/mo</span>
        </p>
      </div>
    </div>
  )
}
