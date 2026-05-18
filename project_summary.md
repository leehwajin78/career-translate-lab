# 한끗프로젝트 (career-translate-lab) — 프로젝트 요약

## 📌 프로젝트 개요

**한끗프로젝트**는 50~60대 시니어 경력 전문가의 30년 경력을 **시장이 선택하는 자산**(강의안, 제안서, 프로필)으로 번역해주는 **프리미엄 1:1 브랜드 매니지먼트 서비스**의 랜딩 & MVP 웹사이트입니다.

> **핵심 메시지**: *"30년을 일했는데, 나를 소개하는 한 문장이 없습니다."*

---

## 🛠 기술 스택

| 영역 | 기술 |
|------|------|
| **프레임워크** | Vite + React 18 (TypeScript) |
| **라우팅** | React Router DOM v6 |
| **스타일링** | Tailwind CSS 3 + shadcn/ui (Radix UI 기반) |
| **상태관리** | Zustand |
| **폼 처리** | React Hook Form + Zod 검증 |
| **데이터 페칭** | TanStack React Query |
| **차트** | Recharts |
| **아이콘** | Lucide React |
| **폰트** | Noto Serif KR, Noto Sans KR (Google Fonts) |
| **테스트** | Vitest + Testing Library |

---

## 📂 디렉토리 구조

```
career-translate-lab/
├── docs/                   # 프로젝트 문서 (PRD, SRS, 아키텍처 등)
├── public/                 # 정적 자산
├── src/
│   ├── assets/             # 이미지/미디어 자산
│   ├── components/
│   │   ├── site/           # 사이트 전용 컴포넌트 (Nav, Footer, FAQ, CTA 등)
│   │   └── ui/             # shadcn/ui 범용 UI 컴포넌트
│   ├── data/               # 모크 데이터 (content.ts, diagnostic.ts, leads.ts)
│   ├── hooks/              # 커스텀 훅
│   ├── lib/                # 유틸리티
│   ├── pages/              # 라우트 페이지 컴포넌트
│   ├── store/              # Zustand 스토어
│   └── test/               # 테스트 파일
├── tasks/                  # 개발 이슈/태스크 문서
└── index.html              # 진입점
```

---

## 📄 페이지 구성 (6개 라우트)

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | **Index (랜딩)** | 서비스 소개, 가치 제안, 비교표, 프로세스, 결과물, 가격, FAQ, CTA |
| `/service` | **Service** | 서비스 상세 소개 (한끗프로젝트 방법론, 신뢰 섹션) |
| `/diagnosis` | **Diagnosis** | 경력 자산 자가 진단 폼 |
| `/result` | **Result** | 진단 결과 리포트 뷰 |
| `/consultation` | **Consultation** | 무료 상담 신청 폼 |
| `/admin` | **Admin** | 관리자 대시보드 (리드 관리) |

---

## 🏠 랜딩 페이지 주요 섹션

1. **Hero** — 핵심 카피 + CTA 버튼 + 핵심 지표(1주/6주/3개월)
2. **가치 제안** — "경력은 충분합니다. 부족한 건 번역입니다." + Input→Output 다이어그램
3. **시간 대비 성과** — 혼자 6개월 vs 한끗 6주 vs 시작하지 못한 시간 (3카드)
4. **차별화 포인트** — PPT 작업 제로, 1:1 전담 매니저, 장기 활용 자산
5. **경쟁 비교표** — 일반 브랜딩 학원 vs 한끗프로젝트 (다크 섹션)
6. **진행 과정** — 4단계 프로세스 (인터뷰→기획→제작→기회탐색)
7. **결과물** — 프로필, 제안서, 강의안, 채널 전략 가이드
8. **단계별 상품** — 4개 상품 카드 (진단 50만원 / 빌드 350만원 / 론칭 700만원 / 파트너 월 100만원)
9. **FAQ** — 아코디언 형식 Q&A
10. **Final CTA** — 전환 유도 섹션

---

## 🖥 현재 실행 상태

![한끗프로젝트 랜딩 페이지](C:/Users/yeki7/.gemini/antigravity/brain/9d9243eb-e873-4903-b4c3-fb49bd9b0141/main_page_loaded_1779071883372.png)

> **개발 서버**: `http://localhost:8080/` 에서 정상 실행 중

---

## 📋 프로젝트 문서

- [PRD_v1.md](file:///e:/%EA%BF%88%EB%AA%B0%EB%8B%A4/%EC%99%B8%EB%B6%80%EC%82%AC%EC%97%85/2026/%EB%AA%A8%EB%91%90%EC%9D%98%EC%97%B0%EA%B5%AC%EC%86%8C/career-translate-lab/docs/PRD_v1.md) — 제품 요구 사양서
- [SRS_v1.md](file:///e:/%EA%BF%88%EB%AA%B0%EB%8B%A4/%EC%99%B8%EB%B6%80%EC%82%AC%EC%97%85/2026/%EB%AA%A8%EB%91%90%EC%9D%98%EC%97%B0%EA%B5%AC%EC%86%8C/career-translate-lab/docs/SRS_v1.md) — 소프트웨어 요구 사양서
- [ARCHITECTURE.md](file:///e:/%EA%BF%88%EB%AA%B0%EB%8B%A4/%EC%99%B8%EB%B6%80%EC%82%AC%EC%97%85/2026/%EB%AA%A8%EB%91%90%EC%9D%98%EC%97%B0%EA%B5%AC%EC%86%8C/career-translate-lab/docs/ARCHITECTURE.md) — 아키텍처 가이드
- [UX_FLOW.md](file:///e:/%EA%BF%88%EB%AA%B0%EB%8B%A4/%EC%99%B8%EB%B6%80%EC%82%AC%EC%97%85/2026/%EB%AA%A8%EB%91%90%EC%9D%98%EC%97%B0%EA%B5%AC%EC%86%8C/career-translate-lab/docs/UX_FLOW.md) — UX 플로우
