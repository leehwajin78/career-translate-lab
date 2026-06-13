# 한끗프로젝트: 코칭 워크스페이스 디자인 스펙

> 본 문서는 `DESIGN.md`를 확장하는 서브 디자인 스펙입니다. 일반 사용자용 랜딩 페이지와 분리된, 로그인 후 진입하는 **멤버 전용 코칭 워크스페이스(App UI)**의 디자인 패턴을 정의합니다.

---

## 1. 개요 (Overview)

코칭 워크스페이스는 시각적인 에디토리얼 랜딩 페이지와 달리 **'앱 라이크(App-like)'한 조작감과 집중력**을 요구합니다.
배경은 집중을 위해 `bg-background`(순백) 또는 `bg-surface`(매우 옅은 회색)를 사용하며, 화려한 마케팅 요소를 배제하고 **기능 중심의 카드 레이아웃**을 채택합니다.

## 2. 주요 색상 (Colors)

기존 `DESIGN.md`의 토큰을 그대로 계승하되, 사용 비율이 다릅니다.

- **Primary (`hsl(230, 99%, 35%)` / Royal Blue)**: 주 액션 버튼, 헤더 로고, 오디오 재생 진행률 바(progress) 등 활성화된 중요 요소.
- **Surface (`hsl(220, 20%, 98%)`)**: 워크스페이스 바탕 배경색 또는 질문 카드 배경색. 장시간 사용에도 눈이 편안한 오프화이트.
- **Accent (`hsl(230, 99%, 35%)`)**: Primary와 동일하지만 주로 아이콘, 라벨 뱃지 등 포인트 요소에 사용.
- **Error/Destructive (`hsl(0, 65%, 45%)`)**: 마이크 권한 거부 알림, 미응답 문항 경고 텍스트 등.
- **Product Confirm (`hsl(244, 60%, 96%)`)**: 제출 전 안내 박스, 리뷰 페이지의 활성화된 카드 배경 등 부드러운 강조 배경.

## 3. 타이포그래피 (Typography)

SCDream 서체를 유지하며, 가독성에 중점을 둡니다.

- **헤더/타이틀**: `font-serif font-extrabold` (SCDream 800)
- **질문 텍스트 (Q)**: `text-xl md:text-2xl font-bold` (SCDream 500/800 혼용)
- **응답 텍스트 (본문)**: `text-base md:text-lg leading-relaxed` (SCDream 300)
- **캡션/힌트**: `text-sm text-muted-foreground` (SCDream 300)

## 4. 핵심 컴포넌트 패턴

### 4.1. 워크스페이스 레이아웃 (Workspace Layout)
- **Top Header**: 뒤로 가기 버튼, "나의 경력 자산화 보드" 등 현재 위치 표시. 우측에 저장/종료 버튼.
- **Progress Header**: 현재 진행 중인 문항수 / 전체 문항수 (`진행률 %`). 선형 프로그레스 바.
- **Main Content Area**: 중앙 정렬된 카드 레이아웃 (최대 너비 `max-w-3xl` 등 적용하여 시선 분산 방지).
- **Bottom Navigation**: 이전/다음 문항 이동 컨트롤 바.

### 4.2. 음성 녹음 모드 (Voice Record Mode)
- **마이크 권한 안내 박스**: `border-dashed border-error-border bg-error-bg` 박스 내에 `text-destructive` 텍스트로 권한 허용 안내.
- **파형 애니메이션 (Waveform)**: 녹음 중일 때 높이가 랜덤하게 변하는 막대(bar) 애니메이션 요소. Primary 컬러 기반의 그라데이션 또는 투명도 조절로 음성 시각화.
- **컨트롤 바**:
  - 중앙의 둥근(full-pill) 대형 녹음/중지 버튼.
  - 재생(Play), 삭제(Trash) 아이콘 버튼.

### 4.3. 텍스트 입력 모드 (Text Input Mode)
- `textarea` 기반의 대형 입력창.
- 보더 없는 깔끔한 텍스트 에어리어(`border-transparent`, `resize-none`)에 배경색과 패딩만 주어 노트에 적는 느낌 부여.

### 4.4. 리뷰 & 대시보드 요약 (Coaching Review)
- **진행 통계**: 완료 갯수, 미응답 갯수(`text-destructive`), 녹음 갯수 등을 한눈에 보여주는 상단 바.
- **상태별 질문 카드**:
  - **응답 완료**: `border-border bg-white`로 선명하게 표시.
  - **미응답**: `border-dashed border-foreground/15 bg-foreground/5`로 흐릿하게 표시하여 입력 유도.
- **최종 제출 카드**: `bg-product-confirm` 배경으로 크게 노출. 제출 버튼은 `bg-primary` 사용.

## 5. 인터랙션 (Interaction)
- 문항 이동 시 부드러운 페이드인(`fade-in`) 애니메이션.
- 녹음 시작/중지 시 버튼 형태 변형(둥근 모양 ↔ 둥근 사각형 등) 마이크로 인터랙션 (선택적).
- 작성된 데이터 자동 저장(auto-save) 또는 명시적 임시 저장 버튼.
