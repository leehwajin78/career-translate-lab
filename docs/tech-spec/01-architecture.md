# 01 — 시스템 아키텍처

---

## 1. 시스템 컨텍스트 다이어그램

```
┌─────────────────────────────────────────────────────────────────┐
│                        External Users                           │
│  [Guest/방문자]  [Member/수강생]  [Admin/운영자]                  │
└────────────┬──────────────┬──────────────┬───────────────────────┘
             │              │              │
             ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│              한끗프로젝트 Web App (React SPA)                    │
│  Vercel CDN  /  career-translate-lab-2.vercel.app               │
│                                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────────┐ │
│  │ 랜딩/서비스│ │ 무료진단  │ │ 코칭워크  │ │    Admin 포털      │ │
│  │ 소개 페이지│ │ 플로우    │ │ 스페이스  │ │  멤버/리드 관리    │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────────────────┘ │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS / REST + Realtime
             ┌─────────────┼─────────────────┐
             ▼             ▼                 ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │   Supabase   │ │  OpenAI API  │ │    Resend    │
    │  (BaaS)      │ │  GPT-4o      │ │  (Email)     │
    │  Auth + DB   │ │  AI 분석     │ │  진단결과 발송 │
    │  Storage     │ └──────────────┘ └──────────────┘
    │  Edge Fn     │         ▲
    └──────┬───────┘         │
           │          ┌──────────────┐
           │          │ 토스페이먼츠  │
           │          │  결제 연동    │
           │          └──────────────┘
           ▼
    ┌──────────────┐
    │  PostgreSQL  │
    │  (Supabase)  │
    └──────────────┘
```

---

## 2. 기술 스택 (ADR — Architecture Decision Records)

### ADR-001: Frontend — React + Vite + TypeScript

**결정**: React 18 + Vite 5 + TypeScript 5  
**이유**:
- 컴포넌트 재사용성 → 코칭 플로우 42문항, 무료 진단 15문항 공통 UI
- TypeScript → 진단 알고리즘 타입 안전성 확보
- Vite SWC → HMR 속도 < 100ms, 빌드 < 10s
- **대안 검토**: Next.js → SEO가 중요하지 않은 로그인 후 플로우가 대부분. SPA로 충분

**트레이드오프**: 초기 번들 로딩 (→ 코드 스플리팅으로 보완)

---

### ADR-002: UI 컴포넌트 — Shadcn UI + Tailwind CSS

**결정**: Shadcn UI (Radix UI 기반) + Tailwind CSS  
**이유**:
- 접근성(a11y) 내장 (Radix Primitives)
- 소유권 있는 컴포넌트 (vendor lock-in 없음)
- Tailwind → 디자인 토큰 통일 (royal blue `#0123B4` = `primary`)

---

### ADR-003: 상태 관리 — Zustand

**결정**: Zustand v5  
**이유**:
- 42문항 코칭 답변, 음성 녹음 데이터 → 복잡한 전역 상태 필요
- Redux 대비 boilerplate 최소화
- localStorage persist 내장

**스토어 목록**:
| 스토어 | 용도 | localStorage 키 |
|---|---|---|
| diagnosticStore | 무료 진단 15문항 답변 + 결과 | kkummolda-diagnostic |
| freeDiagnosticStore | 무료 진단 UI 흐름 제어 | - |
| coachingStore | 42문항 응답 + AI 드래프트 | kkummolda-coaching |
| authStore | 로그인 상태 + 멤버 목록 | kkummolda-auth |
| leadsStore | 영업 리드 목록 | - |
| notificationStore | 알림 목록 | - |

---

### ADR-004: Backend — Supabase (To-Be)

**결정**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)  
**이유**:
- Auth: 이메일 OTP + JWT → Member 인증에 적합
- RLS (Row Level Security) → 멤버는 자신의 데이터만 접근
- Storage: 음성 녹음 파일 (base64 → binary 변환 후 저장)
- Edge Functions: OpenAI API 호출 (API Key 서버사이드 보호)
- Realtime: Admin 포털 실시간 알림

**대안**: Firebase → PostgreSQL 기반이 아니어서 복잡한 쿼리에 불리. Supabase 선택

---

### ADR-005: AI 분석 — OpenAI GPT-4o

**결정**: OpenAI GPT-4o (via Supabase Edge Function)  
**이유**:
- 42문항 텍스트/음성 응답 → 브랜드 프로필 생성
- Structured Output (JSON Mode) → 타입 안전한 응답 파싱
- Edge Function 경유 → API Key 클라이언트 노출 방지

**프롬프트 전략**:
- System Role: 경력 자산화 전문 코치
- 문항별 답변 + 메타데이터 → brandProfile JSON 생성
- 결과: oneLiner, coreValues, strengthStatement, targetAudience, differentiator

---

### ADR-006: 이메일 — Resend

**결정**: Resend  
**이유**:
- Supabase Edge Function 내에서 API 호출
- React Email로 HTML 템플릿 구성
- 배달률 높음, 한국 이메일 서버 호환

**이메일 트리거 목록**:
| 이벤트 | 수신자 | 템플릿 |
|---|---|---|
| 무료 진단 완료 | 고객 | free-diagnosis-result |
| 서비스 신청 접수 | 고객 + Admin | apply-confirm |
| 코칭 분석 완료 | 고객 | coaching-report-ready |
| 멤버 계정 발급 | 고객 | member-welcome |

---

### ADR-007: 결제 — 토스페이먼츠

**결정**: 토스페이먼츠 SDK  
**이유**:
- 한국 결제 수단 전체 지원 (카드, 계좌이체, 간편결제)
- Webhook → Supabase Edge Function으로 결제 완료 이벤트 수신
- 환불 API 내장

**결제 흐름**:
```
고객 신청 → 토스페이먼츠 결제창 → 승인/실패 →
Webhook → Edge Function → DB 결제 상태 업데이트 →
자동 이메일 + 멤버 계정 발급 (빌드 이상)
```

---

## 3. 레이어 아키텍처

```
┌─────────────────────────────────────────┐
│            Presentation Layer            │
│  pages/ + components/ (React)           │
├─────────────────────────────────────────┤
│            Application Layer            │
│  store/ (Zustand) + hooks/              │
│  React Query (서버 상태 캐시)            │
├─────────────────────────────────────────┤
│            Domain Layer                  │
│  lib/diagnostic.ts (진단 알고리즘)       │
│  lib/coachingAI.ts (AI 연동)            │
│  lib/audioRecorder.ts (음성 녹음)       │
├─────────────────────────────────────────┤
│            Infrastructure Layer          │
│  Supabase Client (DB + Auth + Storage)  │
│  OpenAI Client (Edge Fn 경유)           │
│  Resend Client (Edge Fn 경유)           │
└─────────────────────────────────────────┘
```

---

## 4. 배포 아키텍처

```
[GitHub main branch]
        │
        ▼ git push → Vercel CI 자동 트리거
[Vercel Build]
  vite build → dist/
        │
        ▼
[Vercel Edge Network] ─── CDN 캐시 (정적 자산)
        │
        ├── /hankkeut-prototype/* → public/ 정적 HTML 서빙
        └── /* → index.html (SPA fallback)

[Supabase Cloud] (별도)
  - DB: ap-northeast-1 (서울 리전)
  - Storage: voice-recordings 버킷
  - Edge Functions: analyze-coaching, send-email, payment-webhook
```

### 환경 분리

| 환경 | URL | 브랜치 | Supabase 프로젝트 |
|---|---|---|---|
| Production | career-translate-lab-2.vercel.app | main | hankkeut-prod |
| Staging | hankkeut-staging.vercel.app | staging | hankkeut-staging |
| Dev | localhost:3005 | feat/* | hankkeut-dev |

### 환경 변수 목록

```bash
# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# 클라이언트 노출 불가 (Edge Function 전용)
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
RESEND_API_KEY=
TOSSPAYMENTS_SECRET_KEY=
```

---

## 5. 성능 아키텍처

### 코드 스플리팅 전략

```typescript
// App.tsx — lazy loading 적용 대상
const CoachingQuestions = lazy(() => import('./pages/coaching/CoachingQuestions'))
const CoachingReport    = lazy(() => import('./pages/coaching/CoachingReport'))
const Admin             = lazy(() => import('./pages/Admin'))
// → 초기 번들에서 제외 (로그인 후에만 접근)
```

### 번들 크기 목표

| 청크 | 현재 | 목표 |
|---|---|---|
| 초기 번들 | 미측정 | < 200KB gzipped |
| 코칭 청크 | - | < 100KB |
| 어드민 청크 | - | < 80KB |

### Core Web Vitals 목표

| 지표 | 목표 |
|---|---|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| TTFB (Time to First Byte) | < 600ms (Vercel Edge) |
