import Link from "next/link"

import SpendForm from "@/components/SpendForm"

export default function NewAuditPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-lg font-semibold text-[#0A0A0A]">
            Vantage
          </Link>
          <Link href="/" className="text-sm text-[#4B5563] hover:text-[#0A0A0A]">
            ← Back to home
          </Link>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#00C853]">
            Start your audit
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[#0A0A0A] sm:text-4xl">
            What AI tools does your team pay for?
          </h1>
          <p className="mt-3 text-[#4B5563]">
            3 quick steps · completely free · no email required to see results
          </p>
        </div>

        <SpendForm />
      </section>
    </main>
  )
}
