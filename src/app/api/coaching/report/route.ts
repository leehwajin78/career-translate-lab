import { NextResponse } from 'next/server'
import { currentMemberId } from '@/lib/serverMember'
import { getReportForMember } from '@/lib/coaching'

/* GET /api/coaching/report — 현재 멤버의 코칭 리포트 (finalized 일 때만 brandProfile 공개) */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const profileId = await currentMemberId()
    if (!profileId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    const report = await getReportForMember(profileId)
    return NextResponse.json({ report })
  } catch (err) {
    console.error('[api/coaching/report] GET', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}
