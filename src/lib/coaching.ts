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
