import Link from "next/link"

import SpendForm from "@/components/SpendForm"
import PixelBlast from "@/components/ui/PixelBlast"

export default function NewAuditPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black">
      {/* Background PixelBlast */}
      <div className="absolute inset-0 z-0">
        <PixelBlast
          variant="square"
          pixelSize={4}
          color="#9de396"
          patternScale={2}
          patternDensity={1}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.5}
          edgeFade={0.25}
          transparent
        />
      </div>

      <div className="dot-grid pointer-events-none absolute inset-0 z-0 opacity-10" />

      {/* Content */}
      <div className="relative z-10">
        <header className="border-b border-gray-800 bg-black/80 backdrop-blur-lg">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
            <Link href="/" className="text-lg font-semibold text-white">
              Vantage
            </Link>
            <Link href="/" className="text-sm text-gray-400 hover:text-white">
              ← Back to home
            </Link>
          </div>
        </header>

        <section className="mx-auto w-full max-w-6xl px-6 py-10">
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#00C853]">
              Start your audit
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              What AI tools does your team pay for?
            </h1>
            <p className="mt-3 text-gray-300">
              3 quick steps · completely free · no email required to see results
            </p>
          </div>

          <SpendForm />
        </section>
      </div>
    </main>
  )
}
