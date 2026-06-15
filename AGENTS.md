# AGENTS.md — AI 에이전트 운영 규칙

> Claude Code / Claude Agent SDK 를 사용하는 서브에이전트와  
> 미래에 추가될 자동화 에이전트를 위한 행동 규칙입니다.  
> CLAUDE.md 의 전체 규칙이 먼저 적용되며, 이 파일은 에이전트 전용 추가 규칙입니다.

---

## §1. 에이전트 실행 전 필수 확인

모든 에이전트는 작업 시작 전 아래 3개 파일을 반드시 읽어야 합니다:

1. `CLAUDE.md` — 프로젝트 전반 규칙
2. `src/data/playboard.ts` — 작업 대상 화면의 FR·EDGE·인수조건 확인
3. `docs/tech-spec/07-mission-critical.md` — 도메인 제어 스펙 확인 (해당 시)

---

## §2. 역할별 에이전트 정의

### impl-agent (구현 에이전트)
**목적**: 단일 화면의 FE 또는 BE 구현

**허용 작업**:
- `src/pages/` 내 컴포넌트 수정
- `supabase/functions/` Edge Function 작성
- `supabase/migrations/` SQL 파일 생성
- `src/data/playboard.ts` 의 해당 Screen 상태 갱신

**금지 작업**:
- 명시되지 않은 다른 화면의 코드 변경
- playboard.ts 의 다른 Screen 데이터 수정
- `CLAUDE.md`, `AGENTS.md`, `PLAYBOARD.md` 수정

**완료 조건**:
```
1. Screen.acceptanceCriteria 의 모든 항목 통과
2. npm run build 성공
3. playboard.ts Screen.fe 또는 Screen.be 상태 갱신
4. CHANGES 배열에 CHG 항목 추가
```

### spec-agent (명세 에이전트)
**목적**: playboard.ts 의 데이터 확장 (FR/NFR/EDGE/Coverage 추가)

**허용 작업**:
- `src/data/playboard.ts` 데이터 추가·수정
- `docs/PLAYBOARD.md` 산문 뷰 동기화
- `docs/tech-spec/07-mission-critical.md` 갱신

**금지 작업**:
- `src/` 내 컴포넌트·스토어·유틸 코드 변경
- 기존 FR ID 변경 (FR-C03-01 등 ID는 불변)

### review-agent (검토 에이전트)
**목적**: PR 리뷰 — SoT 정합성 및 구현 품질 검토

**검토 항목**:
- [ ] playboard.ts 갱신 여부 (구현 화면의 fe/be 상태)
- [ ] acceptanceCriteria 충족 여부
- [ ] CHANGES 배열 CHG 항목 추가 여부
- [ ] Mission-Critical 화면이면 E2E 테스트 존재 여부
- [ ] 번들 예산 초과 여부 (gzip 80KB)
- [ ] `console.log` 잔류 여부

---

## §3. 에이전트 간 데이터 계약

에이전트가 다른 에이전트의 출력물을 사용할 때의 신뢰 규칙:

```
spec-agent 출력 (playboard.ts)
    → impl-agent 입력 (FR·EDGE·인수조건)
    → review-agent 검증 기준 (acceptanceCriteria)
```

- `spec-agent`의 FR ID가 변경되면 `impl-agent`에게 알림 필요
- `review-agent`는 spec-agent 출력 기준으로만 검증 (구현 코드 의도 추측 금지)

---

## §4. PlayBoard 동기화 프로토콜

구현 완료 후 playboard.ts 갱신 방법:

```typescript
// 예: C-15 Privacy 페이지 FE 구현 완료 시
// src/data/playboard.ts 에서 해당 Screen 찾아 수정:

// Before:
{ id: 'C-15', fe: 'not-started', route: null, component: '❌ 미생성', openIssues: ['ISSUE-03'] }

// After:
{ id: 'C-15', fe: 'partial', route: '/privacy', component: 'src/pages/Privacy.tsx', openIssues: [] }

// CHANGES 배열 끝에 추가:
{ id: 'CHG-011', date: '2026-XX-XX', screens: ['C-15'], type: 'add',
  description: 'Privacy.tsx 생성 + /privacy 라우트 등록. ISSUE-03 해결.', source: '구현' }

// ISSUES 에서 ISSUE-03 상태 갱신:
{ id: 'ISSUE-03', status: 'resolved', resolvedBy: 'CHG-011', ... }
```

---

## §5. 에이전트 실행 금지 조건

아래 상황에서 에이전트는 작업을 중단하고 사람에게 확인 요청합니다:

1. playboard.ts 의 `isMissionCritical: true` 화면에 **파괴적 변경** (삭제·리네임·타입 변경)
2. `supabase/migrations/` 에 이미 실행된 마이그레이션 파일 수정
3. `CLAUDE.md` 또는 `AGENTS.md` 규칙 충돌 발생
4. 예상하지 못한 기존 파일 발견 (미추적 상태의 수정된 파일)
5. `git push --force` 또는 `--no-verify` 가 필요한 상황

---

## §6. 현재 에이전트 실행 컨텍스트

```
프로젝트: 한끗프로젝트 (career-translate-lab)
브랜치: feat/tech-spec-upgrade
PM: 이화진 (yeki78@gmail.com)
현재 Phase: A~D 완료 → 다음: Phase 1 구현 시작
PlayBoard 버전: v2.0
```
