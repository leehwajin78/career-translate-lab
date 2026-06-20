import { checkHealth } from '@/lib/health'

/* =============================================================
 * GET /api/health — DB 연결 검증 (DB-INTEGRATION-SPEC §13.2)
 * ============================================================= */

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const { prisma } = await import('@/lib/db')
  const result = await checkHealth(prisma)
  return Response.json(result.body, { status: result.status })
}
