// =============================================================
// 관리자 비밀번호 → ADMIN_PASSWORD_HASH 생성기
//
// 사용: node scripts/hash-password.mjs "원하는비밀번호"
// 출력된 "salt:hash" 한 줄을 .env / Vercel 의 ADMIN_PASSWORD_HASH 에 넣으세요.
// (평문 비밀번호는 어디에도 저장하지 않습니다.)
// =============================================================
import { scryptSync, randomBytes } from 'node:crypto'

const password = process.argv[2]
if (!password) {
  console.error('사용법: node scripts/hash-password.mjs "비밀번호"')
  process.exit(1)
}

const salt = randomBytes(16).toString('hex')
const hash = scryptSync(password, salt, 64).toString('hex')
console.log(`${salt}:${hash}`)
