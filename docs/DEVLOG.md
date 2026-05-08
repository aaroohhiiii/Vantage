# DEVLOG
# Prune Dev Log

## Day 1 — 2025-01-05
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

**Plan for tomorrow:**
- Build the audit engine (core calculation logic)
- Write 8 unit tests for audit engine
- Create 3-step form component
- Hook up API route and test end-to-end

---

## Day 2 — 2025-01-06
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
