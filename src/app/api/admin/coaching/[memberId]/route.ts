import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionView, setSessionStatus } from '@/lib/coaching'

/* =============================================================
 * 관리자: 특정 멤버 코칭 (인증은 middleware /api/admin/**)
 *  GET   — 멤버의 42문항 답변 조회
 *  PATCH — 세션 상태 변경
 * ============================================================= */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> },
) {
  const { memberId } = await params
  try {
    const session = await getSessionView(memberId)
    return NextResponse.json({ session })
  } catch (err) {
    console.error('[api/admin/coaching/[memberId]] GET', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}

const PatchBody = z.object({
  status: z.enum(['in-progress', 'submitted', 'analyzing', 'analyzed', 'finalized']),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> },
) {
  const { memberId } = await params
  const parsed = PatchBody.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) return NextResponse.json({ error: 'VALIDATION_ERROR' }, { status: 422 })

  try {
    const ok = await setSessionStatus(memberId, parsed.data.status)
    return NextResponse.json({ ok })
  } catch (err) {
    console.error('[api/admin/coaching/[memberId]] PATCH', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}
