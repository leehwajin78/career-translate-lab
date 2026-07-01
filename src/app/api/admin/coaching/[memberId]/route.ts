import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  getSessionView,
  setSessionStatus,
  getReportForAdmin,
  saveReportDraft,
  finalizeReport,
  type BrandProfile,
} from '@/lib/coaching'

/* =============================================================
 * 관리자: 특정 멤버 코칭 (인증은 middleware /api/admin/**)
 *  GET   — 멤버의 42문항 답변 + 리포트 초안 조회
 *  PATCH — 세션 상태 변경
 *  POST  — 브랜드 프로필 임시저장(finalize=false) / 확정(finalize=true)
 * ============================================================= */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> },
) {
  const { memberId } = await params
  try {
    const [session, report] = await Promise.all([
      getSessionView(memberId),
      getReportForAdmin(memberId),
    ])
    return NextResponse.json({ session, report })
  } catch (err) {
    console.error('[api/admin/coaching/[memberId]] GET', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}

const BrandProfileSchema = z.object({
  oneLiner: z.string().default(''),
  coreValues: z.array(z.string()).default([]),
  strengthStatement: z.string().default(''),
  targetPersona: z.string().default(''),
  brandStory: z.string().default(''),
  coreMessage: z.string().default(''),
  channelStrategy: z.string().default(''),
  brandWhy: z.string().default(''),
  coachComment: z.string().default(''),
})
const PostBody = z.object({
  brandProfile: BrandProfileSchema,
  finalize: z.boolean().default(false),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> },
) {
  const { memberId } = await params
  const parsed = PostBody.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) return NextResponse.json({ error: 'VALIDATION_ERROR' }, { status: 422 })

  try {
    const brandProfile = parsed.data.brandProfile as BrandProfile
    const ok = parsed.data.finalize
      ? await finalizeReport(memberId, brandProfile)
      : await saveReportDraft(memberId, brandProfile)
    return NextResponse.json({ ok })
  } catch (err) {
    console.error('[api/admin/coaching/[memberId]] POST', err)
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
