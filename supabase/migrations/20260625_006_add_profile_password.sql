-- =============================================================
-- 006 — profiles.password_hash 추가 (멤버 커스텀 세션 인증, MVP DB연동 Phase 2)
-- 안전: nullable TEXT 추가 (기존 데이터 영향 없음)
-- 비밀번호는 scrypt "salt:hash" 형식으로만 저장 (src/lib/password.ts), 평문 저장 금지.
-- =============================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;
