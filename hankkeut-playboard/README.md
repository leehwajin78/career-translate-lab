# 한끗프로젝트 PlayBoard

> `hankkeut-prototype/`의 프로토타입 화면 34종을 **PlayBoard 스킬**
> ([wild-mental/playboard-skill](https://github.com/wild-mental/playboard-skill))의 구조로 재정리한
> **레지스트리 파생 단일 진실 공급원(SoT) 표면**입니다.
>
> **제1원칙(불가침):** 표시되는 모든 것은 레지스트리([data/registry.js](data/registry.js)) 한 곳에서 파생합니다 —
> 두 곳을 손으로 맞추지 않습니다. 화면·정책·일정·매트릭스·흐름은 모두 같은 데이터에서 계산됩니다.

## 여는 법

빌드 도구가 필요 없습니다. 정적 파일을 그대로 엽니다.

```
hankkeut-playboard/index.html  ← 더블클릭 또는 브라우저로 열기
```

- 데모 썸네일/iframe은 `../hankkeut-prototype/*.html`을 라이브로 로드합니다(상대 경로).
  저장소 폴더 구조를 유지한 채 열어야 데모가 보입니다.
- 다이어그램(DAG·Gantt)은 Mermaid CDN을 사용하므로 그 두 위젯만 인터넷이 필요합니다(나머지는 오프라인 동작).
- 로컬 파일(`file://`)에서 iframe이 차단되면 간단한 정적 서버로 여세요:
  `python -m http.server` 후 `http://localhost:8000/hankkeut-playboard/`.

## 10개 라우트 (정적 파일 매핑)

스킬의 `:param` 라우트는 정적 사이트에선 **쿼리스트링**으로 매핑했습니다. 없는 파라미터는 페이지 내 404로 처리합니다.

| 스킬 라우트 | 이 보드의 파일 | 표면 |
|---|---|---|
| `/` | [index.html](index.html) | 상황판 인덱스(6타일 허브) |
| `/plan` | [plan.html](plan.html) | 작업 항목 DAG + 단계별 표 |
| `/schedule` | [schedule.html](schedule.html) | 병렬 Wave 일정표(Gantt + 카드) |
| `/implement-summary` | [implement-summary.html](implement-summary.html) | 화면 × 제어영역 매트릭스(정렬) |
| `/control-area/:area` | `control-area.html?area=` | 제어 영역 5섹션 정책 허브 |
| `/spec/:plane/:slug` | `spec.html?plane=&slug=` | 산출물 기술 스펙 |
| `/screens/:plane/:slug` | `screens.html?plane=&slug=` | 화면 데모(프로토타입 임베드) |
| `/scenario/:flow` | `scenario.html?flow=` | 시나리오 walkthrough(순차 전용) |
| `/ux-flow/:flow` | `ux-flow.html?flow=` | 데스크톱 흐름 오버뷰 |
| `/mobile-flow/:flow` | `mobile-flow.html?flow=` | 모바일 흐름(폰 프레임 캐러셀) |

공유 골격: sticky PlayBoard 내비(breadcrumb + 4 섹션 탭[상황판·실행계획·일정표·구현통계], 현재 강조) + 타일 세로 스택.
상호작용 “섬”은 5개: **PlayBoardNav · ScreenBoard(타일/칸반 토글) · SortableMatrix · DiagramModal · MobileCarousel**.

## 6개 레지스트리 (SoT)

[data/registry.js](data/registry.js) 한 파일에 있습니다.

| 레지스트리 | 내용 | 원천 |
|---|---|---|
| **Screen** (34) | 산출물 화면 + 엔지니어링 제어 계약 | `src/data/playboard.ts` SCREENS + 프로토타입 |
| **Plane** (4) | customer / member / operator / system | auth 계층 + 시스템 상태 |
| **Status** (4) | 미착수 → 부분구현 → 구현·머지완료 → 검증완료 | fe/be에서 파생(부록 A) |
| **WorkItem** (15) | 작업 DAG(dependsOn) | CHANGES + PR 로드맵 |
| **ControlArea** (6) | 인증·접근·무결성·복구·관측·성능 | playboard.ts coverage 6도메인 |
| **Flow** (4) | customer/member/operator(순차) + system(케이스 집합) | 프로토타입 flow-customer/flow-coach |

파생 개념 **Wave** = 작업 DAG 위상 레벨에서 동시 착수 가능한 묶음([schedule.html](schedule.html)).

## 부록 A. 일반화 ↔ 호스트 매핑 워크시트

| 일반 개념 | 한끗프로젝트 대응물 | 비고 |
|---|---|---|
| 평면 집합 | 고객 / 코칭 멤버 / 운영자 / 시스템 상태 | auth(Guest/Member/Admin) + 전이 상태 |
| 산출물 화면 | 34개(현행 21 + 로드맵 13) | `plane/slug`, slug = 프로토타입 파일명 |
| 구현 상태 4단계 | planned / partial / merged / verified | 아래 파생 규칙 |
| 작업 항목·DAG | WI-01~15(CHANGES·PR) | dependsOn |
| 제어 영역 | 인증·접근제어·데이터무결성·장애복구·관측성·성능 | playboard.ts CoverageMatrix |
| 흐름 | 고객 퍼널·멤버 코칭·운영 루프·시스템 상태 | 평면당 1 |
| Day1 anchor | 2026-06-29 | wave 추정(1 wave ≈ 1 Day) |
| 노출 플래그/환경 | 로컬 항상 노출 | production 기본 비공개 계약 |

**구현 상태(Status) 파생 규칙** — 원천 `playboard.ts`의 `fe`/`be`/`phase`에서 단일 status로 환원:

- `phase ∈ {p2,p3}` 또는 `fe = not-started` → **planned**(미착수·기획확정)
- 백엔드가 머지된 화면(PR 통과: C-03·C-09·C-11·C-12·A-01·A-02·A-05) → **merged**(구현·머지완료)
- 그 외 `fe = partial` → **partial**(부분 구현)
- 배포 검증(E2E) 통과 → **verified** — 현재 0건(`CLAUDE.md §6` 기준 미충족)

## 운영 규칙(거버넌스) — 살아있는 SoT 유지

1. **동시 갱신.** 요구사항/상태/정책/디자인 변경은 같은 PR에서 `registry.js`를 함께 갱신.
2. **상태 전이 규약 고정.** 작업: 미착수→리뷰대기(PR 열림)→완료(머지). 화면: 머지=merged, 배포 검증 후에만 verified.
3. **양방향 싱크.** 제어 영역 정책 ↔ 위성 기준 문서(`docs/tech-spec/*.md`)는 같은 PR에서 함께 갱신.
4. **갭 승격.** 제어 영역 `gaps`가 해소되면 확정 정책/결정값으로 올리고 목록에서 제거(갭은 줄어드는 방향이 정상).
5. **노출 게이트.** production 기본 비공개, 공유는 프리뷰 URL로(문서 export 금지).

> 이 PlayBoard는 운영 SoT(`src/data/playboard.ts`)의 **파생 뷰**입니다. 운영 명세가 바뀌면
> 그 변경과 같은 단위에서 `data/registry.js`를 갱신하세요(부록 A 매핑 유지).

## 무결성 불변식 (재현 체크리스트)

- 화면 `workItems[]` ↔ 작업 `screens[]` 고아 참조 없음
- 작업 DAG 비순환
- `exceptionStates[]`는 system 평면의 실재 slug만 참조
- merged/verified 화면은 `implLocation` 필수
- 흐름 `screens[]`는 같은 평면의 실재 slug만
- 제어 영역 노트 키는 정의된 6개 영역 집합 안

위 불변식은 [scripts/check.mjs](scripts/check.mjs)로 검사합니다(`node hankkeut-playboard/scripts/check.mjs`).
