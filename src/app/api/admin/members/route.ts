import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { listMembers, createMember, memberExists } from '@/lib/members'

/* =============================================================
 * 관리자 멤버 관리 (인증은 middleware /api/admin/** 관리자 세션에서 처리)
 *  GET  — 멤버 목록
 *  POST — 멤버 계정 발급 (profile + membership)
 * ============================================================= */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const members = await listMembers()
    return NextResponse.json({ members })
  } catch (err) {
    console.error('[api/admin/members] GET', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}

const CreateBody = z.object({
  name: z.string().min(1, '이름을 입력해 주세요'),
  email: z.string().email('이메일 형식이 올바르지 않습니다'),
  password: z.string().min(4, '비밀번호는 4자 이상이어야 합니다'),
  productKey: z.enum(['diagnosis', 'build', 'launch', 'partner']),
})

export async function POST(req: NextRequest) {
  const parsed = CreateBody.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'VALIDATION_ERROR', message: parsed.error.errors[0]?.message ?? '' },
      { status: 422 },
    )
  }

  try {
    if (await memberExists(parsed.data.email)) {
      return NextResponse.json(
        { error: 'DUPLICATE', message: '이미 등록된 이메일 ID입니다.' },
        { status: 409 },
      )
    }
    const member = await createMember({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
      productKey: parsed.data.productKey,
    })
    return NextResponse.json({ member }, { status: 201 })
  } catch (err) {
    console.error('[api/admin/members] POST', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}
