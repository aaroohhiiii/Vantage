import type { AuditResult } from "@/lib/types"
import { EmailCapture } from "./ResultsClient"
import { ShieldCheck, Mail } from "lucide-react"

type Props = { audit: AuditResult }

export function MethodologySection({ audit }: Props) {

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.5fr_1fr]">

      <div className="rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-8 shadow-sm">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0A0A0A] uppercase tracking-tight">GET THIS REPORT</h2>
            <p className="text-xs text-[#6b7280]">We&apos;ll email you a copy of this audit.</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dcfce7] text-[#16a34a]">
            <Mail className="h-5 w-5" />
          </div>
        </div>

        <EmailCapture
          auditId={audit.id}
          showCredex={audit.showCredex}
          isOptimal={audit.isOptimal}
        />

        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-medium text-[#9ca3af]">
          <ShieldCheck className="h-3 w-3" />
          Your data is secure and never stored without permission.
        </div>
      </div>
    </div>
  )
}
