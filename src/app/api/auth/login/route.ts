import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { MEMBER_COOKIE, createMemberSession } from '@/lib/session'
import { verifyMemberCredentials } from '@/lib/members'

/* =============================================================
 * 멤버 로그인 (커스텀 세션 게이트, 관리자 게이트와 동일 패턴)
 *  POST   — 이메일+비밀번호 검증 → 서명 세션 쿠키(hk_member) 발급
 *  DELETE — 로그아웃(쿠키 제거)
 * ============================================================= */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'VALIDATION_ERROR' }, { status: 422 })
  }

  try {
    const member = await verifyMemberCredentials(parsed.data.email, parsed.data.password)
    if (!member) {
      return NextResponse.json({ ok: false, error: 'INVALID' }, { status: 401 })
    }

    const token = await createMemberSession(member.id)
    const res = NextResponse.json({ ok: true, member })
    res.cookies.set(MEMBER_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } catch (err) {
    console.error('[api/auth/login] POST', err)
    return NextResponse.json({ ok: false, error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(MEMBER_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
  return res
}
