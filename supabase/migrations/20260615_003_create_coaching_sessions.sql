-- =============================================================
-- 003 — 코칭 세션 · AI 리포트: coaching_sessions · coaching_reports
-- 의존: profiles (001), memberships (002)
-- =============================================================

-- ──────────────────────────────────────────────────────────────
-- coaching_sessions — 코칭 세션 (42문항)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE coaching_sessions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id  UUID NOT NULL UNIQUE REFERENCES memberships(id) ON DELETE CASCADE,
  profile_id     UUID NOT NULL REFERENCES profiles(id),
  status         TEXT NOT NULL DEFAULT 'in_progress'
                 CHECK (status IN (
                   'in_progress', 'submitted', 'analyzing', 'analyzed', 'finalized'
                 )),
  submitted_at   TIMESTAMPTZ,
  analyzed_at    TIMESTAMPTZ,
  finalized_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coaching_sessions_profile ON coaching_sessions(profile_id);
CREATE INDEX idx_coaching_sessions_status  ON coaching_sessions(status);

ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 세션 조회" ON coaching_sessions
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "본인 세션 수정" ON coaching_sessions
  FOR UPDATE USING (profile_id = auth.uid());

CREATE POLICY "Admin 전체 관리" ON coaching_sessions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE TRIGGER trg_coaching_sessions_updated_at
  BEFORE UPDATE ON coaching_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ──────────────────────────────────────────────────────────────
-- coaching_reports — AI 분석 결과
-- ──────────────────────────────────────────────────────────────
CREATE TABLE coaching_reports (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id        UUID NOT NULL UNIQUE REFERENCES coaching_sessions(id) ON DELETE CASCADE,
  brand_profile     JSONB NOT NULL DEFAULT '{}',
  question_insights JSONB DEFAULT '[]',
  model_used        TEXT DEFAULT 'gpt-4o',
  tokens_used       INTEGER,
  generated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finalized_by      UUID REFERENCES profiles(id),
  finalized_at      TIMESTAMPTZ,
  version           INTEGER NOT NULL DEFAULT 1
);

ALTER TABLE coaching_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 리포트 조회" ON coaching_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM coaching_sessions cs
      WHERE cs.id = session_id AND cs.profile_id = auth.uid()
    )
  );

CREATE POLICY "Admin 전체 관리" ON coaching_reports
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
