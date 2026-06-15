-- =============================================================
-- 004 — 문항별 답변: coaching_answers
-- 의존: coaching_sessions (003)
-- =============================================================

-- ──────────────────────────────────────────────────────────────
-- coaching_answers — 문항별 텍스트/음성 답변
-- ──────────────────────────────────────────────────────────────
CREATE TABLE coaching_answers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID NOT NULL REFERENCES coaching_sessions(id) ON DELETE CASCADE,
  question_id     INTEGER NOT NULL CHECK (question_id BETWEEN 1 AND 42),
  text_answer     TEXT,
  voice_url       TEXT,           -- Supabase Storage URL (voice-recordings 버킷)
  voice_mime      TEXT,           -- audio/webm, audio/mp4 등
  voice_duration  INTEGER,        -- 초 단위
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (session_id, question_id)
);

-- Storage 버킷: voice-recordings
-- 경로 패턴: {session_id}/{question_id}.{ext}
-- 접근 제어: Private (Signed URL, 1시간 TTL)

CREATE INDEX idx_coaching_answers_session ON coaching_answers(session_id);

ALTER TABLE coaching_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 답변 조회" ON coaching_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM coaching_sessions cs
      WHERE cs.id = session_id AND cs.profile_id = auth.uid()
    )
  );

CREATE POLICY "본인 답변 작성·수정" ON coaching_answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM coaching_sessions cs
      WHERE cs.id = session_id AND cs.profile_id = auth.uid()
        AND cs.status = 'in_progress'
    )
  );

CREATE POLICY "본인 답변 수정" ON coaching_answers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM coaching_sessions cs
      WHERE cs.id = session_id AND cs.profile_id = auth.uid()
        AND cs.status = 'in_progress'
    )
  );

CREATE POLICY "Admin 전체 관리" ON coaching_answers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- updated_at 트리거 (coaching_answers는 TIMESTAMPTZ 컬럼만 있어 직접 갱신)
CREATE TRIGGER trg_coaching_answers_updated_at
  BEFORE UPDATE ON coaching_answers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
