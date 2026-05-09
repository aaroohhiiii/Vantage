# DEVLOG
# Prune Dev Log

## Day 1 — 07-05-2026
**Hours worked:** 4
**What I did:**
- Created Next.js project and installed all dependencies (Supabase, Resend, Anthropic, Upstash)
- Defined TypeScript types (`AuditResult`, `AuditTool`, `ToolSpend`) in `/lib/types.ts`
- Created `/lib/pricing-data.ts` with official AI tool pricing (Claude, GPT-4, Gemini) + source URLs
- Set up Supabase project, created `audits` and `leads` tables with full schema

- Created skeleton markdown docs: `AGENTS.md`, `PRICING.md`, `ARCHITECTURE.md`

**What I learned:**
- Supabase RLS policies need service role key for writes from API routes
- Environment variable naming (NEXT_PUBLIC_* vs private) matters for security
- Next.js 15 uses App Router; file structure changed from training data
- github workflow pipelines are strict and need us the devs to implementour code sith strict quality strictness . 

**Blockers / what I'm stuck on:**
- None — Day 1 foundation complete
- Developing on a Mac (arm64) and the GitHub Actions runner is on Linux (x64), npm struggles to properly sync nested optional cross-platform dependencies (like the WebAssembly bindings @emnapi/core uses behind the scenes). npm ci is extremely strict and crashes if the Linux-specific optional binaries aren't perfectly mapped out in a Mac-generated lockfile.

**Plan for tomorrow:**
- Build the audit engine (core calculation logic)
- Write 8 unit tests for audit engine
- Create 3-step form component
- Hook up API route and test end-to-end

---

## Day 2 — 08-05-2026
**Hours worked:** 7
**What I did:**
- Configured `.env.local` with all secrets (Supabase, Anthropic, Resend, Upstash)
- Built landing page shell at `/app/page.tsx` with hero section and CTA
- Built audit engine at `/lib/audit-engine.ts` — calculates monthly/annual savings for each tool
- Wrote 8 Jest tests at `/lib/__tests__/audit-engine.test.ts` — all passing
- Created 3-step form component at `/app/components/AuditForm.tsx` (Tool Selection → Spend Entry → Review)
- Built API route `/app/api/audit/route.ts` — receives form data, runs audit engine, saves to DB
- Fixed Supabase client exports (`getSupabaseServerClient`) for API route imports
- Integrated form into landing page — users can now submit audits end-to-end
- Set up Resend helper at `/lib/resend.ts` for future email notifications

**What I learned:**
- Audit engine must handle missing spend data gracefully (assume $0)
- API routes need `application/json` content-type headers
- Server components can't use form submissions directly — need `'use server'` actions or API routes
- TypeScript discriminated unions help model multi-step forms cleanly

**Blockers / what I'm stuck on:**
- None — Day 2 core logic complete and tested

**Plan for tomorrow:**
- Add AI summary generation (Claude API) to audit results
- Build results page (`/app/audit/[id]/page.tsx`)
- Add lead capture form on results page
- Email notification when audit completes
- Deploy to Vercel for live testing

---

## Day 3 — 09-05-2026
**Hours worked:** 8
**What I did:**
- Debugged 3-step form — replaced shadcn Select with native HTML select (hydration mismatch issue).
- Form now fully functional: Tool selection → Spend entry → Team context with real-time total spend calculations.
- Overhauled `PricingDatabase` in `lib/pricingData.ts` to support  AI tools (ChatGPT, Claude, Cursor, Windsurf, APIs) with complex pricing rules (minimum seats, usage-based caps).
- Built core audit logic in `lib/auditEngine.ts` to process 6 specific rule groups: misconfigured seats, redundancy (e.g., Cursor + Copilot), credex negotiation flags, and noise filtering.
- Wrote a comprehensive Jest test suite (`tests/auditEngine.test.ts`) validating all audit edge cases.
- Built the final `/app/audit/[id]/page.tsx` results dashboard with a premium, finance-defensible UI and dark-themed hero banner.
- Implemented `lib/aiSummary.ts` to generate tailored, actionable AI summaries using Anthropic API.
- Integrated UI support for all new tools via `ToolIcon.tsx` and added respective assets to `public/`.
- Cleaned up repository structure by moving all `.md` files out of `docs/` to the project root.

**What I learned:**
- Grouping complex audit logic into specific rule sets (e.g., redundancy vs overpaying) makes testing much more predictable and scalable.
- shadcn Select component had z-index/click issues in dark theme — native select more reliable.
- Hydration mismatch happens when server renders different HTML than client.
- `Next.js` App Router requires careful delineation between Server Components (for data fetching/DB operations) and Client Components (for interactive results dashboards).

**Blockers / what I'm stuck on:**
- None — the entire audit pipeline from form submission to AI summary display is now robust.deployment ti vercek is left .

**Plan for tomorrow:**
- Polish the lead capture form workflow (email + company name) on the results page.
- Finalize email notifications via Resend for user engagement.
- Perform final end-to-end user tests across mobile and desktop.
- Deploy MVP to Vercel for live testing and gather initial feedback.
