# Components Guide

이 문서는 프로토타입에 구현된 주요 컴포넌트들을 분류하고 설명합니다. 이후 Next.js MVP로 UI를 이관할 때 참고할 수 있습니다.

## 1. UI Components (`src/components/ui/`)
이 폴더의 컴포넌트들은 **shadcn/ui**를 기반으로 생성된 범용 디자인 시스템 컴포넌트입니다. 접근성과 Tailwind CSS 스타일링이 기본으로 포함되어 있습니다.

- **폼 요소**: `Input`, `Textarea`, `Select`, `Label`, `Form`, `RadioGroup`, `Checkbox`
- **인터랙션/피드백**: `Button`, `Toast` (Toaster), `Alert`, `Accordion`
- **구조/레이아웃**: `Card`, `Table`, `Separator`, `Tabs`, `Dialog`
- *특이사항*: 이 컴포넌트들은 MVP 개발 시 shadcn CLI(`npx shadcn-ui@latest add`)를 통해 Next.js 프로젝트에 동일하게 설치하여 사용할 수 있습니다.

## 2. Site Components (`src/components/site/`)
해당 도메인(5060 프리미엄 브랜드 매니지먼트)에 맞춰 커스텀하게 제작된 구성 요소들입니다. 

| 컴포넌트 | 설명 | 사용 위치 |
| --- | --- | --- |
| `Layout.tsx` | 기본 페이지 래퍼로 전체적인 여백 및 정렬 설정 | 모든 Page |
| `Nav.tsx` | 상단 네비게이션 바. 로고 및 주요 메뉴 링크 포함. 모바일 햄버거 메뉴 지원. | 모든 Page |
| `Footer.tsx` | 하단 푸터 영역. 저작권, 회사 정보, 약관 링크 등 포함. | 모든 Page |
| `CTAButton.tsx` | 주요 전환을 유도하는 Call To Action 버튼. (프리미엄한 그라데이션 및 호버 효과 포함) | Index, Result 등 |
| `Editorial.tsx` | 텍스트 콘텐츠를 우아하게 표현하기 위한 매거진/사설 형태의 레이아웃. Gold Divider 등 포함. | Index, Result, Consult |
| `ScoreGauge.tsx` | 진단 결과에 따른 점수를 원형 또는 바 형태의 게이지로 시각화. 애니메이션 효과 포함. | Result |
| `NavLink.tsx` | 활성화 상태에 따라 스타일이 변경되는 링크 (React Router의 NavLink 래핑). | Nav |

## 3. Styling & Theming
스타일링은 **Tailwind CSS**(`tailwind.config.ts`)를 전적으로 사용하며, 전역 설정은 `src/index.css`에 정의되어 있습니다. 
특히 `:root` 선택자 내에 CSS 변수(Variables) 형태로 주요 테마 색상(프라이머리, 배경, 전경, 보더 등)이 지정되어 있으며, shadcn/ui 컴포넌트들이 이 변수를 참조하도록 설계되어 있습니다.
