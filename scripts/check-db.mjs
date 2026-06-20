// 읽기 전용 DB 연결/스키마 점검 스크립트 (비파괴)
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const tables = ['profile', 'freeDiagnostic', 'lead', 'membership', 'coachingSession']

let ok = true
for (const t of tables) {
  try {
    const n = await prisma[t].count()
    console.log(`OK    ${t.padEnd(18)} ${n} rows`)
  } catch (e) {
    ok = false
    console.log(`FAIL  ${t.padEnd(18)} ${String(e.message).split('\n')[0]}`)
  }
}
await prisma.$disconnect()
console.log(ok ? 'RESULT: connection OK' : 'RESULT: some tables missing/mismatch')
