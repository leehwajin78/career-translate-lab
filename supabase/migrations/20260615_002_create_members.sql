-- =============================================================
-- 002 — 결제 · 멤버십 테이블: payments · memberships
-- 의존: profiles (001)
-- =============================================================

-- ──────────────────────────────────────────────────────────────
-- payments — 결제 내역
-- ──────────────────────────────────────────────────────────────
CREATE TABLE payments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id       UUID NOT NULL REFERENCES profiles(id),
  product_key      TEXT NOT NULL,
  amount           INTEGER NOT NULL,
  currency         TEXT NOT NULL DEFAULT 'KRW',
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN (
                     'pending', 'authorized', 'paid', 'cancelled',
                     'partial_refunded', 'refunded', 'failed'
                   )),
  pg_provider      TEXT NOT NULL DEFAULT 'tosspayments',
  pg_order_id      TEXT NOT NULL UNIQUE,
  pg_payment_key   TEXT UNIQUE,
  pg_receipt_url   TEXT,
  paid_at          TIMESTAMPTZ,
  cancelled_at     TIMESTAMPTZ,
  cancel_reason    TEXT,
  metadata         JSONB DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_profile  ON payments(profile_id);
CREATE INDEX idx_payments_pg_order ON payments(pg_order_id);
CREATE INDEX idx_payments_status   ON payments(status);

-- 보안: 클라이언트는 본인 결제 내역 조회만 허용, 쓰기는 Edge Function(service_role) 전용
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 결제 조회" ON payments
  FOR SELECT USING (profile_id = auth.uid());


-- ──────────────────────────────────────────────────────────────
-- memberships — 유료 서비스 가입
-- ──────────────────────────────────────────────────────────────
CREATE TABLE memberships (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_key     TEXT NOT NULL
                  CHECK (product_key IN ('diagnosis', 'build', 'launch', 'partner')),
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN (
                    'pending', 'paid', 'active', 'completed', 'cancelled', 'refunded'
                  )),
  started_at      TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  payment_id      UUID REFERENCES payments(id) ON DELETE SET NULL,
  assigned_admin  UUID REFERENCES profiles(id),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_memberships_profile ON memberships(profile_id);
CREATE INDEX idx_memberships_status  ON memberships(status);

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 멤버십 조회" ON memberships
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Admin 전체 관리" ON memberships
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE TRIGGER trg_memberships_updated_at
  BEFORE UPDATE ON memberships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ──────────────────────────────────────────────────────────────
-- leads.converted_membership_id FK 추가 (001 실행 후 가능)
-- ──────────────────────────────────────────────────────────────
ALTER TABLE leads
  ADD CONSTRAINT fk_leads_membership
  FOREIGN KEY (converted_membership_id)
  REFERENCES memberships(id)
  ON DELETE SET NULL;
