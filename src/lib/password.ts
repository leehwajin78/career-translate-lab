import { scryptSync, randomBytes, timingSafeEqual } from 'crypto'

/* =============================================================
 * 비밀번호 해시 (scrypt) — 평문 저장 금지
 *
 * 저장 형식: "salt:hash" (둘 다 hex).
 * Node 런타임 전용(Route Handler). Edge(middleware)에서는 사용하지 않는다.
 * ============================================================= */

const KEYLEN = 64

/** 평문 비밀번호 → "salt:hash" (설정용 해시 생성) */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const derived = scryptSync(password, salt, KEYLEN).toString('hex')
  return `${salt}:${derived}`
}

/** 제출 비밀번호가 저장된 "salt:hash"와 일치하는지 (상수시간 비교) */
export function verifyPassword(
  password: string,
  stored: string | undefined | null,
): boolean {
  if (!stored || !stored.includes(':')) return false
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  try {
    const derived = scryptSync(password, salt, KEYLEN)
    const original = Buffer.from(hash, 'hex')
    return derived.length === original.length && timingSafeEqual(derived, original)
  } catch {
    return false
  }
}
