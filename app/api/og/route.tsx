import { ImageResponse } from "@vercel/og"

export const runtime = "edge"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const savings = searchParams.get("savings") ?? "0"
  const tools = searchParams.get("tools") ?? "0"

  const savingsNum = Number(savings)
  const isOptimal = savingsNum < 100

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0A0A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Gradient orb top-left */}
        <div
          style={{
            position: "absolute",
            top: -80,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,200,83,0.25) 0%, transparent 70%)",
          }}
        />
        {/* Gradient orb bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: -60,
            right: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,200,83,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "#00C853",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            P
          </div>
          <span
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#E5E7EB",
              letterSpacing: "-0.02em",
            }}
          >
            Vantage
          </span>
        </div>

        {/* Label */}
        <div
          style={{
            fontSize: 24,
            color: "#9CA3AF",
            marginBottom: 16,
            letterSpacing: "0.05em",
            textTransform: "uppercase" as const,
          }}
        >
          AI Spend Audit
        </div>

        {/* Main number */}
        {isOptimal ? (
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#F1F5F9",
              lineHeight: 1,
            }}
          >
            Stack Optimized ✓
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 96,
                fontWeight: 700,
                color: "#00C853",
                lineHeight: 1,
              }}
            >
              ${savingsNum.toLocaleString()}
            </span>
            <span
              style={{
                fontSize: 32,
                color: "#9CA3AF",
                fontWeight: 500,
              }}
            >
              /mo
            </span>
          </div>
        )}

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "#64748B",
            marginTop: 12,
          }}
        >
          {isOptimal
            ? `${tools} tools audited — no changes needed`
            : `potential monthly savings across ${tools} tools`}
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 18,
            color: "#475569",
          }}
        >
          <span>Powered by</span>
          <span style={{ color: "#00C853", fontWeight: 600 }}>Credex</span>
          <span>·</span>
          <span>credex.rocks</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
