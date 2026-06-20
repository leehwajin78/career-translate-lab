import { PrismaClient } from '@prisma/client'
import { getServerEnv } from '@/lib/env'

/* =============================================================
 * PrismaClient 싱글턴 (DB-INTEGRATION-SPEC §6)
 * ============================================================= */

type PrismaGlobal = typeof globalThis & {
  __prisma?: PrismaClient
}

const prismaGlobal = globalThis as PrismaGlobal

export function createPrismaClient() {
  const { DATABASE_URL } = getServerEnv()

  return new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL,
      },
    },
  })
}

export function getPrismaClient() {
  if (process.env.NODE_ENV === 'production') {
    return createPrismaClient()
  }

  // 개발 환경: HMR로 모듈이 재실행되어도 커넥션 누수 방지
  prismaGlobal.__prisma ??= createPrismaClient()
  return prismaGlobal.__prisma
}

export const prisma = getPrismaClient()
