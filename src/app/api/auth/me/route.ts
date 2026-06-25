import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { MEMBER_COOKIE, verifySession } from '@/lib/session'
import { getMemberById } from '@/lib/members'

/* GET /api/auth/me — 현재 멤버 세션 → MemberView | null */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const store = await cookies()
    const session = await verifySession(store.get(MEMBER_COOKIE)?.value)
    if (!session || session.role !== 'member' || !session.sub) {
      return NextResponse.json({ member: null })
    }
    const member = await getMemberById(session.sub)
    return NextResponse.json({ member })
  } catch (err) {
    console.error('[api/auth/me] GET', err)
    return NextResponse.json({ member: null })
  }
}
