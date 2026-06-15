-- =============================================================
-- 001 — 기반 테이블: profiles · free_diagnostics · leads · lead_notes
-- 의존: auth.users (Supabase 내장)
-- =============================================================

-- ──────────────────────────────────────────────────────────────
-- updated_at 자동 갱신 트리거 함수 (전체 마이그레이션에서 공유)
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ──────────────────────────────────────────────────────────────
-- profiles — 사용자 프로필
-- ──────────────────────────────────────────────────────────────
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT,
  phone         TEXT,
  role          TEXT NOT NULL DEFAULT 'guest'
                CHECK (role IN ('guest', 'member', 'admin')),
  career_years  TEXT,
  field         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 프로필 조회" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "본인 프로필 수정" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin 전체 조회" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ──────────────────────────────────────────────────────────────
-- free_diagnostics — 무료 진단 제출
-- ──────────────────────────────────────────────────────────────
CREATE TABLE free_diagnostics (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email           TEXT NOT NULL,
  name            TEXT,
  career_years    TEXT,
  answers         JSONB NOT NULL DEFAULT '{}',
  bonus_checks    TEXT[] DEFAULT '{}',
  consent_at      TIMESTAMPTZ NOT NULL,
  score           JSONB,
  report_sent_at  TIMESTAMPTZ,
  status          TEXT NOT NULL DEFAULT 'in_progress'
                  CHECK (status IN ('in_progress', 'completed', 'report_sent')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address      INET
);

CREATE INDEX idx_free_diagnostics_email   ON free_diagnostics(email);
CREATE INDEX idx_free_diagnostics_status  ON free_diagnostics(status);
CREATE INDEX idx_free_diagnostics_created ON free_diagnostics(created_at DESC);

ALTER TABLE free_diagnostics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 진단 조회" ON free_diagnostics
  FOR SELECT USING (
    email = (SELECT email FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Admin 전체 관리" ON free_diagnostics
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 비로그인 제출 허용 (INSERT 공개)
CREATE POLICY "비로그인 진단 제출" ON free_diagnostics
  FOR INSERT WITH CHECK (true);


-- ──────────────────────────────────────────────────────────────
-- leads — 영업 리드 (CRM)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE leads (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email                   TEXT NOT NULL,
  name                    TEXT,
  phone                   TEXT,
  source                  TEXT NOT NULL
                          CHECK (source IN (
                            'free_diagnosis', 'consultation_form',
                            'manual', 'referral', 'sns'
                          )),
  status                  TEXT NOT NULL DEFAULT 'new'
                          CHECK (status IN (
                            'new', 'contacted', 'qualified', 'converted', 'lost'
                          )),
  free_diagnosis_id       UUID REFERENCES free_diagnostics(id),
  converted_membership_id UUID,                     -- memberships 생성 후 FK 추가
  assigned_to             UUID REFERENCES profiles(id),
  score                   INTEGER,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_email  ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin 전체 관리" ON leads
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 비로그인 상담 신청 허용 (INSERT 공개)
CREATE POLICY "상담 신청 제출" ON leads
  FOR INSERT WITH CHECK (true);

CREATE TRIGGER trg_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ──────────────────────────────────────────────────────────────
-- lead_notes — 리드 메모
-- ──────────────────────────────────────────────────────────────
CREATE TABLE lead_notes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id    UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  author_id  UUID NOT NULL REFERENCES profiles(id),
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin 전체 관리" ON lead_notes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
