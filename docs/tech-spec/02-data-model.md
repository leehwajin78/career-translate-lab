# 02 — 데이터 모델 설계

> **DBMS**: PostgreSQL 15 (Supabase)  
> **네이밍 규칙**: snake_case, 테이블명 복수형  
> **시간대**: UTC (표시는 KST 변환)

---

## 1. ERD 개요

```
profiles ──────────────────────────────────────┐
    │ 1                                          │
    │                                            │
    ├─────── 1:N ──────── free_diagnostics       │
    │                         │                  │
    ├─────── 1:N ──────── memberships            │
    │                         │ 1                │
    │                         │                  │
    │                    1:1  ▼                  │
    │              coaching_sessions             │
    │                    │ 1                     │
    │                    │                       │
    │              1:N   ▼                       │
    │          coaching_answers                  │
    │                    │ 1:1                   │
    │                    ▼                       │
    │           coaching_reports                 │
    │                                            │
    ├─────── 1:N ──────── payments               │
    │                                            │
    └─────── 1:N ──────── leads ─────────────────┘
                              │
                         1:N  ▼
                       lead_notes
```

---

## 2. 테이블 스키마

### 2-1. `profiles` — 사용자 프로필

```sql
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT,
  phone         TEXT,
  role          TEXT NOT NULL DEFAULT 'guest'
                CHECK (role IN ('guest','member','admin')),
  career_years  TEXT,                    -- '10~15년' 등 선택값
  field         TEXT,                    -- 전문 분야
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 프로필 조회" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "본인 프로필 수정" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin 전체 조회" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

---

### 2-2. `free_diagnostics` — 무료 진단 (15문항)

```sql
CREATE TABLE free_diagnostics (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email           TEXT NOT NULL,           -- 비로그인 수집용
  name            TEXT,
  career_years    TEXT,
  answers         JSONB NOT NULL DEFAULT '{}',
  -- answers 구조: { "q1": "...", "q2": "...", ... "q15": "..." }
  bonus_checks    TEXT[] DEFAULT '{}',     -- 보유 자료 체크리스트
  consent_at      TIMESTAMPTZ NOT NULL,
  score           JSONB,
  -- score 구조:
  -- {
  --   "total": 72,
  --   "identityLanguage": 15,
  --   "coreValues": 18,
  --   "expertisePositioning": 14,
  --   "targetClarity": 12,
  --   "marketAssets": 13,
  --   "diagnosisType": "hidden-expert",
  --   "recommendedPackage": "build"
  -- }
  report_sent_at  TIMESTAMPTZ,
  status          TEXT NOT NULL DEFAULT 'in_progress'
                  CHECK (status IN ('in_progress','completed','report_sent')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address      INET                     -- 어뷰징 탐지용
);

CREATE INDEX idx_free_diagnostics_email  ON free_diagnostics(email);
CREATE INDEX idx_free_diagnostics_status ON free_diagnostics(status);
CREATE INDEX idx_free_diagnostics_created ON free_diagnostics(created_at DESC);

-- RLS: 본인 이메일 or Admin
ALTER TABLE free_diagnostics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "본인 진단 조회" ON free_diagnostics
  FOR SELECT USING (email = (SELECT email FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Admin 전체 조회" ON free_diagnostics
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

---

### 2-3. `memberships` — 유료 서비스 가입

```sql
CREATE TABLE memberships (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_key     TEXT NOT NULL
                  CHECK (product_key IN ('diagnosis','build','launch','partner')),
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN (
                    'pending',       -- 신청 접수
                    'paid',          -- 결제 완료
                    'active',        -- 진행 중
                    'completed',     -- 완료
                    'cancelled',     -- 취소
                    'refunded'       -- 환불
                  )),
  started_at      TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  payment_id      UUID REFERENCES payments(id) ON DELETE SET NULL,
  assigned_admin  UUID REFERENCES profiles(id),  -- 담당 코치
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_memberships_profile ON memberships(profile_id);
CREATE INDEX idx_memberships_status  ON memberships(status);

-- RLS
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "본인 멤버십 조회" ON memberships
  FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Admin 전체 관리" ON memberships
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

---

### 2-4. `coaching_sessions` — 코칭 세션 (42문항)

```sql
CREATE TABLE coaching_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id   UUID NOT NULL UNIQUE REFERENCES memberships(id) ON DELETE CASCADE,
  profile_id      UUID NOT NULL REFERENCES profiles(id),
  status          TEXT NOT NULL DEFAULT 'in_progress'
                  CHECK (status IN (
                    'in_progress',
                    'submitted',
                    'analyzing',
                    'analyzed',
                    'finalized'
                  )),
  submitted_at    TIMESTAMPTZ,
  analyzed_at     TIMESTAMPTZ,
  finalized_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coaching_sessions_profile ON coaching_sessions(profile_id);
CREATE INDEX idx_coaching_sessions_status  ON coaching_sessions(status);

ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "본인 세션 조회" ON coaching_sessions
  FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Admin 전체 관리" ON coaching_sessions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

---

### 2-5. `coaching_answers` — 문항별 답변

```sql
CREATE TABLE coaching_answers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID NOT NULL REFERENCES coaching_sessions(id) ON DELETE CASCADE,
  question_id     INTEGER NOT NULL CHECK (question_id BETWEEN 1 AND 42),
  text_answer     TEXT,
  voice_url       TEXT,           -- Supabase Storage URL
  voice_mime      TEXT,           -- audio/webm, audio/mp4 등
  voice_duration  INTEGER,        -- 초 단위
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (session_id, question_id)
);

CREATE INDEX idx_coaching_answers_session ON coaching_answers(session_id);

-- Storage 버킷: voice-recordings
-- 경로 패턴: {session_id}/{question_id}.{ext}
-- 접근 제어: Private (Signed URL, 1시간 TTL)
```

---

### 2-6. `coaching_reports` — AI 분석 결과

```sql
CREATE TABLE coaching_reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID NOT NULL UNIQUE REFERENCES coaching_sessions(id) ON DELETE CASCADE,
  brand_profile   JSONB NOT NULL DEFAULT '{}',
  -- brand_profile 구조:
  -- {
  --   "oneLiner": "30년 제조업 경험으로...",
  --   "coreValues": ["전문성", "현장감", "문제해결"],
  --   "strengthStatement": "...",
  --   "targetAudience": "...",
  --   "differentiator": "...",
  --   "keyMessages": ["...", "..."],
  --   "suggestedTitle": "...",
  --   "suggestedBio": "..."
  -- }
  question_insights JSONB DEFAULT '[]',
  -- [{ questionId, matchedPattern, brandingSignal, quote }, ...]
  model_used      TEXT DEFAULT 'gpt-4o',
  tokens_used     INTEGER,
  generated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finalized_by    UUID REFERENCES profiles(id),  -- Admin이 최종 확정
  finalized_at    TIMESTAMPTZ,
  version         INTEGER NOT NULL DEFAULT 1      -- 재생성 시 증가
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
```

---

### 2-7. `payments` — 결제 내역

```sql
CREATE TABLE payments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id        UUID NOT NULL REFERENCES profiles(id),
  product_key       TEXT NOT NULL,
  amount            INTEGER NOT NULL,            -- 원화 단위
  currency          TEXT NOT NULL DEFAULT 'KRW',
  status            TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN (
                      'pending','authorized','paid','cancelled',
                      'partial_refunded','refunded','failed'
                    )),
  pg_provider       TEXT NOT NULL DEFAULT 'tosspayments',
  pg_order_id       TEXT NOT NULL UNIQUE,        -- 우리 쪽 주문 ID
  pg_payment_key    TEXT UNIQUE,                 -- 토스 결제 키
  pg_receipt_url    TEXT,
  paid_at           TIMESTAMPTZ,
  cancelled_at      TIMESTAMPTZ,
  cancel_reason     TEXT,
  metadata          JSONB DEFAULT '{}',          -- 추가 정보
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_profile  ON payments(profile_id);
CREATE INDEX idx_payments_pg_order ON payments(pg_order_id);
CREATE INDEX idx_payments_status   ON payments(status);

-- 보안: 결제 테이블은 Service Role만 직접 접근
-- 클라이언트는 Edge Function 경유만 허용
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "본인 결제 조회" ON payments
  FOR SELECT USING (profile_id = auth.uid());
-- INSERT/UPDATE/DELETE: Edge Function (service_role)만 허용
```

---

### 2-8. `leads` — 영업 리드

```sql
CREATE TABLE leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT NOT NULL,
  name            TEXT,
  phone           TEXT,
  source          TEXT NOT NULL
                  CHECK (source IN (
                    'free_diagnosis','consultation_form',
                    'manual','referral','sns'
                  )),
  status          TEXT NOT NULL DEFAULT 'new'
                  CHECK (status IN (
                    'new','contacted','qualified',
                    'converted','lost'
                  )),
  free_diagnosis_id UUID REFERENCES free_diagnostics(id),
  converted_membership_id UUID REFERENCES memberships(id),
  assigned_to     UUID REFERENCES profiles(id),  -- 담당 Admin
  score           INTEGER,                        -- 리드 스코어 (0~100)
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lead_notes (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id   UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id),
  content   TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_email  ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);

-- Admin 전용
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin 전체 관리" ON leads
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

---

## 3. 주요 인덱스 전략

| 테이블 | 인덱스 | 이유 |
|---|---|---|
| free_diagnostics | email, status, created_at | 이메일 중복 체크, Admin 필터링 |
| coaching_answers | session_id | 세션별 전체 답변 조회 |
| memberships | profile_id, status | 마이페이지 진행 상태 |
| leads | email, status, source | Admin CRM 필터 |
| payments | pg_order_id | Webhook 결제 확인 |

---

## 4. 마이그레이션 전략

```
/supabase/migrations/
  20260615_001_init_profiles.sql
  20260615_002_free_diagnostics.sql
  20260615_003_memberships.sql
  20260615_004_coaching.sql
  20260615_005_payments.sql
  20260615_006_leads.sql
  20260615_007_rls_policies.sql
  20260615_008_indexes.sql
  20260615_009_triggers.sql   ← updated_at 자동 갱신
```

### updated_at 자동 갱신 트리거

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 각 테이블에 적용
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- (memberships, coaching_sessions, leads에도 동일 적용)
```

---

## 5. 데이터 보존 정책

| 데이터 | 보존 기간 | 삭제 방식 |
|---|---|---|
| 무료 진단 | 2년 | Soft delete (deleted_at) |
| 코칭 답변 (음성) | 계약 종료 후 6개월 | Storage 자동 만료 정책 |
| 코칭 답변 (텍스트) | 계약 종료 후 2년 | Soft delete |
| 결제 내역 | 5년 (국세청 기준) | 삭제 불가 |
| 리드 정보 | 전환 후 2년 / 미전환 1년 | Cron job 자동 삭제 |
| 로그 (auth events) | 90일 | Supabase 자동 만료 |
