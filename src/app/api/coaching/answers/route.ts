import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { currentMemberId } from '@/lib/serverMember'
import { saveAnswer } from '@/lib/coaching'

/* PUT /api/coaching/answers — 문항 1개 답변 저장(자동저장 upsert). 제출 후엔 ok:false */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const Body = z.object({
  questionId: z.number().int().min(1).max(42),
  text: z.string().max(5000),
})

export async function PUT(req: NextRequest) {
  const profileId = await currentMemberId()
  if (!profileId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const parsed = Body.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) return NextResponse.json({ error: 'VALIDATION_ERROR' }, { status: 422 })

  try {
    const ok = await saveAnswer(profileId, parsed.data.questionId, parsed.data.text)
    return NextResponse.json({ ok })
  } catch (err) {
    console.error('[api/coaching/answers] PUT', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}
