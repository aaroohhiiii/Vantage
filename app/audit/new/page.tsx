"use client"

import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"
import SpendForm from "@/components/SpendForm"


export default function NewAuditPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white">
      {/* Background Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.4]">

      </div>
      {/* Content */}
      <div className="relative z-10">
        <header className="relative z-10 border-b border-black/5 bg-white/80 backdrop-blur-lg">
          <div className="mx-auto w-full max-w-7xl px-6 py-6 lg:px-8">
            <nav className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <Image
                  src="/Logo.png"
                  alt="Vantage"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span
                  className="text-xl font-medium tracking-tight text-[#111]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Vantage
                </span>
              </div>

              {/* Back link */}
              <Link href="/" className="text-sm font-medium text-[#666] hover:text-black transition-colors">
                ←
              </Link>
            </nav>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-6 pt-20 pb-32">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-medium tracking-tight text-[#111] sm:text-4xl mb-4">
              What AI tools does your team pay for?
            </h1>

          </div>

          <Suspense fallback={<div className="h-100 w-full animate-pulse rounded-3xl bg-[#f3f4f6]" />}>
            <SpendForm />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
