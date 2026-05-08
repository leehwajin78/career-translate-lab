# 꿈몰다 브랜드 매니지먼트 — Premium Consultation Web App

A premium Korean consultation-conversion web app with an AI-style diagnostic funnel for 5060 executives and experts.

## Design System

**Palette (HSL tokens in `index.css`)**
- Ivory background `#FBF9F4`, pure white surfaces
- Deep navy primary `#0E1B33`
- Warm gray text/secondary `#6B6358`
- Muted gold accent `#B8945A` (used sparingly for emphasis, dividers, score arcs)
- Soft shadow + 1px hairline borders for editorial card feel

**Typography**
- Headings: Noto Serif KR (editorial, mature)
- Body/UI: Pretendard / Noto Sans KR
- Generous line-height, large hero type, restrained weights (400/500/700)

**Layout language**
- Wide whitespace, max-w-6xl content, section padding ~120px desktop
- Cards: white, 1px warm border, 16px radius, subtle shadow
- Gold hairline dividers, numbered section labels (e.g. "01 — 문제 인식")
- Subtle fade-in on scroll, no flashy motion

All colors live as HSL CSS variables; Tailwind tokens consume them. No raw hex in components.

## Routes

- `/` — Landing (all marketing sections)
- `/diagnosis` — 16-question diagnostic funnel
- `/result` — AI-style result report
- `/consultation` — Consultation application form
- `/admin` — Leads dashboard prototype

Smooth-scroll anchors on `/` for nav items (서비스 소개, 진단하기, 진행 과정, 산출물, 패키지, 상담 신청).

## Landing Page Sections (`/`)

1. **Top nav** — sticky, ivory/blur, logo "꿈몰다 브랜드 매니지먼트", 6 anchor links, gold-outline primary CTA "브랜딩 준비도 진단" → `/diagnosis`
2. **Hero** — "경력을 무대로 번역합니다" + sub + supporting copy, two CTAs (진단 / 상담), trust line "28년 …"
3. **Problem** — 4 editorial cards in 2×2 grid with numbered labels
4. **Diagnostic intro** — title, description, large gold CTA → `/diagnosis`
5. **Core service concept** — Input → Engine → Output horizontal flow diagram (3 columns, gold connector lines)
6. **Process** — 4-stage vertical timeline with coaching session badges between Stage 1–2 and Stage 3–4
7. **Deliverables** — 8 cards in 4×2 grid, each with icon, title, italic descriptor
8. **Packages** — 2 large side-by-side cards (Package A, Package B with "RECOMMENDED" gold ribbon), price line "프리미엄 1:1 서비스 / 상담 후 맞춤 안내"
9. **Why 꿈몰다** — 4 trust cards
10. **Final CTA band** — navy background, gold accent, "오래 쌓아온 경력은…" + 진단 CTA
11. **Footer** — minimal, brand line + contact

## Diagnostic Funnel (`/diagnosis`)

- Single-page step flow, **one question per screen** (premium pacing, not a quiz)
- Top progress: "정체성 진단 · 3 / 16" with thin gold progress bar and category label
- Each step: large category tag, question (serif), helper text, large textarea, gentle hint "정답은 없습니다. 짧아도 괜찮습니다…"
- Back / 다음 buttons, keyboard friendly
- Questions mapped to 7 categories (정체성·핵심가치·강점·스토리·타깃·채널·WHY) per spec
- Step 17: contact form (이름, 연락처, 이메일, 현재 분야) before report
- Submit → compute mock score + type → navigate to `/result` with state

**Scoring logic (rule-based, AI-ready)**
- Per-answer score from textarea length + keyword presence (직함, 가치, 경험 keywords table)
- Aggregate to 5 dimensions (정체성 언어, 핵심가치, 전문성 포지셔닝, 타깃 명확도, 시장 진입 자산) → 0–100 total
- Type assignment by dimension profile:
  - low identity → 직함 의존형
  - high content / low synthesis → 경험 나열형
  - high target clarity / low self-recognition → 숨은 전문성형
  - balanced + execution gap → 시장 진입 준비형
- Package recommendation rule: score < 65 or identity weak → 브랜드 포지셔닝 패키지; otherwise → VVIP 시그니처 매니지먼트

Logic isolated in `src/lib/diagnostic.ts` with a single `analyze(answers)` function so a future AI call can replace it.

## Result Page (`/result`)

Sections in order:
- A. 준비도 요약 — large circular score gauge (gold arc), "현재 브랜딩 준비도: XX점", one-line interpretation
- B. 진단 유형 — featured card: type name, description, what this means for you
- C. 핵심 진단 결과 — 5 cards (현재 상태 / 리스크 / 다음 단계)
- D. 추천 패키지 — single highlighted package card with reasoning
- E. CTA — "진단 결과 기반 1:1 상담 신청" → `/consultation` (passes diagnostic context)

If user lands on `/result` without state, show empty state + link to take diagnostic.

## Consultation Form (`/consultation`)

- Editorial form, sectioned with thin gold dividers
- Fields per spec: 이름, 연락처, 이메일, 현재 직함/분야, 주요 경력 (textarea), 관심 목적 (multi-checkbox 8 options), 현재 가장 어려운 점 (textarea), 원하는 결과물 (multi-checkbox 5), 상담 희망 방식 (radio 3), 개인정보 동의
- zod schema validation, friendly Korean error messages, length caps
- On submit: store lead in local state (Zustand store persisted to localStorage), show success panel with the exact success copy from spec
- If diagnostic data exists in state, attach score/type/recommended package to lead automatically

## Admin Prototype (`/admin`)

- Simple table listing all stored leads from local store
- Columns: 이름, 연락처, 점수, 진단 유형, 추천 패키지, 상태, 메모, 작성일
- Status select per row with 6 options (신규 리드 → 보류)
- Inline editable 메모 field
- No auth now, but page wrapped in `<AdminGate>` placeholder component returning children — easy to swap for real auth later
- Empty state when no leads

## State & Data

- `src/store/diagnostic.ts` — Zustand store: answers, contact, computed result
- `src/store/leads.ts` — Zustand persisted store: leads list, status updates, memo
- `src/lib/diagnostic.ts` — pure analysis function (swap-in point for AI)
- `src/data/content.ts` — all Korean copy (questions, problem cards, deliverables, packages, etc.) so edits are centralized
- All forms use react-hook-form + zod (already standard)

## Component Inventory

Reusable: `SectionHeader`, `NumberedLabel`, `EditorialCard`, `GoldDivider`, `ProgressBar`, `ScoreGauge`, `StageTimeline`, `PackageCard`, `CTABand`, `Nav`, `Footer`, `DiagnosticStep`, `ResultDimensionCard`, `LeadRow`.

## Out of Scope (prepared for later)

- Real Supabase persistence (store layer is the seam)
- Real AI generation (analyze function is the seam)
- Real admin auth (AdminGate is the seam)
- Email/SMS notifications on submission

## Technical Notes

- React + Vite + Tailwind + TypeScript (existing stack)
- Routing: `react-router-dom` already wired in `App.tsx` — add 4 routes
- Smooth scroll: native `scroll-behavior: smooth` + anchor IDs
- Fonts loaded via `<link>` in `index.html` (Noto Serif KR, Pretendard)
- Fully responsive: mobile = single column, stacked nav with sheet, one-question-per-card flow already mobile-friendly
- HSL design tokens in `index.css`; Tailwind config extended with `serif` font + accent palette
- No client-side logging of form data
