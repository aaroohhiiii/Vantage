import type { ToolName } from "@/lib/types"

type ToolIconProps = {
  tool: ToolName
  size?: number
  className?: string
}

// Inline SVG icons for each AI tool using simplified, recognizable shapes
export function ToolIcon({ tool, size = 24, className = "" }: ToolIconProps) {
  const icons: Record<ToolName, JSX.Element> = {
    cursor: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-label="Cursor"
      >
        <rect width="24" height="24" rx="6" fill="#1A1A2E" />
        <path
          d="M7 4L7 17L10.5 13.5L13 19L14.5 18.3L12 12.5L16.5 12.5L7 4Z"
          fill="white"
        />
      </svg>
    ),
    "github-copilot": (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-label="GitHub Copilot"
      >
        <rect width="24" height="24" rx="6" fill="#1B1F24" />
        <path
          d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.293 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"
          fill="white"
          transform="scale(0.75) translate(4, 4)"
        />
      </svg>
    ),
    claude: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-label="Claude"
      >
        <rect width="24" height="24" rx="6" fill="#CC785C" />
        <text
          x="12"
          y="17"
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill="white"
          fontFamily="serif"
        >
          A
        </text>
      </svg>
    ),
    chatgpt: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-label="ChatGPT"
      >
        <rect width="24" height="24" rx="6" fill="#10A37F" />
        <path
          d="M12 5.5C9.51 5.5 7.5 7.51 7.5 10c0 .95.28 1.83.76 2.57L7 14h3.5c.17.03.33.06.5.06 2.49 0 4.5-2.01 4.5-4.5S14.49 5.5 12 5.5zm0 7.5c-.83 0-1.59-.33-2.14-.86l-.36.86H8l.74-1.74A3.5 3.5 0 018.5 10c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"
          fill="white"
          transform="scale(0.85) translate(1.8, 1.8)"
        />
        <circle cx="12" cy="10" r="3" fill="white" opacity="0.9" />
      </svg>
    ),
    "anthropic-api": (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-label="Anthropic API"
      >
        <rect width="24" height="24" rx="6" fill="#2D1B12" />
        <text
          x="12"
          y="17"
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill="#CC785C"
          fontFamily="serif"
        >
          A
        </text>
      </svg>
    ),
    "openai-api": (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-label="OpenAI API"
      >
        <rect width="24" height="24" rx="6" fill="#1A1A1A" />
        <path
          d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073z"
          fill="white"
          transform="scale(0.5) translate(12, 11)"
        />
      </svg>
    ),
    gemini: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-label="Gemini"
      >
        <rect width="24" height="24" rx="6" fill="#1A1A2E" />
        <path
          d="M12 3L14.5 10H21L15.5 14.5L17.5 21L12 17L6.5 21L8.5 14.5L3 10H9.5L12 3Z"
          fill="url(#gem-gradient)"
        />
        <defs>
          <linearGradient id="gem-gradient" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4285F4" />
            <stop offset="0.5" stopColor="#9C27B0" />
            <stop offset="1" stopColor="#EA4335" />
          </linearGradient>
        </defs>
      </svg>
    ),
    windsurf: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-label="Windsurf"
      >
        <rect width="24" height="24" rx="6" fill="#0F172A" />
        <path
          d="M4 16C6 12 10 8 20 6C18 10 14 14 4 16Z"
          fill="url(#wind-gradient)"
        />
        <path
          d="M4 19C7 16 12 13 20 12C17 16 12 19 4 19Z"
          fill="url(#wind-gradient-2)"
          opacity="0.7"
        />
        <defs>
          <linearGradient id="wind-gradient" x1="4" y1="6" x2="20" y2="16" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A5FA" />
            <stop offset="1" stopColor="#818CF8" />
          </linearGradient>
          <linearGradient id="wind-gradient-2" x1="4" y1="12" x2="20" y2="19" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A5FA" />
            <stop offset="1" stopColor="#818CF8" />
          </linearGradient>
        </defs>
      </svg>
    ),
  }

  return icons[tool] ?? null
}

/** Display names for each tool */
export const TOOL_DISPLAY_NAMES: Record<ToolName, string> = {
  cursor: "Cursor",
  "github-copilot": "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  "anthropic-api": "Anthropic API",
  "openai-api": "OpenAI API",
  gemini: "Gemini",
  windsurf: "Windsurf",
}

/** Short descriptions per tool for the selector */
export const TOOL_DESCRIPTIONS: Record<ToolName, string> = {
  cursor: "AI-native code editor",
  "github-copilot": "GitHub's AI pair programmer",
  claude: "Anthropic's reasoning model",
  chatgpt: "OpenAI's chat assistant",
  "anthropic-api": "Anthropic Claude API usage",
  "openai-api": "OpenAI GPT API usage",
  gemini: "Google's multimodal AI",
  windsurf: "Codeium's AI code editor",
}
