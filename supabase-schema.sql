-- ============================================================
-- Supabase Schema for Portfolio Admin Panel
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: case_studies
-- ============================================================
CREATE TABLE IF NOT EXISTS case_studies (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL DEFAULT '',
  description   TEXT DEFAULT '',
  thumbnail     TEXT DEFAULT '',
  tags          TEXT[] DEFAULT '{}',
  is_password_protected BOOLEAN DEFAULT false,
  status        TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  content       JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: posts
-- ============================================================
CREATE TABLE IF NOT EXISTS posts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL DEFAULT '',
  image         TEXT DEFAULT '',
  date          DATE DEFAULT CURRENT_DATE,
  excerpt       TEXT DEFAULT '',
  content       TEXT DEFAULT '',
  linkedin_url  TEXT DEFAULT '',
  status        TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: page_content
-- ============================================================
CREATE TABLE IF NOT EXISTS page_content (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section     TEXT UNIQUE NOT NULL,
  content     JSONB DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default sections
INSERT INTO page_content (section, content) VALUES
  ('hero',        '{"headline": "", "subheadline": "", "cta_text": "", "cta_url": ""}'),
  ('about',       '{"bio": "", "skills": [], "experience": []}'),
  ('contact',     '{"email": "", "phone": "", "location": ""}')
ON CONFLICT (section) DO NOTHING;

-- ============================================================
-- TABLE: settings
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key         TEXT UNIQUE NOT NULL,
  value       JSONB DEFAULT 'null',
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default settings keys
INSERT INTO settings (key, value) VALUES
  ('site_name',         '"Portfolio"'),
  ('site_description',  '"My portfolio website"'),
  ('og_image',          '""'),
  ('favicon',           '""'),
  ('google_analytics',  '""'),
  ('maintenance_mode',  'false'),
  ('case_study_password', '""')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- TABLE: availability
-- ============================================================
CREATE TABLE IF NOT EXISTS availability (
  id                UUID PRIMARY KEY DEFAULT 'default'::text::uuid,
  weekly_schedule   JSONB DEFAULT '{"monday":{"enabled":false,"start":"09:00","end":"17:00"},"tuesday":{"enabled":false,"start":"09:00","end":"17:00"},"wednesday":{"enabled":false,"start":"09:00","end":"17:00"},"thursday":{"enabled":false,"start":"09:00","end":"17:00"},"friday":{"enabled":false,"start":"09:00","end":"17:00"},"saturday":{"enabled":false,"start":"09:00","end":"17:00"},"sunday":{"enabled":false,"start":"09:00","end":"17:00"}}',
  specific_dates    JSONB DEFAULT '[]',
  meeting_settings  JSONB DEFAULT '{"duration":30,"buffer":15,"advance_notice":24}',
  timezone          TEXT DEFAULT 'UTC',
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (disable for service role access)
-- ============================================================
ALTER TABLE case_studies   DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts          DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_content   DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings       DISABLE ROW LEVEL SECURITY;
ALTER TABLE availability   DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- Auto-update updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_case_studies_updated_at ON case_studies;
CREATE TRIGGER trg_case_studies_updated_at
  BEFORE UPDATE ON case_studies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_page_content_updated_at ON page_content;
CREATE TRIGGER trg_page_content_updated_at
  BEFORE UPDATE ON page_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_settings_updated_at ON settings;
CREATE TRIGGER trg_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_availability_updated_at ON availability;
CREATE TRIGGER trg_availability_updated_at
  BEFORE UPDATE ON availability
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
