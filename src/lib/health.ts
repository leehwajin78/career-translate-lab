import { getDeploymentEnv, getDeploymentRegion } from '@/lib/env'

/* =============================================================
 * DB 헬스체크 (DB-INTEGRATION-SPEC §13.1)
 * 구조화 로그에 connection string을 절대 포함하지 않는다.
 * ============================================================= */

export type HealthResponseBody = {
  db: 'ok' | 'error'
  env: 'development' | 'preview' | 'production'
  region: string
}

export type HealthResult = {
  status: number
  body: HealthResponseBody
}

export type HealthDatabase = {
  $queryRaw(query: TemplateStringsArray): Promise<unknown>
}

export async function checkHealth(
  database: HealthDatabase,
): Promise<HealthResult> {
  const env = getDeploymentEnv()
  const region = getDeploymentRegion()

  try {
    await database.$queryRaw`SELECT 1::int AS value`
    console.info(JSON.stringify({ event: 'db_connect_ok', env, region }))
    return { status: 200, body: { db: 'ok', env, region } }
  } catch {
    console.error(
      JSON.stringify({
        event: 'db_connect_fail',
        env,
        region,
        reason: 'db_unavailable',
      }),
    )
    return { status: 503, body: { db: 'error', env, region } }
  }
}
