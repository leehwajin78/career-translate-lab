# 07 — Mission-Critical 제어 명세 (Phase C)

> **목적**: 인증·접근 제어·데이터 무결성·장애 복구·관측성·성능 6개 도메인에 대한  
> 엔지니어링 제어 스펙. PlayBoard 커버리지 매트릭스의 `gap` 셀을 채우는 기획 자산.  
>
> **SoT 연결**: `src/data/playboard.ts` → `Screen.coverage` 필드  
> **참조**: [04-security.md](./04-security.md) · [05-operations.md](./05-operations.md)  
> **수렴 방침**: 기존 security/ops 문서 내용 중 화면에 귀속되는 제어 사항은 이 문서로 이동. 원본 문서는 이론적 근거(rationale) 역할로 유지.

---

## 도메인 1 — 인증·세션 (Auth & Session)

### 제어 목표
> "로그인된 사용자는 정확히 그 사용자이며, 세션은 예측 가능하게 만료된다"

### 기술 결정 (ADR)
| 항목 | 결정 | 근거 |
|---|---|---|
| Auth 제공자 | Supabase Auth (JWT) | PostgreSQL RLS 통합, 별도 서버 불필요 |
| 토큰 수명 | Access: 1시간 / Refresh: 30일 | 보안(짧은 AT)·UX(긴 RT) 균형 |
| 저장 위치 | Supabase 기본 (httpOnly cookie 옵션 검토) | XSS 노출 최소화 |
| 세션 복구 | `onAuthStateChange` 전역 리스너 | 탭 전환·새로고침 자동 복구 |

### 화면별 제어 사항

**C-09 멤버 로그인** `coverage.auth = gap`
- `supabase.auth.signInWithPassword({ email, password })`
- 실패 응답: `AuthApiError.status === 400` → "이메일 또는 비밀번호가 올바르지 않습니다"
- rate limiting: 5회 연속 실패 → Supabase 기본 잠금 (60초) → UI 메시지 표시
- 세션 복구: `supabase.auth.getSession()` 앱 초기화 시 호출 → `authStore.setMember()`
- **구현 게이트**: 로그인 성공 시 `authStore.currentMember.id === supabase.auth.user().id`

**A-05 어드민 인증 게이트** `coverage.auth = gap`
- `supabase.auth.getUser()` 호출 → `user.app_metadata.role === 'admin'` 검사
- 미충족 → `/unauthorized` (별도 페이지 필요, 현재 미생성)
- `onAuthStateChange` 구독: `SIGNED_OUT` 이벤트 → `authStore.clear()` → `/login`
- Admin 계정 발급: `supabase.auth.admin.createUser()` (Service Role Key 필요, 서버 사이드)
- **구현 게이트**: `VITE_SUPABASE_ANON_KEY`로 admin 생성 불가 → Edge Function 필요

### 세션 만료 UX 흐름
```
[AT 만료]
    ├─ Supabase SDK 자동 갱신 시도 (RT 유효 시)
    │       → 성공: 투명 갱신
    │       → 실패: onAuthStateChange SIGNED_OUT 이벤트
    └─ SIGNED_OUT 이벤트 수신
            → authStore.clear()
            → navigate('/login?redirect=' + currentPath)
            → 로그인 후 이전 경로 복원
```

### 미결 이슈
- `ISSUE-06`: 초기 멤버 비밀번호 발급 흐름 미설계

---

## 도메인 2 — 접근 제어 (Access Control)

### 제어 목표
> "Guest는 Guest 영역만, Member는 자신의 데이터만, Admin은 전체를 접근한다"

### RBAC 매트릭스 (완전판)

| 리소스 | Guest | Member (자신) | Admin |
|---|---|---|---|
| `leads` 조회 | ❌ | ❌ | ✅ |
| `leads` insert (진단·상담 신청) | ✅ (익명) | ✅ | ✅ |
| `members` 조회 | ❌ | 자신만 | ✅ |
| `coaching_sessions` 조회 | ❌ | 자신만 | ✅ |
| `coaching_answers` read/write | ❌ | 자신만 | ✅ (read) |
| `coaching_answers` finalize | ❌ | ❌ | ✅ |
| `ai_drafts` | ❌ | read (finalized 후) | ✅ |
| `audit_logs` | ❌ | ❌ | ✅ |

### Supabase RLS 정책 (핵심)

```sql
-- coaching_answers: 멤버는 자신의 세션 답변만 접근
CREATE POLICY "member_own_answers" ON coaching_answers
  FOR ALL USING (
    session_id IN (
      SELECT id FROM coaching_sessions
      WHERE member_id = auth.uid()
    )
  );

-- coaching_sessions: Admin 전체 접근
CREATE POLICY "admin_all_sessions" ON coaching_sessions
  FOR ALL USING (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );
```

### 클라이언트 ProtectedRoute 동작
```
Route 접근 시도
    → ProtectedRoute(role)
        → authStore.currentMember 없음 → /login (replace)
        → ROLE_LEVEL[userRole] < ROLE_LEVEL[role] → /unauthorized (replace)
        → 통과 → children 렌더
```

### 미구현 화면: `/unauthorized` 페이지
- 현재 미생성 (ProtectedRoute 가 redirect하지만 착지 페이지 없음)
- 콘텐츠: "접근 권한이 없습니다" + 홈 이동 버튼

---

## 도메인 3 — 데이터 무결성·백업 (Data Integrity & Backup)

### 제어 목표
> "사용자 입력은 손실되지 않으며, 제출된 데이터는 원자적으로 처리된다"

### 트랜잭션 경계 정의

| 작업 | 트랜잭션 단위 | 실패 시 동작 |
|---|---|---|
| 무료 진단 제출 | leads insert + consentAt 기록 (1개 트랜잭션) | 롤백 → 클라이언트 Toast 재시도 |
| 코칭 답변 자동 저장 | coaching_answers upsert (단건) | 로컬 저장 → 재시도 큐 |
| 코칭 최종 제출 | session status = 'submitted' (단건) | 클라이언트 재시도 |
| Finalize (A-03) | session status + ai_draft 확정 + 이메일 트리거 (1개 DB 트랜잭션 + 비동기 이메일) | DB 트랜잭션 성공 보장, 이메일 실패 시 재시도 큐 |

### C-11 자동 저장 내구성 설계

```
[사용자 타이핑]
    → debounce 1초
    → supabase.from('coaching_answers').upsert()
        성공 → 사이드바 "저장됨"
        실패 (네트워크) →
            1. localStorage['draft_q{id}'] 에 임시 저장
            2. 사이드바 "저장 실패 — 재시도 중..."
            3. navigator.onLine 복구 감지 → 자동 재시도
            4. 3회 실패 → "저장 실패. 수동 저장 버튼으로 재시도" Toast
```

### A-03 Finalize 원자성

```sql
-- Edge Function 내 트랜잭션
BEGIN;
  UPDATE coaching_sessions
    SET status = 'finalized', finalized_at = now()
    WHERE id = $session_id AND status = 'analyzed';

  UPDATE ai_drafts
    SET is_locked = true
    WHERE session_id = $session_id;
COMMIT;
-- 트랜잭션 성공 후 → Resend 이메일 비동기 발송
```

### Supabase 백업 정책
| 항목 | 설정 |
|---|---|
| Point-in-Time Recovery | Pro 플랜 이상 활성화 (7일) |
| 일일 스냅샷 | Supabase 자동 |
| leads / coaching_answers | 삭제 금지 (soft delete: `deleted_at` 컬럼) |
| 개인정보 파기 | 탈퇴 요청 시 PII 컬럼 null 처리 (법적 보관 기간 후) |

---

## 도메인 4 — 장애·복구 (Failure & Recovery)

### 제어 목표
> "부분 장애가 전체 서비스 중단으로 확산되지 않는다"

### 장애 유형 × 화면 × 복구 전략

| 장애 유형 | 영향 화면 | 복구 전략 |
|---|---|---|
| Edge Function 타임아웃 (>10s) | C-03, C-04 | 클라이언트 AbortController → "분석 지연" Toast + 재시도 버튼 |
| Supabase DB 연결 실패 | C-11 자동 저장 | localStorage 임시 저장 → 복구 후 자동 flush |
| OpenAI API 실패 | C-13 (분석 대기 중) | 최대 3회 재시도 (지수 백오프 1s→2s→4s) → 실패 시 `ai_runs.status = 'failed'` 기록 + 코치 수동 처리로 폴백 |
| Resend 이메일 실패 | A-03 Finalize | DB 트랜잭션과 분리 (이메일 실패해도 finalize 유지) → `email_queue` 테이블 재시도 |
| Vercel 함수 Cold Start | C-03 첫 제출 | 로딩 스피너 + 10초 타임아웃으로 사용자 인지 |

### Mission-Critical 화면 장애 시나리오

**C-03 제출 실패 시**
```
[제출 버튼 클릭]
    → fetch('/functions/v1/submit-free-diagnosis')
        → AbortController 10초 타임아웃
        → 성공 → C-04로 이동
        → 실패 (timeout / 5xx) →
            Toast: "일시적 오류. 다시 시도해주세요."
            재시도 버튼 표시 (answers는 localStorage에 안전)
        → 실패 (429) →
            Toast: "이미 진단하셨습니다. {email} 확인해주세요."
            (재시도 버튼 없음)
```

**C-11 자동 저장 3회 연속 실패 시**
```
사이드바: "연결 문제 — 로컬에 임시 저장 중"
헤더 경고 배너: "답변이 클라우드에 저장되지 않고 있습니다. 인터넷 연결을 확인해주세요."
navigator.onLine = true 복구 → 자동 flush (최신 draft → DB upsert)
```

**A-03 Finalize 실패 시**
```
[최종 확정 클릭]
    → DB 트랜잭션 실패 →
        Toast: "확정 처리 중 오류. 다시 시도하거나 070-4090-2161로 연락하세요."
        session.status 변경 없음 (원자적 롤백)
    → DB 성공 + 이메일 실패 →
        email_queue 테이블 insert (재시도 스케줄러 대상)
        Admin Toast: "확정 완료. 이메일 발송이 지연될 수 있습니다."
```

### 재시도 큐 스키마
```sql
CREATE TABLE email_queue (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email    text NOT NULL,
  subject     text NOT NULL,
  template    text NOT NULL,
  payload     jsonb NOT NULL,
  attempts    int DEFAULT 0,
  max_attempts int DEFAULT 5,
  next_retry  timestamptz DEFAULT now(),
  status      text DEFAULT 'pending', -- pending | sent | failed
  created_at  timestamptz DEFAULT now()
);
```

---

## 도메인 5 — 관측성 (Observability)

### 제어 목표
> "장애와 이상 패턴을 로그·메트릭·알림으로 즉시 인지할 수 있다"

### 로그 수준 정의

| 수준 | 적용 조건 | 예시 |
|---|---|---|
| ERROR | 사용자 영향 장애 | Edge Function 5xx, DB 연결 실패, finalize 실패 |
| WARN | 부분 기능 저하 | 자동 저장 재시도 발생, 이메일 큐 적재 |
| INFO | 정상 비즈니스 이벤트 | 진단 제출 성공, 코칭 제출, finalize 완료 |
| DEBUG | 개발 환경 전용 | 폼 유효성 실패, API 요청 파라미터 |

### 화면별 관측성 갭 해소 계획

**C-03 무료 진단** `coverage.observability = partial`
- 필요 로그:
  ```
  INFO  diag.submit.success  { leadId, careerYears, answeredCount }
  ERROR diag.submit.failed   { email (masked), errorCode, attempt }
  WARN  diag.ratelimit       { email (masked) }
  ```
- 메트릭: 일별 제출 수, 타입별 분포, 완료율(STEP 0→STEP 8)

**C-11 42문항 자동 저장** `coverage.observability = gap`
- 필요 로그:
  ```
  WARN  coaching.save.retry  { sessionId, questionId, attempt }
  ERROR coaching.save.failed { sessionId, questionId, errorCode }
  INFO  coaching.save.flush  { sessionId, draftCount } -- 로컬 draft flush 시
  ```
- 메트릭: 자동 저장 실패율 (목표 < 0.1%)

**A-03 Finalize** `coverage.observability = gap`
- 필요 로그 (Audit Log 테이블):
  ```sql
  INSERT INTO audit_logs (actor_id, action, target_id, payload)
  VALUES (admin_user_id, 'coaching.finalize', session_id, { memberId, finalizedAt })
  ```
- Audit Log는 절대 삭제 불가 (RLS: DELETE 정책 없음)

### 프론트엔드 에러 추적
- `ErrorBoundary.componentDidCatch` → `console.error('[ErrorBoundary]', error, info)`
- Phase 2에서 Sentry 또는 Supabase Edge Function 기반 에러 리포터 연동 예정
- 현재: Vercel 함수 로그 + Supabase Dashboard Logs로 운용

---

## 도메인 6 — 성능·캐시 (Performance & Cache)

### 제어 목표
> "핵심 플로우의 응답이 SLA 내에서 동작하며, 번들이 초기 로드를 막지 않는다"

### 성능 SLA

| 화면 / 작업 | 목표 | 측정 방법 |
|---|---|---|
| C-01 LCP (랜딩) | < 2.5s | Lighthouse 모바일 |
| C-03 제출 → C-04 전환 | < 10s (Edge Function) | AbortController 타임아웃 |
| C-11 자동 저장 응답 | < 2s | Supabase DB 쿼리 |
| C-13 폴링 응답 | < 1s | Supabase DB 쿼리 |
| A-03 42문항 전체 로드 | < 3s | Network DevTools |
| 초기 번들 (gzip) | < 70KB | `npm run build` 출력 |

### 번들 예산 (현재 상태)
| 청크 | 현재 | 목표 |
|---|---|---|
| vendor-react | ~42KB | < 50KB |
| vendor-radix | ~38KB | < 45KB |
| vendor-charts | ~45KB | < 50KB |
| 앱 코드 | ~96KB | < 120KB |
| **합계 (gzip)** | **~66KB** | **< 80KB** |

### 캐시 전략

| 레이어 | 전략 | 설정 |
|---|---|---|
| React Query | `staleTime: 5분` (기본) | 화면 재진입 시 캐시 재사용 |
| 코칭 답변 목록 | `staleTime: 0` (실시간) | A-03 워크스페이스는 항상 fresh |
| 정적 자산 (Vercel) | CDN 캐시 (immutable) | `cache-control: public, max-age=31536000, immutable` |
| 프로토타입 HTML | CDN 캐시 | `public/hankkeut-prototype/` → 변경 시 재배포 |

### C-11 자동 저장 성능 설계
- debounce 1초 → 타이핑 중 API 호출 없음
- upsert 1건 당 예상 latency: < 200ms (Supabase 한국 리전 기준)
- 42문항 동시 flush: 순차 처리 (concurrency 1) — DB 부하 방지

---

## 수렴: 기존 문서 → 이 문서 매핑

| 기존 위치 | 이 문서 수렴 여부 | 처리 |
|---|---|---|
| `04-security.md §인증 흐름` | ✅ 도메인 1로 수렴 | 원본 유지 (이론 근거) |
| `04-security.md §RBAC` | ✅ 도메인 2로 수렴 | 원본 유지 |
| `04-security.md §민감정보` | 미수렴 (별도 PII 정책) | 04-security.md 원본 참조 |
| `05-operations.md §에러 처리` | ✅ 도메인 4로 수렴 | 원본 유지 |
| `05-operations.md §모니터링 KPI` | ✅ 도메인 5로 수렴 | 원본 유지 |
| `05-operations.md §CI/CD` | 미수렴 (인프라 레벨) | 05-operations.md 원본 참조 |

---

## PlayBoard 커버리지 갭 해소 로드맵

| 갭 화면 | 도메인 | 해소 작업 | 우선순위 |
|---|---|---|---|
| C-09 | auth | Supabase Auth signIn 연동 | 🔴 P1 블로커 |
| A-05 | auth, accessControl | RBAC role 검사 활성화 | 🔴 P1 블로커 |
| A-03 | dataIntegrity | Finalize 트랜잭션 경계 구현 | 🔴 P1 |
| A-03 | observability | Audit Log 스키마 + 기록 구현 | 🟡 P1 |
| C-11 | observability | 저장 실패율 로그 구현 | 🟡 P1 |
| C-03 | observability | 제출 이벤트 로그 구현 | 🟡 P1 |
| C-01 | performance | Lighthouse 80점 달성 | 🟢 P1 완료 조건 |
