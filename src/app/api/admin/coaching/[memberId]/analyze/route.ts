import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSessionView, saveAnalysis } from '@/lib/coaching'
import { analyzeCoachingAnswers } from '@/lib/coachingAI'

/* =============================================================
 * POST /api/admin/coaching/[memberId]/analyze  (WI-10)
 *  코치 수동 트리거: 42문항 답변 → AI 브랜드 프로필 초안 생성 →
 *  coaching_reports 초안 저장 + 세션 analyzed. (인증은 middleware /api/admin/**)
 *  ANTHROPIC_API_KEY 미설정 시 로컬 Mock 폴백(무료·결정적).
 * ============================================================= */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> },
) {
  const { memberId } = await params
  try {
    const [session, profile] = await Promise.all([
      getSessionView(memberId),
      prisma.profile.findUnique({ where: { id: memberId }, select: { name: true } }),
    ])
    if (!session || Object.keys(session.answers).length === 0) {
      return NextResponse.json({ error: 'NO_ANSWERS' }, { status: 400 })
    }

    const draft = await analyzeCoachingAnswers(profile?.name ?? '회원', session.answers)
    await saveAnalysis(memberId, draft.brandProfile, draft.questionInsights)

    return NextResponse.json({
      ok: true,
      source: process.env.ANTHROPIC_API_KEY ? 'claude-opus-4-8' : 'mock',
    })
  } catch (err) {
    console.error('[api/admin/coaching/[memberId]/analyze] POST', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}
