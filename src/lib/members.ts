import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { hashPassword, verifyPassword } from '@/lib/password'

/* =============================================================
 * 멤버(고객) 계정 — profiles(role=member) + memberships
 *
 * 관리자가 발급하고, 멤버는 커스텀 세션 쿠키(hk_member)로 로그인한다.
 * 비밀번호는 scrypt "salt:hash"(profiles.password_hash)로만 저장. (PR1)
 * 인가는 middleware + API Route에서 처리. (관리자 게이트와 동일 패턴)
 * ============================================================= */

export interface MemberView {
  id: string
  name: string
  email: string
  /** 가장 최근 membership의 상품 (diagnosis | build | launch | partner) */
  productKey: string
  createdAt: string
}

const memberInclude = {
  memberships: {
    orderBy: { createdAt: 'desc' },
    take: 1,
    select: { productKey: true },
  },
} satisfies Prisma.ProfileInclude
type MemberRow = Prisma.ProfileGetPayload<{ include: typeof memberInclude }>

function mapMember(p: MemberRow): MemberView {
  return {
    id: p.id,
    name: p.name ?? '(이름 미입력)',
    email: p.email,
    productKey: p.memberships[0]?.productKey ?? 'diagnosis',
    createdAt: p.createdAt.toISOString(),
  }
}

/** 관리자: 멤버 계정 발급 (profile upsert + membership 생성) */
export async function createMember(input: {
  name: string
  email: string
  password: string
  productKey: string
}): Promise<MemberView> {
  const email = input.email.trim().toLowerCase()
  const passwordHash = hashPassword(input.password)

  const profile = await prisma.profile.upsert({
    where: { email },
    update: { name: input.name.trim(), role: 'member', passwordHash },
    create: { email, name: input.name.trim(), role: 'member', passwordHash },
  })

  await prisma.membership.create({
    data: { profileId: profile.id, productKey: input.productKey, status: 'active' },
  })

  return {
    id: profile.id,
    name: profile.name ?? '(이름 미입력)',
    email: profile.email,
    productKey: input.productKey,
    createdAt: profile.createdAt.toISOString(),
  }
}

/** 이메일이 이미 멤버로 등록돼 있는지 */
export async function memberExists(email: string): Promise<boolean> {
  const p = await prisma.profile.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: { role: true },
  })
  return p?.role === 'member'
}

/** 로그인: 이메일+비밀번호 검증 → MemberView | null */
export async function verifyMemberCredentials(
  email: string,
  password: string,
): Promise<MemberView | null> {
  const profile = await prisma.profile.findUnique({
    where: { email: email.trim().toLowerCase() },
    include: memberInclude,
  })
  if (!profile || profile.role !== 'member' || !profile.passwordHash) return null
  if (!verifyPassword(password, profile.passwordHash)) return null
  return mapMember(profile)
}

/** 세션(profileId) → 현재 멤버 */
export async function getMemberById(id: string): Promise<MemberView | null> {
  const profile = await prisma.profile.findUnique({
    where: { id },
    include: memberInclude,
  })
  if (!profile || profile.role !== 'member') return null
  return mapMember(profile)
}

/** 관리자: 전체 멤버 목록 */
export async function listMembers(): Promise<MemberView[]> {
  const profiles = await prisma.profile.findMany({
    where: { role: 'member' },
    include: memberInclude,
    orderBy: { createdAt: 'desc' },
  })
  return profiles.map(mapMember)
}
