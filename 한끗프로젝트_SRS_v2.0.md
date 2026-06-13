# 한끗프로젝트 — 소프트웨어 요구사항 명세서 (SRS)

| 항목 | 내용 |
| :--- | :--- |
| **문서 버전** | v2.0 (PRD v3.0 정합 · Phase 1 baseline) |
| **최종 작성일** | 2026-06-13 |
| **상위 문서** | 한끗프로젝트 PRD v3.0 |
| **부속 문서** | 한끗프로젝트 Phase 1 작업 명세 (T1~T11) |
| **기준 코드베이스** | `career-translate-lab` (Vite + React 18 + TS + Zustand + Supabase) |

---

## 1. 개요

### 1-1. 목적

PRD v3.0이 정의한 첫 유료 출시(Phase 1) 범위를, **검증 가능한 요구사항과 인수조건(AC)** 으로 명세한다. 본 문서는 구현·검수·출시 판정의 기준이 된다.

### 1-2. 표기 규칙

- **ID 체계:** `FR-{영역}-{n}`(기능), `NFR-{범주}-{n}`(비기능), `DR-{n}`(데이터)
- **우선순위 (MoSCoW):** **M**=Must(출시 필수) · **S**=Should(출시 직후) · **C**=Could(이후)
- **상태:** [현행] 구현됨 · [P1] 출시 전 구현 · [P1.5] 출시 직후 · [P2]/[P3] 로드맵
- **AC:** 각 요구사항의 통과 조건. 검증 가능한 단언문으로 기술

### 1-3. 출시 범위 / 비범위

| 구분 | 내용 |
| :--- | :--- |
| **Phase 1 범위** | Supabase 영속화, 인증, 비번 해싱(Auth 위임), 검수 게이트, 개인정보 동의·처리방침, 음성 OFF, 기존 공개·코칭·어드민 화면 유지 |
| **비범위 (이후)** | 음성 클라우드 저장[P1.5], 이메일 전송[P1.5], LLM AI 연동[P2], 결제·PPT Export·GA4/Sentry[P3] |

---

## 2. 기능 요구사항 (FR)

### 2-1. 인증 · 계정 (FR-AUTH)

| ID | 요구사항 | 우선 | 상태 |
| :--- | :--- | :---: | :---: |
| FR-AUTH-01 | 어드민은 Supabase Auth 계정으로 로그인하며, `app_metadata.role='admin'`인 세션만 어드민 권한을 가진다 | M | [P1] |
| FR-AUTH-02 | 비로그인 또는 비어드민 세션은 `/admin`·`/coaching/workspace/*` 접근이 차단된다 | M | [P1] |
| FR-AUTH-03 | 멤버는 어드민이 발급한 Auth 계정으로 로그인하고, 로그인 세션은 새로고침·재방문에도 유지된다 | M | [P1] |
| FR-AUTH-04 | 멤버 계정 발급은 Edge Function `create-member`(service_role)가 수행하며, Auth 사용자 생성 + `members` insert를 원자적으로 처리한다 | M | [P1] |
| FR-AUTH-05 | 멤버 비밀번호는 평문으로 어떤 테이블·로그·클라이언트 상태에도 저장되지 않는다 | M | [P1] |

**AC**
- AUTH-02.1 — 로그아웃 상태로 `/admin` 직접 진입 시 어드민 로그인 폼이 표시되고 데이터가 렌더링되지 않는다.
- AUTH-02.2 — 일반 멤버 세션으로 `/coaching/workspace/x` 진입 시 거부된다.
- AUTH-04.1 — 발급 폼 제출 후 해당 이메일로 로그인이 가능하고 `members`에 메타데이터가 존재한다.
- AUTH-05.1 — `members` 테이블 및 클라이언트 store를 점검했을 때 password 필드가 존재하지 않는다.

### 2-2. 개인정보 · 동의 (FR-PRIV)

| ID | 요구사항 | 우선 | 상태 |
| :--- | :--- | :---: | :---: |
| FR-PRIV-01 | 무료 진단·상담·유료 신청 등 모든 개인정보 수집 지점에 동의 체크가 선행한다 | M | [P1] |
| FR-PRIV-02 | 동의하지 않으면 제출이 차단된다 | M | [P1] |
| FR-PRIV-03 | 동의 시각을 수집 레코드에 함께 저장한다 | M | [P1] |
| FR-PRIV-04 | `/privacy` 처리방침 페이지는 수집 항목·목적·보관기간·파기·제3자 제공·문의처를 포함한다 | M | [P1] |

**AC**
- PRIV-02.1 — 동의 미체크 상태에서 제출 버튼이 비활성 또는 차단되고 레코드가 생성되지 않는다.
- PRIV-03.1 — `free_diagnostics.consent_at`(및 리드 동의 시각)이 NULL이 아니다.

### 2-3. 리드 · 상담 · 신청 (FR-LEAD)

| ID | 요구사항 | 우선 | 상태 |
| :--- | :--- | :---: | :---: |
| FR-LEAD-01 | `/consultation`은 이름·연락처·분야·경력·고민·목적(복수)·결과물(복수)·상담방식을 수집해 `leads`에 저장한다 | M | [현행]→[P1] |
| FR-LEAD-02 | `/apply/{diagnosis,build,launch,partner}`는 상품별 신청서를 제출해 `leads`에 저장하고 `source`로 유입 상품을 식별한다 | M | [현행]→[P1] |
| FR-LEAD-03 | 신청 완료 시 `/apply/thank-you`로 이동한다 | M | [현행] |
| FR-LEAD-04 | 비로그인 사용자의 리드 insert는 허용되나, 조회·수정은 어드민만 가능하다 | M | [P1] |

**AC**
- LEAD-01.1 — 상담 제출 후 어드민 리드 탭에 해당 리드가 `source='consultation'`으로 나타난다.
- LEAD-04.1 — 비로그인 클라이언트에서 `leads` select 호출 시 RLS로 0건 또는 거부된다.

### 2-4. 무료 자가 진단 (FR-FREE)

| ID | 요구사항 | 우선 | 상태 |
| :--- | :--- | :---: | :---: |
| FR-FREE-01 | 7문항 주관식 + 보너스 Q8 체크리스트를 순차 입력받고 진행률을 표시한다 | M | [현행] |
| FR-FREE-02 | `analyzeFree()`가 종합 점수(0–100)와 5영역 점수, 4유형 중 하나를 산출한다 | M | [현행] |
| FR-FREE-03 | 진단 결과(answers·score·type·area_scores·동의 시각)를 `free_diagnostics`에 저장한다 | M | [P1] |
| FR-FREE-04 | 결과 리포트에서 상담/유료 신청 전환 CTA를 제공한다 | M | [현행] |

**AC**
- FREE-02.1 — 동일 입력에 대해 유형·점수 산출이 결정적(deterministic)이다.
- FREE-03.1 — 진단 완료 시 `free_diagnostics`에 1건이 insert된다(비로그인 허용).

### 2-5. 유료 코칭 42문항 (FR-COACH)

| ID | 요구사항 | 우선 | 상태 |
| :--- | :--- | :---: | :---: |
| FR-COACH-01 | 4파트 42문항을 텍스트로 입력받고 `completedCount/42` 진행률과 QuestionNav를 제공한다 | M | [현행] |
| FR-COACH-02 | 답변은 `answers`(session_id, question_id upsert)에 디바운스 자동 저장된다 | M | [P1] |
| FR-COACH-03 | 멤버가 다른 기기·브라우저에서 로그인해도 서버에서 세션을 불러와 이어쓰기가 가능하다 | M | [P1] |
| FR-COACH-04 | 음성 입력은 `VITE_VOICE_ENABLED=false`일 때 UI가 노출되지 않으며, 코드는 보존된다 | M | [P1] |
| FR-COACH-05 | 리뷰 화면에서 미답변 문항을 표시하고, 미답변이 있으면 제출을 차단한다 | M | [현행] |
| FR-COACH-06 | 제출 시 세션 상태가 `submitted`로 전환되고 답변이 잠긴다(수정 불가) | M | [현행]→[P1] |

**AC**
- COACH-03.1 — 기기 A에서 N문항 작성 후, 기기 B 로그인 시 동일 N문항이 채워져 있다.
- COACH-04.1 — flag=false에서 '말로 녹음' 토글·녹음 UI가 DOM에 렌더링되지 않는다. flag=true로 변경 시 즉시 복원된다.
- COACH-06.1 — `submitted` 이후 답변 입력 필드가 읽기 전용이다.

### 2-6. 검수 · 워크스페이스 (FR-WORK)

| ID | 요구사항 | 우선 | 상태 |
| :--- | :--- | :---: | :---: |
| FR-WORK-01 | 워크스페이스에서 42문항 답변을 파트별 조회하고 문항별 코치 메모를 저장한다 | M | [현행]→[P1] |
| FR-WORK-02 | AI 초안(AIDraft)을 조회·수정하고, 최종 프로필(FinalProfile)을 작성·저장한다 | M | [현행]→[P1] |
| FR-WORK-03 | 확정(finalize) 시 세션 상태가 `finalized`로 전환되고 `finalized_at`·`review_logs`가 기록된다 | M | [P1] |
| FR-WORK-04 | 멤버 리포트(`/coaching/report`)는 `status='finalized'`일 때만 `final_profile`을 노출하고, 그 전에는 '코치 검토 중' 대기 화면을 표시한다 | M | [P1] |

**AC**
- WORK-04.1 — `status≠finalized` 세션의 멤버가 `/coaching/report` 접근 시 final_profile이 표시되지 않는다.
- WORK-04.2 — RLS/뷰(`my_finalized_report`) 수준에서도 미확정 final_profile 조회가 거부된다(앱 로직 우회 불가).
- WORK-03.1 — 확정 시 `review_logs`에 `action='finalized'`, actor(어드민) 레코드가 남는다.

### 2-7. 관리자 콘솔 (FR-ADMIN)

| ID | 요구사항 | 우선 | 상태 |
| :--- | :--- | :---: | :---: |
| FR-ADMIN-01 | 리드 탭: 상품별 필터, 상태 변경(대기중→상담중→완료→보류), 운영 메모 인라인 자동 저장 | M | [현행]→[P1] |
| FR-ADMIN-02 | 리드 상세: 7문항 답변·5영역 점수·추천 패키지 조회 | M | [현행] |
| FR-ADMIN-03 | 멤버 탭: 계정 발급(FR-AUTH-04), 카카오톡/SMS 안내문 원클릭 복사, 42문항 진행률 추적, 회원 삭제 | M | [현행]→[P1] |

**AC**
- ADMIN-01.1 — 메모 입력 후 별도 저장 없이 새로고침해도 값이 유지된다(DB 반영).
- ADMIN-03.1 — 안내문 복사 시 로그인 URL·ID·패키지가 포함된 텍스트가 클립보드에 담긴다.

### 2-8. 알림 (FR-NOTIF)

| ID | 요구사항 | 우선 | 상태 |
| :--- | :--- | :---: | :---: |
| FR-NOTIF-01 | 멤버 제출 시 차임벨(Web Audio) + 데스크톱 푸시(Notification API)를 발생시킨다 | S | [현행] |
| FR-NOTIF-02 | 열린 모든 어드민 탭에 알림이 동기화된다(BroadcastChannel) | S | [현행] |

### 2-9. 이메일 (FR-MAIL) — [P1.5]

| ID | 요구사항 | 우선 | 상태 |
| :--- | :--- | :---: | :---: |
| FR-MAIL-01 | 무료 진단 완료·상담 접수 시 확인 메일을 Edge Function `send-email`로 발송한다 | S | [P1.5] |
| FR-MAIL-02 | 메일 발송 실패가 사용자 제출 자체를 실패시키지 않는다(비동기) | S | [P1.5] |

---

## 3. 데이터 요구사항 (DR)

> 스키마 DDL·RLS 전문은 「Phase 1 작업 명세」 §2. 본 절은 검증 가능한 데이터 제약을 명세한다.

| ID | 요구사항 | 우선 | 상태 |
| :--- | :--- | :---: | :---: |
| DR-01 | 테이블: `leads`, `free_diagnostics`, `members`, `coaching_sessions`, `answers`, `review_logs` | M | [P1] |
| DR-02 | `members.id`는 `auth.users.id`를 참조(1:1), cascade delete | M | [P1] |
| DR-03 | `answers`는 `(session_id, question_id)` 유니크 — 문항당 1행 upsert | M | [P1] |
| DR-04 | `coaching_sessions.status`는 정의된 5상태만 허용 | M | [P1] |
| DR-05 | 전 테이블 RLS enable. 익명 insert 허용 범위는 `leads`·`free_diagnostics`로 한정 | M | [P1] |
| DR-06 | 레거시 `diagnosticStore` 및 `kkummolda-*` localStorage 키는 영속 신뢰원으로 사용하지 않는다 | M | [P1] |
| DR-07 | `answers.voice_url`·`voice_duration`은 nullable, 첫 출시 미사용 | M | [P1] |

---

## 4. 비기능 요구사항 (NFR)

### 4-1. 보안 (NFR-SEC)

| ID | 요구사항 | 우선 | 상태 |
| :--- | :--- | :---: | :---: |
| NFR-SEC-01 | 모든 테이블 RLS enable, 비로그인으로 `leads`·`answers` 조회 불가 | M | [P1] |
| NFR-SEC-02 | service_role 키는 클라이언트 번들·환경에 포함되지 않고 Edge Function에서만 사용 | M | [P1] |
| NFR-SEC-03 | 검수 게이트는 애플리케이션 로직이 아닌 RLS/뷰 수준에서 보장(WORK-04.2) | M | [P1] |
| NFR-SEC-04 | 멤버 비밀번호 해싱은 Supabase Auth가 담당, 자체 평문 보관 없음 | M | [P1] |

**AC**
- SEC-02.1 — 프로덕션 번들을 `service_role`로 grep했을 때 검출되지 않는다.

### 4-2. 데이터 영속성·가용성 (NFR-DATA)

| ID | 요구사항 | 우선 | 상태 |
| :--- | :--- | :---: | :---: |
| NFR-DATA-01 | 고객 데이터는 기기·브라우저에 종속되지 않고 서버에 영속된다 | M | [P1] |
| NFR-DATA-02 | Supabase 자동 백업(Point-in-Time 또는 일일)을 활성화한다 | M | [P1] |
| NFR-DATA-03 | 자동 저장은 디바운스로 처리해 과도한 쓰기를 방지한다 | S | [P1] |

### 4-3. 성능·사용성 (NFR-UX)

| ID | 요구사항 | 우선 | 상태 |
| :--- | :--- | :---: | :---: |
| NFR-UX-01 | 모바일·태블릿·데스크톱 반응형을 유지한다 | M | [현행] |
| NFR-UX-02 | 5060 타깃을 고려해 본문 가독성(글자 크기·대비)과 단순한 입력 흐름을 유지한다 | M | [현행] |
| NFR-UX-03 | 폰트 SCDream·Noto Serif KR·Noto Sans KR을 사용한다 | M | [현행] |

### 4-4. 개인정보·규정 (NFR-PRIV)

| ID | 요구사항 | 우선 | 상태 |
| :--- | :--- | :---: | :---: |
| NFR-PRIV-01 | 수집 항목·보관기간·파기 정책을 처리방침에 명시한다 | M | [P1] |
| NFR-PRIV-02 | 처리방침 문구는 외부 전문가 법적 검토를 전제로 한다(구현 외 절차) | M | [P1] |

### 4-5. 운영 (NFR-OPS)

| ID | 요구사항 | 우선 | 상태 |
| :--- | :--- | :---: | :---: |
| NFR-OPS-01 | 코칭 리포트는 "AI 초안 → 코치 검수 → finalized → 노출" 순서를 강제한다(FR-WORK) | M | [P1] |
| NFR-OPS-02 | 파트너 동시 정원(5~8명) 운영 제약을 반영한다(시스템 또는 운영 절차) | S | [P1.5] |

---

## 5. 상태 전이 명세

```
[코칭 세션]
in-progress ──(멤버 제출)──▶ submitted ──(분석 시작)──▶ analyzing
   ▲                                                       │
   │(작성 재개·자동저장)                                    ▼
   └────────────────────────────  analyzed ◀──(초안 완료)──┘
                                     │
                          (코치 확정·review_logs)
                                     ▼
                                 finalized ──▶ 멤버 리포트 노출
```

- `submitted` 이후 멤버는 답변을 수정할 수 없다(FR-COACH-06).
- `finalized` 이전에는 `final_profile`이 멤버에게 노출되지 않는다(FR-WORK-04, NFR-SEC-03).

---

## 6. 추적 매트릭스 (PRD ↔ SRS ↔ Phase 1 Task)

| PRD 섹션 | SRS 요구사항 | Phase 1 Task |
| :--- | :--- | :--- |
| §8-1 인증 | FR-AUTH-01~03, NFR-SEC | T1, T3 |
| §5-3 계정 발급 / §8-2 비번 | FR-AUTH-04·05 | T4 |
| §5-5 상담·신청 / §3 동의 | FR-LEAD, FR-PRIV | T5, T10 |
| §5-1 무료 진단 | FR-FREE | T6 |
| §5-2 42문항 / 음성 | FR-COACH | T7, T8 |
| §5-4 워크스페이스 / §8-3 게이트 | FR-WORK, NFR-SEC-03 | T1(RLS), T9 |
| §5-3 콘솔 | FR-ADMIN | T3, T5 |
| §7 아키텍처 / 데이터 | DR-01~07, NFR-DATA | T1, T2 |
| §8-4 개인정보 | FR-PRIV, NFR-PRIV | T10 |
| §12 로드맵(P1.5) | FR-MAIL, NFR-OPS-02 | T11 |

---

## 7. 출시 판정 기준 (Acceptance Gate)

다음 Must 요구사항 AC가 **전부** 통과해야 출시한다.

- [ ] FR-AUTH-02·05 — 어드민 접근 차단 + 평문 비번 부재
- [ ] FR-PRIV-02·03 — 미동의 제출 차단 + 동의 시각 저장
- [ ] FR-LEAD-04 / NFR-SEC-01 — 비로그인 리드·답변 조회 불가
- [ ] FR-COACH-03 — 교차 기기 이어쓰기 정상
- [ ] FR-COACH-04 — 음성 UI 비노출(flag OFF)
- [ ] FR-WORK-04 / NFR-SEC-03 — finalized 전 리포트 비노출(RLS 강제)
- [ ] NFR-SEC-02 — service_role 키 미노출
- [ ] NFR-DATA-02 — 백업 활성화
- [ ] FR-PRIV-04 — `/privacy` 접근 가능

> Should/Could(FR-MAIL, FR-NOTIF, NFR-OPS-02 등)는 출시 차단 요건이 아니며 P1.5 이후 충족한다.

---

> **문서 끝** | SRS v2.0 (PRD v3.0 정합) | 상위: PRD v3.0 · 부속: Phase 1 작업 명세
