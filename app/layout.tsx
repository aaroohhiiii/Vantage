import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Vantage — Stop Overspending on AI Tools",
  description:
    "Audit your AI stack in 90 seconds. Find redundant subscriptions, overpriced plans, and hidden savings opportunities.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white overflow-x-hidden selection:bg-green-100">
        {/* Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
