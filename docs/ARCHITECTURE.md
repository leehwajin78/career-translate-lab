# Architecture Overview

이 문서는 `career-translate-lab` UI 프로토타입의 전체 아키텍처와 라우팅 구조를 설명합니다.

## Tech Stack
- Framework: Vite + React
- Language: TypeScript
- Styling: Tailwind CSS
- UI Components: shadcn/ui
- State Management: Zustand (with persist)
- Routing: React Router

## Routing Structure
라우팅은 `src/App.tsx`에서 정의되어 있으며 주요 경로는 다음과 같습니다.

- `/` : 홈 페이지 (`src/pages/Index.tsx`) - 메인 랜딩 페이지 및 CTA
- `/diagnosis` : 진단 폼 페이지 (`src/pages/Diagnosis.tsx`) - 5060 프리미엄 브랜드 진단 프로세스
- `/result` : 진단 결과 페이지 (`src/pages/Result.tsx`) - 진단 결과 분석 및 점수 게이지 표시
- `/consultation` : 상담 신청 페이지 (`src/pages/Consultation.tsx`) - 연락처 정보 입력 및 리드 생성
- `/admin` : 어드민 페이지 (`src/pages/Admin.tsx`) - 수집된 리드 목록 확인 및 상태 관리
- `*` : 404 페이지 (`src/pages/NotFound.tsx`)

## UX Flow
전체적인 페이지 이동 흐름과 컴포넌트 간의 관계는 다음과 같습니다. 상세한 Mermaid 다이어그램은 [UX_FLOW.md](./UX_FLOW.md)를 참고하세요.

1. **사용자 유입**: `/` (Index) 진입 후 CTA 클릭
2. **진단 진행**: `/diagnosis` 에서 문항 응답 (Zustand: `diagnosticStore`에 임시 저장)
3. **결과 확인**: `/result` 에서 분석 결과 확인 및 상담 신청 버튼 클릭
4. **상담 신청**: `/consultation` 에서 개인정보 입력 완료 시 (Zustand: `leadsStore`에 리드 저장)
5. **관리자 확인**: `/admin` 에서 유입된 리드 관리 (리드 상태 업데이트)

## Directory Structure
- `src/components/ui/`: shadcn/ui 기반의 재사용 가능한 기본 UI 컴포넌트
- `src/components/site/`: 도메인 특화 및 레이아웃 관련 컴포넌트 (`Nav`, `Footer`, `CTAButton`, `Editorial`)
- `src/pages/`: 각 라우트별 메인 페이지 컴포넌트
- `src/store/`: Zustand 전역 상태 관리 모듈 (`diagnostic.ts`, `leads.ts`)
- `src/data/`: 콘텐츠 및 상수 데이터 (패키지 정보 등)
- `src/lib/`: 유틸리티 및 진단 분석 로직 (`diagnostic.ts` 등)
