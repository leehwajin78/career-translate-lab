import { PrismaClient } from '@prisma/client'
import { getServerEnv } from '@/lib/env'

/* =============================================================
 * PrismaClient 싱글턴 (DB-INTEGRATION-SPEC §6)
 *
 * 지연 초기화(lazy): 모듈 import(빌드/prerender) 시점에는 DB 환경변수를
 * 요구하지 않고, 실제 쿼리가 처음 일어나는 런타임에 클라이언트를 만든다.
 * → DATABASE_URL이 없는 빌드 단계에서 import만으로 throw하지 않도록 보장.
 * 서버리스 워밍 인스턴스에서는 globalThis에 캐싱해 커넥션 폭주를 막는다.
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

function getClient(): PrismaClient {
  if (!prismaGlobal.__prisma) {
    prismaGlobal.__prisma = createPrismaClient()
  }
  return prismaGlobal.__prisma
}

// 지연 프록시: prisma.X 에 처음 접근할 때 클라이언트를 생성한다.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getClient()
    const value = (client as unknown as Record<string | symbol, unknown>)[prop]
    return typeof value === 'function'
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value
  },
})
