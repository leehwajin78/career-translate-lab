import { NextResponse } from 'next/server'
import { listLeadsForAdmin } from '@/lib/leads'

/* GET /api/leads — 관리자 리드 목록 (middleware 에서 관리자 세션 검사) */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const leads = await listLeadsForAdmin()
    return NextResponse.json({ leads })
  } catch (err) {
    console.error('[api/leads] GET', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}
