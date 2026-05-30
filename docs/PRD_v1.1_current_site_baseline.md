# PRD v1.1 — 현재 사이트 구현 기준선 (Current Site Baseline)

| 항목 | 내용 |
| :--- | :--- |
| **문서 버전** | v1.1 |
| **작성일** | 2026-05-30 |
| **작성 기준** | 코드베이스 직접 분석 (App.tsx, 각 페이지/스토어/데이터 파일) |
| **목적** | 기존 PRD/SRS(계획 문서)와 별개로, 현재 실제 동작하는 사이트의 상태를 있는 그대로 기록 |
| **주의** | 이 문서는 "무엇을 만들 것인가"가 아닌 "지금 실제로 무엇이 만들어져 있는가"를 기술합니다 |

---

## 1. 현재 기술 스택

| 영역 | 실제 사용 기술 |
| :--- | :--- |
| **빌드 도구** | Vite |
| **프레임워크** | React 18 + TypeScript |
| **라우팅** | React Router DOM v6 (클라이언트 사이드) |
| **스타일링** | Tailwind CSS 3 + shadcn/ui (Radix UI 기반) |
| **상태관리** | Zustand + `persist` 미들웨어 (localStorage 기반) |
| **폼 처리** | React Hook Form + Zod |
| **데이터 페칭** | TanStack React Query (현재 실제 외부 API 호출 없음) |
| **AI 분석** | 로컬 알고리즘 (`src/lib/freeDiagnostic.ts` — `analyzeFree()`) |
| **외부 DB** | 없음 (모든 데이터는 localStorage에 저장) |
| **서버/백엔드** | 없음 (순수 클라이언트 사이드 앱) |
| **인증** | Zustand localStorage (서버 세션/JWT 없음) |
| **아이콘** | Lucide React |
| **폰트** | SCDream (OTF, `src/assets/fonts/`) |

---

## 2. 전체 라우트 목록

`src/App.tsx` 기준 현재 등록된 라우트.

| 경로 | 페이지 파일 | 설명 | 접근 제한 |
| :--- | :--- | :--- | :--- |
| `/` | `pages/Index.tsx` | 메인 랜딩 페이지 | 공개 |
| `/service` | `pages/Service.tsx` | 서비스 소개 페이지 | 공개 |
| `/diagnosis` | `pages/Diagnosis.tsx` | 무료 7문항 진단 (멀티스텝) | 공개 |
| `/result` | `pages/Result.tsx` | 구 진단 결과 페이지 | 공개 (현재 미사용) |
| `/consultation` | `pages/Consultation.tsx` | 30분 무료 상담 신청 | 공개 |
| `/apply/diagnosis` | `pages/apply/ApplyDiagnosis.tsx` | 한끗 진단 50만원 신청 | 공개 |
| `/apply/build` | `pages/apply/ApplyBuild.tsx` | 한끗 빌드 350만원 신청 | 공개 |
| `/apply/launch` | `pages/apply/ApplyLaunch.tsx` | 한끗 론칭 700만원 신청 | 공개 |
| `/apply/partner` | `pages/apply/ApplyPartner.tsx` | 한끗 파트너 월 100만원 신청 | 공개 |
| `/apply/thank-you` | `pages/apply/ApplyThankYou.tsx` | 신청 완료 페이지 | 공개 |
| `/login` | `pages/Login.tsx` | 멤버 로그인 | 공개 |
| `/coaching` | `pages/coaching/CoachingDashboard.tsx` | 42문항 코칭 대시보드 | 로그인 필요 (클라이언트) |
| `/coaching/questions` | `pages/coaching/CoachingQuestions.tsx` | 42문항 작성 | 로그인 필요 (클라이언트) |
| `/coaching/question` | `pages/coaching/CoachingQuestions.tsx` | 동일 (중복 라우트) | 로그인 필요 (클라이언트) |
| `/coaching/review` | `pages/coaching/CoachingReview.tsx` | 제출 답변 전체 리뷰 | 로그인 필요 (클라이언트) |
| `/admin` | `pages/Admin.tsx` | 관리자 콘솔 | **인증 없음** (placeholder) |
| `*` | `pages/NotFound.tsx` | 404 페이지 | 공개 |

> **참고:** `/coaching/*` 페이지는 `useAuthStore`에서 `currentMember`가 null이면 `/login`으로 redirect하지만, 이는 서버 수준 보호가 아닌 클라이언트 사이드 리다이렉트입니다. localStorage를 직접 조작하면 우회 가능합니다.

---

## 3. 데이터 레이어 (Zustand Stores)

모든 데이터는 브라우저 localStorage에만 저장됩니다. 서버/DB 없음.

### 3-1. `freeDiagnosticStore.ts`

**localStorage 키:** `kkummolda-free-diagnostic`

```typescript
interface FreeDiagnosticState {
  step: "email" | "form" | "loading" | "report" | "complete";
  lead: { name: string; email: string; careerYears: string } | null;
  agreedPrivacy: boolean;
  answers: Record<number, string>;       // 질문 id → 답변 텍스트
  currentQuestion: number;
  result: FreeDiagnosticResult | null;
}
```

**역할:** 무료 7문항 진단 멀티스텝 플로우 상태 관리 및 로컬 분석 결과 저장.

---

### 3-2. `authStore.ts`

**localStorage 키:** `kkummolda-auth`

```typescript
interface Member {
  id: string;          // crypto.randomUUID()
  name: string;
  email: string;
  password: string;    // ⚠️ 평문 저장
  productKey: string;  // "diagnosis" | "build" | "launch" | "partner"
  createdAt: string;
}

interface AuthState {
  currentMember: Member | null;
  members: Member[];   // 관리자가 발급한 전체 멤버 목록
}
```

**역할:** 멤버 계정 목록 관리 + 현재 로그인 멤버 추적. 비밀번호 평문 저장 (프로토타입 수준).

**초기 데이터:** 테스트 계정 1개 내장 (`test@example.com` / `password123`).

---

### 3-3. `coachingStore.ts`

**localStorage 키:** (persist)

```typescript
interface CoachingAnswer {
  text?: string;
  voice?: {
    data: string;        // base64 인코딩
    mimeType: string;
    duration: number;    // 초
  };
}

interface CoachingSession {
  status: "in_progress" | "submitted";
  answers: Record<number, CoachingAnswer>;  // 질문 id (1~42) → 답변
  lastSavedAt: string | null;
  submittedAt: string | null;
}
```

**역할:** 42문항 코칭 세션 및 답변 관리. 텍스트 + 음성 녹음 모두 지원. 자동 저장.

---

### 3-4. `leads.ts`

**localStorage 키:** (persist)

```typescript
interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  field: string;                    // 전문 분야
  career: string;                   // 상세 경력
  challenge: string;                // 현재 가장 어려운 점
  purposes: string[];               // 관심 목적
  outcomes: string[];               // 원하는 결과물
  channel: string;                  // 상담 희망 방식
  diagnosticScore?: number;
  diagnosticType?: string;
  scores?: {
    identity: number;
    strengths: number;
    target: number;
    differentiation: number;
  };
  recommendedPackage?: string;
  answers?: Record<number, string>; // 무료 진단 7문항 답변 (진단 후 상담 신청 시)
  memo: string;
  status: LeadStatus;
  createdAt: string;
}

type LeadStatus = "대기중" | "상담중" | "완료" | "보류";
```

**역할:** 모든 유형의 상담 리드 통합 관리 (무료상담, 유료 신청 4종).

---

### 3-5. `diagnostic.ts` (구 스토어, 현재 미사용)

기존 버전의 진단 스토어. `freeDiagnosticStore.ts`로 대체됨. 라우트 `/result`와 연결되어 있으나 현재 미사용.

---

## 4. 서비스 플로우별 구현 현황

### 4-1. 무료 진단 플로우 (`/diagnosis`)

**문항 수:** 7문항 (`FREE_DIAGNOSTIC_QUESTIONS`, `src/data/content.ts`)

**플로우:**
```
[email 단계]
  - 이름, 이메일, 경력연수(드롭다운) 입력
  - 개인정보 수집 동의 체크박스 (agreedPrivacy)
  ↓
[form 단계]
  - FREE_DIAGNOSTIC_QUESTIONS 7문항을 1문항씩 순차 표시
  - textarea 입력, 이전/다음 네비게이션
  - 진행률 표시 (progress bar)
  ↓
[loading 단계]
  - AnalysisLoading 컴포넌트: 모의 로딩 UI
  - analyzeFree(answers) 로컬 알고리즘 실행
  ↓
[report 단계]
  - 진단 결과 표시 (DiagnosisType, 영역별 점수, 브랜드 방향 문구)
  - Report 컴포넌트: 결과 + 이메일 전송 CTA
  ↓
[complete 단계]
  - 완료 화면 + 상담 연결 CTA
```

**7문항 구성:**

| Q# | 진단 영역 | 질문 핵심 |
| :---: | :--- | :--- |
| 1 | identity | 직함 없이 나를 소개한다면? |
| 2 | coreValues | 가장 자랑스러웠던 순간 3가지 |
| 3 | strengths | 자연스럽게 잘 되는 것 3가지 |
| 4 | authority | 사람들이 조언 구하러 오는 분야 |
| 5 | targetAudience | 돕고 싶은 사람 (마음 상태 기준) |
| 6 | differentiation | 나만의 차별점 |
| 7 | message | 세상에 전하고 싶은 핵심 메시지 한 문장 |

**AI 분석:** 외부 API 없음. `src/lib/freeDiagnostic.ts`의 `analyzeFree()` 로컬 함수로 처리.

**출력 진단 유형 4종:**
- `title-dependent` (직함 의존형)
- `experience-list` (경험 나열형)
- `hidden-expert` (숨은 전문성형)
- `market-ready` (시장 진입 준비형)

---

### 4-2. 유료 상품 신청 플로우 (`/apply/*`)

4개 상품별 독립 신청서 페이지. 결제 기능 없음 (리드 수집 목적).

| 경로 | 상품명 | 가격 |
| :--- | :--- | :--- |
| `/apply/diagnosis` | 한끗 진단 | 50만원 |
| `/apply/build` | 한끗 빌드 | 350만원 |
| `/apply/launch` | 한끗 론칭 | 700만원 |
| `/apply/partner` | 한끗 파트너 | 월 100만원 |

**제출 시:** `leadsStore`에 Lead 데이터 저장. 완료 후 `/apply/thank-you` 리다이렉트.

---

### 4-3. 30분 무료 상담 신청 (`/consultation`)

별도 상담 신청 폼. 제출 시 `leadsStore`에 Lead 저장.

수집 항목: 이름, 전화, 이메일, 전문 분야, 상세 경력, 현재 어려운 점, 관심 목적(복수), 원하는 결과물(복수), 상담 방식(전화/Zoom/대면).

---

### 4-4. 멤버 코칭 플로우

유료 결제 완료 후 관리자가 수동으로 계정을 발급하는 방식.

**전체 플로우:**
```
[/admin - 회원 탭]
  관리자: 이름 + 이메일 + 비밀번호 + 상품 입력 → 계정 발급
  → 카카오톡/SMS 안내문 원클릭 복사 기능
  ↓
[/login]
  멤버: 이메일 + 비밀번호 입력
  → authStore.login() → localStorage에서 일치하는 멤버 탐색
  → 성공 시 currentMember 설정 → /coaching 리다이렉트
  ↓
[/coaching]  (CoachingDashboard)
  - 파트별 진행률 시각화 (4개 파트)
  - 전체 42문항 중 완료 문항 수 / 퍼센트
  - 마지막 저장 시각
  - "이어서 작성하기" / "작성 시작하기" CTA
  ↓
[/coaching/questions]  (CoachingQuestions)
  - 42문항 순차 표시
  - 텍스트 입력 또는 음성 녹음 선택 가능
  - 자동 저장 (coachingStore.answers)
  - 최종 제출 → session.status = "submitted"
  ↓
[/coaching/review]  (CoachingReview)
  - 전체 제출 답변 파트별 조회
  - 음성 답변은 오디오 플레이어 표시
```

**42문항 파트 구성:**

| PART | 제목 | 문항 범위 | 문항 수 |
| :---: | :--- | :--- | :---: |
| 1 | 나는 어떤 삶을 살아왔는가 | Q01–Q10 | 10 |
| 2 | 나는 지금 무엇을 가지고 있는가 | Q11–Q22 | 12 |
| 3 | 나는 무엇을 원하는가 | Q23–Q32 | 10 |
| 4 | 나는 세상에 어떻게 말할 것인가 | Q33–Q42 | 10 |

---

### 4-5. 어드민 콘솔 (`/admin`)

**인증:** 없음. `AdminGate` 컴포넌트는 `return <>{children}</>` placeholder.

**Tab 1: 상담 리드 관리**

- 전체 리드 목록 테이블 (이름, 신청구분, 연락처, 점수, 진단유형, 추천패키지, 상태, 메모, 신청일)
- 신청 구분 필터: 전체 / 무료상담 / 한끗 진단 / 한끗 빌드 / 한끗 론칭 / 한끗 파트너
- 상태 변경 (대기중 / 상담중 / 완료 / 보류)
- 메모 인라인 편집
- 리드 상세 펼치기: 영역별 점수 4개 + 상담 세부 요구사항 + **무료 진단 7문항 답변 전문**

**Tab 2: 코칭 회원 및 ID 관리**

- 신규 회원 발급 폼 (이름, 이메일, 비밀번호, 상품 패키지)
- 발급 후 카카오톡/SMS 안내문 자동 생성 + 원클릭 복사
- 발급된 회원 목록 테이블 (이름, 이메일 ID, 비밀번호 평문, 상품, 진행현황, 상태)
- 42문항 답변 상세 조회 (파트별, 텍스트 + 음성 플레이백)
- 회원 삭제

---

## 5. 데이터 흐름 요약

```
[무료 진단 경로]
  /diagnosis (email 단계) → freeDiagnosticStore.lead 저장
  /diagnosis (form 단계) → freeDiagnosticStore.answers 저장
  /diagnosis (report 단계) → analyzeFree() → freeDiagnosticStore.result 저장
  → Report 화면에서 "상담 신청" CTA 클릭 → /consultation
  → /consultation 제출 → leadsStore에 Lead 저장 (answers 포함)

[유료 신청 경로]
  /apply/* 폼 제출 → leadsStore에 Lead 저장 (outcomes에 상품명 포함)

[코칭 경로]
  /admin 멤버 발급 → authStore.members에 저장
  /login → authStore.currentMember 설정
  /coaching/questions 작성 → coachingStore.sessions[memberId].answers 저장
  /admin 멤버 탭 → coachingStore에서 memberId로 answers 조회
```

---

## 6. 현재 미구현 항목 (SRS 계획 대비)

| # | 미구현 항목 | SRS 계획 | 현재 상태 |
| :---: | :--- | :--- | :--- |
| 1 | 어드민 인증 | 환경변수 패스워드 | placeholder (인증 없음) |
| 2 | 외부 DB 연동 | Supabase + Prisma | localStorage만 사용 |
| 3 | AI API 연동 | Gemini API Free Tier | 로컬 알고리즘 |
| 4 | AI 리포트 관리자 검수·승인 플로우 | S9 (Must) | 미구현 |
| 5 | 승인 리포트 웹뷰 (`/report/[id]`) | S10 (Must) | 미구현 |
| 6 | 서버 액션 / Route Handler | Next.js 전제 | 해당 없음 (Vite) |
| 7 | 멤버 비밀번호 암호화 | — | 평문 저장 |
| 8 | GA4 / Sentry 연동 | 선택사항 | 미연동 |
| 9 | 데이터 영속성 (새 브라우저/기기) | DB 저장 | localStorage만 (기기별 독립) |
| 10 | 진단 결과 이메일 전송 | — | Report 단계 CTA에 있으나 실제 전송 여부 불명 |

---

## 7. 현재 구현 범위 요약 (구현 완료 / 미구현)

| 기능 | 구현 완료 | 비고 |
| :--- | :---: | :--- |
| 메인 랜딩 페이지 | ✅ | |
| 서비스 소개 페이지 | ✅ | |
| 무료 7문항 진단 (멀티스텝) | ✅ | 로컬 알고리즘 |
| 진단 결과 리포트 화면 | ✅ | 로컬 생성 |
| 30분 무료 상담 신청 | ✅ | |
| 4종 유료 상품 신청서 | ✅ | 결제 없음 |
| 멤버 로그인 | ✅ | localStorage 기반 |
| 42문항 코칭 (텍스트+음성) | ✅ | |
| 코칭 대시보드 (진행률) | ✅ | |
| 코칭 답변 리뷰 화면 | ✅ | |
| 어드민: 리드 목록 관리 | ✅ | |
| 어드민: 멤버 계정 발급 | ✅ | |
| 어드민: 코칭 답변 조회 | ✅ | |
| 어드민: AI 리포트 검수·승인 | ❌ | SRS Must |
| 승인 리포트 웹뷰 | ❌ | SRS Must |
| 어드민 인증 | ❌ | SRS Must |
| Gemini/Claude AI 연동 | ❌ | SRS Must |
| 외부 DB (Supabase 등) | ❌ | SRS Must |
