import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'

/* =============================================================
 * 코칭 42문항 세션/답변 (멤버 작성 + 관리자 조회)
 *
 * profile → 최신 membership → coaching_session(membership당 1개) → coaching_answers
 * 인가는 API Route(멤버/관리자 세션)에서 처리. Prisma 는 RLS 를 우회한다.
 * PR2 범위: 텍스트 답변만 (음성은 후순위).
 * ============================================================= */

const DB_TO_CLIENT: Record<string, string> = {
  in_progress: 'in-progress',
  submitted: 'submitted',
  analyzing: 'analyzing',
  analyzed: 'analyzed',
  finalized: 'finalized',
}
const CLIENT_TO_DB: Record<string, string> = {
  'in-progress': 'in_progress',
  submitted: 'submitted',
  analyzing: 'analyzing',
  analyzed: 'analyzed',
  finalized: 'finalized',
}

export interface CoachingSessionView {
  status: string
  submittedAt: string | null
  answers: Record<number, { text: string }>
  completedCount: number
}

function countAnswered(answers: { textAnswer: string | null }[]): number {
  return answers.filter((a) => a.textAnswer && a.textAnswer.trim().length > 0).length
}

/** profile 의 코칭 세션을 찾거나 생성 (membership 필요) */
async function getOrCreateSession(
  profileId: string,
): Promise<{ id: string; status: string } | null> {
  const membership = await prisma.membership.findFirst({
    where: { profileId },
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  })
  if (!membership) return null

  const existing = await prisma.coachingSession.findUnique({
    where: { membershipId: membership.id },
    select: { id: true, status: true },
  })
  if (existing) return existing

  return prisma.coachingSession.create({
    data: { membershipId: membership.id, profileId, status: 'in_progress' },
    select: { id: true, status: true },
  })
}

/** 멤버/관리자: profileId 의 세션 + 답변 조회 */
export async function getSessionView(profileId: string): Promise<CoachingSessionView | null> {
  const membership = await prisma.membership.findFirst({
    where: { profileId },
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  })
  if (!membership) return null

  const session = await prisma.coachingSession.findUnique({
    where: { membershipId: membership.id },
    include: { answers: { select: { questionId: true, textAnswer: true } } },
  })
  if (!session) {
    return { status: 'in-progress', submittedAt: null, answers: {}, completedCount: 0 }
  }

  const answers: Record<number, { text: string }> = {}
  for (const a of session.answers) answers[a.questionId] = { text: a.textAnswer ?? '' }

  return {
    status: DB_TO_CLIENT[session.status] ?? 'in-progress',
    submittedAt: session.submittedAt?.toISOString() ?? null,
    answers,
    completedCount: countAnswered(session.answers),
  }
}

/** 멤버: 답변 저장(upsert). 제출 후엔 차단(false). */
export async function saveAnswer(
  profileId: string,
  questionId: number,
  text: string,
): Promise<boolean> {
  const session = await getOrCreateSession(profileId)
  if (!session) return false
  if (session.status !== 'in_progress') return false

  await prisma.coachingAnswer.upsert({
    where: { sessionId_questionId: { sessionId: session.id, questionId } },
    update: { textAnswer: text },
    create: { sessionId: session.id, questionId, textAnswer: text },
  })
  return true
}

/** 멤버: 최종 제출 */
export async function submitSession(profileId: string): Promise<boolean> {
  const session = await getOrCreateSession(profileId)
  if (!session) return false
  await prisma.coachingSession.update({
    where: { id: session.id },
    data: { status: 'submitted', submittedAt: new Date() },
  })
  return true
}

/** 관리자: 세션 상태 변경 */
export async function setSessionStatus(profileId: string, clientStatus: string): Promise<boolean> {
  const dbStatus = CLIENT_TO_DB[clientStatus]
  if (!dbStatus) return false
  const session = await getOrCreateSession(profileId)
  if (!session) return false
  await prisma.coachingSession.update({
    where: { id: session.id },
    data: { status: dbStatus },
  })
  return true
}

/* =============================================================
 * WI-09 — 코칭 리포트(브랜드 프로필) 저장·확정·조회
 *  코치가 워크스페이스(A-03)에서 수동 작성 → Finalize → 멤버 리포트(C-14) 공개.
 *  AI 자동 초안은 Phase 2(WI-10). 이메일은 인앱 게이트만(WI-09 결정).
 * ============================================================= */
export interface BrandProfile {
  oneLiner: string
  coreValues: string[]
  strengthStatement: string
  targetPersona: string
  brandStory: string
  coreMessage: string
  channelStrategy: string
  brandWhy: string
  coachComment: string
}

export interface CoachingReportView {
  status: string
  finalizedAt: string | null
  brandProfile: BrandProfile | null
  questionInsights?: unknown[]
}

/** 관리자(워크스페이스): 세션 + 리포트 초안(미확정 포함) */
export async function getReportForAdmin(profileId: string): Promise<CoachingReportView> {
  const session = await getOrCreateSession(profileId)
  if (!session) return { status: 'in-progress', finalizedAt: null, brandProfile: null }
  const report = await prisma.coachingReport.findUnique({
    where: { sessionId: session.id },
    select: { brandProfile: true, finalizedAt: true, questionInsights: true },
  })
  return {
    status: DB_TO_CLIENT[session.status] ?? 'in-progress',
    finalizedAt: report?.finalizedAt?.toISOString() ?? null,
    brandProfile: (report?.brandProfile as unknown as BrandProfile) ?? null,
    questionInsights: (report?.questionInsights as unknown[]) ?? [],
  }
}

/** 관리자(WI-10): AI 자동 초안 저장 — brandProfile + questionInsights + 세션 analyzed */
export async function saveAnalysis(
  profileId: string,
  brandProfile: object,
  questionInsights: unknown[],
): Promise<boolean> {
  const session = await getOrCreateSession(profileId)
  if (!session) return false
  const bp = brandProfile as unknown as Prisma.InputJsonValue
  const qi = questionInsights as unknown as Prisma.InputJsonValue
  await prisma.$transaction([
    prisma.coachingReport.upsert({
      where: { sessionId: session.id },
      update: { brandProfile: bp, questionInsights: qi, modelUsed: 'claude-opus-4-8' },
      create: { sessionId: session.id, brandProfile: bp, questionInsights: qi, modelUsed: 'claude-opus-4-8' },
    }),
    prisma.coachingSession.update({
      where: { id: session.id },
      data: { status: 'analyzed', analyzedAt: new Date() },
    }),
  ])
  return true
}

/** 멤버(C-14): finalized 일 때만 brandProfile 노출(공개 게이트). 세션 생성하지 않음. */
export async function getReportForMember(profileId: string): Promise<CoachingReportView> {
  const membership = await prisma.membership.findFirst({
    where: { profileId },
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  })
  if (!membership) return { status: 'in-progress', finalizedAt: null, brandProfile: null }

  const session = await prisma.coachingSession.findUnique({
    where: { membershipId: membership.id },
    select: { id: true, status: true },
  })
  const status = session ? DB_TO_CLIENT[session.status] ?? 'in-progress' : 'in-progress'
  if (!session || status !== 'finalized') {
    return { status, finalizedAt: null, brandProfile: null }
  }

  const report = await prisma.coachingReport.findUnique({
    where: { sessionId: session.id },
    select: { brandProfile: true, finalizedAt: true },
  })
  return {
    status,
    finalizedAt: report?.finalizedAt?.toISOString() ?? null,
    brandProfile: (report?.brandProfile as unknown as BrandProfile) ?? null,
  }
}

/** 관리자: 브랜드 프로필 초안 저장(임시저장) — 세션 상태 변경 없음 */
export async function saveReportDraft(profileId: string, brandProfile: BrandProfile): Promise<boolean> {
  const session = await getOrCreateSession(profileId)
  if (!session) return false
  const json = brandProfile as unknown as Prisma.InputJsonValue
  await prisma.coachingReport.upsert({
    where: { sessionId: session.id },
    update: { brandProfile: json },
    create: { sessionId: session.id, brandProfile: json },
  })
  return true
}

/** 관리자: 리포트 확정(Finalize) — 리포트 저장 + 세션 finalized (트랜잭션) */
export async function finalizeReport(
  profileId: string,
  brandProfile: BrandProfile,
  finalizedBy?: string,
): Promise<boolean> {
  const session = await getOrCreateSession(profileId)
  if (!session) return false
  const json = brandProfile as unknown as Prisma.InputJsonValue
  const now = new Date()
  await prisma.$transaction([
    prisma.coachingReport.upsert({
      where: { sessionId: session.id },
      update: { brandProfile: json, finalizedBy: finalizedBy ?? null, finalizedAt: now },
      create: { sessionId: session.id, brandProfile: json, finalizedBy: finalizedBy ?? null, finalizedAt: now },
    }),
    prisma.coachingSession.update({
      where: { id: session.id },
      data: { status: 'finalized', finalizedAt: now },
    }),
  ])
  return true
}

/** 관리자: 여러 멤버의 진행률(답변 수)+상태 한 번에 */
export async function getProgressByProfiles(
  profileIds: string[],
): Promise<Record<string, { completedCount: number; status: string }>> {
  if (profileIds.length === 0) return {}
  const sessions = await prisma.coachingSession.findMany({
    where: { profileId: { in: profileIds } },
    include: { answers: { select: { textAnswer: true } } },
  })
  const out: Record<string, { completedCount: number; status: string }> = {}
  for (const s of sessions) {
    out[s.profileId] = {
      completedCount: countAnswered(s.answers),
      status: DB_TO_CLIENT[s.status] ?? 'in-progress',
    }
  }
  return out
}
