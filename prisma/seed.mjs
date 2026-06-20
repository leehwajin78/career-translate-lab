// =============================================================
// Prisma 시드 — 관리자 프로필 1건 (멱등)
// 실행: pnpm db:seed  (또는 migrate dev/reset 시 자동)
// =============================================================
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.profile.upsert({
    where: { email: 'admin@kkummolda.com' },
    update: {},
    create: {
      email: 'admin@kkummolda.com',
      name: '이화진',
      role: 'admin',
    },
  })
  console.info('[seed] admin profile ensured')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
