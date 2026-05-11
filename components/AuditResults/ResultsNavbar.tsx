"use client"

import Link from "next/link"
import Image from "next/image"
import { Download, Shield } from "lucide-react"

export function ResultsNavbar() {
  return (
    <header className="relative z-10 border-b border-gray-800 bg-black/80 backdrop-blur-lg px-6 py-6 print:hidden">
      <div className="mx-auto w-full max-w-7xl lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/Logo.png"
              alt="Vantage"
              width={44}
              height={44}
              className="rounded-xl shadow-lg"
            />
            <span
              className="text-xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Vantage
            </span>
          </div>

          {/* Badge */}
          <div className="flex items-center gap-4">
            <div
              className="hidden items-center gap-2 rounded-full px-4 py-2 text-xs font-medium sm:flex shadow-sm"
              style={{
                background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
                border: "1px solid #00C85320",
                color: "#00C853",
              }}
            >
              <Shield className="h-3.5 w-3.5" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#00C853] animate-pulse-glow" />
              Powered by Credex
            </div>
            <Link
              href="/audit/new"
              className="btn-primary rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-lg"
            >
              Free Audit
            </Link>
            <button 
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-900/50 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
            >
              <Download className="h-3.3 w-3" /> Download PDF
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
