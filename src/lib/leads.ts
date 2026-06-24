import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import type { Lead } from '@/store/leads'

/* =============================================================
 * 리드 조회/매핑 (관리자용)
 *
 * DB(leads + free_diagnostics) → 관리자 UI가 기대하는 Lead 형태로 매핑.
 * 인증은 middleware(관리자 세션)에서 처리하므로 여기선 데이터만 다룬다.
 * ============================================================= */

// DB 상태(영문) ↔ UI 상태(한글)
const DB_TO_KR: Record<string, Lead['status']> = {
  new: '신규 리드',
  contacted: '상담 예정',
  qualified: '상담 완료',
  converted: '계약 완료',
  lost: '보류',
}
const KR_TO_DB: Record<string, string> = {
  '신규 리드': 'new',
  '상담 예정': 'contacted',
  '상담 완료': 'qualified',
  '계약 완료': 'converted',
  '보류': 'lost',
}

/** UI(한글) 상태 → DB(영문) 상태. CHECK 제약(new/contacted/qualified/converted/lost) 보장. */
export function krToDbStatus(kr: string): string {
  return KR_TO_DB[kr] ?? 'new'
}

const leadInclude = { freeDiagnosis: true } satisfies Prisma.LeadInclude
type LeadRow = Prisma.LeadGetPayload<{ include: typeof leadInclude }>

/** 무료진단 답변 키 q1..q7 → 1..7 (UI는 숫자 키로 조회) */
function normalizeAnswers(raw: unknown): Record<string, string> | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v === 'string') out[k.replace(/^q/i, '')] = v
  }
  return Object.keys(out).length ? out : undefined
}

function mapLead(row: LeadRow): Lead {
  const fd = row.freeDiagnosis
  const score = (fd?.score ?? null) as {
    total?: number
    type?: string
    areas?: Lead['scores']
  } | null

  return {
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    name: row.name ?? fd?.name ?? '(이름 미입력)',
    phone: row.phone ?? '',
    email: row.email,
    field: fd?.careerYears ?? '',
    career: '',
    purposes: [],
    challenge: '',
    outcomes: [],
    channel: '',
    diagnosticScore: typeof score?.total === 'number' ? score.total : undefined,
    diagnosticType: typeof score?.type === 'string' ? score.type : undefined,
    recommendedPackage: undefined,
    answers: normalizeAnswers(fd?.answers),
    scores: score?.areas,
    status: DB_TO_KR[row.status] ?? '신규 리드',
    memo: row.memo ?? '',
  }
}

export async function listLeadsForAdmin(): Promise<Lead[]> {
  const rows = await prisma.lead.findMany({
    include: leadInclude,
    orderBy: { createdAt: 'desc' },
  })
  return rows.map(mapLead)
}

export async function getLeadForAdmin(id: string): Promise<Lead | null> {
  const row = await prisma.lead.findUnique({ where: { id }, include: leadInclude })
  return row ? mapLead(row) : null
}
