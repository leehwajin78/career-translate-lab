// =============================================================
// 빌드 시 환경변수 사전검증 (DB-INTEGRATION-SPEC §7.5)
// prebuild 훅에서 실행. Vercel 빌드에서 .env가 없을 수 있으므로
// DB URL이 아예 비어있으면 경고만 하고 통과(빌드 시점엔 DB 불필요).
// =============================================================
const requiredEnvNames = ['DATABASE_URL', 'DIRECT_URL']
const postgresEnvNames = new Set(['DATABASE_URL', 'DIRECT_URL'])

// CI/Vercel 빌드 단계에서 DB 접속 정보가 주입되지 않는 경우가 있다.
// 그 경우 빌드 자체는 막지 않되, 값이 있으면 형식을 검증한다.
const errors = requiredEnvNames.flatMap((name) => {
  const value = process.env[name]?.trim() ?? ''
  if (!value) {
    console.warn(`[validate-env] (warn) ${name} 미설정 — 런타임에 필요`)
    return []
  }
  try {
    new URL(value)
  } catch {
    return [`Invalid env URL: ${name}`]
  }
  if (
    postgresEnvNames.has(name) &&
    !value.startsWith('postgresql://') &&
    !value.startsWith('postgres://')
  ) {
    return [`Invalid PostgreSQL env: ${name}`]
  }
  return []
})

if (errors.length > 0) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.info('[validate-env] OK')
}
