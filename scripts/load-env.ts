// =============================================================
// CLI 스크립트용 .env 로더 (DB-INTEGRATION-SPEC §14.2)
// 셸에 이미 값이 있으면 로드하지 않는다 (배포 환경변수 우선).
// =============================================================
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

if (!process.env.DATABASE_URL) {
  const envPath = resolve(process.cwd(), '.env')
  if (existsSync(envPath)) {
    process.loadEnvFile(envPath)
  }
}
