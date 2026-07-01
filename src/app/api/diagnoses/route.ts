import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { analyzeFree } from '@/lib/freeDiagnostic'
import { notifyLead } from '@/lib/notifyLead'
import type { Lead } from '@/store/leads'

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

    // [ISSUE-02] 규칙 기반 분류를 서버에서 계산해 영속화한다.
    // 클라이언트 store(analyzeFree)와 동일 로직을 재사용 → 서버·클라이언트 결과 일치.
    // 분류가 실패해도 제출 자체는 계속(현행 동작 보존).
    // 저장 shape은 관리자 매핑(lib/leads mapLead)이 읽는 { total, type, areas } 로 맞춘다.
    let scorePayload:
      | { total: number; type: string; areas: Record<string, number> }
      | null = null
    try {
      const answersByNum: Record<number, string> = {}
      for (let i = 1; i <= 7; i++) {
        const v = answers[`q${i}`]
        if (v) answersByNum[i] = v
      }
      const r = analyzeFree(answersByNum, bonusChecks)
      scorePayload = { total: r.totalScore, type: r.type, areas: r.scores }
    } catch (classifyErr) {
      console.error('[api/diagnoses] classify', classifyErr)
    }

    // free_diagnostics 저장 (분류 결과는 score(Json)에 함께 보관)
    const diagnosis = await prisma.freeDiagnostic.create({
      data: {
        email,
        name,
        careerYears,
        answers,
        bonusChecks,
        consentAt: new Date(consentAt),
        score: scorePayload ?? undefined,
        status: scorePayload ? 'completed' : 'in_progress',
        ipAddress: ip,
      },
      select: { id: true },
    })

    // leads 테이블 등록 (총점을 CRM 정렬용으로 함께 저장 / 실패해도 결과 반환 계속)
    try {
      await prisma.lead.create({
        data: {
          email,
          name,
          source: 'free_diagnosis',
          freeDiagnosisId: diagnosis.id,
          status: 'new',
          score: scorePayload?.total ?? null,
        },
      })
    } catch (leadErr) {
      console.error('[api/diagnoses] insert leads', leadErr)
    }

    // 어드민 신규 리드 알림 메일(무료 진단). 실패해도 제출에 영향 없음.
    // 클라이언트 제출은 fire-and-forget이라 이 await로 인한 지연은 UX에 드러나지 않는다.
    try {
      const notifyPayload: Lead = {
        id: diagnosis.id,
        createdAt: new Date().toISOString(),
        name,
        email,
        phone: '',
        field: careerYears,
        career: '',
        purposes: [],
        challenge: '',
        outcomes: [],
        channel: '',
        diagnosticScore: scorePayload?.total,
        diagnosticType: scorePayload?.type,
        outputAssets: bonusChecks,
        scores: scorePayload?.areas as Lead['scores'],
        status: '신규 리드',
        memo: '',
      }
      await notifyLead(notifyPayload, { categoryLabel: '무료 진단' })
    } catch (mailErr) {
      console.error('[api/diagnoses] notifyLead', mailErr)
    }

    return NextResponse.json({
      id: diagnosis.id,
      type: scorePayload?.type ?? 'pending',
      scores: scorePayload?.areas ?? {},
      totalScore: scorePayload?.total ?? null,
    })
  } catch (err) {
    console.error('[api/diagnoses] error', err)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: '저장 중 오류가 발생했습니다.' },
      { status: 500 },
    )
  }
}
