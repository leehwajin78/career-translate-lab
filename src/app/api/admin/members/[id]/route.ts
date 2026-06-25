import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'

/* =============================================================
 * 관리자 단일 멤버 관리 (인증은 middleware /api/admin/**)
 *  PATCH  — membership 상품(productKey) 변경
 *  DELETE — 멤버 삭제 (membership 정리 후 profile 제거)
 * ============================================================= */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PatchBody = z.object({
  productKey: z.enum(['diagnosis', 'build', 'launch', 'partner']).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const parsed = PatchBody.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json({ error: 'VALIDATION_ERROR' }, { status: 422 })
  }
  try {
    if (parsed.data.productKey) {
      const latest = await prisma.membership.findFirst({
        where: { profileId: id },
        orderBy: { createdAt: 'desc' },
      })
      if (latest) {
        await prisma.membership.update({
          where: { id: latest.id },
          data: { productKey: parsed.data.productKey },
        })
      } else {
        await prisma.membership.create({
          data: { profileId: id, productKey: parsed.data.productKey, status: 'active' },
        })
      }
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/admin/members/[id]] PATCH', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  try {
    // membership FK 정리 후 profile 삭제 (freeDiagnostics는 onDelete:SetNull)
    await prisma.$transaction([
      prisma.membership.deleteMany({ where: { profileId: id } }),
      prisma.profile.delete({ where: { id } }),
    ])
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/admin/members/[id]] DELETE', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}
