import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { ADMIN_COOKIE, createAdminSession, verifySession } from '@/lib/session'
import { verifyPassword } from '@/lib/password'

/* =============================================================
 * 관리자 로그인 (MVP 단일 관리자 게이트)
 *  POST   — 비밀번호 검증(ADMIN_PASSWORD_HASH) → 서명 세션 쿠키 발급
 *  DELETE — 로그아웃(쿠키 제거)
 *  GET    — 현재 세션 여부 확인
 * ============================================================= */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const Body = z.object({ password: z.string().min(1) })

export async function POST(req: NextRequest) {
  const hash = process.env.ADMIN_PASSWORD_HASH
  if (!hash) {
    return NextResponse.json(
      { ok: false, error: 'NOT_CONFIGURED', message: 'ADMIN_PASSWORD_HASH 미설정' },
      { status: 503 },
    )
  }

  const parsed = Body.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'VALIDATION_ERROR' }, { status: 422 })
  }

  if (!verifyPassword(parsed.data.password, hash)) {
    return NextResponse.json({ ok: false, error: 'INVALID' }, { status: 401 })
  }

  const token = await createAdminSession()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
  return res
}

export async function GET() {
  const store = await cookies()
  const session = await verifySession(store.get(ADMIN_COOKIE)?.value)
  return NextResponse.json({ authenticated: !!session })
}
