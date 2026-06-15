# PLAYBOARD — 한끗프로젝트 구현 상황판

> **SoT 선언**: 이 문서는 전체 화면 기술 명세 · 구현 현황 · 요구사항 변경의 단일 출처입니다.  
> PRD · SRS · 이슈 등 모든 요구사항 변경은 이 문서의 §8 Change Log 또는 §7 Open Issues 에 먼저 기록됩니다.  
> 참조 문서: [01 아키텍처](tech-spec/01-architecture.md) · [02 데이터모델](tech-spec/02-data-model.md) · [03 API명세](tech-spec/03-api-spec.md) · [04 보안](tech-spec/04-security.md) · [05 운영](tech-spec/05-operations.md)  
> 마지막 업데이트: 2026-06-15 | PM: 이화진

---

## 0. 빠른 현황 (At-a-Glance)

### 화면 구현 현황

| 그룹 | 전체 | 🟢 FE완료 | 🟡 FE부분 | 🔴 미시작 | ⚫ 보류(로드맵) |
|---|---|---|---|---|---|
| Phase 1 공개 (C-01~C-09, C-15) | 10 | 0 | 9 | 1 | — |
| Phase 1 멤버 (C-10~C-14) | 5 | 0 | 5 | 0 | — |
| Phase 1 어드민 (A-01~A-05) | 5 | 0 | 4 | 1 | — |
| Phase 1.5 보강 (R-01) | 1 | 0 | 0 | 1 | — |
| Phase 2 AI 연동 (R-02~R-11) | 10 | 0 | 0 | 0 | 10 |
| Phase 3 확장 (R-12~R-14) | 3 | 0 | 0 | 0 | 3 |
| **합계** | **34** | **0** | **18** | **2** | **13** |

> FE부분 = React 컴포넌트 존재 + 프로토타입 수준 UI, 그러나 Supabase 백엔드 미연동

### 백엔드 구현 현황

| 레이어 | 상태 | 비고 |
|---|---|---|
| Supabase Auth | ❌ 미구현 | authStore 하드코딩 임시 처리 |
| PostgreSQL (Supabase DB) | ❌ 미구현 | localStorage 임시 대체 |
| Edge Functions | ❌ 미구현 | API 스텁만 존재 |
| OpenAI GPT-4o | ⚠️ 뼈대 | src/lib/coachingAI.ts 스키마만 |
| Resend 이메일 | ❌ 미구현 | |
| 토스페이먼츠 결제 | ❌ 미구현 | |
| Vercel 정적 배포 | ✅ 구현 | hankkeut-prototype → public/ |

---

## 1. 마스터 화면 레지스트리 (Master Screen Registry)

> 상태 범례: 🟢 완료 | 🟡 FE부분 | 🔴 미시작 | ⚫ 보류

| ID | 화면명 | Route | 프로토타입 | React 컴포넌트 | Phase | 권한 | FE | BE | 비고 |
|---|---|---|---|---|---|---|---|---|---|
| **C-01** | 메인 랜딩 | `/` | landing.html | `pages/Index.tsx` | Current | Guest | 🟡 | ❌ | 10섹션 |
| **C-02** | 서비스 소개 | `/service` | service.html | `pages/Service.tsx` | Current | Guest | 🟡 | ❌ | |
| **C-03** | 무료 진단 폼 | `/diagnosis` | diagnosis.html | `pages/Diagnosis.tsx` | Current+P1 | Guest | 🟡 | ❌ | 핵심 리드 수집 |
| **C-04** | 분석 로딩 | `/diagnosis` (state) | analyzing-free.html | `pages/Diagnosis.tsx` (step) | Current | Guest | 🟡 | ❌ | C-03 인라인 상태 |
| **C-05** | 무료 진단 리포트 | `/result` | report-free.html | `pages/Result.tsx` | Current | Guest | 🟡 | ❌ | 유형 4종 |
| **C-06** | 무료 상담 신청 | `/consultation` | consultation.html | `pages/Consultation.tsx` | Current+P1 | Guest | 🟡 | ❌ | 리드 수집 |
| **C-07** | 유료 상품 신청 | `/apply/*` | apply.html | `pages/apply/Apply*.tsx` | Current+P1 | Guest | 🟡 | ❌ | 4상품 공통 폼 |
| **C-08** | 신청 완료 | `/apply/thank-you` | apply-thank-you.html | `pages/apply/ApplyThankYou.tsx` | Current | Guest | 🟡 | ❌ | |
| **C-09** | 멤버 로그인 | `/login` | login.html | `pages/Login.tsx` | Current+P1 | Guest | 🟡 | ❌ | Supabase Auth 미연동 |
| **C-10** | 코칭 대시보드 | `/coaching` | coaching-dashboard.html | `pages/coaching/CoachingDashboard.tsx` | Current | Member | 🟡 | ❌ | 4파트 진행률 |
| **C-11** | 42문항 작성 | `/coaching/questions` | coaching-questions.html | `pages/coaching/CoachingQuestions.tsx` | Current+P1 | Member | 🟡 | ❌ | Mission-Critical |
| **C-12** | 답변 리뷰·제출 | `/coaching/review` | coaching-review.html | `pages/coaching/CoachingReview.tsx` | Current | Member | 🟡 | ❌ | |
| **C-13** | AI 분석 진행 | `/coaching/analyzing` | coaching-analyzing.html | `pages/coaching/CoachingAnalyzing.tsx` | Current | Member | 🟡 | ❌ | 폴링 로직 필요 |
| **C-14** | 코칭 리포트 | `/coaching/report` | coaching-report.html | `pages/coaching/CoachingReport.tsx` | Current+P1 | Member | 🟡 | ❌ | 검수 게이트 |
| **C-15** | 개인정보 처리방침 | `/privacy` | privacy.html | ❌ 미생성 | P1 | Guest | 🔴 | ❌ | [ISSUE-03] 라우트 누락 |
| **A-01** | 관리자 콘솔 | `/admin` | admin.html | `pages/Admin.tsx` | Current+P1 | Admin | 🟡 | ❌ | 리드 CRM + 멤버 발급 2탭 |
| **A-02** | 리드 상세 | `/admin` (modal) | admin-lead-detail.html | `pages/Admin.tsx` (panel) | Current | Admin | 🟡 | ❌ | |
| **A-03** | 코칭 워크스페이스 | `/coaching/workspace/:id` | workspace.html | `pages/coaching/CoachingWorkspace.tsx` | Current+P1 | Admin | 🟡 | ❌ | Mission-Critical |
| **A-04** | 알림 시스템 | `/admin` (overlay) | admin-notifications.html | notificationStore | Current | Admin | 🟡 | ❌ | |
| **A-05** | 어드민 인증 게이트 | `/admin` (guard) | admin-auth.html | `ProtectedRoute` (role=admin) | P1 | Admin | 🔴 | ❌ | Supabase 연동 후 활성화 |
| **R-01** | 검수 대기 안내 | `/coaching/report` (state) | report-pending.html | `pages/coaching/CoachingReport.tsx` | P1.5 | Member | 🔴 | ❌ | 이메일 알림 연계 |
| **R-02** | 마스터 브리프 | `/admin/brief` | admin-brief.html | — | P2 | Admin | ⚫ | ⚫ | AI 자동 생성 |
| **R-03** | 원라이너 3종 | `/admin/oneliner` | admin-oneliner.html | — | P2 | Admin | ⚫ | ⚫ | |
| **R-04** | 질문 아키텍처 | `/admin/questions` | admin-questions.html | — | P2 | Admin | ⚫ | ⚫ | |
| **R-05** | 패턴 분류기 | `/admin/patterns` | admin-patterns.html | — | P2 | Admin | ⚫ | ⚫ | |
| **R-06** | 브랜딩 매퍼 | `/admin/mapper` | admin-mapper.html | — | P2 | Admin | ⚫ | ⚫ | |
| **R-07** | 코칭 피드백 | `/admin/feedback` | admin-feedback.html | — | P2 | Admin | ⚫ | ⚫ | |
| **R-08** | 리포트 룰 엔진 | `/admin/rules` | admin-rules.html | — | P2 | Admin | ⚫ | ⚫ | |
| **R-09** | 교차검증 | `/admin/crosscheck` | admin-crosscheck.html | — | P2 | Admin | ⚫ | ⚫ | |
| **R-10** | 휴먼 핸드오프 | `/admin/handoff` | admin-handoff.html | — | P2 | Admin | ⚫ | ⚫ | |
| **R-11** | AI 호출 로그 | `/admin/airuns` | admin-airuns.html | — | P2 | Admin | ⚫ | ⚫ | |
| **R-12** | 리테이너 관리 | `/admin/retainer` | admin-retainer.html | — | P3 | Admin | ⚫ | ⚫ | 월 구독 |
| **R-13** | PPT Export | `/admin/export` | admin-export.html | — | P3 | Admin | ⚫ | ⚫ | |
| **R-14** | 변화 리포트 | `/coaching/change` | change-report.html | — | P3 | Member | ⚫ | ⚫ | 재진단 비교 |

---

## 2. Phase별 구현 체크리스트

### Phase 1 — MVP 출시 (목표: 2026-Q3)

#### 인프라·공통
- [ ] Supabase 프로젝트 생성 + 환경변수 설정 (.env.local)
- [ ] Supabase Auth (이메일+비밀번호) 활성화
- [ ] 데이터베이스 마이그레이션 실행 (docs/tech-spec/02-data-model.md)
- [ ] Vercel 환경변수 등록 (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- [ ] RLS 정책 적용 (leads, members, coaching_sessions, coaching_answers)
- [ ] CSP 헤더 설정 (vercel.json)
- [ ] /privacy 라우트 생성 [ISSUE-03]

#### 공개 플로우 (Guest)
- [ ] C-01 메인 랜딩 — 실제 섹션 데이터 연결 (FAQ, 상품 정보)
- [ ] C-02 서비스 소개 — PDF 링크 유지, 콘텐츠 완성
- [ ] C-03 무료 진단 — FreeDiagnosisSchema 폼 연동 + Edge Function POST
- [ ] C-04 분석 로딩 — analyzeFree() Edge Function 호출 연출
- [ ] C-05 무료 진단 리포트 — 4유형 분류 로직 + 결과 표시
- [ ] C-06 무료 상담 신청 — ConsultationSchema 폼 연동 + Supabase insert
- [ ] C-07 유료 상품 신청 — 4상품 ApplyForm + 리드 insert
- [ ] C-08 신청 완료 — 완료 메시지 + 다음 단계 안내
- [ ] C-09 멤버 로그인 — Supabase Auth signInWithPassword 연동
- [ ] C-15 개인정보 처리방침 — 페이지 생성 + 라우트 등록

#### 코칭 플로우 (Member)
- [ ] C-10 코칭 대시보드 — coachingStore → Supabase sessions 연동
- [ ] C-11 42문항 작성 — debounce 자동 저장 → coaching_answers upsert
- [ ] C-12 답변 리뷰·제출 — 최종 제출 → session status = 'submitted'
- [ ] C-13 AI 분석 진행 — /functions/v1/coaching-status 30초 폴링
- [ ] C-14 코칭 리포트 — analyzed 상태 + admin 확정 후 표시 게이트

#### 관리자 (Admin)
- [ ] A-01 관리자 콘솔 — 리드 테이블 + 멤버 발급 탭 → Supabase 연동
- [ ] A-02 리드 상세 — 진단 답변 전문 + 메모 → DB 연동
- [ ] A-03 코칭 워크스페이스 — 42문항 검토 + AIDraft + finalize
- [ ] A-04 알림 시스템 — notificationStore → Supabase Realtime 구독
- [ ] A-05 어드민 인증 — Supabase RBAC (role = 'admin') 게이트

#### 이메일·알림
- [ ] 무료 진단 접수 확인 이메일 (Resend)
- [ ] 상담 신청 접수 확인 이메일 (Resend)
- [ ] 코칭 제출 확인 이메일 (Resend)
- [ ] 리포트 준비 완료 알림 이메일 (Admin 확정 시 트리거)

### Phase 1.5 — 출시 직후 보강 (목표: 2026-Q4)
- [ ] R-01 검수 대기 안내 — 제출 후 / 분석 전 화면 + 이메일 연계
- [ ] 음성 입력 기능 활성화 (C-11 음성 탭 — upload-voice Edge Function)
- [ ] 교차 기기 이어쓰기 (Supabase DB 기반으로 전환)

### Phase 2 — AI 연동 (목표: 2027-Q1)
- [ ] R-02 마스터 브리프 (GPT-4o 자동 생성)
- [ ] R-03 원라이너 3종
- [ ] R-04~R-08 AI 엔진 화면 (질문/패턴/매퍼/피드백/룰)
- [ ] R-09~R-11 교차검증 · 핸드오프 · AI 호출 로그

### Phase 3 — 비즈니스 확장 (목표: 2027-Q3)
- [ ] R-12 리테이너 관리 (月 구독 + 토스페이먼츠)
- [ ] R-13 PPT/PDF Export 자동화
- [ ] R-14 변화 리포트 (재진단 비교)

---

## 3. 화면별 상세 기술 명세 — Phase 1 (C-01~C-15, A-01~A-05)

> 하위 항목 구조:  
> **목적** | **데이터 흐름** | **관련 Store** | **API** | **FR** | **NFR** | **EDGE** | **인수 조건**

---

### C-01 — 메인 랜딩

| 항목 | 내용 |
|---|---|
| Route | `/` |
| 프로토타입 | `hankkeut-prototype/landing.html` |
| 컴포넌트 | `src/pages/Index.tsx` |
| Phase | Current |
| 권한 | Guest |
| 관련 Store | — (정적 콘텐츠) |
| API | — |

**FR-C01-01** 히어로 섹션  
- 메인 헤드라인 + 서브카피 표시  
- CTA 1: "경력 가치 무료 진단받기" → `/diagnosis`  
- CTA 2: "30분 무료 상담 신청하기" → `/consultation`

**FR-C01-02** 네비게이션 바  
- 로고 → `/`  
- "서비스 소개" → `/service`  
- "진행 과정" → `/#process` (스무스 스크롤)  
- "상품 안내" → `/#products` (스무스 스크롤)  
- 활성 링크: 로열블루 (#0123B4) + font-weight:800  
- IntersectionObserver: 스크롤 위치에 따라 앵커 링크 자동 활성화

**FR-C01-03** 가치 제안·비교 섹션  
- "이런 분들께" 타깃 설명 + 경쟁 비교표

**FR-C01-04** 진행 과정 섹션 (`#process`)  
- 4단계 카드: 진단 → 빌드 → 론칭 → 파트너  
- 각 카드: "신청하기" → `/apply/{product}`

**FR-C01-05** 상품 안내 섹션 (`#products`)  
- 4개 상품 카드 (한끗 진단 50만원 / 한끗 빌드 350만원 / 한끗 론칭 별도 문의 / 한끗 파트너 별도 문의)  
- 한끗 빌드: "핵심" 뱃지 강조

**FR-C01-06** 산출물 6종 섹션  
- 원라이너 · 경력 선언서 · 포트폴리오 · 강의안 · SNS 콘텐츠 · 브랜드 가이드

**FR-C01-07** FAQ 아코디언 (8개)  
- `<details>`/`<summary>` 또는 Radix Accordion

**FR-C01-08** 최종 CTA 섹션 (로열블루 배경)  
- "지금 바로 시작하세요" + CTA 2개

**NFR-C01-01** LCP < 2.5s (Core Web Vitals)  
**NFR-C01-02** CLS < 0.1 (폰트 FOUT 방지 — font-display:swap)  
**NFR-C01-03** 모바일 760px 미만 → 햄버거 메뉴

**EDGE-C01-01** 뒤로가기 시 앵커 스크롤 위치 복원 → `scrollRestoration = 'manual'`  
**EDGE-C01-02** 모바일 뷰에서 네비 링크 클릭 → 메뉴 자동 닫힘

**인수 조건**  
- [ ] Lighthouse 모바일 Performance ≥ 80  
- [ ] CTA 2개 모두 올바른 라우트로 이동  
- [ ] FAQ 모든 항목 클릭·키보드(Enter/Space) 동작  
- [ ] 스크롤 중 앵커 링크 색상 자동 전환 확인

---

### C-02 — 서비스 소개

| 항목 | 내용 |
|---|---|
| Route | `/service` |
| 프로토타입 | `hankkeut-prototype/service.html` |
| 컴포넌트 | `src/pages/Service.tsx` |
| Phase | Current |
| 권한 | Guest |
| 관련 Store | — |
| API | — |

**FR-C02-01** 히어로 섹션  
- 아이브로우: "1:1 맞춤 6주 과정"  
- CTA: "프로그램 상세 안내서 다운로드" → Google Drive PDF (별도 탭)  
- PDF URL: `https://drive.google.com/file/d/1871MRxG1L2_ft-xe_z5vCmpFdQm24sv1/view`

**FR-C02-02** 대상·문제 정의 섹션  
- 타깃 페르소나 설명 + 페인포인트

**FR-C02-03** 한끗 방법론 3단계 (추출·번역·자산화)

**FR-C02-04** 6주 타임라인 그리드  
- 3열 2행 (주 1~3 / 주 4~6)  
- 각 주차 작업 명시

**FR-C02-05** 산출물 6종 카드 (2열 3행 그리드)

**FR-C02-06** 코치 소개 섹션  
- 사진 + 이름 + 약력

**FR-C02-07** 상품 가격 섹션 (로열블루 배경)  
- 한끗 진단 50만원 | 한끗 빌드 350만원 | 한끗 론칭 별도 문의 | 한끗 파트너 별도 문의

**FR-C02-08** FAQ + 최종 CTA

**EDGE-C02-01** PDF 다운로드 링크: Google Drive 접근 불가 시 → 링크 클릭 실패해도 페이지에 에러 없음 (별도 탭)

**인수 조건**  
- [ ] PDF 버튼 → 별도 탭 오픈  
- [ ] 6주 그리드 모바일에서 1열로 변환  
- [ ] 모든 상품 가격 표시 정확

---

### C-03 — 무료 진단 폼 (Mission-Critical)

| 항목 | 내용 |
|---|---|
| Route | `/diagnosis` |
| 프로토타입 | `hankkeut-prototype/diagnosis.html` |
| 컴포넌트 | `src/pages/Diagnosis.tsx` |
| Phase | Current + P1 |
| 권한 | Guest |
| 관련 Store | `diagnosticStore` (read/write) |
| API | `POST /functions/v1/submit-free-diagnosis` |
| Zod 스키마 | `FreeDiagnosisSchema` (`src/lib/validation.ts`) |

**FR-C03-01** 단계별 폼 (9단계: STEP 0~8)  
- STEP 0: 이름 · 이메일 · 경력연수 선택 · 개인정보 동의  
- STEP 1~7: 질문별 주관식 (각 1문항)  
- STEP 8: 보너스 체크리스트 + 제출  
- 완료 화면: 이름 + 이메일 표시 + CTA 2개

**FR-C03-02** 진행률 표시  
- 프로그레스 바: `(step / 8) × 100%`  
- 텍스트: "Q{n} / 7 진행 중"

**FR-C03-03** 유효성 검사 (클라이언트)  
- STEP 0: 이름 필수 · 이메일 형식 · 경력연수 선택 · 동의 체크 → 미완료 시 다음 차단 + 필드별 에러 메시지  
- STEP 1~7: 최소 5자 → 미달 시 차단

**FR-C03-04** 실시간 저장  
- 각 단계 답변 즉시 localStorage 저장 (key: `diag_answers`)  
- 새로고침/재진입 시 마지막 단계 복원

**FR-C03-05** 글자 수 실시간 표시  
- 각 textarea 우하단 "N자" 카운터

**FR-C03-06** 제출 처리  
- STEP 8 완료 → `POST /functions/v1/submit-free-diagnosis`  
- 로딩: 버튼 disabled + 스피너  
- 성공 → C-04 (분석 로딩 연출)  
- 실패 → Toast 에러 + 재시도 버튼

**FR-C03-07** 개인정보 동의  
- 동의 체크박스 + `/privacy` 링크 (별도 탭)  
- `consentAt` = ISO 8601 타임스탬프 서버 기록

**NFR-C03-01** 단계 전환 애니메이션 < 200ms  
**NFR-C03-02** 모바일 키패드 오픈 시 레이아웃 이탈 없음  
**NFR-C03-03** 제출 API 타임아웃: 10초

**EDGE-C03-01** 동일 이메일 24시간 내 재제출 → 서버 429 → "이미 진단을 진행하셨습니다. {email}을 확인해주세요."  
**EDGE-C03-02** 네트워크 단절 중 제출 → Toast: "인터넷 연결 확인. 답변은 저장됨." + 온라인 복구 시 자동 재시도  
**EDGE-C03-03** STEP 7 완료 후 브라우저 닫기 → 재진입 시 localStorage 복원  
**EDGE-C03-04** 이메일 입력 후 STEP 0 복귀 → 이메일 필드 읽기 전용  
**EDGE-C03-05** 동의 미체크 상태 → "다음" 버튼 DOM 레벨 disabled

**인수 조건**  
- [ ] 9단계 전체 이동 및 뒤로가기 동작  
- [ ] 유효성 실패 시 정확한 필드 에러 표시  
- [ ] 새로고침 후 마지막 단계 복원  
- [ ] 제출 성공 → C-04로 전환  
- [ ] 제출 실패 → Toast + 재시도 가능

---

### C-04 — 분석 로딩

| 항목 | 내용 |
|---|---|
| Route | `/diagnosis` (제출 후 state) 또는 별도 상태 |
| 프로토타입 | `hankkeut-prototype/analyzing-free.html` |
| 컴포넌트 | `src/pages/Diagnosis.tsx` (loading state) |
| Phase | Current |
| 권한 | Guest |
| 관련 Store | `diagnosticStore` |
| API | `POST /functions/v1/submit-free-diagnosis` (응답 대기 중) |

**FR-C04-01** 로딩 애니메이션 연출  
- 펄스 아이콘 또는 프로그레스 연출  
- 메시지: "답변을 분석하고 있습니다..."

**FR-C04-02** 분석 완료 시 C-05로 자동 이동  
- Edge Function 응답 수신 → `/result`로 replace 네비게이션

**FR-C04-03** 타임아웃 처리  
- 10초 초과 → "분석이 지연되고 있습니다. 잠시 후 다시 확인해주세요." + 재시도 버튼

**EDGE-C04-01** 뒤로가기 버튼 → `/diagnosis` 폼으로 이동 (분석 중 중단 안내)

---

### C-05 — 무료 진단 리포트

| 항목 | 내용 |
|---|---|
| Route | `/result` |
| 프로토타입 | `hankkeut-prototype/report-free.html` |
| 컴포넌트 | `src/pages/Result.tsx` |
| Phase | Current |
| 권한 | Guest |
| 관련 Store | `diagnosticStore` (read) |
| API | — (Edge Function 응답 결과 표시) |

**FR-C05-01** 유형 표시  
- 4종 유형 중 1종 강조: 준비형 / 성과형 / 관계형 / 통합형 브랜더  
- 이름 + 유형명 표시: "{이름} 님은 **{유형}**입니다"

**FR-C05-02** 종합 점수 (5개 영역)  
- 레이더 차트 또는 바 차트로 점수 시각화  
- 영역: 전문성 · 독창성 · 가시성 · 신뢰도 · 확장성

**FR-C05-03** 강점 + 보완 포인트 2~3개씩 텍스트 표시

**FR-C05-04** 전환 CTA 섹션  
- "다음 단계로 나아가세요" 섹션  
- CTA 1: "무료 상담 신청" → `/consultation`  
- CTA 2: "한끗 빌드 알아보기" → `/apply/build`

**NFR-C05-01** 리포트 인쇄 (브라우저 Print) 시 CTA 버튼 숨김

**EDGE-C05-01** `/result` 직접 접근 (diagnosticStore 비어있음) → `/diagnosis`로 리다이렉트

**인수 조건**  
- [ ] 4유형 중 정확한 유형 표시  
- [ ] 5영역 점수 차트 렌더링  
- [ ] diagnosticStore 없이 직접 접근 시 리다이렉트

---

### C-06 — 무료 상담 신청

| 항목 | 내용 |
|---|---|
| Route | `/consultation` |
| 프로토타입 | `hankkeut-prototype/consultation.html` |
| 컴포넌트 | `src/pages/Consultation.tsx` |
| Phase | Current + P1 |
| 권한 | Guest |
| 관련 Store | `leadsStore` (write) |
| API | `POST /functions/v1/submit-consultation` |
| Zod 스키마 | `ConsultationSchema` |

**FR-C06-01** 상담 신청 폼 필드  
- 이름 (필수) · 이메일 (필수) · 전화번호 (필수)  
- 전문 분야 (필수) · 경력 연수 선택  
- 목적 복수 선택 (체크박스) · 원하는 결과물 복수 선택  
- 메시지 (선택, 1000자 이내) · 선호 상담 시간 (선택)

**FR-C06-02** 개인정보 동의 게이트 [P1]  
- 동의 체크박스 필수 + `/privacy` 링크

**FR-C06-03** 제출 처리  
- POST 성공 → `leadsStore` 업데이트 + Toast "신청이 완료되었습니다"  
- 실패 → Toast 에러 + 재시도

**EDGE-C06-01** 동일 이메일 24시간 내 재신청 → 서버 409 → "이미 신청하셨습니다. 담당자가 연락드립니다."

---

### C-07 — 유료 상품 신청

| 항목 | 내용 |
|---|---|
| Route | `/apply/*` (apply/diagnosis, apply/build, apply/launch, apply/partner) |
| 프로토타입 | `hankkeut-prototype/apply.html` |
| 컴포넌트 | `src/pages/apply/Apply{Diagnosis|Build|Launch|Partner}.tsx` |
| Phase | Current + P1 |
| 권한 | Guest |
| 관련 Store | `leadsStore` (write) |
| API | `POST /functions/v1/submit-apply` |

**FR-C07-01** 상품 확인 카드  
- 신청 중인 상품명 · 가격 · 기간 표시 (라우트별 자동 선택)

**FR-C07-02** 공통 신청 폼 (ApplyForm 컴포넌트)  
- 이름 · 이메일 · 전화번호 · 전문 분야 · 경력 연수  
- 신청 동기 (필수, 200자 이상)  
- 개인정보 동의

**FR-C07-03** 제출 → C-08 (신청 완료) 이동

**EDGE-C07-01** `/apply/launch`, `/apply/partner` — "가격 별도 문의" 명시

---

### C-08 — 신청 완료

| 항목 | 내용 |
|---|---|
| Route | `/apply/thank-you` |
| 프로토타입 | `hankkeut-prototype/apply-thank-you.html` |
| 컴포넌트 | `src/pages/apply/ApplyThankYou.tsx` |
| Phase | Current |
| 권한 | Guest |
| 관련 Store | `leadsStore` (read) |
| API | — |

**FR-C08-01** 완료 메시지 + 접수 확인 이메일 안내  
**FR-C08-02** 다음 절차 안내 (영업일 2일 내 연락)  
**FR-C08-03** CTA: "홈으로" + "서비스 소개 보기"

**EDGE-C08-01** leadsStore 없이 직접 접근 → `/` 리다이렉트

---

### C-09 — 멤버 로그인

| 항목 | 내용 |
|---|---|
| Route | `/login` |
| 프로토타입 | `hankkeut-prototype/login.html` |
| 컴포넌트 | `src/pages/Login.tsx` |
| Phase | Current + P1 |
| 권한 | Guest |
| 관련 Store | `authStore` (write) |
| API | Supabase `auth.signInWithPassword()` |
| Zod 스키마 | `LoginSchema` |

**FR-C09-01** 로그인 폼  
- 이메일 + 비밀번호  
- "로그인" 버튼

**FR-C09-02** 로그인 성공 처리  
- `authStore.currentMember` 업데이트  
- `state.from` 복원 또는 `/coaching` 이동

**FR-C09-03** 로그인 실패 처리  
- 잘못된 자격증명 → "이메일 또는 비밀번호가 올바르지 않습니다." (429 제한 없음)  
- 5회 실패 → "잠시 후 다시 시도해주세요." (rate limiting)

**NFR-C09-01** 비밀번호 필드 마스킹 + 표시/숨김 토글

**EDGE-C09-01** 이미 로그인된 상태 → `/coaching` 자동 이동  
**EDGE-C09-02** 세션 만료 후 보호 라우트 접근 → `/login?redirect={경로}` 리다이렉트

**인수 조건**  
- [ ] Supabase Auth 연동 후 실제 로그인 동작  
- [ ] 로그인 성공 시 이전 경로 복원  
- [ ] 5회 실패 후 rate limit 메시지

---

### C-10 — 코칭 대시보드

| 항목 | 내용 |
|---|---|
| Route | `/coaching` |
| 프로토타입 | `hankkeut-prototype/coaching-dashboard.html` |
| 컴포넌트 | `src/pages/coaching/CoachingDashboard.tsx` |
| Phase | Current |
| 권한 | Member |
| 관련 Store | `coachingStore` (read/write), `authStore` (read) |
| API | `GET /functions/v1/coaching-status` |

**FR-C10-01** 세션 상태 표시  
- 4파트 진행률 바 (Part 1~4, 각 최대 10~11문항)  
- 전체 완료: N / 42 문항

**FR-C10-02** 상태별 CTA  
- `in_progress` → "이어서 작성하기" → `/coaching/questions`  
- `submitted` → "제출 완료 — 검토 중" (비활성)  
- `analyzed` → "리포트 보기" → `/coaching/report`

**FR-C10-03** 멤버 정보 표시  
- "{이름}님의 코칭 세션" + 상품명 + 기간

**EDGE-C10-01** 미인증 접근 → `ProtectedRoute` → `/login`

---

### C-11 — 42문항 작성 (Mission-Critical)

| 항목 | 내용 |
|---|---|
| Route | `/coaching/questions` |
| 프로토타입 | `hankkeut-prototype/coaching-questions.html` |
| 컴포넌트 | `src/pages/coaching/CoachingQuestions.tsx` |
| Phase | Current + P1 |
| 권한 | Member |
| 관련 Store | `coachingStore` (read/write) |
| API | `POST /functions/v1/save-answer` (debounce 1초) |
| Zod 스키마 | `CoachingAnswerSchema` |

**FR-C11-01** 레이아웃  
- 왼쪽: 문항 사이드바 (42문항 목록, 완료/미완료 상태)  
- 오른쪽: 현재 문항 본문 + 입력 영역

**FR-C11-02** 입력 모드  
- 텍스트 모드 (기본): `<textarea>` 5000자 이내  
- 음성 모드 [P1]: 녹음 시작/중지/재녹음 + 업로드

**FR-C11-03** 자동 저장  
- 타이핑 멈춤 1초 후 Supabase upsert (`coaching_answers`)  
- 사이드바: 저장 중... / 저장됨 상태 표시

**FR-C11-04** 음성 녹음 [P1]  
- 브라우저 마이크 권한 요청  
- `MediaRecorder` API (WebM 또는 iOS Safari mp4 자동 감지)  
- `POST /functions/v1/upload-voice` → Supabase Storage  
- 최대 10분 / 10MB  
- VoicePlayer 컴포넌트 (업로드 후 재생)

**FR-C11-05** 문항 이동  
- 이전/다음 버튼  
- 사이드바 문항 직접 클릭  
- 미답변 → 이동 가능하나 사이드바에 경고 표시

**FR-C11-06** 파트 구조 (42문항 분류)  
- Part 1 (Q1~10): 경력 정체성  
- Part 2 (Q11~21): 전문성 자산  
- Part 3 (Q22~32): 영향력·관계  
- Part 4 (Q33~42): 미래 지향

**NFR-C11-01** 자동 저장 실패 시 로컬 임시 저장 후 재시도  
**NFR-C11-02** 음성 파일 업로드 실패 → 텍스트 입력 유지 + 재시도 버튼

**EDGE-C11-01** 음성 업로드 실패 → 텍스트 모드 유지  
**EDGE-C11-02** 녹음 중 탭 전환 → 백그라운드 녹음 유지  
**EDGE-C11-03** iOS Safari → audio/mp4 자동 감지  
**EDGE-C11-04** 42문항 미완료 상태에서 `/coaching/review` 직접 접근 → 허용 (미완료 경고만 표시)

**인수 조건**  
- [ ] 42문항 전체 이동 (사이드바 + 버튼)  
- [ ] 자동 저장 후 Supabase DB 확인  
- [ ] 새로고침 후 현재 문항 유지  
- [ ] 음성 녹음 → 업로드 → 재생 동작 [P1]

---

### C-12 — 답변 리뷰·제출

| 항목 | 내용 |
|---|---|
| Route | `/coaching/review` |
| 프로토타입 | `hankkeut-prototype/coaching-review.html` |
| 컴포넌트 | `src/pages/coaching/CoachingReview.tsx` |
| Phase | Current |
| 권한 | Member |
| 관련 Store | `coachingStore` (read) |
| API | `POST /functions/v1/submit-coaching` |

**FR-C12-01** 42문항 전체 답변 일람  
- 파트별 그룹핑  
- 미답변 → 빨간 강조 + "작성하러 가기" 링크 → `/coaching/questions?q={id}`

**FR-C12-02** 최종 제출 버튼  
- 미답변 1개 이상 → 경고 다이얼로그: "N개 문항이 미작성입니다. 그래도 제출하시겠습니까?"  
- 전체 완료 → 확인 다이얼로그: "제출 후에는 수정할 수 없습니다."

**FR-C12-03** 제출 처리  
- `session.status = 'submitted'`  
- 성공 → `/coaching/analyzing`

**EDGE-C12-01** 제출 후 뒤로가기 → "이미 제출된 세션입니다" 안내

---

### C-13 — AI 분석 진행

| 항목 | 내용 |
|---|---|
| Route | `/coaching/analyzing` |
| 프로토타입 | `hankkeut-prototype/coaching-analyzing.html` |
| 컴포넌트 | `src/pages/coaching/CoachingAnalyzing.tsx` |
| Phase | Current |
| 권한 | Member |
| 관련 Store | `coachingStore` (read) |
| API | `GET /functions/v1/coaching-status` (30초 폴링) |

**FR-C13-01** 분석 진행 연출  
- 로딩 애니메이션 + "전문 코치가 답변을 분석하고 있습니다" 메시지  
- 단계 메시지 자동 전환 (패턴 분류 → 브랜드 프로필 생성 → 검토 중)

**FR-C13-02** 상태 폴링  
- 30초마다 `GET /functions/v1/coaching-status` 호출  
- `status = 'analyzed'` 수신 → `/coaching/report` 자동 이동 (replace)

**FR-C13-03** 이탈 경고  
- 페이지 이탈 시도 → "분석 중입니다. 이탈해도 계속 진행됩니다."

**EDGE-C13-01** 폴링 30분 초과 → "분석에 시간이 걸리고 있습니다. 완료되면 이메일로 알려드립니다." + 자동 폴링 중단

---

### C-14 — 코칭 리포트

| 항목 | 내용 |
|---|---|
| Route | `/coaching/report` |
| 프로토타입 | `hankkeut-prototype/coaching-report.html` |
| 컴포넌트 | `src/pages/coaching/CoachingReport.tsx` |
| Phase | Current + P1 |
| 권한 | Member |
| 관련 Store | `coachingStore` (read) |
| API | `GET /functions/v1/coaching-report` |

**FR-C14-01** 검수 게이트  
- `session.status !== 'finalized'` → R-01 (검수 대기 안내) 표시

**FR-C14-02** 브랜드 프로필 섹션 (확정 후)  
- 원라이너 · 핵심 가치 3가지 · 차별점 · 타깃 고객

**FR-C14-03** 문항별 인사이트 섹션  
- 패턴 분류 · 브랜딩 신호 · 주요 문장 발췌

**FR-C14-04** PDF 다운로드  
- 브라우저 `window.print()` API  
- 인쇄 CSS: CTA·네비 숨김

**FR-C14-05** 공유 링크 (Admin 확정 후 활성화)

**EDGE-C14-01** `status = 'submitted'` (미확정) → R-01 화면으로 대체 표시  
**EDGE-C14-02** PDF 인쇄 시 차트 이미지 누락 → `canvas` 대신 SVG 사용

---

### C-15 — 개인정보 처리방침

| 항목 | 내용 |
|---|---|
| Route | `/privacy` |
| 프로토타입 | `hankkeut-prototype/privacy.html` |
| 컴포넌트 | **❌ 미생성** → [ISSUE-03] |
| Phase | P1 |
| 권한 | Guest |
| 관련 Store | — |
| API | — |

**FR-C15-01** 개인정보처리방침 전문  
- 수집 항목 · 수집 목적 · 보관 기간 · 제3자 제공 · 이용자 권리 · 문의처

**FR-C15-02** 동의 전후 참조 모두 지원  
- 무료 진단 · 상담 신청 폼 내 링크에서 별도 탭 오픈

**인수 조건**  
- [ ] `src/pages/Privacy.tsx` 생성  
- [ ] `App.tsx`에 `/privacy` 라우트 추가  
- [ ] 모든 개인정보 동의 링크가 이 페이지로 연결

---

### A-01 — 관리자 콘솔

| 항목 | 내용 |
|---|---|
| Route | `/admin` |
| 프로토타입 | `hankkeut-prototype/admin.html` |
| 컴포넌트 | `src/pages/Admin.tsx` |
| Phase | Current + P1 |
| 권한 | Admin |
| 관련 Store | `leadsStore`, `authStore` |
| API | `GET /functions/v1/leads`, `GET /functions/v1/members`, `POST /functions/v1/create-member` |

**FR-A01-01** 2탭 레이아웃  
- Tab 1: 리드 CRM  
- Tab 2: 멤버 계정 발급·진행 추적

**FR-A01-02** 리드 CRM 탭  
- 테이블 컬럼: 이름 · 이메일 · 소스 · 상태 · 생성일 · 담당자  
- 필터: 상태별 (new/contacted/qualified/converted/lost) · 날짜 범위  
- 행 클릭 → A-02 (리드 상세) 패널 오픈  
- 상태 변경 (드롭다운 인라인)

**FR-A01-03** 멤버 계정 발급  
- 발급 폼: 이름 · 이메일 · 상품 · 기간  
- 발급 시 Supabase Auth 계정 생성 + 초기 비밀번호 이메일 발송

**FR-A01-04** 대시보드 요약 카드  
- 오늘 신규 리드 · 진행 중 멤버 · 완료 세션 카운트

**FR-A01-05** 최근 활동 피드  
- 리드 수신 · 제출 완료 · 결제 알림 (Supabase Realtime)

**NFR-A01-01** 리드 테이블 페이지네이션 (20건/page)  
**NFR-A01-02** 리드 CSV 다운로드

**EDGE-A01-01** Admin 권한 없는 Member → `ProtectedRoute` → `/unauthorized`

---

### A-02 — 리드 상세

| 항목 | 내용 |
|---|---|
| Route | `/admin` (패널/모달) |
| 프로토타입 | `hankkeut-prototype/admin-lead-detail.html` |
| 컴포넌트 | A-01 내 패널 (`LeadDetail` 컴포넌트) |
| Phase | Current |
| 권한 | Admin |
| 관련 Store | `leadsStore` (read/write) |
| API | `GET /functions/v1/leads/{id}`, `PATCH /functions/v1/leads/{id}` |

**FR-A02-01** 7문항 답변 전문 표시  
**FR-A02-02** 5영역 점수 표시  
**FR-A02-03** AI 추천 패키지 표시  
**FR-A02-04** 메모 추가/수정 (텍스트 에리어 인라인)  
**FR-A02-05** 상태 변경 드롭다운

---

### A-03 — 코칭 워크스페이스 (Mission-Critical)

| 항목 | 내용 |
|---|---|
| Route | `/coaching/workspace/:memberId` |
| 프로토타입 | `hankkeut-prototype/workspace.html` |
| 컴포넌트 | `src/pages/coaching/CoachingWorkspace.tsx` |
| Phase | Current + P1 |
| 권한 | Admin |
| 관련 Store | — (직접 API) |
| API | `GET /functions/v1/workspace/{memberId}`, `PATCH /functions/v1/coaching-sessions/{id}` |

**FR-A03-01** 42문항 전체 답변 조회  
- 텍스트 답변 + 음성 답변 재생 (VoicePlayer)

**FR-A03-02** 코치 분석 메모  
- 문항별 코치 메모 추가 (인라인 텍스트)

**FR-A03-03** AI 초안 (AIDraft)  
- AI가 생성한 원라이너 3종 · 핵심 가치 · 브랜드 프로필 초안 표시  
- 각 항목 인라인 수정 가능

**FR-A03-04** 최종 확정 (Finalize)  
- "최종 확정" 버튼 → 확인 다이얼로그  
- `session.status = 'finalized'` 업데이트  
- 멤버에게 "리포트 준비 완료" 이메일 자동 발송 (Resend)

**FR-A03-05** 세션 상태 뱃지  
- submitted (검토 중) / analyzed (AI 완료) / finalized (확정)

**EDGE-A03-01** 이미 finalized인 세션 → AIDraft 수정 불가 (읽기 전용)  
**EDGE-A03-02** 음성 재생 실패 → 텍스트 답변만 표시 + 재생 오류 안내

---

### A-04 — 알림 시스템

| 항목 | 내용 |
|---|---|
| Route | `/admin` (오버레이) |
| 프로토타입 | `hankkeut-prototype/admin-notifications.html` |
| 컴포넌트 | `notificationStore` + 헤더 벨 아이콘 |
| Phase | Current |
| 권한 | Admin |
| 관련 Store | `notificationStore` (read/write) |
| API | Supabase Realtime 구독 |

**FR-A04-01** 알림 뱃지: 헤더 벨 아이콘에 미읽음 수 표시  
**FR-A04-02** 알림 목록 드롭다운: 리드 수신 · 제출 완료 · 결제 알림  
**FR-A04-03** 알림 읽음 처리 (클릭 시 + 전체 읽음 처리)  
**FR-A04-04** Supabase Realtime 실시간 수신 (멀티탭 동기화)

---

### A-05 — 어드민 인증 게이트

| 항목 | 내용 |
|---|---|
| Route | `/admin` (진입 시 ProtectedRoute) |
| 프로토타입 | `hankkeut-prototype/admin-auth.html` |
| 컴포넌트 | `src/components/ProtectedRoute.tsx` (role='admin') |
| Phase | P1 |
| 권한 | Admin |
| 관련 Store | `authStore` (read) |
| API | Supabase `auth.getUser()` + role 조회 |

**FR-A05-01** Supabase RBAC 검사  
- `auth.users` 테이블의 `app_metadata.role === 'admin'` 확인  
- 미충족 → `/unauthorized` 페이지 표시

**FR-A05-02** 세션 만료 감지  
- Supabase `onAuthStateChange` 구독  
- 세션 만료 → `/login?redirect=/admin`

**EDGE-A05-01** Admin URL 직접 접근 (미로그인) → `/login`  
**EDGE-A05-02** Member 권한으로 `/admin` 접근 → `/unauthorized`

---

## 4. Phase 1.5 로드맵 명세

### R-01 — 검수 대기 안내

| 항목 | 내용 |
|---|---|
| Route | `/coaching/report` (status=submitted 시) |
| 프로토타입 | `hankkeut-prototype/report-pending.html` |
| Phase | P1.5 |
| 의존성 | C-12 제출 완료 + A-03 미확정 상태 |

**FR-R01-01** "리포트를 아직 준비하고 있습니다" 안내 화면  
**FR-R01-02** 예상 완료일 표시 (세션 제출 후 영업일 3일)  
**FR-R01-03** "완료 시 이메일로 알려드립니다" 안내 → 이메일 알림 [P1.5] 연계

---

## 5. Phase 2 로드맵 보존 명세

> Phase 2 화면들은 현재 구현 대상이 아닙니다. 기획 자산으로 보존합니다.

| ID | 화면명 | 핵심 기능 | 기술 포인트 | 의존 완료 조건 |
|---|---|---|---|---|
| R-02 | 마스터 브리프 (F1) | 42문항 기반 8섹션 브리프 자동 생성 | GPT-4o 프롬프트 체이닝 (42 OUTPUT → AC-Out-1~6) | Supabase DB + OpenAI 연동 |
| R-03 | 원라이너 3종 | 전문성형·공감형·결과형 3종 초안 생성 | 2차 세션 24시간 전 자동 트리거 | R-02 완료 |
| R-04 | 질문 아키텍처 (F9) | 42문항 분류·트리거 관리 어드민 UI | 동적 문항 추가/삭제/순서 변경 | Admin CRUD API |
| R-05 | 패턴 분류기 (F10) | 답변 → 10개 패턴 자동 분류 | NLP 키워드 + LLM 문맥 분석 | OpenAI 연동 |
| R-06 | 브랜딩 매퍼 (F11) | 답변 → 8대 브랜딩 요소 매핑 | 누락 영역 식별 + 보완 질문 트리거 | R-05 완료 |
| R-07 | 코칭 피드백 (F12) | 코칭 스크립트 자동 생성 | 답변 기반 맞춤 피드백 프롬프트 | R-06 완료 |
| R-08 | 리포트 룰 엔진 (F13) | 가설 표현 강제 등 생성 룰 | 일관성 ≥ 95% 검증 로직 | R-05~R-07 완료 |
| R-09 | 교차검증 (AC-Cross) | 답변 간 관계 패턴 분석 (9개 매트릭스) | 다변수 일관성 검증 | R-05 완료 |
| R-10 | 휴먼 핸드오프 (F14) | AI 한계 감지 시 코치 개입 트리거 | 신뢰도 점수 임계값 기반 자동 에스컬레이션 | R-08 + R-09 완료 |
| R-11 | AI 호출 로그 | API 호출 성공/실패·생성시간·비용 추적 | `ai_runs` 테이블 + 비용 집계 대시보드 | OpenAI 연동 |

---

## 6. Phase 3 로드맵 보존 명세

| ID | 화면명 | 핵심 기능 | 기술 포인트 |
|---|---|---|---|
| R-12 | 리테이너 관리 | 한끗 파트너 월 구독 결제·운영 | 토스페이먼츠 정기결제 API |
| R-13 | PPT Export | 브랜드 프로필 → PPT/PDF 자동 출력 | pptxgenjs 또는 외부 렌더링 서비스 |
| R-14 | 변화 리포트 | 재진단 전후 브랜드 변화 시각화 | 시계열 데이터 비교 차트 |

---

## 7. 미결 이슈 (Open Issues)

> 이슈 추가 방법: 이 섹션에 직접 기록 + §8 Change Log에 날짜와 함께 등록

| ID | 화면 | 유형 | 내용 | 우선순위 | 상태 |
|---|---|---|---|---|---|
| ISSUE-01 | C-03 | 결정 필요 | 무료 진단 제출 후 분석 결과를 즉시 보여줄지, 어드민 검수 후 이메일로 발송할지 결정 필요 | 🔴 High | 미결 |
| ISSUE-02 | C-05 | 설계 | 4유형 분류 알고리즘 정의 필요 (점수 가중치·임계값) | 🔴 High | 미결 |
| ISSUE-03 | C-15 | 구현 | `/privacy` 라우트 미등록 (App.tsx), `src/pages/Privacy.tsx` 미생성 | 🔴 High | 미결 |
| ISSUE-04 | C-11 | 설계 | 음성 녹음 기능 P1에 포함할지 P1.5로 연기할지 결정 필요 | 🟡 Medium | 미결 |
| ISSUE-05 | A-03 | 설계 | AI Draft 생성 시점 결정: 제출 즉시 자동 생성(GPT-4o) vs. 코치 수동 트리거 | 🟡 Medium | 미결 |
| ISSUE-06 | C-09 | 구현 | 초기 멤버 비밀번호 발급 흐름 설계: Admin 발급 이메일 → 초기 비밀번호 → 강제 변경 UX | 🟡 Medium | 미결 |
| ISSUE-07 | A-01 | 요구사항 | 리드 CSV 다운로드 기능 개인정보 처리 주의사항 확인 필요 (다운로드 기록 audit log) | 🟢 Low | 검토 중 |
| ISSUE-08 | C-13 | 설계 | 폴링 방식 vs. Supabase Realtime 구독 방식 선택 (폴링: 구현 단순, RT: UX 우월) | 🟢 Low | 미결 |

---

## 8. 요구사항 변경 이력 (Change Log)

> **SoT 원칙**: PRD 업데이트, 이해관계자 피드백, 이슈에서 발생하는 모든 요구사항 변경을 이 섹션에 먼저 기록합니다.  
> 포맷: `날짜 | 변경 ID | 화면 | 변경 유형 | 내용 | 요청 출처`

| 날짜 | ID | 화면 | 유형 | 변경 내용 | 출처 |
|---|---|---|---|---|---|
| 2026-06-15 | CHG-001 | C-02 | 수정 | 히어로 아이브로우 "SERVICE" → "1:1 맞춤 6주 과정" 변경 | PM 요청 |
| 2026-06-15 | CHG-002 | C-02 | 수정 | 한끗 론칭·한끗 파트너 가격 "별도 문의"로 변경 | PM 요청 |
| 2026-06-15 | CHG-003 | C-02 | 추가 | PDF 다운로드 버튼 → Google Drive 링크 연결 | PM 요청 |
| 2026-06-15 | CHG-004 | C-01 | 수정 | 네비게이션 클릭 시 로열블루 활성화 (기본 검정 → 클릭 시 로열블루) | PM 요청 |
| 2026-06-15 | CHG-005 | ALL | 추가 | Vercel 배포 환경에서 proto-bar 자동 숨김 (proto-hide.js) | 기술 결정 |
| 2026-06-15 | CHG-006 | — | 신규 | 기술기획서 docs/tech-spec/ 전체 6개 문서 작성 | PM 지시 |
| 2026-06-15 | CHG-007 | — | 신규 | React 코드 고도화: ProtectedRoute, ErrorBoundary, Zod, lazy loading, manualChunks | 기술 결정 |
| 2026-06-15 | CHG-008 | — | 신규 | PLAYBOARD 작성 — 모든 요구사항의 단일 출처(SoT)로 지정 | PM 지시 |

---

## 부록. 용어 정의

| 용어 | 정의 |
|---|---|
| SoT (Source of Truth) | 이 PLAYBOARD. 모든 화면 명세·상태의 최신 기준 |
| FE | Frontend (React/Vite) |
| BE | Backend (Supabase + Edge Functions) |
| Mission-Critical | 비즈니스 핵심 흐름을 담당하여 장애 시 서비스 불가 화면 (C-03, C-11, A-03) |
| Guest / Member / Admin | ProtectedRoute의 3개 권한 레벨 |
| finalized | Admin이 코칭 리포트를 최종 확정한 상태 — 멤버가 C-14를 볼 수 있는 조건 |
| AIDraft | GPT-4o가 생성한 원라이너·브랜드 프로필 초안 |
| FR-XXX | 기능 요구사항 (Functional Requirement) |
| NFR-XXX | 비기능 요구사항 (Non-Functional Requirement) |
| EDGE-XXX | 엣지 케이스 |
| CHG-XXX | Change Log 항목 |
| ISSUE-XXX | Open Issue 항목 |
