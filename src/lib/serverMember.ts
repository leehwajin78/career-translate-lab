import { cookies } from 'next/headers'
import { MEMBER_COOKIE, verifySession } from '@/lib/session'

/* Route Handler 전용: 현재 멤버 세션의 profileId (없으면 null) */
export async function currentMemberId(): Promise<string | null> {
  const store = await cookies()
  const session = await verifySession(store.get(MEMBER_COOKIE)?.value)
  if (!session || session.role !== 'member' || !session.sub) return null
  return session.sub
}
