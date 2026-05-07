import { ImageResponse } from "@vercel/og"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "white",
          color: "black",
          fontSize: 48,
          fontWeight: 700,
        }}
      >
        AI Spend Audit
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
