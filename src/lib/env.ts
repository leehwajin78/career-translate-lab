import { z } from 'zod'

/* =============================================================
 * 서버 환경변수 검증 (DB-INTEGRATION-SPEC §7.4)
 * zod 3.x 문법으로 작성 (프로젝트 zod 버전 기준).
 * ============================================================= */

const databaseUrlSchema = z
  .string()
  .trim()
  .min(1, 'is required')
  .url('must be a valid PostgreSQL URL')
  .refine(
    (value) =>
      value.startsWith('postgresql://') || value.startsWith('postgres://'),
    { message: 'must use a PostgreSQL connection string' },
  )

const serverEnvSchema = z.object({
  DATABASE_URL: databaseUrlSchema,
  DIRECT_URL: databaseUrlSchema,
  NEXT_PUBLIC_APP_URL: z
    .union([z.string().url(), z.literal('')])
    .optional(),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>

export function getServerEnv(): ServerEnv {
  const result = serverEnvSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL ?? '',
    DIRECT_URL: process.env.DIRECT_URL ?? '',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  })

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => {
        const name = issue.path.join('.') || 'env'
        return issue.message === 'is required'
          ? `Missing required env: ${name}`
          : `${name} ${issue.message}`
      })
      .join('; ')
    throw new Error(`Invalid server environment: ${message}`)
  }

  return result.data
}

/* =============================================================
 * 배포 환경 판별 (DB-INTEGRATION-SPEC §7.6)
 * ============================================================= */

export type DeploymentEnv = 'development' | 'preview' | 'production'

export function getDeploymentEnv(): DeploymentEnv {
  if (
    process.env.VERCEL_ENV === 'production' ||
    process.env.VERCEL_ENV === 'preview'
  ) {
    return process.env.VERCEL_ENV
  }
  return process.env.NODE_ENV === 'production' ? 'production' : 'development'
}

export function getDeploymentRegion(): string {
  return process.env.VERCEL_REGION?.trim() || 'local'
}

/* =============================================================
 * 서버 전용 App URL 도출 (DB-INTEGRATION-SPEC §7.7)
 * ============================================================= */

export function getAppUrl(): string {
  const toHttps = (host?: string) => {
    const trimmed = host?.trim()
    return trimmed ? `https://${trimmed}` : undefined
  }
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim() || undefined

  if (process.env.VERCEL_ENV === 'preview') {
    const previewUrl =
      toHttps(process.env.VERCEL_BRANCH_URL) ?? toHttps(process.env.VERCEL_URL)
    if (previewUrl) return previewUrl
  }

  if (process.env.VERCEL_ENV === 'production') {
    return (
      explicit ??
      toHttps(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
      'http://localhost:3000'
    )
  }

  return explicit ?? 'http://localhost:3000'
}
