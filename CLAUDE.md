# CLAUDE.md — 한끗프로젝트 AI 협업 규칙

> 이 파일은 Claude Code 및 모든 AI 에이전트가 이 저장소에서 작업할 때  
> **반드시** 따라야 하는 규칙 모음입니다.  
> 규칙 변경은 PM(이화진)의 명시적 지시 후 이 파일과 PLAYBOARD CHG 항목에 동시 기록합니다.

---

## §1. Source of Truth (SoT) 규칙

### 1-1. 단일 출처 원칙

| 관심사 | 공식 SoT | 비고 |
|---|---|---|
| 화면 명세·구현 현황 | `src/data/playboard.ts` | TypeScript 데이터 파일 |
| 화면 명세 산문 뷰 | `docs/PLAYBOARD.md` | playboard.ts에서 파생 |
| 시스템 아키텍처 | `docs/tech-spec/01-architecture.md` | |
| DB 스키마 | `docs/tech-spec/02-data-model.md` | |
| API 명세 | `docs/tech-spec/03-api-spec.md` | |
| 보안·권한 | `docs/tech-spec/04-security.md` | |
| 운영·CI/CD | `docs/tech-spec/05-operations.md` | |
| Mission-Critical 제어 | `docs/tech-spec/07-mission-critical.md` | |
| PRD | `docs/PRD_v1.md` | 비전·근거 문서 (운영 SoT 아님) |

### 1-2. 변경 시 동시 갱신 의무

다음 중 하나라도 발생하면 **같은 커밋** 또는 **즉시 다음 커밋**에서 playboard.ts 를 갱신합니다:

- [ ] 화면 FE/BE 구현 상태 변경 → `Screen.fe` / `Screen.be` 업데이트
- [ ] 신규 기능 요구사항 추가 → `Screen.frs` 배열에 FR 추가
- [ ] 신규 이슈 발생 → `ISSUES` 배열에 Issue 추가 + `Screen.openIssues` 연결
- [ ] 이슈 해결 → `Issue.status = 'resolved'`, `Issue.resolvedBy = 'CHG-xxx'`
- [ ] 요구사항 변경 → `CHANGES` 배열에 Change 추가
- [ ] 커버리지 갭 해소 → `Screen.coverage[domain]` 상태 갱신

### 1-3. PRD·이슈 문서 처리 방침

- PRD(`docs/PRD_v1.md`)는 **비전과 근거** 문서로 유지. 운영 명세는 playboard.ts가 최신.
- 신규 이슈는 PRD나 별도 파일이 아닌 **playboard.ts ISSUES 배열**에 추가.
- 기존 `docs/tech-spec/06-frd.md`는 아카이브 (신규 내용 추가 금지).

---

## §2. 코드 작업 규칙

### 2-1. 기본 원칙

- **1 작업 = 1 PR**: 화면 하나의 FE/BE 구현 또는 단일 이슈 해결.
- **구현 전 SoT 확인**: 작업 시작 시 `src/data/playboard.ts`에서 해당 화면의 FR·EDGE·인수조건 확인.
- **인수 조건 = 완료 기준**: `Screen.acceptanceCriteria` 목록이 모두 통과해야 `fe: 'done'` 으로 갱신.
- **건드리지 말 것**: 명시적으로 요청하지 않은 화면의 코드·스타일·리팩터링 금지.

### 2-2. 새 파일 생성 규칙

```
src/pages/{PageName}.tsx          ← 페이지 컴포넌트
src/pages/{flow}/{PageName}.tsx   ← 플로우별 서브페이지
src/components/site/{Name}.tsx    ← 공유 UI 컴포넌트
src/lib/{feature}.ts              ← 비즈니스 로직
supabase/functions/{name}/index.ts ← Edge Function
supabase/migrations/{timestamp}_{name}.sql ← DB 마이그레이션
```

### 2-3. 새 라우트 등록 절차

1. `src/pages/{Page}.tsx` 생성
2. `src/App.tsx` Public/Member/Admin 블록에 Route 추가
3. `src/data/playboard.ts` 해당 Screen의 `fe: 'partial'`, `route` 필드 갱신
4. `CHANGES` 배열에 CHG 항목 추가

### 2-4. 금지 사항

- `--no-verify` (git hook bypass) 금지
- `src/data/playboard.ts` 없이 화면 구현 시작 금지 (FR 미확인 상태)
- 기존 `docs/tech-spec/06-frd.md` 수정 금지 (아카이브)
- `console.log` 프로덕션 코드 잔류 금지 (DEBUG 로그는 `if (import.meta.env.DEV)` 감싸기)

---

## §3. 브랜치·커밋 규칙

### 3-1. 브랜치 네이밍

```
feat/{screen-id}-{기능}      예: feat/C03-diagnosis-api
fix/{screen-id}-{버그}       예: fix/C11-save-retry
docs/{대상}                  예: docs/playboard-mission-critical
arch/{아키텍처}              예: arch/supabase-auth-setup
```

### 3-2. 커밋 메시지

```
<type>(<scope>): <요약>

<상세 설명 (선택)>

PlayBoard: <갱신된 항목> [CHG-xxx]
```

예시:
```
feat(C-03): 무료 진단 폼 submit-free-diagnosis Edge Function 연동

- Diagnosis.tsx handleSubmit에 fetch 연결
- FreeDiagnosisSchema 서버 검증 적용
- 429 rate limit 처리 UI 추가
- navigator.onLine 오프라인 감지 + 재시도

PlayBoard: C-03 be = partial [CHG-011]
```

### 3-3. 현재 작업 브랜치

- `feat/tech-spec-upgrade` — 기술기획서 + PlayBoard SoT 구축

---

## §4. 기술 스택 & 결정 사항

| 항목 | 결정 | 변경 시 |
|---|---|---|
| Frontend | React 18 + Vite + TypeScript + Shadcn UI + Tailwind | arch 브랜치 + ADR 추가 |
| 상태 관리 | Zustand (localStorage → Supabase 단계적 전환) | playboard.ts 스토어 업데이트 |
| 라우팅 | React Router v6 (lazy + ProtectedRoute) | 새 화면은 §2-3 절차 |
| Backend | Supabase (Auth + DB + Edge Functions + Storage) | 02-data-model.md 먼저 |
| AI | OpenAI GPT-4o (Phase 2~) | 현재 mock/stub |
| 이메일 | Resend | email_queue 재시도 패턴 적용 |
| 결제 | 토스페이먼츠 (Phase 3~) | |
| 번들 예산 | gzip 80KB 이하 | manualChunks 유지 |

---

## §5. 환경 변수

```bash
# .env.local (git 미추적)
VITE_SUPABASE_URL=https://{project}.supabase.co
VITE_SUPABASE_ANON_KEY={anon_key}

# Vercel 대시보드 등록 필요
SUPABASE_SERVICE_ROLE_KEY={service_role}  # Edge Function 전용
OPENAI_API_KEY={key}                       # Phase 2~
RESEND_API_KEY={key}
TOSS_PAYMENTS_SECRET_KEY={key}             # Phase 3~
```

---

## §6. 테스트 기준

| 레이어 | 도구 | 커버리지 목표 |
|---|---|---|
| lib/ 비즈니스 로직 | Vitest | > 80% |
| store/ 상태 | Vitest | > 70% |
| components/ UI | Testing Library | > 50% |
| E2E 핵심 플로우 | Playwright | C-03, C-11, A-03 필수 |

Mission-Critical 화면(C-03, C-11, A-03)의 E2E 테스트 없이 `fe: 'done'` 갱신 금지.
