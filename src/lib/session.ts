/* =============================================================
 * 경량 서명 세션 (MVP 관리자 인증)
 *
 * HMAC-SHA256 서명 쿠키. Web Crypto(subtle)를 사용해 Edge(middleware)와
 * Node(Route Handler) 양쪽에서 동일하게 동작한다.
 * Phase 2에서 회원(Supabase Auth)으로 확장 예정 — 현재는 단일 관리자 게이트.
 * ============================================================= */

export const ADMIN_COOKIE = 'hk_admin'
export const MEMBER_COOKIE = 'hk_member'

export interface SessionPayload {
  role: 'admin' | 'member'
  /** member 세션일 때 profileId (profiles.id) */
  sub?: string
  /** epoch seconds 만료 */
  exp: number
}

const encoder = new TextEncoder()

function getSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 16) {
    throw new Error(
      'SESSION_SECRET 환경변수가 없거나 너무 짧습니다(16자 이상 필요).',
    )
  }
  return secret
}

function base64urlEncode(bytes: Uint8Array): string {
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64urlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function hmac(data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  return new Uint8Array(sig)
}

/** payload → "base64url(json).base64url(hmac)" 토큰 */
export async function signSession(payload: SessionPayload): Promise<string> {
  const body = base64urlEncode(encoder.encode(JSON.stringify(payload)))
  const sig = base64urlEncode(await hmac(body))
  return `${body}.${sig}`
}

/** 토큰 검증 → 유효하면 payload, 아니면 null (만료·서명불일치 포함) */
export async function verifySession(
  token: string | undefined | null,
): Promise<SessionPayload | null> {
  if (!token || !token.includes('.')) return null
  const [body, sig] = token.split('.')
  if (!body || !sig) return null

  try {
    const expected = base64urlEncode(await hmac(body))
    // 길이·내용 일치 확인 (상수시간까진 아니지만 MVP 충분)
    if (expected.length !== sig.length || expected !== sig) return null

    const payload = JSON.parse(
      new TextDecoder().decode(base64urlDecode(body)),
    ) as SessionPayload
    if (payload.role !== 'admin' && payload.role !== 'member') return null
    if (typeof payload.exp !== 'number' || payload.exp < Date.now() / 1000)
      return null
    return payload
  } catch {
    return null
  }
}

/** 7일 만료 관리자 세션 토큰 생성 */
export async function createAdminSession(): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
  return signSession({ role: 'admin', exp })
}

/** 7일 만료 멤버 세션 토큰 생성 (profileId 포함) */
export async function createMemberSession(profileId: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
  return signSession({ role: 'member', sub: profileId, exp })
}
