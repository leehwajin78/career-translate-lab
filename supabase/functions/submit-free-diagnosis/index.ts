import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://esm.sh/zod@3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

const CAREER_YEARS = [
  '10년 미만', '10~15년', '15~20년', '20~25년', '25~30년', '30년 이상',
] as const

const BodySchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(50),
  careerYears: z.enum(CAREER_YEARS),
  answers: z.record(
    z.string().regex(/^q[1-7]$/),
    z.string().min(5).max(2000),
  ),
  bonusChecks: z.array(z.string()).default([]),
  consentAt: z.string().datetime(),
})

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return json({ error: 'METHOD_NOT_ALLOWED' }, 405)
  }

  let rawBody: unknown
  try {
    rawBody = await req.json()
  } catch {
    return json({ error: 'VALIDATION_ERROR', message: '요청 본문이 올바른 JSON 형식이 아닙니다.' }, 422)
  }

  const parsed = BodySchema.safeParse(rawBody)
  if (!parsed.success) {
    const first = parsed.error.errors[0]
    return json({
      error: 'VALIDATION_ERROR',
      message: first.message,
      field: String(first.path[0] ?? ''),
    }, 422)
  }

  const { email, name, careerYears, answers, bonusChecks, consentAt } = parsed.data

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  // 24시간 재제출 Rate Limit
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data: existing } = await supabase
    .from('free_diagnostics')
    .select('id')
    .eq('email', email)
    .gte('created_at', since)
    .maybeSingle()

  if (existing) {
    return json({
      error: 'RATE_LIMITED',
      message: '동일 이메일로 24시간 내 재진단은 1회만 허용됩니다.',
      retryAfter: 86400,
    }, 429)
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null

  // free_diagnostics 저장
  // TODO: [ISSUE-02] score·diagnosisType 계산 로직 미구현 (준비형/성과형/관계형/통합형 분류 알고리즘 필요)
  const { data: diagnosis, error: diagErr } = await supabase
    .from('free_diagnostics')
    .insert({
      email,
      name,
      career_years: careerYears,
      answers,
      bonus_checks: bonusChecks,
      consent_at: consentAt,
      status: 'in_progress',
      ip_address: ip,
    })
    .select('id')
    .single()

  if (diagErr || !diagnosis) {
    console.error('[submit-free-diagnosis] insert free_diagnostics', diagErr)
    return json({ error: 'INTERNAL_ERROR', message: '저장 중 오류가 발생했습니다.' }, 500)
  }

  // leads 테이블 등록 (실패해도 진단 결과 반환 계속)
  const { error: leadErr } = await supabase.from('leads').insert({
    email,
    name,
    source: 'free_diagnosis',
    free_diagnosis_id: diagnosis.id,
    status: 'new',
  })
  if (leadErr) {
    console.error('[submit-free-diagnosis] insert leads', leadErr)
  }

  return json({
    id: diagnosis.id,
    type: 'pending',  // TODO: [ISSUE-02] 유형 분류 알고리즘 구현 후 실제 type 반환
    scores: {},       // TODO: [ISSUE-02] 5개 영역 점수 계산 후 반환
  })
})
