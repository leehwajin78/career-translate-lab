import { NextResponse } from 'next/server'
import { currentMemberId } from '@/lib/serverMember'
import { submitSession } from '@/lib/coaching'

/* POST /api/coaching/submit — 42문항 최종 제출 (status=submitted) */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST() {
  const profileId = await currentMemberId()
  if (!profileId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  try {
    const ok = await submitSession(profileId)
    return NextResponse.json({ ok })
  } catch (err) {
    console.error('[api/coaching/submit] POST', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}
