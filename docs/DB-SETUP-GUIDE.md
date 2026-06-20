# DB 연동 설정 가이드 (사람이 직접 하는 작업)
## Next.js + Prisma + Supabase + Vercel

> 코드 마이그레이션은 **이미 완료**되었습니다. 이 문서는 **실제 데이터베이스를 연결하고
> 배포하기 위해 사람이 직접 해야 하는 설정**을 하나도 빠짐없이, 클릭 단위로 안내합니다.
> 작성일: 2026-06-20 · 예상 소요시간: **약 40~60분**

---

## 0. 이 문서를 읽기 전에

### 무엇이 바뀌었나요?
- 예전: 화면(Vite) + Supabase에 **직접** 접속 + Edge Function으로 저장
- 지금: 화면(Next.js) + **Prisma**라는 도구로 PostgreSQL에 저장 + **내부 API**로 저장

### 왜 설정이 필요한가요?
프로그램이 데이터베이스에 접속하려면 **접속 주소(Connection URL)** 2개가 필요합니다.
이 주소는 비밀번호가 들어있어 코드에 넣지 않고, 별도 설정 파일·대시보드에만 넣습니다.

### 필요한 계정 (이미 다 있습니다)
- Supabase: 프로젝트 `hankkeut-ai-lab` (ID: `sjdikvepabqgkgzlsdyf`)
- Vercel: 프로젝트 `career-translate-lab`
- GitHub: `leehwajin78/career-translate-lab`

---

## 빠른 경로 안내

| 목표 | 읽어야 할 섹션 |
|---|---|
| **운영 사이트만 빨리 연결** | §1 → §3 → §4 → §6 → §7 |
| 로컬 PC에서도 개발 | §2 (Docker 필요) 추가 |
| 자동 마이그레이션(CI)까지 | §8 추가 |

---

## 1. Supabase 접속 주소(Connection URL) 2개 확보

Prisma는 두 종류의 주소가 필요합니다:
- **DATABASE_URL** — 평소 데이터를 읽고 쓸 때 (포트 `6543`, Pooler)
- **DIRECT_URL** — 표(테이블)를 만들거나 바꿀 때 (포트 `5432`, Direct)

### 1-1. Supabase 대시보드 접속
1. 브라우저에서 **https://supabase.com/dashboard/project/sjdikvepabqgkgzlsdyf** 접속
2. 로그인 (GitHub 계정)

### 1-2. Connect 버튼 클릭
1. 화면 **맨 위 가운데**에 있는 **`Connect`** 버튼 클릭
   (초록색, 프로젝트 이름 옆에 있습니다)
2. 팝업 창이 열립니다.

### 1-3. ORMs 탭 → Prisma 선택
1. 팝업 상단 탭에서 **`ORMs`** 클릭
2. `Tool` 드롭다운에서 **`Prisma`** 선택
3. 그러면 아래에 두 줄이 나타납니다:
   ```
   DATABASE_URL="postgresql://postgres.sjdikvepabqgkgzlsdyf:[YOUR-PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.sjdikvepabqgkgzlsdyf:[YOUR-PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres"
   ```
4. **두 줄을 모두 복사**해서 메모장에 붙여넣어 두세요.

> 만약 ORMs 탭이 안 보이면 `Connection string` 탭에서
> **Transaction pooler**(6543)와 **Direct connection**(5432) 두 개를 각각 복사하세요.

### 1-4. 비밀번호 채우기 (중요!)
복사한 주소에 `[YOUR-PASSWORD]` 부분이 있습니다. 이걸 **실제 DB 비밀번호**로 바꿔야 합니다.

- 이 비밀번호는 **Supabase 프로젝트를 처음 만들 때 정한 비밀번호**입니다.
- 기억나지 않으면: 대시보드 → **Settings(⚙️) → Database → Database password → `Reset database password`** 로 새로 만드세요.
  (새로 만들면 기존 비밀번호는 무효가 됩니다)

`[YOUR-PASSWORD]`를 지우고 그 자리에 실제 비밀번호를 넣습니다.

> ⚠️ 비밀번호에 `@ # ? & %` 같은 특수문자가 있으면 **URL 인코딩**이 필요합니다.
> 예: `@` → `%40`, `#` → `%23`, `?` → `%3F`. 특수문자가 없는 비밀번호를 쓰는 게 가장 안전합니다.

### 1-5. 끝에 `&schema=public` 또는 `?schema=public` 추가 (권장)
Prisma가 `public` 스키마를 쓰도록 명시합니다.
- `DATABASE_URL`은 이미 `?pgbouncer=true`가 있으니 뒤에 `&schema=public&connection_limit=1` 추가
- `DIRECT_URL`은 `?` 가 없으니 뒤에 `?schema=public` 추가

**최종 형태 예시:**
```
DATABASE_URL="postgresql://postgres.sjdikvepabqgkgzlsdyf:내비밀번호@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&schema=public"
DIRECT_URL="postgresql://postgres.sjdikvepabqgkgzlsdyf:내비밀번호@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres?schema=public"
```

✅ 이제 주소 2개가 준비되었습니다. 메모장에 잘 보관하세요.

---

## 2. (선택) 로컬 PC에서 개발하기 — Docker 필요

> 운영 사이트만 연결하려면 이 섹션은 **건너뛰어도 됩니다.** (§3으로)
> 로컬에서 코드를 고치며 테스트하려면 진행하세요.

### 2-1. 사전 준비
- **Docker Desktop** 설치 및 실행 (https://www.docker.com/products/docker-desktop)
- Node.js 20+ , pnpm 9+ (이미 설치됨)

### 2-2. 로컬 DB 띄우기
프로젝트 폴더에서 터미널(PowerShell)을 열고:
```powershell
pnpm db:start
```
- 처음에는 Docker 이미지를 받느라 몇 분 걸립니다.
- 완료되면 로컬 PostgreSQL이 `127.0.0.1:54322`에 뜹니다.

### 2-3. 로컬 .env는 기본값 그대로
로컬 DB는 `.env.example`의 기본값을 그대로 쓰면 됩니다 (§3에서 `.env` 생성).

### 2-4. 스키마 적용 + 화면 실행
```powershell
pnpm db:migrate -- --name init   # 표(테이블) 생성 (최초 1회)
pnpm dev                          # http://localhost:3000
```

### 2-5. 로컬 DB 중지
```powershell
pnpm db:stop      # 데이터 보존하며 중지
```

---

## 3. 로컬 `.env` 파일 만들기

프로젝트 폴더 최상위에 **`.env`** 파일을 만듭니다 (이 파일은 Git에 올라가지 않습니다).

> VS Code에서: 좌측 파일 목록 빈 곳 우클릭 → `New File` → 이름 `.env` 입력

### 운영 DB에 직접 연결할 경우 (`.env` 내용):
```
DATABASE_URL="(§1에서 만든 DATABASE_URL 6543)"
DIRECT_URL="(§1에서 만든 DIRECT_URL 5432)"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_LEAD_NOTIFY_KEY="fbce603b-441c-4b51-941b-f41b07733177"
NEXT_PUBLIC_ANTHROPIC_API_KEY=""
```

### 로컬 Docker DB를 쓸 경우 (`.env` 내용):
```
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres?schema=public"
DIRECT_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_LEAD_NOTIFY_KEY="fbce603b-441c-4b51-941b-f41b07733177"
NEXT_PUBLIC_ANTHROPIC_API_KEY=""
```

> 💡 `.env.example` 파일을 복사해서 `.env`로 만든 뒤 값만 바꿔도 됩니다.

---

## 4. 운영 DB에 표(테이블) 만들기 — 최초 1회

Supabase에 9개 테이블(profiles, free_diagnostics, leads, …)을 생성합니다.

### 4-1. Prisma 클라이언트 생성 (이미 되어 있으면 생략)
```powershell
pnpm db:generate
```

### 4-2. 운영 DB에 스키마 적용
`.env`에 **운영 DB 주소**가 들어있는 상태에서:
```powershell
pnpm db:deploy
```
- 이 명령은 `prisma/migrations/` 폴더의 마이그레이션을 운영 DB에 적용합니다.
- 성공하면 `All migrations have been successfully applied` 가 나옵니다.

> ⚠️ 아직 마이그레이션 파일이 없다면(처음이라면) 먼저 로컬에서 한 번 생성해야 합니다:
> ```powershell
> # 로컬 DB(또는 임시)로 마이그레이션 파일 생성
> pnpm db:migrate -- --name init
> # 그 파일을 운영에 적용
> pnpm db:deploy
> ```
> 만약 운영 DB에 **이미 예전 SQL로 만든 표가 있다면**, 충돌이 날 수 있습니다.
> 그 경우 §9 트러블슈팅의 "이미 표가 있는 경우(베이스라인)"를 보세요.

### 4-3. 확인
Supabase 대시보드 → **Table Editor**에서 `profiles`, `free_diagnostics`, `leads` 등
테이블이 보이면 성공입니다.

---

## 5. 로컬에서 연결 확인 (헬스체크)

```powershell
pnpm dev
```
브라우저에서 **http://localhost:3000/api/health** 접속.

- ✅ `{ "db": "ok", "env": "development", "region": "local" }` → **DB 연결 성공!**
- ❌ `{ "db": "error", ... }` (503) → 주소·비밀번호 확인 (§9 참조)

진단 플로우도 테스트: **http://localhost:3000/diagnosis** → 끝까지 진행 →
Supabase `free_diagnostics` 테이블에 데이터가 쌓이는지 확인.

---

## 6. Vercel 설정 변경 (가장 중요)

기존 Vercel 프로젝트는 **Vite** 기준입니다. **Next.js**로 바꿔야 합니다.

### 6-1. Framework 변경
1. **https://vercel.com** → 프로젝트 **`career-translate-lab`** 클릭
2. 상단 **`Settings`** 탭 → 좌측 **`Build and Deployment`** (또는 `General`)
3. **Framework Preset** 항목을 **`Next.js`** 로 변경
   - 기존이 `Vite`로 되어 있으면 드롭다운에서 `Next.js` 선택
   - Build Command / Output Directory는 **비워두고 Next.js 기본값 사용** (자동)
4. **Save**

> `vercel.json`에 이미 `"framework": "nextjs"`가 설정되어 있어 자동 인식될 수도 있습니다.
> 그래도 대시보드에서 한 번 확인하세요.

### 6-2. 환경변수 등록/교체
1. **Settings** → **Environment Variables**
2. **기존 `VITE_…` 변수는 삭제**하거나 그대로 둬도 무방 (이제 사용 안 함).
3. 아래 변수를 **추가** (Production, Preview **둘 다 체크**):

| Name | Value | 환경 |
|---|---|---|
| `DATABASE_URL` | §1의 DATABASE_URL (6543, Pooler) | Production ✅ Preview ✅ |
| `DIRECT_URL` | §1의 DIRECT_URL (5432, Direct) | Production ✅ Preview ✅ |
| `NEXT_PUBLIC_APP_URL` | `https://career-translate-lab.vercel.app` | Production ✅ Preview ✅ |
| `NEXT_PUBLIC_LEAD_NOTIFY_KEY` | `fbce603b-441c-4b51-941b-f41b07733177` | Production ✅ Preview ✅ |
| `NEXT_PUBLIC_ANTHROPIC_API_KEY` | (비워둠 또는 키) | Production ✅ Preview ✅ |

> 입력 방법: `Key` 칸에 이름, `Value` 칸에 값 붙여넣기 → 환경 체크 → **Add/Save**

### 6-3. 재배포
환경변수를 바꾸면 **재배포**해야 반영됩니다.
1. 상단 **`Deployments`** 탭
2. 가장 최근 배포 우측 **`⋯`** → **`Redeploy`** → **Redeploy** 확인

### 6-4. 운영 확인
배포 완료 후:
- **https://career-translate-lab.vercel.app/api/health** → `{ "db": "ok", "env": "production", ... }`
- **https://career-translate-lab.vercel.app/diagnosis** → 진단 완료 → Supabase에 데이터 확인

---

## 7. (정리) 기존 Supabase Edge Function 비활성화

이제 진단 저장은 Next.js 내부 API(`/api/diagnoses`)가 담당하므로,
기존 Edge Function `submit-free-diagnosis`는 **더 이상 호출되지 않습니다.**

- 그대로 둬도 무해하지만, 혼동을 막으려면 Supabase → **Edge Functions** →
  `submit-free-diagnosis` → 사용 중지/삭제해도 됩니다. (필수 아님)

---

## 8. (선택) 자동 마이그레이션 — GitHub Actions

앞으로 스키마(테이블 구조)를 바꿀 때, `main`에 머지하면 운영 DB에 **자동 적용**되게 합니다.

### 8-1. GitHub Secret 등록
1. **https://github.com/leehwajin78/career-translate-lab** → **Settings**
2. 좌측 **Secrets and variables** → **Actions**
3. **`New repository secret`** 클릭
4. Name: **`DIRECT_URL_PROD`**
5. Value: §1의 **DIRECT_URL** (5432 Direct 주소, 비밀번호 포함)
6. **Add secret**

> 워크플로 파일은 이미 있습니다: `.github/workflows/migrate-prod.yml`
> `prisma/migrations/**`가 바뀐 채로 main에 push되면 자동으로 `pnpm db:deploy`가 실행됩니다.

### 8-2. 앞으로의 스키마 변경 흐름
```powershell
# 1) prisma/schema.prisma 수정 후 로컬에서 마이그레이션 생성
pnpm db:migrate -- --name add_some_column

# 2) 커밋 & 푸시
git add prisma/
git commit -m "feat(db): add some column"
git push origin main
# → GitHub Action이 운영 DB에 자동 적용
```

---

## 9. 트러블슈팅

| 증상 | 원인 | 해결 |
|---|---|---|
| `/api/health`가 503 | DB 주소/비밀번호 오류 | §1 주소 재확인, 비밀번호 특수문자 인코딩 |
| `P1001: Can't reach database` | 주소 틀림 / 네트워크 | Supabase가 켜져 있는지, 주소 포트(6543/5432) 확인 |
| `password authentication failed` | 비밀번호 틀림 | Settings → Database → Reset password 후 주소 갱신 |
| `pnpm db:deploy`가 멈춤/락 | Pooler(6543)로 마이그레이션 시도 | 마이그레이션은 **DIRECT_URL(5432)** 사용 — `.env` 확인 |
| `migrate deploy` drift/충돌 | 운영 DB에 예전 SQL 표가 이미 있음 | 아래 "이미 표가 있는 경우" 참조 |
| Vercel 빌드 실패 | Framework가 Vite로 남음 | §6-1에서 Next.js로 변경 |
| 진단 데이터 안 쌓임 | env 누락 / 잘못된 프로젝트 | §6-2 환경변수, §6-4 health 확인 |
| 빌드 시 `DATABASE_URL` 경고 | 빌드 단계엔 DB 불필요 | 경고만 — 런타임 환경변수가 있으면 정상 |

### 이미 표가 있는 경우 (베이스라인)
운영 Supabase에 예전 SQL(`supabase/migrations/*.sql`)로 만든 표가 이미 있다면,
Prisma가 "처음부터 만들려" 해서 충돌합니다. 이럴 때:

**옵션 A (권장 · 데이터 없음/초기):** Supabase SQL Editor에서 기존 표를 모두 DROP한 뒤 §4 재실행.
```sql
-- 주의: 데이터가 모두 삭제됩니다. 초기 단계에서만.
DROP TABLE IF EXISTS coaching_answers, coaching_reports, coaching_sessions,
  memberships, payments, lead_notes, leads, free_diagnostics, profiles CASCADE;
```
그 후:
```powershell
pnpm db:deploy
```

**옵션 B (데이터 보존):** 기존 표 구조를 Prisma 이력으로 인정(베이스라인)시킵니다.
```powershell
# init 마이그레이션을 "이미 적용됨"으로 표시
pnpm exec prisma migrate resolve --applied <마이그레이션_폴더명>
```
(자세한 절차는 [DB-INTEGRATION-SPEC.md](DB-INTEGRATION-SPEC.md) §10.5 참조)

---

## 10. 보안 주의사항 (꼭 지켜주세요)

1. **`.env` 파일과 접속 주소(비밀번호 포함)를 절대 Git에 올리지 마세요.**
   - `.gitignore`에 이미 `.env`가 등록되어 있습니다.
2. **`DIRECT_URL_PROD`는 GitHub Secrets에만** 두고, 채팅·문서·코드에 붙여넣지 마세요.
3. 비밀번호가 노출되었다면 즉시 Supabase에서 **Reset database password** 하세요.
4. `NEXT_PUBLIC_`로 시작하는 변수는 **브라우저에 노출**됩니다. DB 비밀번호 같은 비밀값은
   절대 `NEXT_PUBLIC_`에 넣지 마세요. (DB 주소는 `NEXT_PUBLIC_` 아님 — 안전)

---

## 부록. 자주 쓰는 명령어

```powershell
pnpm dev                         # 개발 서버 (http://localhost:3000)
pnpm build                       # 프로덕션 빌드
pnpm start                       # 프로덕션 서버 실행

pnpm db:start                    # 로컬 DB 켜기 (Docker)
pnpm db:stop                     # 로컬 DB 끄기
pnpm db:migrate -- --name 이름   # 마이그레이션 생성+적용 (로컬)
pnpm db:deploy                   # 운영 DB에 마이그레이션 적용
pnpm db:studio                   # DB 내용 GUI로 보기
pnpm db:generate                 # Prisma 클라이언트 재생성

curl http://localhost:3000/api/health   # DB 연결 확인
```

---

*막히는 부분이 있으면 어느 단계에서 무엇이 안 되는지 알려주세요. 그 지점부터 함께 봅니다.*
