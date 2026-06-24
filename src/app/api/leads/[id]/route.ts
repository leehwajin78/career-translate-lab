import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getLeadForAdmin, krToDbStatus } from '@/lib/leads'

/* GET/PATCH /api/leads/[id] — 관리자 리드 상세·수정 (middleware 에서 관리자 세션 검사) */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params
  const lead = await getLeadForAdmin(id)
  if (!lead) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
  return NextResponse.json({ lead })
}

const PatchSchema = z.object({
  status: z.string().optional(),
  memo: z.string().max(5000).optional(),
})

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params
  const parsed = PatchSchema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json({ error: 'VALIDATION_ERROR' }, { status: 422 })
  }

  const data: { status?: string; memo?: string } = {}
  if (parsed.data.status !== undefined) data.status = krToDbStatus(parsed.data.status)
  if (parsed.data.memo !== undefined) data.memo = parsed.data.memo

  try {
    await prisma.lead.update({ where: { id }, data })
    const lead = await getLeadForAdmin(id)
    return NextResponse.json({ lead })
  } catch (err) {
    console.error('[api/leads/[id]] PATCH', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}
