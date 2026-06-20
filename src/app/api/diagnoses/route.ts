import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'

/* =============================================================
 * POST /api/diagnoses — 무료 진단 제출
 * 기존 Supabase Edge Function(submit-free-diagnosis)을 대체.
 * Deno → Node.js, supabase-js → Prisma.
 * ============================================================= */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const BodySchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(50),
  careerYears: z.string().min(1).max(20),
  answers: z.record(
    z.string().regex(/^q[1-7]$/),
    z.string().min(5).max(2000),
  ),
  bonusChecks: z.array(z.string()).default([]),
  consentAt: z.string().datetime(),
})

export async function POST(req: NextRequest) {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json(
      { error: 'VALIDATION_ERROR', message: '요청 본문이 올바른 JSON 형식이 아닙니다.' },
      { status: 422 },
    )
  }

  const parsed = BodySchema.safeParse(raw)
  if (!parsed.success) {
    const first = parsed.error.errors[0]
    return NextResponse.json(
      {
        error: 'VALIDATION_ERROR',
        message: first.message,
        field: String(first.path[0] ?? ''),
      },
      { status: 422 },
    )
  }

  const { email, name, careerYears, answers, bonusChecks, consentAt } =
    parsed.data

  try {
    // 24시간 재제출 Rate Limit
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const existing = await prisma.freeDiagnostic.findFirst({
      where: { email, createdAt: { gte: since } },
      select: { id: true },
    })
    if (existing) {
      return NextResponse.json(
        {
          error: 'RATE_LIMITED',
          message: '동일 이메일로 24시간 내 재진단은 1회만 허용됩니다.',
          retryAfter: 86400,
        },
        { status: 429 },
      )
    }

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null

    // free_diagnostics 저장
    // TODO: [ISSUE-02] score·diagnosisType 계산 로직 미구현
    const diagnosis = await prisma.freeDiagnostic.create({
      data: {
        email,
        name,
        careerYears,
        answers,
        bonusChecks,
        consentAt: new Date(consentAt),
        status: 'in_progress',
        ipAddress: ip,
      },
      select: { id: true },
    })

    // leads 테이블 등록 (실패해도 진단 결과 반환 계속)
    try {
      await prisma.lead.create({
        data: {
          email,
          name,
          source: 'free_diagnosis',
          freeDiagnosisId: diagnosis.id,
          status: 'new',
        },
      })
    } catch (leadErr) {
      console.error('[api/diagnoses] insert leads', leadErr)
    }

    return NextResponse.json({
      id: diagnosis.id,
      type: 'pending', // TODO: [ISSUE-02] 유형 분류 알고리즘 구현 후 실제 type 반환
      scores: {}, // TODO: [ISSUE-02] 5개 영역 점수 계산 후 반환
    })
  } catch (err) {
    console.error('[api/diagnoses] error', err)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: '저장 중 오류가 발생했습니다.' },
      { status: 500 },
    )
  }
}
