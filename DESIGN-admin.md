# 한끗프로젝트: 어드민(관리자) 페이지 디자인 스펙

> 본 문서는 `DESIGN.md`를 확장하는 서브 디자인 스펙입니다. 내부 운영 도구인 **한끗 관리자 콘솔(Admin Console)**의 레이아웃, 색상 규칙, 컴포넌트 패턴을 정의합니다.

---

## 1. 개요 (Overview)

어드민 페이지는 심미성보다는 **정보 밀도와 효율성**을 최우선으로 설계됩니다. 방대한 데이터를 쾌적하게 열람하고 관리할 수 있도록, 일반 랜딩 페이지와는 다른 넓은 컨테이너(`max-w-7xl`)와 밀도 높은 테이블 구조를 갖습니다.

## 2. 레이아웃 구조 (Layout)

### 2.1. 컨테이너 (Container)
- **최대 너비**: `max-w-7xl mx-auto px-4`. 일반 에디토리얼 레이아웃(`max-w-6xl`)보다 훨씬 넓게 사용하여 테이블 컬럼 공간을 확보합니다.
- **배경**: 전체 배경은 `bg-background`(순백)를 유지하되, 리스트 박스나 폼 영역은 `bg-card border-border`로 묶어 시각적 위계를 줍니다.

### 2.2. 헤더 영역 (Header)
- **Admin Badge**: `font-mono text-xs text-accent font-bold`. 쉴드 아이콘과 함께 `ADMIN CONSOLE` 표시.
- **알림 센터**: 우측 상단에 실시간 알림 센터(종 모양)를 배치. 새 알림이 있을 경우 `animate-bounce`, 숫자 뱃지에 `animate-pulse`를 사용하여 직관적 인지 가능하도록 구성.
- **알림 오버레이**: `absolute slide-down backdrop-blur-md` 기반으로, 중요한 시스템/사용자 활동 내역을 드롭다운 형태로 렌더링.

### 2.3. 탭 네비게이션 (Tabs)
- Radix UI(Shadcn) 탭 사용.
- **스타일**: 컨테이너 배경은 `bg-secondary/30`. 활성화된 탭은 `bg-primary text-white` 조합으로 명확한 대조를 줍니다.
- **분류**: "상담 리드 관리" / "코칭 회원 및 ID 관리" 두 가지 메인 탭으로 분리.

## 3. 핵심 컴포넌트 패턴

### 3.1. 카테고리 필터 (Filter Pills)
- **용도**: 테이블이나 리스트 위의 상품군(한끗 진단, 빌드 등) 필터링 버튼.
- **형태**: `bg-secondary/15 rounded-xl p-2` 랩퍼 내부에 위치.
- **비활성 상태**: `hover:bg-secondary/40 text-muted-foreground`. 카운터 뱃지는 `bg-secondary`.
- **활성 상태**: `bg-primary text-white shadow-soft`. 카운터 뱃지는 `bg-white/20`.

### 3.2. 데이터 테이블 (Data Table)
- **헤더(`thead`)**: `bg-secondary/60 text-xs tracking-widest text-muted-foreground`. 가독성을 위해 텍스트는 좌측 정렬, 작고 넓은 자간 적용.
- **본문(`tbody`)**:
  - 패딩: `px-4 py-4`로 넉넉한 공간 부여.
  - 행 구분: `border-t border-border`.
  - 뱃지(신청 구분): 데이터의 성격에 따라 각기 다른 테마 색상(emerald, rose, amber, blue, purple)의 파스텔 뱃지(`bg-color-50 text-color-700`) 사용.
- **확장 행 (Expanded Row)**:
  - "보기 ▼" 클릭 시 열리는 상세 영역.
  - 행 배경색: `bg-secondary/15`.
  - 내부 데이터: 2컬럼(Grid)으로 나누어 '영역별 점수/요구사항'과 '진단 답변 전문'을 분리 노출.

### 3.3. 관리자 폼 (Admin Form)
- **레이아웃**: 1/3 너비의 입력 폼(좌측) + 2/3 너비의 데이터 리스트(우측).
- **입력 필드**: `h-10 text-xs rounded-xl`. 아이콘(`lucide-react`)을 폼 인풋 좌측(absolute)에 배치하여 시각적 보조.
- **제출 피드백**:
  - 에러 시: `bg-destructive/5 text-destructive border-destructive/10`.
  - 성공 시: `bg-emerald-50 text-emerald-700 border-emerald-200`.

## 4. 타이포그래피 규칙
- 어드민 콘솔의 기본 폰트 크기는 `text-xs` ~ `text-sm`으로 조밀하게 세팅됩니다.
- 점수, 날짜 등 정확한 수치 데이터에는 `font-mono`를 적극적으로 활용합니다.
- 큰 제목만 `font-serif text-3xl font-bold`로 유지하여 브랜드 아이덴티티를 계승합니다.
