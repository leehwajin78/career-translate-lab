# 프레임워크 마이그레이션 계획
## React 18 + Vite → Next.js (App Router) + Prisma

> **목표**: UX·디자인·기능을 100% 동일하게 유지하면서 기술 스택을 DB-INTEGRATION-SPEC 기준으로 전환한다.  
> **작성일**: 2026-06-20  
> **예상 기간**: 약 18 작업일 (1인 기준)

---

## 1. 변경 대조표

| 영역 | 현재 (Before) | 변경 후 (After) |
|---|---|---|
| **런타임** | Node.js (버전 미고정) | Node.js 24.x (`.nvmrc` 고정) |
| **패키지 매니저** | npm | pnpm 9.x |
| **프레임워크** | React 18 + Vite | Next.js 16 (App Router) |
| **라우팅** | React Router v6 | Next.js 파일 기반 라우팅 |
| **ORM** | 없음 (Supabase JS 직접) | Prisma 6.x |
| **DB 접근** | Supabase Edge Function (Deno) | Next.js API Route (Node.js) |
| **로컬 DB** | 없음 (클라우드 직접) | Supabase CLI Docker (`54322`) |
| **마이그레이션** | 수동 SQL Editor 붙여넣기 | `pnpm db:migrate` 자동화 |
| **CI/CD** | 없음 | GitHub Actions (`migrate-prod.yml`) |
| **환경변수 접두사** | `VITE_` | `NEXT_PUBLIC_` (클라이언트) / 없음 (서버) |
| **환경변수 검증** | 없음 | Zod (`lib/env.ts`) |
| **번들러** | Vite (manualChunks) | Next.js 내장 번들러 (자동 청킹) |
| **빌드 명령** | `vite build` | `next build` |
| **Lazy 로딩** | `React.lazy()` | `next/dynamic` |
| **헬스체크** | 없음 | `GET /api/health` |

---

## 2. 변경하지 않는 것 (UX 보존 목록)

| 항목 | 이유 |
|---|---|
| Tailwind CSS + Shadcn UI | Next.js와 완전 호환 |
| Zustand 상태 관리 | SSR 안전화 처리 후 그대로 사용 |
| 인증 방식 (localStorage 기반) | Supabase Auth 미사용, 구조 동일 유지 |
| Web3Forms 이메일 알림 | 클라이언트 호출, 변경 없음 |
| 전체 디자인·레이아웃 | 컴포넌트 코드 그대로 이식 |
| 36개 페이지 UX 흐름 | 라우트 경로만 Next.js 파일로 이동 |
| DB 스키마 | Prisma로 동일 테이블 재정의 |

---

## 3. 파일 변환 매핑

### 3-1. 라우트 (36개 페이지)

| 현재 경로 | Next.js 파일 위치 |
|---|---|
| `/` | `app/page.tsx` |
| `/service` | `app/service/page.tsx` |
| `/diagnosis` | `app/diagnosis/page.tsx` |
| `/result` | `app/result/page.tsx` |
| `/consultation` | `app/consultation/page.tsx` |
| `/login` | `app/login/page.tsx` |
| `/playboard` | `app/playboard/page.tsx` |
| `/privacy` | `app/privacy/page.tsx` |
| `/terms` | `app/terms/page.tsx` |
| `/apply/diagnosis` | `app/apply/diagnosis/page.tsx` |
| `/apply/build` | `app/apply/build/page.tsx` |
| `/apply/launch` | `app/apply/launch/page.tsx` |
| `/apply/partner` | `app/apply/partner/page.tsx` |
| `/apply/thank-you` | `app/apply/thank-you/page.tsx` |
| `/coaching` | `app/coaching/page.tsx` |
| `/coaching/questions` | `app/coaching/questions/page.tsx` |
| `/coaching/question` | `app/coaching/question/page.tsx` |
| `/coaching/review` | `app/coaching/review/page.tsx` |
| `/coaching/analyzing` | `app/coaching/analyzing/page.tsx` |
| `/coaching/report` | `app/coaching/report/page.tsx` |
| `/coaching/workspace/:memberId` | `app/coaching/workspace/[memberId]/page.tsx` |
| `/admin` | `app/admin/page.tsx` |
| `/admin/lead/:id` | `app/admin/lead/[id]/page.tsx` |
| `/admin/notifications` | `app/admin/notifications/page.tsx` |
| `/admin/auth` | `app/admin/auth/page.tsx` |
| `/admin/airuns` | `app/admin/airuns/page.tsx` |
| `/admin/brief` | `app/admin/brief/page.tsx` |
| `/admin/oneliner` | `app/admin/oneliner/page.tsx` |
| `/admin/questions` | `app/admin/questions/page.tsx` |
| `/admin/patterns` | `app/admin/patterns/page.tsx` |
| `/admin/mapper` | `app/admin/mapper/page.tsx` |
| `/admin/feedback` | `app/admin/feedback/page.tsx` |
| `/admin/rules` | `app/admin/rules/page.tsx` |
| `/admin/crosscheck` | `app/admin/crosscheck/page.tsx` |
| `/admin/handoff` | `app/admin/handoff/page.tsx` |
| `/admin/retainer` | `app/admin/retainer/page.tsx` |
| `/admin/export` | `app/admin/export/page.tsx` |

### 3-2. 레이아웃

| 현재 | Next.js 위치 | 역할 |
|---|---|---|
| `src/components/site/Layout.tsx` | `app/(site)/layout.tsx` | 공개 페이지 공통 레이아웃 |
| `src/pages/admin/AdminLayout.tsx` | `app/admin/layout.tsx` | 어드민 사이드바 레이아웃 |
| (없음) | `app/layout.tsx` | 루트 레이아웃 (Provider, Font, Toaster) |
| `src/components/ProtectedRoute.tsx` | `middleware.ts` | 라우트 보호 (서버 미들웨어로 격상) |

### 3-3. API 레이어

| 현재 | Next.js 위치 |
|---|---|
| `supabase/functions/submit-free-diagnosis/index.ts` (Deno) | `app/api/diagnoses/route.ts` (Node.js) |
| (없음) | `app/api/health/route.ts` |

### 3-4. 공유 코드 (이동 경로)

| 현재 위치 | Next.js 위치 | 변경 내용 |
|---|---|---|
| `src/components/ui/*` | `components/ui/*` | 변경 없음 |
| `src/components/site/*` | `components/site/*` | 변경 없음 |
| `src/components/free-diagnosis/*` | `components/free-diagnosis/*` | 변경 없음 |
| `src/components/coaching/*` | `components/coaching/*` | 변경 없음 |
| `src/data/*` | `lib/data/*` | 변경 없음 |
| `src/lib/*` | `lib/*` | env 접두사 변환 |
| `src/store/*` | `store/*` | SSR 하이드레이션 가드 추가 |
| `src/hooks/*` | `hooks/*` | 변경 없음 |
| `src/integrations/supabase/client.ts` | **삭제** | Prisma로 대체 |

---

## 4. 코드 변환 규칙 (반복 패턴)

### 4-1. 환경변수

```ts
// Before (Vite)
import.meta.env.VITE_SUPABASE_URL
import.meta.env.VITE_SUPABASE_ANON_KEY
import.meta.env.VITE_LEAD_NOTIFY_KEY
import.meta.env.DEV

// After (Next.js)
process.env.NEXT_PUBLIC_SUPABASE_URL       // 클라이언트에서 읽어야 할 경우
process.env.SUPABASE_URL                   // 서버(API Route)에서만 읽는 경우
process.env.NODE_ENV === 'development'     // DEV 체크
```

### 4-2. 라우터

```ts
// Before (React Router)
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom'
const navigate = useNavigate()
navigate('/path')

// After (Next.js)
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
const router = useRouter()
router.push('/path')
```

### 4-3. Lazy 로딩

```ts
// Before (Vite)
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))

// After (Next.js)
import dynamic from 'next/dynamic'
const AdminLayout = dynamic(() => import('./app/admin/layout'))
// ※ App Router에서 admin/layout.tsx는 파일 기반 자동 적용, dynamic 불필요
```

### 4-4. 클라이언트 컴포넌트 선언

```ts
// Before (Vite — 모든 컴포넌트가 암묵적으로 클라이언트)
// 아무것도 없음

// After (Next.js — 훅·상태·이벤트 사용 시 필수)
"use client"

import { useState } from 'react'
```

### 4-5. Zustand SSR 안전화

```ts
// Before (Vite — SSR 없으므로 hydration 이슈 없음)
export const useLeadsStore = create(persist(...))

// After (Next.js — 서버/클라이언트 불일치 방지)
import { useStore } from 'zustand'

export function useLeadsStoreHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  const store = useLeadsStore()
  return hydrated ? store : initialState
}
```

---

## 5. 단계별 작업 계획

### Phase 0 — 브랜치 생성 & 인벤토리 (0.5일)

```bash
git checkout -b feat/nextjs-migration
```

- [ ] 현재 사이트 전체 라우트 동작 스크린샷 수동 캡처 (회귀 기준점)
- [ ] 환경변수 전체 목록화 (`VITE_` 접두사 항목 식별)
- [ ] `window`/`document`/`import.meta` 사용 파일 목록화 (SSR 위험 파일)
- [ ] 현재 `career-translate-lab.vercel.app` 정상 동작 확인

---

### Phase 1 — 신규 Next.js 프로젝트 부트스트랩 (1일)

```bash
# 새 Next.js 프로젝트를 현재 폴더 안에 임시 서브폴더로 생성
pnpm dlx create-next-app@latest nextjs-migration --typescript --tailwind --eslint --app --src-dir=no
```

완료 기준:
- [ ] `next dev`로 `http://localhost:3000` 접속 성공
- [ ] TypeScript 컴파일 에러 없음
- [ ] Tailwind 동작 확인
- [ ] Shadcn UI 초기화 (`pnpm dlx shadcn@latest init`)
- [ ] `.nvmrc` (24), `package.json`의 `packageManager: "pnpm@9"` 설정

---

### Phase 2 — Prisma 스키마 & 로컬 DB (1일)

**2-1. SQL → Prisma 변환**

4개 마이그레이션 파일을 `prisma/schema.prisma`로 단일 변환:

```prisma
model Profile {
  id        String @id
  email     String @unique
  role      String @default("member")
  createdAt DateTime @default(now()) @map("created_at")
  @@map("profiles")
}

model FreeDiagnostic {
  id          String   @id @default(cuid())
  email       String
  name        String
  careerYears String   @map("career_years")
  answers     Json
  bonusChecks String[] @map("bonus_checks")
  consentAt   DateTime @map("consent_at")
  status      String   @default("in_progress")
  ipAddress   String?  @map("ip_address")
  createdAt   DateTime @default(now()) @map("created_at")
  @@map("free_diagnostics")
}

model Lead {
  id        String   @id @default(cuid())
  email     String
  name      String?
  source    String?
  createdAt DateTime @default(now()) @map("created_at")
  @@map("leads")
}

// coaching_sessions, coaching_answers, payments, memberships 동일 패턴
```

완료 기준:
- [ ] `supabase/config.toml` 생성 (§4.1 스펙 참조)
- [ ] `pnpm db:start` → 로컬 PostgreSQL 기동
- [ ] `pnpm db:migrate -- --name init` → 전체 스키마 생성
- [ ] Prisma Studio로 테이블 확인

---

### Phase 3 — 글로벌 레이아웃 & 미들웨어 (1일)

**app/layout.tsx** (루트)
```tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
// 폰트, 글로벌 CSS, 공통 Provider
```

**app/(site)/layout.tsx** (공개 사이트 레이아웃)
```tsx
// 현재 src/components/site/Layout.tsx의 Nav + Footer 구조 그대로
```

**app/admin/layout.tsx** (어드민 레이아웃)
```tsx
// 현재 src/pages/admin/AdminLayout.tsx 내용 그대로
```

**middleware.ts** (라우트 보호)
```ts
// useAuthStore의 localStorage 토큰 → 쿠키로 변환하여 서버에서 검증
// /admin/* → admin role 필요
// /coaching/* → member 또는 admin role 필요
```

완료 기준:
- [ ] `/` 접속 시 Nav + Footer 렌더링 확인
- [ ] `/admin` 직접 접속 시 `/login`으로 리다이렉트

---

### Phase 4 — 공유 컴포넌트 이식 (2일)

**이식 순서** (의존성 낮은 것 → 높은 것):

1. `components/ui/*` — Shadcn 컴포넌트 전체 (재초기화 or 직접 복사)
2. `components/site/Editorial.tsx`, `ScoreGauge.tsx`, `CTAButton.tsx` 등
3. `components/site/Nav.tsx`, `Footer.tsx`, `FAQ.tsx`
4. `components/site/ApplyForm.tsx`, `ProductConfirmCard.tsx`
5. `components/free-diagnosis/*` (5개 컴포넌트)
6. `components/coaching/*` (4개 컴포넌트)
7. `components/ErrorBoundary.tsx`

**각 파일 상단에 추가할 것:**
```tsx
"use client"  // useState, useEffect, 이벤트 핸들러 사용 시 필수
```

완료 기준:
- [ ] 모든 컴포넌트 TypeScript 에러 없음
- [ ] Shadcn 컴포넌트 스타일 정상 렌더링

---

### Phase 5 — 데이터 & 라이브러리 이식 (0.5일)

| 파일 | 작업 |
|---|---|
| `src/data/content.ts` | `lib/data/content.ts`로 복사 |
| `src/data/playboard.ts` | `lib/data/playboard.ts`로 복사 |
| `src/data/coachingQuestions.ts` | `lib/data/coachingQuestions.ts`로 복사 |
| `src/lib/diagnostic.ts` | `lib/diagnostic.ts`로 복사 |
| `src/lib/freeDiagnostic.ts` | `lib/freeDiagnostic.ts`로 복사 |
| `src/lib/coachingAI.ts` | `lib/coachingAI.ts`로 복사 |
| `src/lib/notifyLead.ts` | `lib/notifyLead.ts` → env 접두사 변환 |
| `src/lib/audioRecorder.ts` | `lib/audioRecorder.ts`로 복사 |
| `src/lib/utils.ts` | `lib/utils.ts`로 복사 |
| `src/lib/validation.ts` | `lib/validation.ts`로 복사 |
| `lib/db.ts` | **신규** (Prisma 싱글턴) |
| `lib/env.ts` | **신규** (Zod 환경변수 검증) |
| `lib/health.ts` | **신규** (DB 헬스체크) |

완료 기준:
- [ ] `lib/env.ts`에서 `NEXT_PUBLIC_SUPABASE_URL` 등 검증 통과
- [ ] `lib/db.ts`에서 `prisma.$queryRaw\`SELECT 1\`` 성공

---

### Phase 6 — Zustand 스토어 SSR 안전화 (1일)

**7개 스토어 전체 처리:**

| 스토어 | SSR 위험 요소 | 처리 방법 |
|---|---|---|
| `authStore.ts` | `window.localStorage` + 로그인 상태 | hydration guard + cookie 동기화 |
| `leads.ts` | localStorage persist | hydration guard |
| `freeDiagnosticStore.ts` | localStorage persist | hydration guard |
| `diagnostic.ts` | localStorage persist | hydration guard |
| `coachingStore.ts` | localStorage persist | hydration guard |
| `notificationStore.ts` | localStorage persist | hydration guard |

**공통 패턴:**
```ts
// store/_hydration.ts — 공통 유틸
export function useHydrated<T>(store: () => T, fallback: T): T {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated ? store() : fallback
}
```

**auth 특이사항**: 미들웨어가 쿠키를 읽어야 하므로, 로그인 시 `httpOnly: false` 쿠키에 role 정보를 저장하는 로직 추가.

완료 기준:
- [ ] Next.js 빌드 시 `useLayoutEffect` / `window` 관련 SSR 에러 없음
- [ ] 로그인 → 새로고침 → 로그인 상태 유지

---

### Phase 7 — 공개 페이지 이식 (2일)

**7개 페이지** (의존성 단순, 빠른 이식):

| 페이지 | 특이사항 |
|---|---|
| `app/page.tsx` (Index) | 정적 랜딩, SSG 가능 |
| `app/service/page.tsx` | 정적, SSG 가능 |
| `app/privacy/page.tsx` | 정적, SSG 가능 |
| `app/terms/page.tsx` | 정적, SSG 가능 |
| `app/login/page.tsx` | `"use client"`, 로그인 폼 |
| `app/playboard/page.tsx` | `"use client"`, 어드민 내부 도구 |
| `app/result/page.tsx` | `"use client"`, 진단 결과 표시 |

완료 기준:
- [ ] 7개 페이지 전부 `/` 기준 네비게이션 이동 성공
- [ ] Footer 이용약관·개인정보 링크 동작

---

### Phase 8 — 무료 진단 플로우 & API Route (1.5일)

**진단 페이지:**
```tsx
// app/diagnosis/page.tsx
"use client"
// 현재 src/pages/Diagnosis.tsx 내용 그대로
// EDGE_URL 변경:
const EDGE_URL = '/api/diagnoses'  // 절대 URL 대신 상대 경로
```

**API Route (Edge Function 대체):**
```ts
// app/api/diagnoses/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

// 현재 supabase/functions/submit-free-diagnosis/index.ts 로직 그대로
// Deno → Node.js 변환 (Deno.env.get → process.env)
// createClient → prisma.free_diagnostics.create()
```

완료 기준:
- [ ] 진단 완료 → `free_diagnostics` 테이블에 데이터 저장 확인
- [ ] 5단계 플로우 (이메일→질문→로딩→리포트→완료) 전부 동작

---

### Phase 9 — 상담 & 신청 플로우 (1일)

| 페이지 | 작업 |
|---|---|
| `app/consultation/page.tsx` | `"use client"`, 현재 코드 그대로 |
| `app/apply/diagnosis/page.tsx` | `"use client"` |
| `app/apply/build/page.tsx` | `"use client"` |
| `app/apply/launch/page.tsx` | `"use client"` |
| `app/apply/partner/page.tsx` | `"use client"` |
| `app/apply/thank-you/page.tsx` | `"use client"` |

완료 기준:
- [ ] 신청 폼 제출 → 이메일 수신 확인 (Web3Forms 동일 동작)
- [ ] `/apply/thank-you` 리다이렉트 정상

---

### Phase 10 — 어드민 포털 (3일)

16개 어드민 페이지 이식. 공통 패턴:

```tsx
// app/admin/[각페이지]/page.tsx
"use client"
// 현재 src/pages/admin/Admin*.tsx 내용 그대로
// useNavigate → useRouter
// useParams (react-router) → useParams (next/navigation)
```

**admin/layout.tsx에서 처리:**
```tsx
// 현재 AdminLayout.tsx의 사이드바 + Outlet 구조를
// Next.js children props로 변환
```

완료 기준:
- [ ] `/admin` 대시보드 → 리드 목록 표시
- [ ] `/admin/lead/[id]` 상세 페이지 정상 동작
- [ ] 어드민 사이드바 네비게이션 전체 이동 확인

---

### Phase 11 — 코칭 플로우 (2일)

| 페이지 | 특이사항 |
|---|---|
| `app/coaching/page.tsx` | member 보호 라우트 |
| `app/coaching/questions/page.tsx` | 음성 녹음 (`"use client"`) |
| `app/coaching/question/page.tsx` | `"use client"` |
| `app/coaching/review/page.tsx` | `"use client"` |
| `app/coaching/analyzing/page.tsx` | `"use client"` |
| `app/coaching/report/page.tsx` | `"use client"` |
| `app/coaching/workspace/[memberId]/page.tsx` | admin 보호 라우트 |

완료 기준:
- [ ] 멤버 계정으로 `/coaching` 접근 성공
- [ ] 음성 녹음 컴포넌트 정상 동작
- [ ] 비로그인 시 `/login` 리다이렉트

---

### Phase 12 — DB 레이어 & 헬스체크 (0.5일)

- [ ] `app/api/health/route.ts` 생성 및 `GET /api/health` → `{ "db": "ok" }` 확인
- [ ] `lib/db.ts` Prisma 싱글턴 검증
- [ ] `lib/env.ts` Zod 검증 전체 통과
- [ ] `scripts/validate-env.mjs` 생성
- [ ] `scripts/db/guarded-migrate.mjs` 생성

---

### Phase 13 — 배포 & 자동화 (1일)

**Vercel 재배포:**
- [ ] `career-translate-lab.vercel.app` 프로젝트 → Framework: Next.js로 변경
- [ ] 환경변수 전체 재설정 (`VITE_` → `NEXT_PUBLIC_` 적용)
- [ ] `vercel.json` 생성 (`pnpm build`, `pnpm install --frozen-lockfile`)
- [ ] Supabase Transaction Pooler URL → `DATABASE_URL`
- [ ] Supabase Direct Connection URL → `DIRECT_URL`
- [ ] Production 배포 → `GET /api/health` 확인

**GitHub Actions:**
- [ ] `.github/workflows/migrate-prod.yml` 생성
- [ ] `DIRECT_URL_PROD` GitHub Secret 등록
- [ ] 테스트 마이그레이션 PR 머지 → Action 자동 실행 확인

---

## 6. 위험 요소 & 대응

| 위험 | 가능성 | 대응 |
|---|---|---|
| Zustand hydration 불일치 → UI 깜빡임 | 높음 | Phase 6 hydration guard 철저히 처리 |
| `window`/`document` SSR 참조 오류 | 높음 | `useEffect` 내부로 이동, `dynamic({ ssr: false })` |
| `useSearchParams` API 차이 (동기→비동기) | 중간 | Next.js `Suspense`로 래핑 필요 |
| 음성 녹음 API (`MediaRecorder`) SSR 불가 | 중간 | `dynamic({ ssr: false })`로 클라이언트 전용 로드 |
| Admin 페이지 16개 → `useNavigate` 대량 치환 | 낮음 (반복 작업) | VS Code 전역 교체 자동화 |
| Prisma 마이그레이션 이력 ↔ 기존 Supabase 스키마 불일치 | 중간 | Phase 2에서 `prisma migrate resolve --applied init` |
| Vercel: Next.js 빌드 vs Vite 빌드 동시 존재 | 낮음 | 배포 직전까지 별도 브랜치로 유지 |

---

## 7. 작업 브랜치 전략

```
main                          ← 현재 Vite 사이트 (운영 중)
  └─ feat/nextjs-migration    ← 마이그레이션 작업 브랜치
       └─ (Phase별 커밋)
```

- 각 Phase 완료 시 커밋
- Phase 13 완료 후 QA → `main`에 머지 → Vercel 자동 재배포

---

## 8. 완료 기준 (최종 QA 체크리스트)

### 기능 검증
- [ ] 무료 진단 전 플로우 (5단계) 완주 → DB 저장 확인
- [ ] 상담 신청 → 이메일 수신 확인
- [ ] 유료 신청 4개 → 이메일 수신 확인
- [ ] 어드민 로그인 → 리드 목록 → 상세 → 상태 변경
- [ ] 어드민 → 멤버 발급 → 해당 멤버 로그인 → 코칭 플로우
- [ ] 로그아웃 → 재로그인
- [ ] 비로그인 상태 `/admin` 직접 접속 → `/login` 리다이렉트
- [ ] `GET /api/health` → `{ "db": "ok", "env": "production" }`

### 성능 검증
- [ ] Lighthouse 성능 점수 현재 대비 유지 또는 향상
- [ ] 정적 페이지 (Terms, Privacy, Service) SSG 적용 확인

### 배포 검증
- [ ] `pnpm db:migrate -- --name <name>` → GitHub 푸시 → Action 자동 실행
- [ ] Vercel Preview 배포 URL 정상 동작
- [ ] Production URL 정상 동작

---

## 9. 실행 전 결정 사항

아래 항목은 작업 시작 전 PM 확인이 필요합니다:

| 결정 항목 | 옵션 A | 옵션 B |
|---|---|---|
| 인증 방식 | 현재 localStorage 방식 유지 | Supabase Auth로 전환 |
| 작업 위치 | 현재 레포 브랜치 | 새 레포 생성 |
| Vercel 프로젝트 | 기존 `career-translate-lab` 덮어쓰기 | 새 프로젝트 생성 후 도메인 이전 |
| 로컬 DB | Supabase CLI Docker 필수 설치 | 클라우드 직접 유지 (스펙 일부 미준수) |

---

*이 계획서는 PM 승인 후 Phase 0부터 순차 실행합니다.*
