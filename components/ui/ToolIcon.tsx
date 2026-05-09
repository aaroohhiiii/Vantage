import Image from "next/image"
import type { ToolName } from "@/lib/types"

type ToolIconProps = {
  tool: ToolName
  size?: number
  className?: string
}

// Inline SVG icons for each AI tool using simplified, recognizable shapes
export function ToolIcon({ tool, size = 24, className = "" }: ToolIconProps) {
  const imageMap: Partial<Record<ToolName, string>> = {
    cursor: "/cursor.jpeg",
    claude: "/claude.png",
    chatgpt: "/chatgpt.png",
    "anthropic-api": "/anthropic.png",
    "openai-api": "/openai.png",
    gemini: "/gemini.jpeg",
    windsurf: "/windsurf.png",
  }

  const src = imageMap[tool]
  
  if (src) {
    return (
      <Image 
        src={src} 
        alt={TOOL_DISPLAY_NAMES[tool] ?? tool} 
        width={size} 
        height={size} 
        className={`rounded-md object-cover ${className}`}
      />
    )
  }

  // Fallback for github-copilot if it doesn't have an image
  if (tool === "github-copilot") {
    return (
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
    )
  }

  return null
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
