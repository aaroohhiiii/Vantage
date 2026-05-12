"use client"

import { useState, useEffect } from "react"
import { trackEvent } from "@/lib/analytics"

type EmailCaptureProps = {
  auditId: string
  showCredex: boolean
  isOptimal: boolean
}

const STORAGE_KEY = "vantage-lead-captured"

export function EmailCapture({ auditId, showCredex }: EmailCaptureProps) {
  const [email, setEmail] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [role, setRole] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "rate_limit">("idle")
  const [alreadyCaptured, setAlreadyCaptured] = useState(false)

  useEffect(() => {
    const captured = window.localStorage.getItem(STORAGE_KEY)
    if (captured === auditId) {
      setAlreadyCaptured(true)
    }
  }, [auditId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus("submitting")
    try {
      const res = await fetch("/api/capture-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auditId,
          email: email.trim(),
          companyName: companyName.trim() || undefined,
          role: role.trim() || undefined,
          honeypot,
        }),
      })

      if (res.ok) {
        setStatus("success")
        trackEvent('email_capture_submitted', auditId, { role, companyName })
        window.localStorage.setItem(STORAGE_KEY, auditId)
      } else if (res.status === 429) {
        setStatus("rate_limit")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  if (alreadyCaptured || status === "success") {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
      >
        <div className="mb-2 text-3xl">✓</div>
        <p className="text-lg font-semibold text-[#086841]">Check your inbox</p>
        <p className="mt-1 text-sm text-[#4B5563]">
          {showCredex
            ? "A Credex advisor will review your audit and reach out within 48 hours."
            : "Your audit results have been sent to your email."}
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Honeypot — hidden from users */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div>
          <label htmlFor="lead-email" className="mb-1 block text-xs font-medium text-[#4B5563]">
            Email *
          </label>
          <input
            id="lead-email"
            type="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl px-4 py-2.5 text-sm text-[#0A0A0A] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#00C853]/40"
            style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="lead-company" className="mb-1 block text-xs font-medium text-[#4B5563]">
              Company name
            </label>
            <input
              id="lead-company"
              type="text"
              placeholder="Optional"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-sm text-[#0A0A0A] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#00C853]/40"
              style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}
            />
          </div>
          <div>
            <label htmlFor="lead-role" className="mb-1 block text-xs font-medium text-[#4B5563]">
              Your role
            </label>
            <input
              id="lead-role"
              type="text"
              placeholder="Optional"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-sm text-[#0A0A0A] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#00C853]/40"
              style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}
            />
          </div>
        </div>

        {status === "error" && (
          <p className="text-sm text-red-500">Couldn&apos;t save — try again?</p>
        )}
        {status === "rate_limit" && (
          <p className="text-sm text-red-500">You&apos;ve submitted recently — check your inbox.</p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00C853] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#00A846] disabled:opacity-60"
        >
          {status === "submitting" ? (
            <>
              <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            "Send Me This Report →"
          )}
        </button>
      </form>
    </div>
  )
}

/* ─── Share buttons ─── */

type ShareButtonProps = {
  url: string
  label?: string
  variant?: "light" | "dark"
}

export function ShareButton({ url, label = "Share results", variant = "light" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      trackEvent('share_button_clicked')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement("textarea")
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all"
      style={
        variant === "dark"
          ? {
              background: copied ? "rgba(0, 200, 83, 0.2)" : "rgba(255, 255, 255, 0.1)",
              border: copied ? "1px solid #00C853" : "1px solid rgba(255, 255, 255, 0.2)",
              color: "#FFFFFF",
            }
          : {
              background: copied ? "#F0FDF4" : "#FFFFFF",
              border: copied ? "1px solid #BBF7D0" : "1px solid #E5E7EB",
              color: copied ? "#00C853" : "#4B5563",
            }
      }
    >
      {copied ? (
        <>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L6.5 11.5L13 5" stroke={variant === "dark" ? "#FFFFFF" : "#00C853"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="9" height="9" rx="2" stroke={variant === "dark" ? "#FFFFFF" : "#4B5563"} strokeWidth="1.5"/><path d="M3 11V3a2 2 0 012-2h8" stroke={variant === "dark" ? "#FFFFFF" : "#4B5563"} strokeWidth="1.5" strokeLinecap="round"/></svg>
          {label}
        </>
      )}
    </button>
  )
}
