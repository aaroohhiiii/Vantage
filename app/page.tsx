"use client"

import Link from "next/link"
import { CheckCircle2, ChevronDown, MessageSquareQuote } from "lucide-react"
import Image from "next/image"
import { useEffect } from "react"
import { trackEvent } from "@/lib/analytics"
import dynamic from "next/dynamic"

const PixelBlast = dynamic(() => import("@/components/ui/PixelBlast"), { ssr: false })

export default function Home() {
  useEffect(() => {
    trackEvent('page_view_landing', undefined, { source: 'direct' })
  }, [])

  return (
    <main className="min-h-screen bg-white selection:bg-green-100 antialiased overflow-x-hidden relative">
      {/* Background Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.4]">
        <PixelBlast

        />
      </div>
      {/* Header */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
        <nav className="glass-card rounded-full px-6 py-3 flex items-center justify-between shadow-sm border border-black/5">
          <div className="flex items-center gap-3">
            <Image
              src="/Logo.png"
              alt="Vantage"
              width={32}
              height={32}
              className="rounded-lg shadow-sm"
            />
            <span className="text-xl font-bold tracking-tighter text-[#111]">Vantage</span>
          </div>
          {/*           
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#666]">
            <Link href="#how-it-works" className="hover:text-black">How it works</Link>
            <Link href="#coverage" className="hover:text-black">Tool Coverage</Link>
            <Link href="#testimonials" className="hover:text-black">Testimonials</Link>
          </div> */}

          <Link href="/audit/new" className="bg-[#111] text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-black transition-all">
            Audit My AI Spend
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 px-6 credex-grid overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">


          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-[#111] mb-8 leading-[1.05]">
            Find out if you&apos;re <br />
            <span className="text-[#00C853]">overpaying</span> for AI tools.
          </h1>

          <p className="text-xl text-[#666] max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Free audit. No login. See your exact savings and tool consolidation opportunities in 60 seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/audit/new" className="w-full sm:w-auto bg-[#111] text-white px-12 py-5 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-black transition-all shadow-2xl shadow-black/10">
              Audit My AI Spend
            </Link>

          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="border-y border-black/5 bg-[#fcfcfc] py-8 overflow-hidden relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center items-center gap-x-16 gap-y-6">

          <div className="flex items-center gap-3 text-xs font-bold text-[#666]">
            <CheckCircle2 className="h-4 w-4 text-[#00C853]" /> VERIFIED PRICING
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-[#666]">
            <CheckCircle2 className="h-4 w-4 text-[#00C853]" /> ZERO-DATA STORAGE
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-[#666]">
            <CheckCircle2 className="h-4 w-4 text-[#00C853]" /> ANONYMOUS REPORTING
          </div>
        </div>
      </div>



      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 px-6 bg-[#fcfcfc] relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-[#111] mb-6">Built for Engineering Leaders</h2>
            <p className="text-[#666] font-medium max-w-2xl mx-auto text-lg">Vantage is the trusted optimization partner for high-growth startups and enterprise teams.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Found $340/month in savings we didn't know about. Took 90 seconds.",
                author: "Head of Engineering",
                company: "Series A SaaS company"
              },
              {
                quote: "Already switched from GitHub Copilot Business to Cursor Pro based on this. Saved $18/user/month.",
                author: "CTO",
                company: "12-person startup"
              },
              {
                quote: "We were paying for Claude Team for a single user. Nobody had noticed until the Vantage audit.",
                author: "Engineering Manager",
                company: "B2B startup"
              }
            ].map((t, i) => (
              <div key={i} className="glass-card rounded-[32px] p-10 border border-black/5 flex flex-col justify-between">
                <div>
                  <MessageSquareQuote className="h-8 w-8 text-[#00C853] mb-6 opacity-20" />
                  <p className="text-lg font-medium text-[#111] mb-8 leading-relaxed">&quot;{t.quote}&quot;</p>
                </div>
                <div>
                  <p className="font-bold text-[#111]">{t.author}</p>
                  <p className="text-xs font-medium text-[#666] mt-1">{t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 px-6 bg-white relative z-10 border-t border-black/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-[#111] mb-6">Frequently Asked</h2>
            <p className="text-[#666] font-medium text-lg">Everything you need to know about Vantage audits.</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "Is this actually free?", a: "Yes. There's no plan, no credit card, and no login required. We show you the results first, then optionally ask for your email if you want the PDF report." },
              { q: "How do you calculate savings?", a: "We look at public pricing for each tool and compare it to the most cost-effective alternative. We factor in unused seats, redundancy, and API usage patterns." },
              { q: "How current is the pricing data?", a: "Pricing is verified weekly against official vendor pages (OpenAI, Anthropic, Cursor, etc.). Every recommendation cites its source URL." },
              { q: "Is my data shared or sold?", a: "No. Your audit data is only used to generate your report. We don't sell your data to third parties." },
              { q: "What tools do you cover?", a: "We currently cover Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, and Windsurf." }
            ].map((item, i) => (
              <details key={i} className="group glass-card rounded-[24px] border border-black/5 overflow-hidden">
                <summary className="flex items-center justify-between p-7 cursor-pointer list-none font-bold text-[#111] text-lg">
                  {item.q}
                  <ChevronDown className="h-5 w-5 text-[#666] group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-7 pb-7 text-[#666] font-medium leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 bg-[#111] text-white relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/Logo.png"
                alt="Vantage"
                width={32}
                height={32}
                className="rounded-lg opacity-80"
              />
              <span className="text-xl font-bold tracking-tighter">Vantage</span>
            </div>
            <p className="text-white/40 text-sm font-medium">© 2026 Vantage. All rights reserved.</p>
          </div>

          <div className="flex gap-12 text-sm font-bold text-white/60">

          </div>
        </div>
      </footer>
    </main>
  )
}
