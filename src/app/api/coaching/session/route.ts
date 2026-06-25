import { NextResponse } from 'next/server'
import { currentMemberId } from '@/lib/serverMember'
import { getSessionView } from '@/lib/coaching'

/* GET /api/coaching/session — 현재 멤버의 세션 + 42문항 답변 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const profileId = await currentMemberId()
    if (!profileId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    const session = await getSessionView(profileId)
    return NextResponse.json({ session })
  } catch (err) {
    console.error('[api/coaching/session] GET', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}
