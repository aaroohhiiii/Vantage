import type { Metadata } from "next"
import { Inter, Inter_Tight, Roboto_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const interTight = Inter_Tight({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
})

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Vantage — Stop Overspending on AI Tools",
  description:
    "Audit your AI stack in 90 seconds. Find redundant subscriptions, overpriced plans, and hidden savings opportunities. Powered by Credex.",
  openGraph: {
    title: "Vantage — Stop Overspending on AI Tools",
    description:
      "Audit your AI stack in 90 seconds. Find redundant subscriptions and hidden savings opportunities.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">{children}</body>
    </html>
  )
}
