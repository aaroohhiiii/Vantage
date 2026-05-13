"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Download, Gift, X, Copy, Check } from "lucide-react"

export function ResultsNavbar() {
  const [showReferModal, setShowReferModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const referralMessage = `Check out my AI tooling audit! If you view my audit, we both get exclusive discounted credits at Credex!\n\n${typeof window !== "undefined" ? window.location.href : ""}`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-screen-2xl px-2 sm:px-6 print:hidden">
        <nav className="glass-card rounded-full px-6 py-3 flex items-center justify-between shadow-sm border border-black/5 bg-white/80 backdrop-blur-lg">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/Logo.png"
              alt="Vantage"
              width={32}
              height={32}
              className="rounded-lg shadow-sm"
            />
            <span className="text-xl font-medium tracking-tight text-[#111]">Vantage</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowReferModal(true)}
              className="hidden md:flex items-center gap-1.5 rounded-full bg-[#111] text-white px-5 py-2.5 text-xs font-semibold hover:bg-black transition-all shadow-sm"
              title="Share the tool and both get exclusive discounted credits at Credex!"
            >
              <Gift className="h-3.5 w-3.5" /> Refer & Earn
            </button>

            <button 
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-full border border-black/5 bg-white px-4 py-2 text-xs font-medium text-[#666] hover:bg-black/5 transition-all"
            >
              <Download className="h-3.5 w-3.5" /> PDF
            </button>
            
            <Link
              href="/audit/new"
              className="bg-[#111] text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-black transition-all"
            >
              New Audit
            </Link>
          </div>
        </nav>
      </header>

      {/* Referral Modal */}
      {showReferModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl border border-black/5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#EAFEF3] text-[#00C853]">
                  <Gift className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#111]">Refer & Earn</h3>
                  <p className="text-xs text-[#666] font-medium">Get exclusive Credex credits</p>
                </div>
              </div>
              <button 
                onClick={() => setShowReferModal(false)}
                className="p-2 rounded-full hover:bg-black/5 transition-colors"
              >
                <X className="h-5 w-5 text-[#666]" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-[#111] font-medium leading-relaxed">
                Share your audit with a friend! If they view it, both of you will receive exclusive discounted credits at Credex.
              </p>
              
              <div className="relative group">
                <div className="w-full bg-[#f9fafb] border border-black/5 rounded-2xl p-4 text-xs font-mono text-[#444] break-all leading-relaxed pr-12">
                  {referralMessage}
                </div>
                <button 
                  onClick={handleCopy}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-white border border-black/5 shadow-sm hover:bg-black hover:text-white transition-all"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <button 
                onClick={handleCopy}
                className="w-full bg-[#111] text-white rounded-2xl py-4 font-bold text-sm hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" /> Copied to Clipboard
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy Referral Message
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
