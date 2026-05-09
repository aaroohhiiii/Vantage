-- ═══════════════════════════════════════════════════════════════
-- Prune — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Audits table ──────────────────────────────────────────────
-- Stores audit inputs, results, and computed flags.
-- No PII in this table — safe to read publicly via anon key.
CREATE TABLE IF NOT EXISTS audits (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  input           JSONB NOT NULL,          -- AuditInput (tools[], teamSize, useCase)
  results         JSONB NOT NULL,          -- ToolAuditResult[]
  total_monthly_savings NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_annual_savings  NUMERIC(10,2) NOT NULL DEFAULT 0,
  ai_summary      TEXT NOT NULL DEFAULT '',
  is_optimal      BOOLEAN NOT NULL DEFAULT false,
  show_credex     BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for quick lookups by ID (primary key already indexed)
-- Index for sorting by creation date
CREATE INDEX IF NOT EXISTS idx_audits_created_at ON audits (created_at DESC);

-- ── Leads table ───────────────────────────────────────────────
-- Contains PII — only accessible via service role key.
CREATE TABLE IF NOT EXISTS leads (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_id        UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  company_name    TEXT,
  role            TEXT,
  team_size       INTEGER,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for looking up leads by audit
CREATE INDEX IF NOT EXISTS idx_leads_audit_id ON leads (audit_id);
-- Index for deduplication checks
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);

-- ── Row Level Security ────────────────────────────────────────

-- Audits: allow public read (no PII), restrict writes to service role
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read of audits"
  ON audits FOR SELECT
  USING (true);

CREATE POLICY "Allow service role insert audits"
  ON audits FOR INSERT
  WITH CHECK (true);

-- Leads: restrict all access to service role only (contains PII)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role insert leads"
  ON leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow service role read leads"
  ON leads FOR SELECT
  USING (true);
