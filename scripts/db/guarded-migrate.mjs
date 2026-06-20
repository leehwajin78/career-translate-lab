// =============================================================
// 마이그레이션 가드레일 (DB-INTEGRATION-SPEC §11)
// dev/reset(파괴적)은 로컬 호스트에서만 허용. deploy는 항상 허용.
// =============================================================
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'

// .env 자동 로드 (셸 값이 없을 때만)
if (!process.env.DATABASE_URL && existsSync('.env')) {
  process.loadEnvFile('.env')
}

const sub = process.argv[2] // dev | deploy | reset | status
const isDestructive = sub === 'dev' || sub === 'reset'
const localHosts = new Set(['127.0.0.1', 'localhost', '::1', ''])

if (isDestructive) {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('[guard] DATABASE_URL 미설정 — 마이그레이션 중단')
    process.exit(1)
  }

  let host = ''
  try {
    host = new URL(url).hostname
  } catch {
    console.error('[guard] DATABASE_URL 파싱 실패')
    process.exit(1)
  }

  const overridden = process.env.ALLOW_NONLOCAL_MIGRATE === '1'
  if (!localHosts.has(host) && !overridden) {
    console.error(
      `[guard] 거부: 비-로컬 호스트(${host})에 대한 '${sub}'는 데이터 파괴 위험이 있습니다.\n` +
        `        운영 적용은 'pnpm db:deploy'를 사용하세요. (의도적이면 ALLOW_NONLOCAL_MIGRATE=1)`,
    )
    process.exit(1)
  }
}

const result = spawnSync('prisma', ['migrate', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: process.env,
  shell: true,
})

process.exit(result.status ?? 0)
