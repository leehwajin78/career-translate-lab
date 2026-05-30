# PRD/SRS Gap Analysis — 계획 vs 현재 구현 비교

| 항목 | 내용 |
| :--- | :--- |
| **문서 버전** | v1.0 |
| **작성일** | 2026-05-30 |
| **비교 기준 (계획)** | PRD v0.4.2 + SRS v1.3 |
| **비교 기준 (현재)** | PRD_v1.1_current_site_baseline.md |
| **목적** | 후속 구현 우선순위 판단 및 방향 결정을 위한 차이 분석 |

---

## 1. 기술 스택 GAP

| 영역 | SRS v1.3 계획 | 현재 구현 | 차이 심각도 |
| :--- | :--- | :--- | :---: |
| **프레임워크** | Next.js App Router | Vite + React Router DOM | 🔴 Critical |
| **서버 로직** | Server Actions + Route Handlers | 없음 (클라이언트 전용) | 🔴 Critical |
| **데이터베이스** | Supabase Free + Prisma ORM | localStorage (Zustand persist) | 🔴 Critical |
| **AI 연동** | Gemini API Free Tier (Vercel AI SDK) | 로컬 알고리즘 (`analyzeFree()`) | 🔴 Critical |
| **배포** | Vercel Hobby | 미배포 (로컬 개발) | 🟡 Moderate |
| **UI 라이브러리** | Tailwind + shadcn/ui | Tailwind + shadcn/ui | ✅ 일치 |
| **폼 처리** | React Hook Form + Zod | React Hook Form + Zod | ✅ 일치 |
| **인증 (어드민)** | 환경변수 패스워드 체크 | placeholder (무인증) | 🔴 Critical |
| **인증 (멤버)** | (SRS에 명세 없음) | Zustand localStorage 이메일/패스워드 | 🟡 Moderate |
| **GA4** | 선택 사항 | 미연동 | 🟢 Low |
| **Sentry** | 선택 사항 | 미연동 | 🟢 Low |

> **Critical 판단 기준:** 운영 전환 시 데이터 영속성, 보안, AI 품질에 직접 영향을 주는 항목.

---

## 2. 기능 GAP (SRS In-Scope 항목별)

SRS v1.3 §1.2 In-Scope(S1~S12) 항목별 구현 상태.

| SRS ID | 항목 | 구현 상태 | 비고 |
| :---: | :--- | :---: | :--- |
| S1 | 랜딩페이지 (서비스 소개, 진단 시작 CTA) | ✅ 구현 | `/` |
| S2 | 16문항 진단 폼 | ⚠️ 부분 구현 | **7문항**으로 구현됨 (SRS 16문항과 차이) |
| S3 | 질문별 브랜드 자산 안내 | ⚠️ 부분 구현 | hint/placeholder 있으나 SRS 명세의 assetHint 구조와 다름 |
| S4 | 리드 정보 저장 (이름, 연락처, 유입경로) | ✅ 구현 | leadsStore (localStorage) |
| S5 | 답변 원문 저장 (16문항) | ⚠️ 부분 구현 | 7문항 답변 저장 (localStorage) |
| S6 | AI 진단 리포트 생성 (강점/약점/방향/CTA) | ⚠️ 부분 구현 | 로컬 알고리즘으로 구현 (실제 AI 아님) |
| S7 | 관리자 목록 화면 | ✅ 구현 | `/admin` Tab 1 리드 목록 |
| S8 | 관리자 상세 화면 (답변+리포트 조회) | ⚠️ 부분 구현 | 진단 답변 조회 가능. AI 리포트 섹션 없음 |
| S9 | 관리자 검수·수정·승인 | ❌ 미구현 | 리포트 수정/승인/거부 플로우 없음 |
| S10 | 승인 리포트 웹뷰 (`/report/[id]`) | ❌ 미구현 | 해당 라우트 없음 |
| S11 | 상담 CTA 연결 (구글폼/이메일/카카오) | ⚠️ 부분 구현 | CTA 버튼 있으나 실제 외부 링크 연결 확인 필요 |
| S12 | AI 호출 로그 (성공/실패/시간/오류) | ❌ 미구현 | AI API 자체가 없으므로 해당 없음 |

**범례:** ✅ 구현 완료 / ⚠️ 부분 구현 / ❌ 미구현

---

## 3. UX 플로우 GAP

### 3-1. 라우트 네이밍 차이

| SRS 계획 경로 | 현재 구현 경로 | 차이 |
| :--- | :--- | :--- |
| `/diagnose` | `/diagnosis` | 명칭 다름 |
| `/report/[id]` | 미구현 | 없음 |
| `/admin/diagnoses/[id]` | `/admin` (단일 페이지, 탭 구조) | 구조 다름 |
| (명세 없음) | `/login` | SRS에 없는 라우트 |
| (명세 없음) | `/coaching`, `/coaching/questions`, `/coaching/review` | SRS에 없는 라우트 (V1.5 예정이었음) |
| (명세 없음) | `/apply/diagnosis`, `/apply/build`, `/apply/launch`, `/apply/partner`, `/apply/thank-you` | SRS에 없는 라우트 |
| (명세 없음) | `/service` | SRS에 없는 라우트 |

### 3-2. 데이터 플로우 차이

| 시나리오 | SRS 계획 플로우 | 현재 구현 플로우 |
| :--- | :--- | :--- |
| **진단 제출** | 폼 → Server Action → Supabase DB → Gemini API → Report (draft) 저장 | 폼 → Zustand → 로컬 알고리즘 → 화면에 즉시 표시 |
| **리포트 공유** | 관리자 승인 → `/report/[id]` URL 고객에게 전달 | 미구현 (진단 플로우 내부에만 표시됨) |
| **어드민 리포트 검수** | 어드민 상세 → 수정 → 승인 버튼 → Report.status = approved | 미구현 |
| **데이터 영속성** | Supabase (기기 무관) | localStorage (기기별 독립, 브라우저 초기화 시 삭제) |

---

## 4. 데이터 모델 GAP

### 4-1. SRS 계획 Prisma 스키마 vs 현재 Zustand 스토어

| SRS 엔터티 | SRS 역할 | 현재 구현 | 차이 |
| :--- | :--- | :--- | :--- |
| `Lead` | 고객 이름, 연락처, 유입경로 | `leadsStore` Lead 타입 | ✅ 유사 (localStorage) |
| `Diagnosis` | 진단 제출 단위 + 상태 | `freeDiagnosticStore` step | ⚠️ 단순화됨 |
| `Answer` | 질문 코드별 답변 원문 | `freeDiagnosticStore.answers` | ⚠️ 구조 단순화 |
| `Report` | AI 리포트 JSON + 승인 상태 | `freeDiagnosticStore.result` | ⚠️ 승인 상태 없음 |
| `AiRun` | AI 호출 로그 | 없음 | ❌ 미구현 |
| `ReviewLog` | 관리자 수정 이력 | 없음 | ❌ 미구현 |
| `AdminUser` | 관리자 인증 정보 | 없음 | ❌ 미구현 |
| (없음) | — | `authStore` (Member 목록) | SRS에 없는 모델 |
| (없음) | — | `coachingStore` (42문항 세션) | SRS에 없는 모델 |

### 4-2. SRS Report JSON Schema vs 현재 FreeDiagnosticResult

**SRS 계획 JSON Schema:**
```json
{
  "summary": "string",
  "strengths": [{ "title", "description", "sourceQuestionCodes" }],
  "weaknesses": [{ "title", "description", "sourceQuestionCodes" }],
  "brandDirection": { "oneSentence", "description", "sourceQuestionCodes" },
  "recommendedNextStep": { "message", "ctaLabel" },
  "warnings": ["string"]
}
```

**현재 FreeDiagnosticResult (로컬 알고리즘 출력):**
```typescript
// src/lib/freeDiagnostic.ts 기준 (analyzeFree 반환값)
// 정확한 타입은 해당 파일 참조 필요
// DiagnosisType + 영역별 점수 + 추천 패키지 구조로 추정됨
```

> **차이:** SRS는 AI가 자연어 기반 JSON을 생성하는 구조. 현재 구현은 규칙 기반 로컬 알고리즘으로 점수/유형을 계산하는 구조. `sourceQuestionCodes` 연결 없음.

---

## 5. SRS Out-of-Scope였으나 현재 구현된 항목

SRS v1.3에서 V1.5/V2로 연기되거나 아예 명세되지 않았으나, 현재 코드에 구현되어 있는 기능.

| 항목 | SRS 계획 | 현재 상태 | 영향 |
| :--- | :--- | :--- | :--- |
| **42문항 코칭 플로우** (`/coaching/*`) | V1.5 Out-of-Scope (O3) | ✅ 구현 완료 | SRS 범위를 앞서 구현. 데이터 모델·플로우 재검토 필요 |
| **멤버 로그인 시스템** (`/login`) | SRS에 명세 없음 | ✅ 구현 완료 | 보안 강화 필요 |
| **멤버 계정 발급 (어드민)** | SRS에 명세 없음 | ✅ 구현 완료 | SRS 어드민 범위와 다름 |
| **유료 상품 신청서 4종** (`/apply/*`) | SRS에 명세 없음 (결제는 V2 Out-of-Scope) | ✅ 구현 완료 | 리드 수집 목적으로는 유효 |
| **서비스 소개 페이지** (`/service`) | SRS에 명세 없음 | ✅ 구현 완료 | 문제 없음 |
| **음성 녹음 답변** | SRS에 명세 없음 | ✅ 구현 완료 | base64 localStorage 저장 |

---

## 6. GAP 심각도 분류 및 대응 방향

### 🔴 Critical — 운영 전환 전 반드시 결정/해결 필요

| # | GAP | 현재 리스크 | 대응 방향 (결정 필요) |
| :---: | :--- | :--- | :--- |
| C-1 | 기술 스택 (Vite vs Next.js) | 백엔드 로직 구현 불가 | Vite 유지 + Supabase 직접 연동 OR Next.js 마이그레이션 |
| C-2 | 데이터 영속성 없음 (localStorage) | 실제 고객 데이터 유실 리스크 | Supabase 연동 시점 결정 |
| C-3 | 어드민 인증 없음 | 누구나 `/admin` 접근 가능 | 최소 비밀번호 환경변수 보호 즉시 적용 |
| C-4 | AI API 미연동 | 진단 리포트 품질 한계 | 로컬 알고리즘 유지 기간 결정 |
| C-5 | 리포트 검수·승인 플로우 없음 | SRS Must 기능 누락 | 어드민에 검수 탭 추가 또는 플로우 재설계 |
| C-6 | 승인 리포트 웹뷰 없음 | 고객에게 리포트 전달 방법 없음 | `/report/[id]` 구현 또는 대안 방식 결정 |

### 🟡 Moderate — 운영 중 개선 가능하나 우선순위 결정 필요

| # | GAP | 현재 리스크 | 대응 방향 |
| :---: | :--- | :--- | :--- |
| M-1 | 진단 문항 수 (7문항 vs SRS 16문항) | SRS 설계와 불일치 | 현행 7문항 확정 OR 16문항으로 확장 |
| M-2 | 멤버 비밀번호 평문 저장 | 보안 취약 | bcrypt 해싱 또는 서버 인증 전환 |
| M-3 | Report JSON 구조 차이 | V1.5 연동 시 구조 충돌 | 현행 구조 문서화 후 마이그레이션 계획 수립 |
| M-4 | 음성 답변 base64 localStorage | 용량 한계, 기기 이전 불가 | Supabase Storage 마이그레이션 |
| M-5 | 라우트 네이밍 불일치 | SRS 문서와 혼란 | 네이밍 통일 후 문서 업데이트 |

### 🟢 Low — 현재 운영에 영향 없음

| # | GAP | 비고 |
| :---: | :--- | :--- |
| L-1 | GA4 미연동 | 파일럿 단계에서 선택 사항 |
| L-2 | Sentry 미연동 | 파일럿 단계에서 선택 사항 |
| L-3 | `/result` 페이지 미사용 | 구 버전 잔존, 삭제 또는 정리 가능 |
| L-4 | `/coaching/question` 중복 라우트 | `/coaching/questions`와 동일, 정리 가능 |

---

## 7. 구현 선행/후행 의존성 맵

다음 기능을 구현하려면 선행 결정/구현이 필요합니다.

```
[어드민 인증]
  → 어드민 리포트 검수·승인 구현의 전제 조건

[데이터 저장 레이어 결정 (localStorage vs Supabase)]
  → AI API 연동의 전제 조건 (서버 사이드 API 키 관리)
  → 리포트 검수·승인의 전제 조건 (영속 상태 필요)
  → 승인 리포트 웹뷰의 전제 조건 (Report 엔터티 필요)

[AI API 연동]
  → AI 리포트 JSON 구조 확정의 전제 조건
  → 관리자 검수 UI 구현의 전제 조건

[승인 리포트 웹뷰]
  → 리포트 검수·승인 플로우 구현 이후 가능
```
