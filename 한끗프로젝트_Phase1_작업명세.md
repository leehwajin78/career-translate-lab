# 한끗프로젝트 — Phase 1 작업 명세 (Antigravity 실행용)

| 항목 | 내용 |
|---|---|
| 목적 | localStorage MVP를 **유료 실고객을 받을 수 있는 최소 안전 상태**로 전환 |
| 기준 코드베이스 | `career-translate-lab` (Vite + React 18 + TS + Zustand + Tailwind) |
| 추가 인프라 | Supabase (DB · Auth · Storage) |
| 작성일 | 2026-06-13 |
| 사용법 | 각 Task는 의존성 순서대로 실행. 각 Task 끝의 **▶ Antigravity 프롬프트**를 복사해 에이전트에 하나씩 전달 |

---

## 0. 범위 확정

### 0-1. Phase 1에 **포함**

1. **데이터 영속성** — localStorage → Supabase DB (B1)
2. **어드민 인증 + 멤버 비밀번호 보안** — Supabase Auth (B3·B4)
3. **개인정보 처리방침 · 동의 기록** (법적 고지)
4. **음성 입력 OFF** — 첫 코호트는 텍스트 전용 (feature flag)
5. **검수 게이트** — 코치 확정(finalized) 전 리포트 비노출 (Q1)
6. (Phase 1 후반) **이메일 전송** — 무료 진단 결과·상담 안내 (Q2)

### 0-2. Phase 1에서 **제외** (이후 단계)

- 음성 녹음 클라우드 저장 (B2) — 음성 기능 재활성화 시
- AI API 연동 (coachingAI → LLM) — Phase 2
- 결제, PPT Export, GA4/Sentry — Phase 3

### 0-3. 핵심 설계 결정

- **멤버 계정을 Supabase Auth로 발급** → 비밀번호 평문 저장 문제가 구조적으로 소멸(해싱은 Supabase가 처리). 어드민은 콘솔에서 Auth Admin API로 계정 생성.
- **검수 게이트를 RLS로 강제** → 멤버는 `status='finalized'`인 리포트만 조회 가능. 애플리케이션 로직 실수로도 미검수 리포트가 새지 않음.
- **음성은 코드를 지우지 않고 flag로 숨김** → B2 해결 후 즉시 재활성화.

---

## 1. 환경 변수 (`.env`)

```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_VOICE_ENABLED=false          # 첫 코호트 텍스트 전용
VITE_LEAD_NOTIFY_KEY=<web3forms>  # 기존 리드 알림 유지 시
```

> 서비스 롤 키(service_role)는 클라이언트에 **절대 노출 금지**. 멤버 계정 발급·이메일 발송 등 권한 작업은 Supabase Edge Function에서만 사용.

---

## 2. 데이터베이스 스키마

기존 store ↔ 테이블 매핑

| 기존 Zustand store | → 테이블 | 비고 |
|---|---|---|
| `leadsStore` | `leads` | 상담·유료신청 통합 |
| `freeDiagnosticStore`(결과) | `free_diagnostics` | 무료 7문항 결과 분리 |
| `authStore.members` | `members` + Supabase `auth.users` | 비번은 Auth가 보관 |
| `coachingStore.sessions` | `coaching_sessions` + `answers` | 음성 컬럼은 nullable, Phase 1 미사용 |
| `notificationStore` | (클라이언트 유지 또는 `notifications`) | Phase 1 단순화 — 유지 가능 |
| `diagnosticStore`(레거시) | — | 폐기 |

### 2-1. DDL (Supabase SQL Editor에 적용)

```sql
-- 상담·유료신청 리드
create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  field text,
  career text,
  challenge text,
  purposes text[],
  outcomes text[],
  channel text,
  source text,                 -- 'consultation' | 'apply/diagnosis' | 'apply/build' ...
  recommended_package text,
  memo text default '',
  status text not null default '대기중',  -- 대기중|상담중|완료|보류
  created_at timestamptz default now()
);

-- 무료 7문항 진단 결과 (비로그인 익명 제출)
create table free_diagnostics (
  id uuid primary key default gen_random_uuid(),
  name text, email text, career_years int,
  consent_at timestamptz,      -- 개인정보 동의 시각
  answers jsonb,               -- {1..7: text} + bonus q8
  score int,
  type text,                   -- explorer|preparer|transitioner|executor
  area_scores jsonb,           -- {identity,strengths,target,differentiation,message}
  created_at timestamptz default now()
);

-- 코칭 회원 (auth.users 와 1:1)
create table members (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  product_key text not null,   -- diagnosis|build|launch|partner
  created_at timestamptz default now()
);

-- 코칭 세션
create table coaching_sessions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  status text not null default 'in-progress', -- in-progress|submitted|analyzing|analyzed|finalized
  current_question int default 1,
  last_saved_at timestamptz default now(),
  submitted_at timestamptz,
  finalized_at timestamptz,
  ai_draft jsonb,              -- coachingAI 초안
  final_profile jsonb,         -- 코치 확정본 (고객 노출 대상)
  coach_notes jsonb,           -- {questionId: note}
  unique(member_id)
);

-- 문항 답변
create table answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references coaching_sessions(id) on delete cascade,
  question_id int not null,    -- 1..42
  text text,
  voice_url text,              -- Phase 1 미사용(null), B2 해결 후 사용
  voice_duration int,
  updated_at timestamptz default now(),
  unique(session_id, question_id)
);

-- 검수 로그 (Q1 게이트 감사용)
create table review_logs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references coaching_sessions(id),
  action text not null,        -- draft_saved|finalized
  actor text,                  -- admin email
  created_at timestamptz default now()
);
```

### 2-2. RLS 정책 (보안의 핵심 — 반드시 적용)

```sql
alter table leads enable row level security;
alter table free_diagnostics enable row level security;
alter table members enable row level security;
alter table coaching_sessions enable row level security;
alter table answers enable row level security;
alter table review_logs enable row level security;

-- 어드민 식별: auth.users.raw_app_meta_data->>'role' = 'admin'
create or replace function is_admin() returns boolean language sql stable as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

-- 무료 진단: 익명 insert 허용, 조회는 어드민만
create policy fd_insert on free_diagnostics for insert with check (true);
create policy fd_admin  on free_diagnostics for select using (is_admin());

-- 리드: 익명 insert(신청 폼) 허용, 그 외 어드민만
create policy lead_insert on leads for insert with check (true);
create policy lead_admin  on leads for all using (is_admin());

-- 멤버: 본인 또는 어드민
create policy m_self on members for select using (auth.uid() = id or is_admin());

-- 세션: 본인 또는 어드민 (수정은 본인 또는 어드민)
create policy s_rw on coaching_sessions for all
  using (auth.uid() = member_id or is_admin())
  with check (auth.uid() = member_id or is_admin());

-- 답변: 소속 세션 본인 또는 어드민
create policy a_rw on answers for all using (
  exists(select 1 from coaching_sessions cs
         where cs.id = answers.session_id
           and (cs.member_id = auth.uid() or is_admin()))
);

-- 리포트 노출 게이트: 멤버는 final_profile를 finalized 상태에서만 읽도록
-- (앱에서 final_profile 노출 전 status='finalized' 확인 + 아래 뷰 사용 권장)
create view my_finalized_report as
  select id, member_id, final_profile, finalized_at
  from coaching_sessions
  where status = 'finalized' and (member_id = auth.uid() or is_admin());

-- 검수 로그: 어드민만
create policy rl_admin on review_logs for all using (is_admin());
```

---

## 3. Task 분해 (의존성 순서)

> 각 Task는 **변경 대상 → 완료 기준(AC) → Antigravity 프롬프트** 구조. 한 Task가 통과해야 다음으로.

### T1. Supabase 프로젝트 + 스키마 + RLS

- **대상**: Supabase 콘솔 (코드 변경 없음)
- **AC**: 위 DDL·RLS 전체 적용 / 어드민 유저 1개를 `app_metadata.role='admin'`으로 생성 / `is_admin()` 함수가 어드민 JWT에서 true 반환
- **▶ Antigravity 프롬프트**
  > 별도 작업 없음. Supabase SQL Editor에 §2-1, §2-2 SQL을 순서대로 실행하고, Authentication에서 어드민 계정 1개를 만든 뒤 app_metadata에 `{"role":"admin"}`를 설정하세요.

### T2. Supabase 클라이언트 연동

- **대상**: `src/lib/supabase.ts`(신규), `.env`
- **AC**: `supabase` 클라이언트 export / 앱 빌드·기동 정상 / 기존 화면 회귀 없음
- **▶ Antigravity 프롬프트**
  > `@supabase/supabase-js`를 설치하고 `src/lib/supabase.ts`에 `VITE_SUPABASE_URL`·`VITE_SUPABASE_ANON_KEY`를 사용하는 단일 supabase 클라이언트를 생성해 export하세요. 아직 어떤 store도 교체하지 말고, 클라이언트 생성과 환경변수 로딩만 추가한 뒤 빌드가 정상인지 확인하세요.

### T3. 어드민 인증 — AdminGate 교체 (B3)

- **대상**: `AdminGate` 컴포넌트, `/admin` · `/coaching/workspace/*` 라우트
- **AC**: 비로그인 `/admin` 접근 시 로그인 화면으로 차단 / `is_admin()` 아닌 세션은 거부 / 로그인 후 콘솔 정상
- **▶ Antigravity 프롬프트**
  > 현재 children만 반환하는 AdminGate를 Supabase Auth 기반 인증 게이트로 교체하세요. 미로그인 또는 app_metadata.role이 admin이 아닌 사용자는 어드민 로그인 폼을 보여주고 /admin·/coaching/workspace 진입을 막습니다. Supabase 세션을 구독해 로그인 상태를 유지하세요.

### T4. 멤버 계정 발급을 Supabase Auth로 (B4)

- **대상**: 어드민 콘솔 Tab2(계정 발급), `authStore`, **Edge Function `create-member`**
- **AC**: 어드민이 이름·이메일·비번·패키지 입력 → Edge Function이 `auth.users` 생성 + `members` insert / 평문 비밀번호를 어디에도 저장하지 않음 / 카톡 안내문(로그인 URL·ID·패키지) 복사 동작
- **▶ Antigravity 프롬프트**
  > Supabase Edge Function `create-member`를 만드세요(service_role 사용, 서버에서만). 입력은 name·email·password·productKey이며, Auth 사용자 생성 후 members 테이블에 메타데이터를 insert합니다. 어드민 콘솔의 계정 발급 폼이 이 함수를 호출하도록 바꾸고, authStore에서 평문 password 필드를 제거하세요. 발급 성공 시 기존 카카오톡/SMS 안내문 복사 기능은 그대로 유지합니다.

### T5. leadsStore → Supabase

- **대상**: `leadsStore`, `/consultation`, `/apply/*`, 어드민 리드 탭
- **AC**: 상담·신청 제출이 `leads`에 insert(익명 허용) / 어드민 리드 목록·상세·상태·메모가 DB 기준 동작 / 기존 Web3Forms 알림은 유지 가능
- **▶ Antigravity 프롬프트**
  > leadsStore의 저장소를 localStorage에서 Supabase `leads` 테이블로 교체하세요. /consultation과 /apply/* 제출은 insert, 어드민 리드 탭은 select/update(상태·메모)로 연결합니다. Zustand는 UI 상태 캐시로만 쓰고 영속은 Supabase가 담당하게 하세요.

### T6. 무료 진단 결과 저장

- **대상**: `freeDiagnosticStore`, `analyzeFree()` 결과 저장, `/diagnosis`
- **AC**: 진단 완료 시 `free_diagnostics`에 insert(동의 시각 포함) / 결과 화면은 정상 / 비로그인 익명 insert 동작
- **▶ Antigravity 프롬프트**
  > 무료 7문항 진단 완료 시점에 analyzeFree 결과(answers·score·type·area_scores)와 개인정보 동의 시각을 free_diagnostics에 insert하세요. 진단 결과 화면 표시 로직은 그대로 두고, 저장만 Supabase로 추가합니다.

### T7. coachingStore → Supabase (텍스트 전용)

- **대상**: `coachingStore`, `/coaching/*`, 워크스페이스
- **AC**: 42문항 답변·진행률·상태가 `coaching_sessions`·`answers`에 저장 / 다른 기기·브라우저에서 로그인해도 이어쓰기 가능 / 자동 저장 동작 / 워크스페이스에서 답변·코치메모·AIDraft·FinalProfile 저장
- **▶ Antigravity 프롬프트**
  > coachingStore를 Supabase로 옮기세요. 답변은 answers 테이블(session_id, question_id 기준 upsert)에, 세션 상태·진행률·coach_notes·ai_draft·final_profile은 coaching_sessions에 저장합니다. 자동 저장은 디바운스 후 upsert로 구현하고, 로그인 시 서버에서 세션을 불러와 이어쓰기가 되게 하세요. 음성 관련 컬럼은 건드리지 마세요.

### T8. 음성 입력 OFF (feature flag)

- **대상**: `VoiceRecordMode`, 문항 작성 화면의 모드 토글
- **AC**: `VITE_VOICE_ENABLED=false`면 녹음 토글·UI가 숨겨지고 텍스트 전용 / 코드는 삭제하지 않음 / `true`로 바꾸면 즉시 복원
- **▶ Antigravity 프롬프트**
  > VITE_VOICE_ENABLED 환경변수를 도입하세요. false면 42문항 작성 화면에서 '말로 녹음' 토글과 VoiceRecordMode를 렌더링하지 않고 텍스트 입력만 보여줍니다. 음성 관련 코드는 삭제하지 말고 조건부 렌더링으로만 숨기세요.

### T9. 검수 게이트 (Q1)

- **대상**: 워크스페이스 확정 버튼, `/coaching/report`, RLS·뷰
- **AC**: 코치가 'finalized' 확정 전에는 멤버 리포트 화면에 final_profile이 노출되지 않음(대기 안내 표시) / 확정 시 `review_logs`에 기록 / `my_finalized_report` 뷰 기준 노출
- **▶ Antigravity 프롬프트**
  > /coaching/report는 coaching_sessions.status가 'finalized'일 때만 final_profile을 보여주고, 그 전에는 '코치 검토 중' 대기 화면을 표시하세요. 워크스페이스의 확정 버튼은 status를 finalized로 바꾸고 finalized_at·review_logs를 기록합니다. 노출은 my_finalized_report 뷰를 사용하세요.

### T10. 개인정보 처리방침 + 동의 기록

- **대상**: `/privacy`(신규), 무료 진단·상담·신청 폼의 동의 체크
- **AC**: 처리방침 페이지 존재(수집 항목·목적·보관기간·파기·문의처) / 모든 개인정보 수집 지점에 동의 체크박스 + 동의 시각 저장 / 미동의 시 제출 차단
- **▶ Antigravity 프롬프트**
  > /privacy 처리방침 페이지를 만들고(수집 항목·이용 목적·보관 기간·파기·제3자 제공·문의처 섹션 포함), 무료 진단·상담·신청 폼에 '개인정보 수집·이용 동의' 체크박스를 추가하세요. 동의해야만 제출 가능하며, 동의 시각을 함께 저장합니다. 문구의 법적 검토는 별도 진행 예정이므로 자리표시 문구로 작성하세요.

### T11. 이메일 전송 (Phase 1 후반, Q2)

- **대상**: Edge Function `send-email`, 무료 진단 완료·상담 접수 트리거
- **AC**: 무료 진단 결과 요약/상담 접수 확인 메일 발송 / 발송 실패해도 제출 자체는 성공
- **▶ Antigravity 프롬프트**
  > Resend(또는 Supabase SMTP)를 쓰는 Edge Function send-email을 만들고, 무료 진단 완료와 상담 접수 시 호출하세요. 메일 발송은 비동기로 처리하고 실패가 사용자 제출을 막지 않게 하세요. API 키는 service_role 환경에서만 사용합니다.

---

## 4. 데이터 마이그레이션

- 현재 실데이터는 소수(초기 클라이언트). **자동 스크립트 불필요** — 어드민 콘솔에서 기존 localStorage 데이터를 보고 신규 DB에 수동 재입력하거나, 일회성 JSON export→import로 처리.
- 배포 전 기존 localStorage 키(`kkummolda-*`)는 신규 코드에서 더 이상 신뢰원으로 쓰지 않음. 혼선을 막기 위해 첫 로그인 시 1회 정리(또는 무시) 로직 권장.

---

## 5. 배포 전 체크리스트 (Definition of Done)

- [ ] RLS가 **모든** 테이블에 enable, 비로그인으로 leads/answers **조회 불가** 확인
- [ ] `/admin`·`/coaching/workspace` 비로그인 접근 차단 확인
- [ ] service_role 키가 클라이언트 번들에 포함되지 않음 (빌드 산출물 grep)
- [ ] 멤버 비밀번호가 어떤 테이블·로그에도 평문으로 없음
- [ ] 폰↔PC 교차 로그인 시 42문항 이어쓰기 정상
- [ ] `VITE_VOICE_ENABLED=false`에서 녹음 UI 비노출
- [ ] finalized 전 리포트 비노출, 확정 후 노출
- [ ] 모든 개인정보 수집 지점에 동의 체크 + 시각 저장
- [ ] 처리방침 페이지 접근 가능, 동의 미체크 시 제출 차단
- [ ] Supabase 자동 백업(Point-in-Time 또는 일일) 활성화

---

## 6. 권장 실행 순서 요약

```
T1 (스키마·RLS·어드민) → T2 (클라이언트) → T3 (어드민 인증)
  → T4 (멤버 Auth 발급) → T5 (리드) → T6 (무료진단) → T7 (코칭 텍스트)
  → T8 (음성 OFF) → T9 (검수 게이트) → T10 (처리방침·동의)
  → [개시 가능] → T11 (이메일, 운영 중 보강)
```

T1~T10 완료 = **첫 유료 코호트(텍스트 전용)를 합법적·안전하게 받을 수 있는 상태**. 이후 안정화되면 B2(음성 클라우드 저장)와 Phase 2(AI API)로 진행.
