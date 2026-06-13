---
version: alpha
name: 한끗프로젝트-design-system
description: 시니어 경력자를 위한 프리미엄 에디토리얼 컨설팅 랜딩 사이트. Royal Blue(#0123B4)를 단일 브랜드 컬러로 사용하고, SCDream(ExtraBold weight 800)으로 헤드라인의 권위를 세우며 Body는 SCDream Light(weight 300)로 읽기 편한 호흡을 유지한다. 전체적으로 화이트 캔버스 위에 에디토리얼 섹션들이 교대 배치되며, 라운드 카드(rounded-2xl / 3xl)와 full-pill CTA 버튼이 신뢰감 있는 프리미엄 톤을 형성한다.

colors:
  primary: "hsl(230, 99%, 35%)"         # Royal Blue #0123B4
  primary-foreground: "hsl(0, 0%, 100%)"
  accent: "hsl(230, 99%, 35%)"          # accent = primary (같은 Royal Blue)
  accent-foreground: "hsl(0, 0%, 100%)"
  accent-soft: "hsl(230, 60%, 94%)"     # 연한 블루 워시
  background: "hsl(0, 0%, 100%)"        # 순백 캔버스
  foreground: "hsl(220, 20%, 14%)"      # 본문 잉크 — 순수 블랙 대신 다크 네이비
  surface: "hsl(220, 20%, 98%)"         # 카드/폼 배경
  secondary: "hsl(220, 16%, 96%)"       # 세컨더리 타일 배경
  secondary-foreground: "hsl(220, 20%, 14%)"
  muted: "hsl(220, 14%, 94%)"           # 비활성/약한 배경
  muted-foreground: "hsl(220, 10%, 40%)"  # 캡션, 힌트 텍스트
  card: "hsl(0, 0%, 100%)"             # 카드 기본 배경
  card-foreground: "hsl(220, 20%, 14%)"
  popover: "hsl(0, 0%, 100%)"
  popover-foreground: "hsl(220, 20%, 14%)"
  destructive: "hsl(0, 65%, 45%)"       # 에러/파괴적 빨강
  destructive-foreground: "hsl(0, 0%, 100%)"
  border: "hsl(220, 14%, 89%)"          # 기본 보더
  input: "hsl(220, 14%, 89%)"           # 인풋 보더
  ring: "hsl(230, 99%, 35%)"            # 포커스 링 (= primary)
  footer-bg: "#ffffff"                   # 푸터 배경 (순백)
  footer-text: "#0123b4"                # 푸터 텍스트 (직접 Royal Blue)

typography:
  hero-display:
    fontFamily: "'SCDream', 'Pretendard', 'Noto Sans KR', sans-serif"
    fontSize: 72px (lg) / 56px (md) / 40px (base)
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: -0.02em
  display-lg:
    fontFamily: "'SCDream', 'Pretendard', 'Noto Sans KR', sans-serif"
    fontSize: 48px (lg) / 40px (md) / 32px (base)
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: -0.02em
  display-md:
    fontFamily: "'SCDream', 'Pretendard', 'Noto Sans KR', sans-serif"
    fontSize: 40px (md) / 30px (base)
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: -0.02em
  section-heading:
    fontFamily: "'SCDream', 'Pretendard', 'Noto Sans KR', sans-serif"
    fontSize: 36px (md) / 30px (base)
    fontWeight: 800
    lineHeight: 1.33
    letterSpacing: -0.02em
  card-title:
    fontFamily: "'SCDream', 'Pretendard', 'Noto Sans KR', sans-serif"
    fontSize: 30px (md) / 24px (base)
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: -0.02em
  lead:
    fontFamily: "'SCDream', 'Pretendard', 'Noto Sans KR', sans-serif"
    fontSize: 20px (md) / 18px (base)
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: 0
  body:
    fontFamily: "'SCDream', 'Pretendard', 'Noto Sans KR', sans-serif"
    fontSize: 18px (md) / 16px (base)
    fontWeight: 300
    lineHeight: 1.6
    letterSpacing: 0
  body-strong:
    fontFamily: "'SCDream', 'Pretendard', 'Noto Sans KR', sans-serif"
    fontSize: 18px (md) / 16px (base)
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: 0
  caption:
    fontFamily: "'SCDream', 'Pretendard', 'Noto Sans KR', sans-serif"
    fontSize: 14px
    fontWeight: 300
    lineHeight: 1.5
    letterSpacing: 0
  caption-strong:
    fontFamily: "'SCDream', 'Pretendard', 'Noto Sans KR', sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
  micro:
    fontFamily: "'SCDream', 'Pretendard', 'Noto Sans KR', sans-serif"
    fontSize: 12px
    fontWeight: 300
    lineHeight: 1.4
    letterSpacing: 0
  numbered-label:
    fontFamily: "monospace"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: 0.22em
    textTransform: uppercase

rounded:
  none: 0px
  sm: 6px           # calc(var(--radius) - 4px) ≈ 10px
  md: 12px          # calc(var(--radius) - 2px) ≈ 12px
  lg: 14px          # var(--radius) = 0.875rem ≈ 14px
  xl: 16px          # rounded-xl (Tailwind)
  2xl: 16px         # rounded-2xl — 주력 카드 코너
  3xl: 24px         # rounded-3xl — 프리미엄 카드 코너
  full: 9999px      # rounded-full — pill 형태 CTA

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  section: 96px (py-24) / 128px (py-32)

shadows:
  soft: "0 1px 2px hsl(230 40% 20% / 0.05), 0 8px 24px -12px hsl(230 40% 20% / 0.10)"
  elevated: "0 1px 2px hsl(230 40% 20% / 0.06), 0 24px 48px -24px hsl(230 50% 25% / 0.20)"

components:
  cta-button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.full}"
    padding: 16px 32px
    shadow: shadow-md
    hover: "scale(1.05), bg-primary/90"
    active: "scale(0.95)"
    icon: ArrowRight (20px, 0.9 opacity)
  cta-button-ghost:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    border: "2px solid {colors.border}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.full}"
    padding: 16px 32px
    hover: "scale(1.05), border-primary, bg-primary/5"
    active: "scale(0.95)"
    icon: ArrowRight (20px, 0.9 opacity)
  nav-cta-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 10px 20px
    shadow: shadow-soft
    hover: "bg-primary/90"
  nav-cta-outline:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    border: "1px solid primary/30"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 10px 20px
    hover: "bg-primary/5"
  button-default:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.caption-strong}"
    rounded: "{rounded.md}"
    height: 40px
    padding: 8px 16px
    hover: "bg-primary/90"
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.destructive-foreground}"
    rounded: "{rounded.md}"
    hover: "bg-destructive/90"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: foreground
    border: "1px solid {colors.input}"
    rounded: "{rounded.md}"
    hover: "bg-accent, text-accent-foreground"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.md}"
    hover: "bg-secondary/80"
  button-ghost:
    backgroundColor: transparent
    hover: "bg-accent, text-accent-foreground"
  button-link:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    textDecoration: "underline on hover"
  global-nav:
    backgroundColor: "bg-background/85 (scrolled) / bg-background/60 (top)"
    backdropFilter: "blur(12px)"
    height: "64px (mobile) / 80px (desktop)"
    border-bottom: "transparent (top) → border-border/70 (scrolled)"
    position: sticky top-0 z-40
  global-nav-logo:
    fontFamily: "{typography.hero-display.fontFamily}"
    fontSize: "20px (md) / 18px (base)"
    fontWeight: 800
    textColor: "{colors.primary}"
    letterSpacing: tight
  hero-badge:
    backgroundColor: "accent/10"
    textColor: "{colors.accent}"
    border: "1px solid accent/20"
    typography: "{typography.caption-strong}"
    rounded: "{rounded.full}"
    padding: 6px 16px
    shadow: shadow-sm
    icon: Sparkles (16px)
  editorial-section:
    padding: "96px 0 (py-24) / 128px 0 (py-32)"
  editorial-section-alt:
    backgroundColor: "secondary/40"
    padding: "96px 0 (py-24)"
  editorial-section-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    padding: "96px 0 (py-24) / 128px 0 (py-32)"
  editorial-section-accent-wash:
    backgroundColor: "primary/5"
    padding: "96px 0 (py-24)"
  section-header:
    eyebrow: "{typography.numbered-label}"
    heading: "{typography.section-heading}"
    headingColor: "{colors.primary}"
    description: "{typography.body}"
    descriptionColor: "foreground/70"
    maxWidth: 768px (max-w-3xl)
  editorial-card:
    backgroundColor: "{colors.card}"
    border: "1px solid {colors.border}"
    rounded: "var(--radius)"
    padding: "28px (p-7) / 36px (p-9) on md"
    shadow: shadow-soft
  content-card:
    backgroundColor: "{colors.background}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.2xl}"
    padding: 32px (p-8)
    shadow: shadow-sm
    hover: shadow-md
  content-card-emphasized:
    backgroundColor: "primary/5"
    border: "2px solid {colors.accent}"
    rounded: "{rounded.2xl}"
    padding: 32px (p-8)
    shadow: shadow-md
  content-card-dark:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    border: "1px solid primary-foreground/10"
    rounded: "{rounded.2xl}"
    padding: 32px (p-8)
    shadow: shadow-xl
    transform: "md:scale(1.05)"
  pricing-card:
    backgroundColor: "{colors.background}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.3xl}"
    padding: "24px (p-6) / 32px (p-8) on md"
    shadow: shadow-sm
  pricing-card-featured:
    backgroundColor: "{colors.background}"
    border: "2px solid {colors.accent}"
    rounded: "{rounded.3xl}"
    padding: "24px (p-6) / 32px (p-8) on md"
    shadow: shadow-lg
    badge: "absolute top-0 -translate-y-1/2, bg-accent text-white, rounded-full"
  pricing-card-cta-primary:
    backgroundColor: "{colors.accent}"
    textColor: white
    rounded: "{rounded.xl}"
    padding: "14px 0 (w-full)"
    shadow: shadow-lg
    hover: "bg-accent/90"
  pricing-card-cta-outline:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.xl}"
    padding: "14px 0 (w-full)"
    hover: "border-primary"
  product-confirm-card:
    backgroundColor: "#F0EFFB"
    border-left: "5px solid #1E2D8C"
    rounded: "{rounded.2xl}"
    padding: "24px (p-6) / 40px (p-10) on lg"
    shadow: shadow-sm
  icon-circle:
    backgroundColor: "accent/10"
    textColor: "{colors.accent}"
    rounded: "{rounded.full}"
    size: "48px (w-12 h-12) / 64px (w-16 h-16)"
  step-number-circle:
    backgroundColor: "{colors.accent}"
    textColor: white
    rounded: "{rounded.full}"
    size: 56px (w-14 h-14)
    border: "4px solid white"
    shadow: shadow-md
    typography: "font-extrabold text-2xl"
  score-gauge:
    size: 200px
    strokeWidth: 6px
    trackColor: "hsl(var(--border))"
    fillColor: "hsl(var(--accent))"
    transition: "stroke-dashoffset 1s ease-out"
    scoreTypography: "{typography.display-lg}, font-serif"
    labelTypography: "font-mono, text-xs, tracking-widest"
  comparison-table-dark:
    backgroundColor: "white/10"
    border: "1px solid white/20"
    rounded: "{rounded.3xl}"
    cellPadding: 24px (p-6)
    cellBorder: "1px solid white/10"
  comparison-card-mobile:
    backgroundColor: "white/5"
    border: "1px solid white/15"
    rounded: "{rounded.2xl}"
    padding: 20px (p-5)
    hover: "bg-white/10"
  accordion-item:
    backgroundColor: white
    border: "1px solid {colors.border}"
    rounded: "{rounded.xl}"
    padding: "0 24px (px-6)"
    openShadow: shadow-sm
    triggerTypography: "font-bold text-primary"
    triggerPadding: 24px 0 (py-6)
    contentTypography: "text-foreground/80, text-base, leading-relaxed"
  input-default:
    backgroundColor: "{colors.background}"
    border: "1px solid {colors.input}"
    rounded: "{rounded.md}"
    height: 40px
    padding: "8px 12px"
    focus: "ring-2 ring-ring ring-offset-2"
    placeholderColor: "{colors.muted-foreground}"
  input-tall:
    height: 48px (h-12)
    fontSize: 16px (text-base)
  badge-default:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
    fontSize: 12px
    fontWeight: 600
  badge-outline:
    backgroundColor: transparent
    border: "1px solid currentColor"
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
  dialog:
    overlayBg: "black/80"
    contentBg: "{colors.background}"
    border: "1px solid {colors.border}"
    rounded: "lg (sm breakpoint)"
    padding: 24px (p-6)
    shadow: shadow-lg
    animation: "fade-in + zoom-in-95 + slide-in"
  locked-section:
    contentFilter: "blur(6px)"
    overlayBg: "background/60"
    overlayIcon: Lock (32px, accent)
    ctaLayout: "flex-wrap gap-2 justify-center"
  footer:
    backgroundColor: white
    textColor: "#0123b4"
    padding: "48px 0 (py-12) / 64px 0 (py-16)"
    border-top: "1px solid {colors.border}"
    infoTextSize: 14px
    phoneSize: "36px (md) / 30px (base)"
    copyrightColor: "#0123b4 / 60%"
  gold-divider:
    background: "linear-gradient(90deg, transparent, hsl(var(--accent)/0.6), transparent)"
    height: 1px
  numbered-label:
    layout: "inline-flex items-center gap-3"
    numberFont: "font-mono"
    lineElement: "h-px w-8 bg-accent/60"
    textColor: "{colors.muted-foreground}"
    letterSpacing: 0.22em
    textTransform: uppercase
---

## Overview

한끗프로젝트 웹사이트는 **시니어 경력 전문가(30년차 이상)의 경력 자산화 컨설팅 서비스**를 위한 프리미엄 에디토리얼 랜딩 사이트다. 디자인 전략은 "신뢰감 있는 프리미엄 컨설팅 브랜드"를 구현하는 데 집중한다.

전체 인터페이스는 순백 캔버스(`{colors.background}`) 위에 에디토리얼 섹션들을 세로로 교대 배치하는 구조다. 섹션 간 리듬은 `white → secondary/40(회색 워시) → white → primary(Royal Blue 다크) → white → primary/5(연한 블루 워시)`의 5가지 서피스 톤이 교대하며 만들어진다. 별도의 구분선이나 그림자 없이, **배경색 변화 자체가 섹션 구분자** 역할을 한다.

타이포그래피는 SCDream 서체 하나로 통일되며, weight 300(Light) / 500(Medium) / 800(ExtraBold)의 3단계 웨이트만 사용한다. 헤드라인은 항상 weight 800 + letter-spacing -0.02em으로 "한국어에 맞는 타이트한 확신"을 표현한다. Body는 weight 300으로 "편안한 읽기" 호흡을 유지한다. Weight 400·600·700은 의도적으로 배제한다.

인터랙션 컬러는 단일 Royal Blue(`{colors.primary}` — `hsl(230, 99%, 35%)` ≈ #0123B4)로 모든 링크, 버튼, 강조, 포커스 링을 처리한다. 두 번째 브랜드 컬러는 존재하지 않는다 — accent 토큰도 primary와 동일한 값이다.

버튼 문법은 두 가지: **full-pill CTA**(`{rounded.full}` — 9999px)가 주요 행동 신호이고, **rounded-xl 카드 내 버튼**이 보조 행동이다. 모든 pill CTA에는 ArrowRight 아이콘이 후행한다.

**Key Characteristics:**
- 한국어 서체(SCDream) 기반 에디토리얼 디자인 — 영문 산세리프가 아닌 한글 전용 서체로 브랜드 정체성을 구축.
- 단일 브랜드 컬러(Royal Blue #0123B4)로 모든 인터랙티브 요소를 통합. 보조 컬러 없음.
- 교대 배치 에디토리얼 섹션: white ↔ secondary/40 ↔ primary(dark) ↔ primary/5(wash).
- 라운드 카드(2xl/3xl) + full-pill CTA가 프리미엄 톤을 형성.
- 프로스티드 글래스 네비게이션 — `backdrop-filter: blur(12px)` + 반투명 배경.
- 섹션 넘버링 시스템 — `NumberedLabel`로 01/02/03… 에디토리얼 진행 감각 부여.
- `word-break: keep-all` — 한국어 줄바꿈 최적화 전역 적용.
- 무료 진단 → 상담 → 유료 프로그램의 퍼널 전환 UI 설계.

## Colors

> **Color system**: HSL 기반 CSS custom properties. Tailwind `hsl(var(--token))` 패턴으로 참조. 모든 색상은 `:root`에 HSL 값만 정의하고, Tailwind 유틸리티에서 `hsl(var(--xxx))`로 조합한다.

### Brand & Accent
- **Royal Blue** (`{colors.primary}` — `hsl(230, 99%, 35%)` ≈ #0123B4): 단일 브랜드 컬러. 모든 CTA, 링크, 포커스 링, 히어로 헤드라인 색상, 다크 섹션 배경을 이 하나의 컬러로 처리한다. 두 번째 브랜드 컬러는 의도적으로 존재하지 않는다.
- **Accent** (`{colors.accent}` — primary와 동일): 배지, 아이콘 서클, 체크 아이콘 등 시맨틱하게 'accent'로 참조되지만, 실제 값은 Royal Blue와 동일하다.
- **Accent Soft** (`{colors.accent-soft}` — `hsl(230, 60%, 94%)`): 연한 블루 워시. 히어로 배지 배경, 아이콘 서클 배경에 사용.

### Surface
- **Pure White** (`{colors.background}` — `hsl(0, 0%, 100%)`): 주 캔버스. 히어로, 프로세스, FAQ, 폼 등 기본 섹션의 배경.
- **Surface** (`{colors.surface}` — `hsl(220, 20%, 98%)`): 로그인 카드, 코칭 대시보드 등 약간의 깊이를 부여할 때 사용.
- **Secondary Wash** (`{colors.secondary}/40` — `hsl(220, 16%, 96%)` at 40%): 교대 배치 섹션의 "회색 워시" 배경. 값 비교, 왜 한끗인가, 단계별 상품 섹션에 사용.
- **Primary Tint** (`primary/5`): 산출물 섹션의 연한 블루 워시 배경.
- **Royal Blue Dark** (`{colors.primary}`): 다크 섹션 배경 — 비교 테이블, 최종 CTA. 텍스트는 `{colors.primary-foreground}`(white)로 전환.
- **Product Confirm Lavender** (`#F0EFFB`): 신청 확인 카드 전용 연보라 배경.

### Text
- **Foreground** (`{colors.foreground}` — `hsl(220, 20%, 14%)`): 기본 본문 텍스트. 순수 블랙(#000) 대신 다크 네이비를 사용하여 사진적(photographic) 느낌을 유지.
- **Foreground/80, /70, /60, /50**: Tailwind opacity 유틸리티로 생성하는 투명도 계단. 서브 카피(80%), 세컨더리 설명(70%), 힌트(60%), 로그인 링크(50%).
- **Primary Foreground** (`{colors.primary-foreground}` — white): 다크 섹션(primary 배경)에서의 모든 텍스트.
- **Muted Foreground** (`{colors.muted-foreground}` — `hsl(220, 10%, 40%)`): 캡션, 서브라벨, NumberedLabel 텍스트.
- **Footer Text** (`#0123b4`): 푸터에서 직접 하드코딩된 Royal Blue — HSL 변수가 아닌 직접 hex.

### Hairlines & Borders
- **Border** (`{colors.border}` — `hsl(220, 14%, 89%)`): 카드, 인풋, 아코디언, 구분선 등 모든 1px 보더의 기본 톤.
- **Border/70, /60**: 스크롤 시 네비게이션 하단 보더, 히어로 영역 통계 구분선에 사용하는 연한 변형.
- **Input** (`{colors.input}` — border와 동일): 인풋 필드 보더.

### Dark Mode
다크모드가 CSS에 정의되어 있으나, 프로덕션에서는 사용하지 않는다. 정의된 다크모드 토큰:
- Background: `hsl(220, 40%, 6%)` — 매우 짙은 다크 네이비.
- Foreground: `hsl(40, 33%, 97%)` — 따뜻한 오프화이트.
- Accent: `hsl(36, 38%, 60%)` — 골드 브론즈(Royal Blue 대신).
- 다크모드 정의는 존재하지만 런타임에서 `.dark` 클래스가 적용되지 않으므로, 실질적으로 라이트 전용 시스템이다.

### Brand Gradient
**단일 장식 그래디언트만 존재:** `linear-gradient(90deg, transparent, hsl(var(--accent)/0.6), transparent)` — `gold-rule` 유틸리티 클래스로 1px 수평 구분선에 사용. 히어로 배경 장식에는 `bg-gradient-to-bl from-accent/20 to-transparent`의 블러 오브(blur orb)가 사용되지만, 이는 CSS gradient가 아닌 대형 블러 원형 div다.

## Typography

### Font Family
- **Primary (Display + Body)**: `'SCDream', 'Pretendard', 'Noto Sans KR', system-ui, -apple-system, sans-serif` — SC제일은행에서 제작한 한글 전용 서체. 라운드 없는 직선적 형태로, 전문성과 신뢰감을 표현.
- **Monospace** (NumberedLabel 숫자): `font-mono` — 시스템 모노스페이스. 섹션 넘버(01, 02, 03)에만 제한적으로 사용.
- **Font files**: SCDream3.otf (Light 300), SCDream5.otf (Medium 500), SCDream8.otf (ExtraBold 800). `@font-face`로 직접 로딩, `font-display: swap`.
- **OpenType features**: `font-feature-settings: "ss01", "tnum"` — 대체 스타일셋 1, 타뷸러(고정폭) 숫자.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.hero-display}` | `clamp(2.5rem, 5vw+1rem, 4.5rem)` | 800 | 1.15 | -0.02em | 히어로 헤드라인. "30년을 일했는데" 같은 1차 주목 카피 |
| `{typography.display-lg}` | `clamp(1.875rem, 3vw+0.75rem, 3rem)`| 800 | 1.25 | -0.02em | 최종 CTA 헤드라인, 다크 섹션 핵심 카피 |
| `{typography.section-heading}` | 36px → 30px | 800 | 1.33 | -0.02em | 섹션 h2 — "혼자 6개월, 한끗과 함께라면 6주" |
| `{typography.card-title}` | 30px → 24px | 800 | 1.3 | -0.02em | 카드 내 제목 — 방법론 스텝, 산출물 명칭 |
| `{typography.lead}` | 20px → 18px | 500 | 1.6 | 0 | 히어로 서브 카피, 섹션 설명문 |
| `{typography.body}` | 18px → 16px | 300 | 1.6 | 0 | 기본 본문. 카드 설명, FAQ 답변, 폼 라벨 |
| `{typography.body-strong}` | 18px → 16px | 500 | 1.6 | 0 | 강조 본문. CTA 버튼 텍스트, 카드 내 소제목 |
| `{typography.caption}` | 14px | 300 | 1.5 | 0 | 캡션, 힌트, 메타 정보 |
| `{typography.caption-strong}` | 14px | 500 | 1.5 | 0 | 배지 텍스트, 네비게이션 CTA |
| `{typography.micro}` | 12px | 300 | 1.4 | 0 | 저작권, 면책, 세부 조건 |
| `{typography.numbered-label}` | 12px | mono 400 | 1.0 | 0.22em | 섹션 넘버 ("01 — 시간 대비 성과") |

### Principles

- **Weight 300이 기본이다.** Body 전체가 weight 300(SCDream3 Light)으로 렌더링된다. 이것은 의도적인 선택 — SCDream의 Light weight가 한글에서 가장 편안한 가독성을 제공하기 때문이다.
- **Weight 800이 모든 헤드라인을 담당한다.** h1–h4, `.font-serif`로 마킹된 모든 제목은 weight 800(ExtraBold). Weight 600·700은 사용하지 않는다.
- **Weight 500은 중간 강조 전용.** Body-strong, lead 텍스트, 배지 등 "본문보다 약간 강조"가 필요한 곳에만 사용.
- **letter-spacing -0.02em은 헤드라인 전용.** h1–h4에만 적용. Body와 caption에는 letter-spacing을 주지 않는다.
- **`word-break: keep-all` 전역 적용.** 한국어 단어 단위 줄바꿈을 보장. `break-keep` 유틸리티가 추가로 중요 카피에 명시적으로 적용됨.
- **`-webkit-font-smoothing: antialiased` + `text-rendering: optimizeLegibility`**: 고해상도 디스플레이에서의 서체 렌더링 최적화.

### Note on Font Substitutes
SCDream은 SC제일은행 전용 서체다. 라이선스 제한 시:
- **Pretendard** (Google Fonts): 첫 번째 폴백. 모던 한글 고딕 서체로, weight 300/500/800 매핑이 가장 유사.
- **Noto Sans KR** (Google Fonts): 두 번째 폴백. Google의 범용 한글 서체.
- SCDream과 Pretendard 간의 차이: SCDream은 글자 폭이 약간 좁고 직선적이므로, Pretendard 사용 시 `letter-spacing`을 -0.01em 추가로 타이트닝하면 유사한 느낌을 재현할 수 있다.

## Layout

### Spacing System
- **Base unit:** 4px. Tailwind의 default spacing scale 사용 (4px → 1unit).
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.2xl}` 48px · `{spacing.section}` 96–128px.
- **Section vertical padding:** `py-24` (96px) 표준 섹션, `py-32` (128px) 히어로 및 프리미엄 섹션. 섹션 간 여백 0 — 배경색 전환이 구분자.
- **Card padding:** `p-8` (32px) 표준, `p-6` (24px) 모바일, `p-10` (40px) 프리미엄/히어로 카드.
- **Container:** `.container-prose` = `mx-auto w-full max-w-6xl px-6 md:px-10`. 최대 너비 1152px (72rem).

### Grid & Container
- **Max content width:** 1152px (`max-w-6xl`). 일부 섹션은 `max-w-5xl` (1024px), `max-w-4xl` (896px), `max-w-3xl` (768px), `max-w-2xl` (672px)을 사용.
- **Column patterns:**
  - 히어로: 단일 컬럼 중앙 정렬.
  - 비교 카드: 3-column (`md:grid-cols-3`).
  - 프로세스 스텝: 4-column (`md:grid-cols-4`).
  - 산출물/가격: 4-column (`lg:grid-cols-4 md:grid-cols-2`).
  - 진단 리포트 점수: 2-column (`md:grid-cols-2`).
  - 폼 필드: 2-column (`md:grid-cols-2`).
- **Gutters:** `gap-6` (24px) 카드 그리드, `gap-8` (32px) 프리미엄 카드 그리드, `gap-4` (16px) 폼 요소.

### Whitespace Philosophy
한끗프로젝트의 여백은 "컨설팅 브로슈어의 격조"를 재현한다. 히어로 섹션은 상단 80–128px의 padding으로 시작하여, 텍스트와 CTA 사이에 40px 이상의 여백을 확보한다. 섹션 h2 아래에는 항상 16–24px의 설명문 여백 후 64px의 콘텐츠 간격이 존재한다. 카드 내부는 32–40px의 padding으로 콘텐츠가 "숨 쉴 공간"을 확보한다.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | 보더 없음, 그림자 없음 | 히어로 섹션, 에디토리얼 본문, 풀블리드 다크 섹션 |
| Hairline | 1px `{colors.border}` border | 표준 카드, 인풋, 아코디언, 가격 카드 |
| Soft shadow | `{shadows.soft}` | 에디토리얼 카드, 리포트 점수 카드, 네비 CTA, 히어로 배지 |
| Medium shadow | `shadow-md` (Tailwind default) | CTA 버튼, 스텝 넘버 서클 |
| Elevated shadow | `{shadows.elevated}` | 다크 강조 카드 (md:scale(1.05) 적용 시), 다크 CTA |
| XL shadow | `shadow-xl` (Tailwind default) | 프라이싱 featured 카드, pill CTA on dark backgrounds |

**Shadow philosophy.** 한끗의 그림자 사용은 절제적이다. 대부분의 카드는 `shadow-sm`(Tailwind 기본)에 `hover:shadow-md` 전환을 사용한다. 커스텀 `shadow-soft`는 HSL 기반으로 차가운 블루 톤을 적용하여 브랜드 컬러와의 조화를 유지한다. 강한 그림자는 강조 카드(`shadow-xl`)와 최종 CTA 버튼에만 사용된다.

### Decorative Depth
- **히어로 블러 오브:** `bg-gradient-to-bl from-accent/20 to-transparent blur-3xl` — 대형 원형 div로 구현, z-index -10. 히어로와 서비스 페이지 배경에 미묘한 글로우 효과.
- **Radial gradient:** 다크 CTA 섹션에서 `bg-[radial-gradient(ellipse_at_center,...)] from-accent/20 to-transparent` — 중앙에서 퍼지는 은은한 빛 효과.
- **프로스티드 네비게이션:** `backdrop-blur-md` + 반투명 배경. 스크롤 시 `bg-background/85`로 전환되며 하단 보더가 나타나는 트랜지션.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.md}` | 12px | 기본 UI 버튼(shadcn Button), 인풋 필드, 셀렉트 |
| `{rounded.lg}` | 14px | shadcn Card 컴포넌트, 에디토리얼 카드 |
| `{rounded.xl}` | 16px | 아코디언 아이템, 로그인 카드 인풋, 가격 카드 CTA |
| `{rounded.2xl}` | 16px | 주력 콘텐츠 카드 — 비교, 산출물, 방법론, 점수 카드 |
| `{rounded.3xl}` | 24px | 프리미엄 카드 — 가격 테이블, 로그인 카드 외곽, 방법론 스텝 |
| `{rounded.full}` | 9999px | Pill CTA 버튼, 히어로 배지, 아이콘 서클, 네비 CTA, 스텝 넘버 |

### Photography & Imagery
- **프로필 사진**: `rounded-3xl shadow-lg object-cover` — 풀 너비 최대 md, 3xl 코너 라운딩.
- **배경 장식**: CSS gradient 기반 블러 오브 — 실제 이미지 에셋 없이 코드로 구현.
- **아이콘**: Lucide React 아이콘 라이브러리 전용. 커스텀 SVG 없음.
- **색상 원형 불릿**: `w-2.5 h-2.5 rounded-full bg-accent` — 리스트 아이템 앞 장식 점.

## Components

### Top Navigation

**`global-nav`** — 프로스티드 글래스 스타일의 스티키 네비게이션. `sticky top-0 z-40`, `backdrop-blur-md`. 스크롤 전: `bg-background/60`, 보더 없음. 스크롤 8px 이후: `bg-background/85`, `border-b border-border/70`. 높이 `h-16` (모바일) / `h-20` (데스크톱).

좌측: 로고 "한끗프로젝트" — `font-serif text-lg md:text-xl font-bold text-primary tracking-tight`.

중앙: 데스크톱 전용 네비 링크 (`lg:flex gap-8`). 링크 기본: `text-sm text-foreground/80 hover:text-foreground`. 활성 상태: `text-sm text-primary font-bold border-b-2 border-accent pb-0.5`.

우측: 두 개의 pill CTA + 로그인 링크.
- "경력 가치 진단" — `{component.nav-cta-primary}`.
- "무료 상담 신청" — `{component.nav-cta-outline}`.
- "로그인" — `text-xs text-foreground/50 hover:text-primary underline underline-offset-4`.

모바일: `lg:hidden` 햄버거 (Menu/X 아이콘 토글). 열리면 전체 너비 메뉴 드로어.

### Buttons

**`cta-button-primary`** — 시그니처 액션 버튼. `bg-primary text-primary-foreground`, `rounded-full`, `px-8 py-4`, `text-base md:text-lg font-bold`. 후행 `ArrowRight` 아이콘(20px). `hover:scale-105`, `active:scale-95`, `shadow-md`. 히어로, 최종 CTA, 서비스 페이지에서 사용.

**`cta-button-ghost`** — 보조 CTA. `border-2 border-border text-primary bg-transparent`, `rounded-full`, `px-8 py-4`. `hover:border-primary hover:bg-primary/5`. 히어로에서 "무료 상담 신청하기"로 사용.

**`nav-cta-primary`** — 네비 내 주 CTA. 위와 동일 컬러 + pill이지만, 더 작은 사이즈: `px-5 py-2.5 text-sm rounded-full shadow-soft`.

**`nav-cta-outline`** — 네비 내 보조 CTA. `border border-primary/30 text-primary`, `px-5 py-2.5 text-sm rounded-full`. `hover:bg-primary/5`.

**`pricing-card-cta-primary`** — 가격 카드 내 주 CTA. `w-full py-3.5 rounded-xl font-bold bg-accent text-white shadow-lg`. `hover:bg-accent/90`.

**`pricing-card-cta-outline`** — 가격 카드 내 보조 CTA. `w-full py-3.5 rounded-xl font-bold border border-border text-primary`. `hover:border-primary`.

**`form-submit`** — 폼 제출 버튼. `bg-[#1E2D8C] text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-lg`. `hover:bg-[#1E2D8C]/90 hover:shadow-xl`. 비활성: `disabled:opacity-60 disabled:cursor-not-allowed`.

**`dark-section-cta`** — 다크(primary) 배경 위의 CTA. 두 가지 변형:
- 강조: `bg-accent text-white border-2 border-white/90 rounded-full px-10 py-5 shadow-lg hover:scale-105`.
- 보조: `bg-white text-primary rounded-full px-10 py-5 shadow-lg hover:scale-105`.

### Cards & Containers

**`content-card`** — 범용 콘텐츠 카드. `bg-background border border-border p-8 rounded-2xl shadow-sm`. `hover:shadow-md transition-shadow`. 비교 카드, 산출물 카드, 프로세스 스텝, 진단 점수 카드에 사용.

**`content-card-emphasized`** — 강조 콘텐츠 카드. `bg-primary/5 border-2 border-accent p-8 rounded-2xl shadow-md`. "한끗과 함께" 같은 추천 옵션에 사용.

**`content-card-dark`** — 다크 콘텐츠 카드. `bg-primary text-primary-foreground p-8 md:p-10 rounded-2xl shadow-xl border border-primary-foreground/10`. `md:scale-105`. "시장이 선택하는 자산" 같은 아웃풋 카드에 사용.

**`editorial-card`** — 에디토리얼 카드 (Editorial.tsx). `bg-card border border-border rounded-[var(--radius)] shadow-soft p-7 md:p-9`. section-header 등과 함께 사용.

**`pricing-card`** — 가격 테이블 카드. `bg-background border border-border p-6 md:p-8 rounded-3xl shadow-sm flex flex-col`. 내부 구조: STEP 라벨 → 상품명(font-serif 3xl–4xl) → 가격 → 기간 → hr → 체크리스트 → CTA.

**`pricing-card-featured`** — 강조 가격 카드. `border-2 border-accent shadow-lg`. 상단에 절대 위치 배지: `bg-accent text-white px-4 py-1 rounded-full text-xs font-bold`. "시작은 여기서" 태그.

**`product-confirm-card`** — 신청 확인 카드. `bg-[#F0EFFB] rounded-2xl border-l-[5px] border-l-[#1E2D8C] shadow-sm`. 좌측 5px 어센트 바가 시각적 앵커.

**`comparison-table-dark`** — 데스크톱 비교 테이블 (다크 섹션). `bg-white/10 rounded-3xl border border-white/20`. 3-column 그리드, 셀 간 `border-b border-white/10`.

**`comparison-card-mobile`** — 모바일 비교 카드. `bg-white/5 border border-white/15 rounded-2xl p-5`. `hover:bg-white/10`.

**`methodology-card`** — 방법론 스텝 카드 (Service.tsx). `bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-md`. 좌측 대형 넘버(font-serif 6xl–7xl text-accent/30) + 우측 본문.

### Editorial Primitives

**`numbered-label`** — 섹션 에디토리얼 넘버링. `inline-flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-accent`. 숫자(font-mono) → 8px 라인(h-px w-8 bg-accent/60) → 텍스트(text-muted-foreground). 예: `01 — 시간 대비 성과`.

**`section-header`** — 섹션 표준 헤더 구조. NumberedLabel 위 → h2(font-serif 3xl/4xl text-primary mt-4) → description(text-foreground/70 text-lg mt-5). max-w-3xl.

**`gold-divider`** — 1px 수평 그래디언트 구분선. `linear-gradient(90deg, transparent, hsl(var(--accent)/0.6), transparent)`. 폼 섹션 간 구분에 사용.

**`hero-badge`** — 히어로 상단 작은 배지. `bg-accent/10 text-accent border border-accent/20 rounded-full px-4 py-1.5 text-sm font-bold shadow-sm`. Sparkles 아이콘 선행.

### Inputs & Forms

**`input-default`** — 기본 인풋. `h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm`. Focus: `ring-2 ring-ring ring-offset-2`. 한끗 폼에서는 `h-12 text-base`로 오버라이드하여 더 큰 터치 타겟 제공.

**`textarea`** — 멀티라인 인풋. 인풋과 동일한 보더/라운딩. `rows={4-6}`, `text-base leading-[1.7]`.

**`radio-group-item`** — Radix UI RadioGroup 기반. 원형 라디오 버튼.

**`checkbox`** — Radix UI Checkbox 기반. 체크 시 `bg-primary` 채움.

**`form-field`** — 폼 필드 래퍼. 라벨(`text-base font-bold text-foreground`) + 힌트(`text-sm text-foreground/50 leading-relaxed`) + 인풋 + 에러(`text-sm text-red-500 font-medium`). 필수 필드에 `*` 빨간색 표시.

**`privacy-consent`** — 개인정보 동의 영역. `bg-secondary/40 border border-border rounded-xl p-5`. 체크박스 + 동의 텍스트 + 접기/펼치기 상세 안내.

### Free Diagnosis Components

**`analysis-loading`** — 진단 분석 로딩. `pulse-spinner` 애니메이션 (3중 펄스 링 + 중앙 코어). `progress-animate` (12초 프로그래스 바). 순차 `text-fade-in` 메시지.

**`locked-section`** — 잠금 콘텐츠. `filter: blur(6px)` + `user-select: none` + `pointer-events: none`. 오버레이: Lock 아이콘(32px accent) + 안내 텍스트 + 두 개의 pill CTA (무료 상담 / 유료 진단).

**`score-card`** — 진단 점수 카드. `bg-background border border-border rounded-2xl p-6 shadow-soft`. 아이콘 서클 + 라벨 + 점수(font-serif 2xl) + 프로그래스 바(h-2 bg-border rounded-full → bg-accent fill, 1s ease-out transition) + 코멘트.

### Footer

**`footer`** — `bg-white text-[#0123b4]`. `border-t border-border`. `py-12 md:py-16`. 좌측: 브랜드명(text-lg md:text-xl font-bold) + 연락처·주소·사업자정보(text-sm text-[#0123b4]/80). 우측: "CUSTOMER SERVICE" 라벨 + 전화번호(text-3xl md:text-4xl font-bold tracking-tight) + 운영시간. 하단 저작권: `text-[#0123b4]/60 text-xs`.

## Do's and Don'ts

### Do
- 모든 인터랙티브 요소에 `{colors.primary}`(Royal Blue)를 사용한다 — 링크, pill CTA, 포커스 링, 배지, 체크 아이콘 모두 하나의 컬러.
- 헤드라인은 항상 SCDream weight 800 + `letter-spacing: -0.02em`. 이 조합이 브랜드의 "확신 있는 전문가" 톤.
- Body는 SCDream weight 300 — 가독성과 편안함의 균형.
- 교대 배치 섹션을 유지한다: white → secondary/40 → white → primary(dark) → primary/5. 배경색 변화가 구분자.
- Pill CTA(`rounded-full`)에는 항상 ArrowRight 아이콘을 후행한다. 이것이 "행동 신호".
- 콘텐츠 카드는 `rounded-2xl` 또는 `rounded-3xl`로 프리미엄 느낌을 유지.
- `transform: scale(1.05)` hover + `scale(0.95)` active를 pill CTA에 적용 — 시스템 전반의 마이크로 인터랙션.
- `word-break: keep-all` + `break-keep`을 모든 한국어 카피에 적용.
- 네비게이션은 항상 프로스티드 글래스(`backdrop-blur-md` + 반투명 배경).

### Don't
- 두 번째 브랜드 컬러를 도입하지 않는다. 모든 인터랙션은 Royal Blue 하나로 통합.
- Weight 400·600·700을 사용하지 않는다. 시스템의 웨이트 사다리는 300/500/800 고정.
- Body 텍스트에 `letter-spacing`을 적용하지 않는다 — letter-spacing은 헤드라인 전용(-0.02em).
- 카드에 `rounded-md` 이하의 작은 코너를 사용하지 않는다 — 최소 `rounded-2xl`이 프리미엄 기준.
- 그래디언트를 장식 배경으로 사용하지 않는다 — `gold-rule` 구분선과 히어로 블러 오브만 예외.
- HSL 변수 대신 hex 하드코딩을 하지 않는다 — 푸터의 `#0123b4`와 ProductConfirmCard의 `#1E2D8C`, `#F0EFFB`는 레거시 예외이며, 새로운 코드에서는 항상 `hsl(var(--xxx))` 토큰을 사용한다.
- 순수 블랙(`#000000`)을 텍스트에 사용하지 않는다 — 항상 `{colors.foreground}`(다크 네이비)를 사용.
- 다크모드를 프로덕션에 노출하지 않는다 — 토큰은 정의되어 있지만 현재 라이트 전용.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | 단일 컬럼, hero h1 40px, CTA 풀 너비, nav 햄버거 |
| Small tablet | 640–767px | `sm:` — CTA 가로 배치 시작, 폼 2-column, 체크박스 그리드 2-column |
| Tablet | 768–1023px | `md:` — hero h1 56px, 카드 그리드 2-column, nav 높이 80px, 섹션 패딩 128px |
| Desktop | 1024–1279px | `lg:` — hero h1 72px, 카드 그리드 3–4 column, 네비 풀 확장, max-w-6xl 콘텐츠 |
| Wide desktop | ≥ 1280px | 콘텐츠 max-w-6xl (1152px) 고정, 양쪽 마진 흡수 |

### Touch Targets
- Pill CTA: ~48 × 120px+ (py-4 px-8). 충분한 터치 영역.
- Nav CTA: ~40 × 100px (py-2.5 px-5).
- 햄버거 버튼: 44 × 44px (p-2).
- 폼 인풋: h-12 (48px) — 모바일 터치 최적화.
- 체크박스/라디오: Radix UI 기본 크기 + 라벨 전체가 터치 영역.

### Collapsing Strategy
- **네비게이션**: `lg:flex` — 1024px 이상에서 풀 확장 링크 + CTA 표시. 이하에서 햄버거로 축소.
- **히어로**: 단일 컬럼 유지. 타이포그래피만 `text-4xl → text-6xl → text-7xl`로 스케일.
- **카드 그리드**: `lg:grid-cols-4 → md:grid-cols-2 → grid-cols-1`.
- **비교 테이블**: 데스크톱은 3-column 테이블 (`hidden md:block`), 모바일은 개별 카드 스택 (`block md:hidden`).
- **CTA 배치**: `flex-col sm:flex-row` — 모바일에서 수직 스택, 태블릿 이상에서 수평.

### Animation Behavior
- **`fade-in`**: `opacity 0→1, translateY 12px→0, 0.7s ease-out`. 히어로 진입 시 사용.
- **`text-fade-in`**: `opacity 0→1, translateY 8px→0, 0.6s ease-out`. 진단 로딩 메시지.
- **Accordion**: `accordion-down/up 0.2s ease-out` — Radix 높이 전환.
- **호버 전환**: 모든 카드 `transition-shadow`, 모든 CTA `transition-all duration-200`.
- **진단 로딩**: `pulse-spinner` (2s 무한 루프) + `progress-animate` (12s 선형 진행).

## Iteration Guide

1. 하나의 컴포넌트에 집중하라. YAML 키로 직접 참조 (`{component.cta-button-primary}`, `{component.content-card}`).
2. 기존 컴포넌트의 변형(`-emphasized`, `-dark`, `-featured`)은 별도 항목으로 관리한다.
3. 항상 `{token.refs}`를 사용하라 — hex 인라인 금지. `hsl(var(--xxx))` 토큰 패턴 준수.
4. Hover 문서화하되, Focus/Active도 함께 명시. 특히 pill CTA의 `scale(0.95)` active state.
5. 헤드라인은 SCDream 800 + `-0.02em`. Body는 SCDream 300. 이 경계는 절대 불변.
6. 새로운 색상 도입 전에, `primary/N%` opacity 변형으로 해결 가능한지 먼저 검토.
7. 의심스러우면: 배경색 교대(white → secondary/40 → primary)로 시각적 구분을 만들어라 — 보더나 그림자보다 먼저.

## Known Gaps

### ✅ 해결 완료

- **Hex 하드코딩 제거** — `ProductConfirmCard`, `ApplyForm`, `Footer`의 `#1E2D8C`, `#0123b4`, `#F0EFFB`를 `primary`, `product-confirm` 토큰으로 통일 완료.
- **서체 라이선스 문서화** — `FONTS-LICENSE.md` 작성. SCDream 상업적 사용 및 self-hosting 허용 확인.
- **Toast/Sonner 브랜드 커스터마이징** — `rounded-2xl`, `shadow-soft`, `primary` 컬러, 에러/성공/경고 변형 적용 완료.
- **진단 전용 CSS 모듈 분리** — `pulse-spinner`, `locked-section`, `progress-animate`, `text-fade-in`을 `src/styles/diagnosis.css`로 분리. `index.css`는 공통 유틸리티만 관리.
- **에러·성공·경고 토큰 추가** — `--error-bg`, `--error-border`, `--success`, `--success-bg`, `--warning`, `--warning-bg` CSS 변수 정의.
- **`--product-confirm` 토큰 추가** — `#F0EFFB` 대응 연보라 배경을 HSL 토큰으로 관리.

- **다크모드** — 사용하지 않는 `.dark` 관련 CSS 토큰 제거를 통해 코드 경량화 및 라이트 테마 전용 체제로 확정.
- **에러 컴포넌트화** — `<FieldError>`, `<ErrorBox>` 공통 컴포넌트 추출 후 폼(`ApplyForm`, `Login`, `Consultation`)에 일괄 적용.
- **Fluid Typography** — `clamp()` 기반의 `text-fluid-hero` 유틸리티 추가 및 헤드라인 계단식 폰트 크기 변경 현상 개선.
- **Admin 페이지 스펙** — 데이터 관리용 레이아웃 규칙을 정의한 `DESIGN-admin.md` 분리 문서화 완료.
- **코칭 워크스페이스 스펙** — 앱 라이크 UI에 최적화된 규칙을 정의한 `DESIGN-coaching.md` 분리 문서화 완료.

### 🔲 잔여 항목

- 현재 발견된 주요 디자인 시스템 누락(Gaps) 및 하드코딩 이슈는 모두 해결되었습니다.
