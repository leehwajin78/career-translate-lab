# 잔여 Known Gaps 해결 계획서

현재 `DESIGN.md`에 남아있는 5개의 잔여 항목(백로그)을 해결하기 위한 구체적인 구현 계획입니다.

## User Review Required

- **다크모드 정책 결정**: 현재 다크모드 토큰이 CSS에 정의되어 있으나 실제로 사용되지 않고 있습니다. 코드를 깔끔하게 유지하기 위해 사용하지 않는 다크모드 CSS 토큰을 **완전히 제거**할지, 아니면 미래를 위해 **그대로 둘지** 결정이 필요합니다. (추천: 제거 후 필요시 재도입)

## 1. 에러 컴포넌트화 (우선순위: P1)

현재 폼 검증 에러나 네트워크 에러 메시지가 폼마다 인라인(예: `text-red-500`)으로 하드코딩되어 있습니다. 이를 공통 컴포넌트로 추출하여 브랜드 일관성을 맞춥니다.

### 1.1. 신규 컴포넌트 생성 (`src/components/ui/error-message.tsx`)
- `<FieldError />`: 입력 폼 하단에 붙는 작은 에러 텍스트 (기존 `text-red-500 text-sm` 대체). `text-destructive` 색상과 ⚠️ 아이콘을 포함.
- `<ErrorBox />`: 페이지나 섹션 단위의 큰 에러 박스 (`Login.tsx`의 에러 스타일 활용). 연한 붉은 배경(`bg-destructive/5`)과 테두리 적용.

### 1.2. 기존 폼 리팩토링
- `ApplyForm.tsx`, `Consultation.tsx`, `Diagnosis.tsx`, `Login.tsx` 등에서 기존 에러 출력부를 `<FieldError>` 또는 `<ErrorBox>`로 교체.

## 2. Fluid Typography 도입 (우선순위: P2)

현재 헤드라인 폰트 크기가 브레이크포인트에 따라 계단식으로 변형(`text-4xl md:text-6xl lg:text-7xl`)되어 창 크기 조절 시 글자 크기가 툭툭 끊기며 바뀝니다. `clamp()`를 도입하여 화면 크기에 비례해 부드럽게 글자 크기가 변하도록 개선합니다.

### 2.1. 유틸리티 클래스 정의 (`src/index.css`)
- `.text-fluid-hero`: `clamp(2.5rem, 5vw + 1rem, 4.5rem)` (히어로 영역 전용)
- `.text-fluid-display`: `clamp(1.875rem, 3vw + 0.75rem, 3rem)` (대형 섹션 헤딩)

### 2.2. 히어로 섹션 파일럿 적용
- `Index.tsx`와 `Service.tsx`의 최상단 히어로 텍스트(`h1`)에 우선 적용하여 시각적 안정성 검증.
- `DESIGN.md` 타이포그래피 섹션에 `clamp` 사용 기준 문서화.

## 3. 코칭 워크스페이스 스펙 문서화 (우선순위: P3)

코칭 워크스페이스는 랜딩 페이지와 다른 성격의 '앱' UI를 가지고 있습니다(음성 녹음, 질문 네비게이션, 진행률 바 등).

### 3.1. `DESIGN-coaching.md` 작성
- **분석 대상**: `CoachingWorkspace.tsx`, `CoachingDashboard.tsx` 등 코칭 관련 라우트.
- **문서 내용**: 워크스페이스 전용 컴포넌트(파형 애니메이션, 질문 카드, 하단 컨트롤 바)의 레이아웃과 동작 명세 정리.

## 4. Admin 페이지 스펙 문서화 (우선순위: P3)

관리자 페이지 역시 일반 유저가 보지 않는 대형 UI입니다.

### 4.1. `DESIGN-admin.md` 작성
- **분석 대상**: `Admin.tsx`
- **문서 내용**: 데이터 테이블, 탭 네비게이션, 모달 다이얼로그, 필터링 UI 등 어드민 전용 레이아웃 패턴 정리.

---

## Verification Plan

1. **에러 컴포넌트**: `Login` 및 `Consultation` 페이지에서 폼 제출 버튼을 눌러 에러가 정상적으로, 통일된 디자인으로 노출되는지 확인.
2. **Fluid Typography**: 브라우저 창 크기를 리사이징하며 히어로 텍스트가 부드럽게 스케일링되는지 시각적 확인.
3. **문서화**: 생성된 `DESIGN-coaching.md`와 `DESIGN-admin.md`가 기존 `DESIGN.md`와 포맷 일관성을 유지하는지 확인.
