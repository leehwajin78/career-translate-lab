# 실제 고객 테스트 배포 가이드

> 목표: 외부 사람이 접속할 수 있는 URL을 만들고, 신청 데이터를 이메일로 받는 것까지 확인한다.  
> 작성일: 2026-06-20 · 예상 소요시간: **약 30~40분**

---

## 현재 상태 확인

| 항목 | 상태 | 비고 |
|---|---|---|
| 코드 | ✅ GitHub 연결됨 | leehwajin78/career-translate-lab |
| 이메일 알림 (신청폼) | ✅ Web3Forms 키 설정됨 | 신청 시 이메일 수신 가능 |
| Vercel 배포 | ❌ 없음 | **이 가이드의 핵심 작업** |
| Supabase (DB) | ❌ 미연결 | 무료진단 UI는 동작, 데이터 저장만 안 됨 |

---

## STEP 1. 최신 코드 GitHub에 올리기

> 터미널(VS Code 터미널 또는 PowerShell)에서 실행합니다.  
> 프로젝트 폴더 안에 있어야 합니다.

### 1-1. 변경사항 확인

```bash
git status
```

아래 파일들이 변경됨으로 표시됩니다:
- `src/App.tsx`
- `src/components/free-diagnosis/EmailCollect.tsx`
- `src/components/site/Footer.tsx`
- `src/pages/Terms.tsx` (신규)
- `docs/PAGE-FLOW.md` (신규)

### 1-2. 전체 추가 후 커밋

```bash
git add -A
git commit -m "feat: 이용약관 페이지, Footer 법적 링크, 진단폼 동의 링크 추가"
```

### 1-3. GitHub에 푸시

```bash
git push origin main
```

브라우저에서 https://github.com/leehwajin78/career-translate-lab 접속해서  
최근 커밋이 올라갔는지 확인합니다.

---

## STEP 2. Vercel 계정 만들기

> 이미 Vercel 계정이 있으면 STEP 3으로 건너뜁니다.

1. **https://vercel.com** 접속
2. 우측 상단 **Sign Up** 클릭
3. **Continue with GitHub** 선택 → GitHub 계정(leehwajin78)으로 로그인
4. 이메일 인증 완료

---

## STEP 3. Vercel에 프로젝트 배포하기

### 3-1. 새 프로젝트 시작

1. Vercel 대시보드 → 우측 상단 **Add New** → **Project** 클릭
2. **Import Git Repository** 화면에서 `career-translate-lab` 찾기
   - 목록에 안 보이면 **Adjust GitHub App Permissions** 클릭 후 저장소 권한 부여
3. `career-translate-lab` 우측 **Import** 클릭

### 3-2. 프로젝트 설정 확인

아래 항목을 확인합니다 (기본값이 이미 올바르게 설정되어 있을 것입니다):

| 설정 항목 | 값 |
|---|---|
| Framework Preset | **Vite** (자동 감지) |
| Root Directory | `.` (기본값) |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### 3-3. 환경변수 등록 (중요!)

**Environment Variables** 섹션에서 아래를 추가합니다:

| Name | Value |
|---|---|
| `VITE_LEAD_NOTIFY_KEY` | `fbce603b-441c-4b51-941b-f41b07733177` |

> ⚠️ 이 키가 없으면 신청 이메일 알림이 발송되지 않습니다.

추가 방법:
1. `Name` 입력창에 `VITE_LEAD_NOTIFY_KEY` 입력
2. `Value` 입력창에 위 값 붙여넣기
3. **Add** 클릭

### 3-4. 배포 시작

1. **Deploy** 버튼 클릭
2. 빌드 로그가 실시간으로 나타납니다 (약 1~2분 소요)
3. `🎉 Congratulations!` 화면이 나오면 배포 성공

### 3-5. URL 확인

배포 완료 후 화면에 URL이 생성됩니다:
```
https://career-translate-lab-xxxx.vercel.app
```

이 URL을 복사해 두세요. 이제 **누구나 이 주소로 접속 가능**합니다.

---

## STEP 4. 배포 후 동작 테스트 (체크리스트)

> 생성된 Vercel URL로 접속해서 하나씩 확인합니다.

### 4-1. 기본 페이지 확인

- [ ] 랜딩페이지 (`/`) — 정상 로딩, 이미지·글씨 깨짐 없음
- [ ] 서비스 소개 (`/service`) — 비교표, 방법론 섹션 정상
- [ ] 이용약관 (`/terms`) — 내용 정상 표시
- [ ] 개인정보처리방침 (`/privacy`) — 내용 정상 표시
- [ ] Footer 하단 이용약관·개인정보처리방침 링크 클릭 확인

### 4-2. 무료 진단 플로우 전체 테스트

> 실제 이름·이메일·경력 입력해서 끝까지 진행합니다.

- [ ] `/diagnosis` 접속 → 이름·이메일·경력연수 입력
- [ ] 개인정보 동의 체크박스 체크
- [ ] `무료 진단 시작하기` 버튼 클릭 → Step 2(질문)으로 이동 확인
- [ ] 8개 질문 모두 답변 입력 후 제출
- [ ] 분석 로딩 화면(12초) 정상 표시
- [ ] 진단 리포트 결과 화면 표시 확인
- [ ] 이메일 발송 완료 화면 확인

### 4-3. 유료 신청폼 테스트 (이메일 수신 확인)

> **가장 중요한 테스트입니다.**  
> 실제 신청처럼 입력하면 `kkummolda@kkummolda.com`으로 이메일이 발송됩니다.

- [ ] `/apply/diagnosis` 접속
- [ ] 신청 폼 전체 입력 후 제출
- [ ] `/apply/thank-you` 페이지로 이동 확인
- [ ] **이메일 수신함에서 `[한끗 신규리드]` 제목 메일 수신 확인** ← 핵심

### 4-4. 무료 상담 신청 테스트

- [ ] `/consultation` 접속 → 상담 신청 폼 입력 후 제출
- [ ] 이메일 수신 확인

### 4-5. 어드민 로그인 테스트

- [ ] `/login` 접속
- [ ] 이메일: `admin@kkummolda.com` / 비밀번호: `hankkeut2026` 입력
- [ ] `/admin` 대시보드로 이동 확인

### 4-6. 모바일 반응형 확인

- [ ] 스마트폰에서 Vercel URL 접속
- [ ] 랜딩, 무료 진단, 신청폼 레이아웃 확인

---

## STEP 5. (선택) 커스텀 도메인 연결

> 이미 도메인이 있는 경우에만 진행합니다.

1. Vercel 프로젝트 → **Settings** → **Domains** 탭
2. 보유한 도메인 입력 (예: `hankkeut.com`)
3. Vercel이 DNS 설정 방법을 안내합니다
4. 도메인 등록 업체(가비아·아임웹 등) DNS 설정에서  
   - `CNAME` 레코드: `cname.vercel-dns.com`  
   로 변경합니다
5. 전파 완료까지 최대 24시간 소요 (보통 10~30분)

---

## STEP 6. 이후 코드 수정 시 배포 방법

> Vercel과 GitHub이 연동되어 있어 **자동 배포**됩니다.

```bash
# 코드 수정 후
git add -A
git commit -m "수정 내용 설명"
git push origin main
```

`git push`하는 순간 Vercel이 자동으로 빌드·배포합니다. 약 1~2분 후 반영됩니다.

---

## 현재 알려진 제약사항

| 항목 | 현재 상태 | 영향 |
|---|---|---|
| 무료진단 DB 저장 | Supabase 미연결 | 진단 데이터가 서버에 저장 안 됨. UI는 정상 동작. 리드는 이메일로 수신 가능 |
| 어드민 리드 목록 | localStorage 저장 | **어드민이 다른 기기에서 접속하면 리드 목록이 비어있음** |
| 멤버 계정 발급 | 코드에 하드코딩 | 새 멤버 추가 시 코드 수정 필요 |

> 위 제약은 Phase 2(Supabase 연결)에서 해결됩니다.  
> 지금은 **이메일로 신청 내용 수신** + **무료진단 UI 체험**이 핵심입니다.

---

## Supabase 연결 (Phase 2 — 준비되면 진행)

> Supabase 없이도 고객 테스트는 충분히 가능합니다.  
> 데이터를 DB에 저장하고 싶을 때 진행하세요.

### 6-1. Supabase 프로젝트 생성

1. https://supabase.com → **Start your project** → GitHub로 로그인
2. **New Project** → 프로젝트명 입력 → 비밀번호 설정 → 리전: **Northeast Asia (Seoul)**
3. 생성 완료 (약 2분 소요)

### 6-2. DB 마이그레이션 실행

Supabase 프로젝트 → **SQL Editor** 탭에서 아래 파일들을 순서대로 열어 **Run** 실행:

```
supabase/migrations/20260615_001_create_leads.sql
supabase/migrations/20260615_002_create_members.sql
supabase/migrations/20260615_003_create_coaching_sessions.sql
supabase/migrations/20260615_004_create_coaching_answers.sql
```

### 6-3. API 키 확인

Supabase 프로젝트 → **Settings** → **API** 탭:
- **Project URL** 복사
- **anon / public** 키 복사

### 6-4. 로컬 .env.local 업데이트

```bash
VITE_LEAD_NOTIFY_KEY=fbce603b-441c-4b51-941b-f41b07733177
VITE_SUPABASE_URL=https://여기에-프로젝트-URL.supabase.co
VITE_SUPABASE_ANON_KEY=여기에-anon-키
```

### 6-5. Vercel 환경변수 추가

Vercel → 프로젝트 → **Settings** → **Environment Variables**:

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key |

추가 후 **Vercel 재배포** (Deployments → 최신 배포 → Redeploy).

### 6-6. Edge Function 배포

> Supabase CLI 설치가 필요합니다.

```bash
# Supabase CLI 설치 (Windows)
npm install -g supabase

# 로그인
supabase login

# Edge Function 배포
supabase functions deploy submit-free-diagnosis --project-ref 여기에-프로젝트-ref
```

---

*이 가이드에서 막히는 부분이 있으면 말씀해 주세요.*
