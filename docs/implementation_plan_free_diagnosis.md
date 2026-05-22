# 경력 가치 무료 진단 페이지 — 리디자인 구현 계획서

> **작성일:** 2026-05-21  
> **대상 경로:** `/diagnosis` (경력 가치 무료 진단받기 버튼 클릭 시)  
> **상태:** 🟡 계획 수립 완료 — 구현 대기

---

## 1. 목표

### 1-1. 비즈니스 목표

| 항목 | 설명 |
|------|------|
| **핵심 목적** | 무료 진단을 통해 잠재 고객의 **이메일 리드를 확보**하고, AI 분석 레포트로 **WOW 경험**을 제공한 뒤, **한끗 유료 코칭으로 전환**시키는 리드 퍼널 구축 |
| **타깃 사용자** | 5060 고경력 전문가 (퇴직·전환기 임원, 연구원, 전문직) |
| **소요 시간** | 5~8분 |
| **핵심 원칙** | 무료 진단은 **충분히 인상적이어야 하되, 완결되면 안 된다** |

### 1-2. 전환 전략

```
무료 진단 (WOW 경험)
  → "내 경력의 가치가 이렇게 보이는구나"
  → "그런데 가장 중요한 것은 한끗 코칭에서 완성된다"
  → 유료 서비스 전환
```

### 1-3. 성과 KPI

| 지표 | 목표 |
|------|------|
| 무료 진단 완료율 | 70% 이상 |
| 이메일 수집률 | 95% (선수집 방식) |
| 레포트 → 한끗 전환 | 10~15% |
| 팔로업 이메일 전환 | 추가 5% |

### 1-4. 현재 → 변경 비교

| 항목 | 현재 (`Diagnosis.tsx`) | 변경 후 |
|------|------------------------|---------|
| 질문 수 | 16문항 (7개 카테고리) | **7문항** (기획서 기반) |
| 사전 정보 | 없음 (마지막에 연락처 수집) | **이메일 선수집** (이름+이메일+경력연수) |
| 결과 화면 | `/result` 별도 라우트 | **동일 페이지 내 Step** (Screen 4) |
| 분석 방식 | 클라이언트 즉시 계산 | **AI 로딩 연출** (Screen 3) + 클라이언트 계산 |
| 전환 포인트 | 패키지 추천 | **진단 갭 + 잠금 섹션** → 한끗 코칭 CTA |
| 완료 화면 | 없음 | **이메일 발송 확인** (Screen 5) |

---

## 2. 변경할 화면 구조

전체 흐름은 **5개 화면(Step)**으로 구성되며, 단일 페이지(`/diagnosis`) 내에서 `step` 상태로 전환됩니다.

```
[Screen 1] 이메일 선수집
    ↓
[Screen 2] 진단 폼 (Q1 → Q2 → ... → Q7)
    ↓
[Screen 3] AI 분석 로딩 (약 12초 연출)
    ↓
[Screen 4] 경력 가치 레포트 (스크롤)
    ↓
[Screen 5] 완료 (이메일 발송 확인)
```

---

### Screen 1 — 이메일 선수집 화면

**목적:** 진단 시작 전 이메일을 먼저 받는다. **리드 확보**가 핵심.

| 요소 | 상세 |
|------|------|
| 상단 헤드라인 | "30년을 일했는데, 나를 소개하는 한 문장이 없습니다." (Bold, 큰 사이즈) |
| 서브텍스트 | "5~8분 안에 내 경력의 숨겨진 가치를 발견합니다." |
| 입력 필드 1 | 이름 (placeholder: "홍길동") |
| 입력 필드 2 | 이메일 (placeholder: "example@email.com") |
| 입력 필드 3 | 경력 연수 — 드롭다운 (5년 미만 / 5~10년 / 10~15년 / 15~20년 / 20~25년 / 25~30년 / 30년 이상) |
| 체크박스 | 개인정보 수집·이용 동의 (작은 텍스트) |
| CTA 버튼 | "무료 진단 시작하기" (Primary Blue, 전체 너비) |
| 하단 신뢰 지표 | "✓ 무료 ✓ 5~8분 완료 ✓ AI 즉시 분석" |

**유효성 검사:**
- 이름: 필수, 1~60자
- 이메일: 필수, 이메일 형식
- 경력 연수: 필수 선택
- 개인정보 동의: 필수 체크

---

### Screen 2 — 진단 폼 화면 (7문항 스텝 방식)

**목적:** 7개 질문을 한 번에 1개씩 보여주며 답변을 수집한다.

**공통 UI 구성:**

| 요소 | 상세 |
|------|------|
| 상단 진행 바 | "3 / 7" + 퍼센트 표시 (예: 43%) |
| 질문 번호 배지 | "Q3" (Blue 원형 배지) |
| 질문 텍스트 | 크고 명확하게 (font-serif, text-2xl md:text-4xl) |
| 작성 힌트 | 작은 사이즈로 질문 아래 (text-sm, text-muted-foreground) |
| 텍스트에어리어 | 세로 높이 충분히 (rows=8), 플레이스홀더, 글자 수 카운터 (/1500) |
| 하단 안내 | "💡 길게 쓸수록 더 정확한 진단이 나옵니다" |
| 버튼 2개 | [← 이전] (Secondary) + [다음 →] (Primary Blue) |

**7개 질문 상세:**

| # | 질문 텍스트 | 진단 영역 | 힌트 텍스트 | placeholder |
|---|------------|-----------|------------|-------------|
| Q1 | 지금 이 순간, 직함이나 회사 이름 없이 나는 어떤 사람이라고 소개하겠습니까? | 정체성 기준선 | 직업이나 역할이 아닌, 나라는 사람의 본질을 표현해 주세요 | 예: 사람들의 잠재력을 끌어내는 것을 좋아하는 사람... |
| Q2 | 지금까지 살아오면서 가장 자랑스러웠던 순간 3가지를 들려주세요. 결과보다 그 순간 어떤 감정이었는지를요. | 핵심 가치 추출 | 크고 거창한 성취가 아니어도 됩니다. 혼자만 아는 자랑스러움도 소중한 자산입니다 | 예: 1. 처음으로 팀원이 성장하는 모습을 봤을 때... |
| Q3 | 남들보다 자연스럽게 잘 되는 것, 에너지가 드는 게 아니라 그냥 되는 것 3가지는? | 핵심 강점 발굴 | "잘하는 것"을 묻는 게 아닙니다. 다른 사람들은 힘들어하는데 나는 그냥 되는 것이요 | 예: 1. 복잡한 상황을 정리해서 설명하는 것... |
| Q4 | 사람들이 나에게 조언이나 도움을 구하러 오는 분야는 주로 무엇인가요? | 자연 권위 영역 | 직업과 관련 없는 분야도 포함해서 써주세요 | 예: 커리어 방향 결정, 조직 갈등 해결... |
| Q5 | 나는 어떤 사람에게 가장 도움이 되고 싶나요? 직업이나 나이보다 어떤 마음 상태인지로요. | 이상적 타깃 인식 | "50대 CEO" 같은 정보 말고, 그 사람이 어떤 마음 상태인지로요 | 예: 능력은 있는데 어디서부터 시작해야 할지 막막한 사람... |
| Q6 | 같은 경력을 가진 사람들 중, 당신만이 가진 차별점은 무엇이라고 생각하세요? | 차별화 인식도 | "더 잘한다"가 아닌 "다르다"로 생각해 주세요. 모르겠다면 그것도 솔직하게 | 예: 기술과 사람 사이를 연결하는 시각... |
| Q7 | 내가 세상에 전하고 싶은 핵심 메시지는 무엇인가요? 한 문장으로요. | 브랜드 메시지 준비도 | 없거나 모르겠어도 괜찮습니다. 지금 이 순간 가장 솔직한 답을 써주세요 | 예: 경험은 나이가 아니라 관점의 깊이입니다... |

---

### Screen 3 — AI 분석 로딩 화면

**목적:** 기대감을 높이면서 분석 중임을 보여준다.

| 요소 | 상세 |
|------|------|
| 중앙 애니메이션 | 펄스 원형 (Royal Blue 톤, CSS 애니메이션) |
| 메인 텍스트 | "AI가 경력 가치를 분석 중입니다..." (Bold) |
| 서브 텍스트 | 3초 간격 순차 전환 (fade 애니메이션) |
| 진행률 바 | 0% → 100% (12초간 애니메이션) |
| 하단 텍스트 | "약 1~2분 소요됩니다. 창을 닫지 마세요." |

**순차 메시지 (3초 간격):**
1. "30년의 경험을 분석하고 있어요"
2. "숨겨진 강점을 발굴하고 있어요"
3. "당신만의 차별화 포인트를 찾고 있어요"
4. "경력 가치 레포트를 생성 중이에요"

**타이밍:**
- 총 12초 후 자동으로 Screen 4로 전환
- 실제 API 호출 없음 (클라이언트 측 분석 + 연출)

---

### Screen 4 — 경력 가치 레포트 화면

**목적:** 진단 결과를 보여주고 한끗 유료 서비스로 전환시킨다.

**전체 구조 (스크롤 방식, 위→아래):**

#### [헤더]
- 이름 + 타입 배지: "{이름} 님의 경력 가치 레포트" + "📦 준비형 브랜더" 배지
- 총점: "경력 가치 점수 72점 / 100점"

#### [Section 1] 경력 가치 점수
- 4개 영역 점수 카드 (가로 2×2 그리드)
  - 정체성 명확도: 65점
  - 강점 자산 인식도: 78점
  - 타깃 설계도: 42점
  - 차별화 인식도: 38점
- 각 카드에 점수 + 짧은 코멘트 한 줄
- 점수 바 (프로그래스 바 형태)

#### [Section 2] 당신이 빛나는 순간의 공통점
- 강조 박스 (파란색 배경): "당신이 가장 빛나는 순간에는 항상 '성장'과 '동반'이 있었습니다"
- 아래 설명 텍스트 2~3줄 (Q2 답변 기반 AI 해석)

#### [Section 3] 아직 브랜드로 만들지 못한 3가지 자산
- 카드 3개 (세로 리스트)
  - 강점명 + "이것이 희귀한 이유" 한 줄 코멘트
- 하단 플래그: "이 3가지를 원라이너로 압축하는 작업이 남아있습니다"

#### [Section 4] 사람들이 이미 당신에게서 찾고 있는 것
- 아이콘 + 텍스트 블록 (Q4 자연 권위 영역 분석 결과)

#### [Section 5] ⚠️ 진단 갭 — 아직 완성되지 않은 3가지
- 갭 3개 카드 (amber/orange 테두리):
  - **타깃 갭:** "당신이 도우려는 사람이 아직 흐릿합니다"
  - **차별화 갭:** "차별점이 있지만 언어가 없습니다"
  - **메시지 갭:** "전하고 싶은 것은 있지만 한 문장이 아닙니다"
- 각 갭 카드 하단: "→ 한끗 코칭에서 해결됩니다"

#### [Section 6] 🔒 브랜드 원라이너 초안 (잠금)
- 블러 처리된 텍스트 박스
- 🔒 아이콘 + "한끗 진단에서만 완성됩니다"
- [한끗 진단 신청하기] 버튼

#### [Section 7] 🔒 이상적 고객 페르소나 (잠금)
- 블러 처리된 텍스트 박스
- 🔒 아이콘 + "한끗 진단에서만 완성됩니다"
- [한끗 진단 신청하기] 버튼

#### [CTA 섹션 — 하단]
- 배경: Primary Blue
- 헤드라인: "경력 가치는 있습니다. 아직 언어가 없을 뿐입니다."
- 서브: "브랜드 원라이너, 고객 페르소나, 핵심 메시지 — 한끗 코칭에서 완성합니다."
- 버튼 2개:
  - 메인: [한끗 진단 신청하기] (White Button on Blue)
  - 서브: [레포트 이메일로 받기] (Ghost Button) → Screen 5로 이동

---

### Screen 5 — 완료 화면 (이메일 발송 확인)

**목적:** 레포트 이메일 발송 완료 확인 + 한끗 서비스 최종 유도

| 요소 | 상세 |
|------|------|
| 중앙 아이콘 | 파란색 원형(64px) + 흰색 체크 |
| 헤드라인 | "레포트가 이메일로 발송됐습니다" |
| 서브 텍스트 | "{email}으로 발송됐어요. 스팸함도 확인해 주세요." |
| 구분선 | — |
| 추가 CTA 박스 | "더 깊은 분석을 원하신다면" + [한끗 진단 신청하기] 버튼 (Blue) |
| 하단 텍스트 | "3일 후 추가 인사이트 이메일을 보내드릴게요" |

---

## 3. 수정 예정 파일 목록

### 신규 생성 파일

| 파일 경로 | 역할 |
|----------|------|
| `src/components/free-diagnosis/EmailCollect.tsx` | Screen 1 — 이메일 선수집 컴포넌트 |
| `src/components/free-diagnosis/DiagnosisForm.tsx` | Screen 2 — 7문항 스텝 폼 컴포넌트 |
| `src/components/free-diagnosis/AnalysisLoading.tsx` | Screen 3 — AI 분석 로딩 컴포넌트 |
| `src/components/free-diagnosis/Report.tsx` | Screen 4 — 경력 가치 레포트 컴포넌트 |
| `src/components/free-diagnosis/Complete.tsx` | Screen 5 — 완료 화면 컴포넌트 |
| `src/store/freeDiagnosticStore.ts` | 무료 진단 전용 Zustand store |
| `src/lib/freeDiagnostic.ts` | 무료 진단 전용 분석 로직 |

### 수정 파일

| 파일 경로 | 변경 내용 |
|----------|----------|
| `src/pages/Diagnosis.tsx` | 기존 16문항 → 5개 화면 스텝 컨트롤러로 전면 재작성 |
| `src/data/content.ts` | `FREE_DIAGNOSTIC_QUESTIONS`, `FREE_DIAGNOSIS_TYPES`, `CAREER_YEAR_OPTIONS` 상수 추가 |
| `src/index.css` | 로딩 애니메이션, 블러 잠금, 진행률 바 CSS 추가 |

### 유지 (변경 없음)

| 파일 경로 | 이유 |
|----------|------|
| `src/App.tsx` | `/diagnosis` 라우트 이미 존재, 변경 불필요 |
| `src/pages/Result.tsx` | 기존 16문항 결과용, 당분간 유지 |
| `src/store/diagnostic.ts` | 기존 16문항 store, 기존 코드 백업용 유지 |
| `src/lib/diagnostic.ts` | 기존 16문항 분석 로직, 유지 |
| `src/components/site/*` | Layout, Nav, Footer 등 공통 컴포넌트 변경 없음 |

---

## 4. 컴포넌트 설계

### 4-1. 전체 구조

```
Diagnosis.tsx (페이지 컨트롤러)
├── step === "email"    → <EmailCollect />
├── step === "form"     → <DiagnosisForm />
├── step === "loading"  → <AnalysisLoading />
├── step === "report"   → <Report />
└── step === "complete" → <Complete />
```

### 4-2. 컴포넌트별 상세

#### `Diagnosis.tsx` (페이지 컨트롤러)

```
역할: 5개 화면의 전환을 관리하는 최상위 컨트롤러
상태: freeDiagnosticStore의 step을 구독
렌더링: step 값에 따라 해당 컴포넌트를 조건부 렌더링
```

#### `EmailCollect.tsx`

```
Props: onNext() — 이메일 수집 완료 후 호출
내부 상태: name, email, careerYears, agreedPrivacy
유효성: zod 스키마 (이름 필수, 이메일 형식, 경력연수 필수, 동의 필수)
액션: 유효성 통과 시 → store에 lead 저장 → onNext() 호출
```

#### `DiagnosisForm.tsx`

```
Props: onNext() — 7문항 완료 후 호출, onBack() — Screen 1로 복귀
내부 상태: currentQuestion (0~6)
Store 연동: answers 읽기/쓰기
UI: 진행 바 + 질문 배지 + 질문 + 힌트 + 텍스트에어리어 + 버튼
Q7 다음 클릭 시 → onNext() 호출
```

#### `AnalysisLoading.tsx`

```
Props: onComplete() — 로딩 완료 후 호출
내부 로직:
  - useEffect로 12초 타이머 시작
  - 3초 간격으로 메시지 인덱스 전환 (0→1→2→3)
  - 진행률 바 0→100% CSS 애니메이션
  - 12초 후 store.analyze() 호출 → onComplete()
```

#### `Report.tsx`

```
Props: onSendEmail() — "레포트 이메일로 받기" 클릭 시 호출
Store 연동: result, lead 읽기
렌더링: Section 1~7 + CTA (스크롤 페이지)
잠금 섹션: CSS blur + overlay
```

#### `Complete.tsx`

```
Props: 없음
Store 연동: lead.email 읽기
렌더링: 체크 아이콘 + 발송 확인 메시지 + CTA
```

### 4-3. 디자인 토큰 (기존 스타일 유지)

| 토큰 | 값 | 용도 |
|------|-----|------|
| Primary | `hsl(230 99% 35%)` / `#0123B4` | CTA 버튼, 헤딩, 배지 |
| Primary Foreground | `hsl(0 0% 100%)` | 버튼 텍스트 |
| Accent | `hsl(230 99% 35%)` | 진행 바, 하이라이트 |
| Warning | `amber/orange` 계열 | 진단 갭 카드 테두리 |
| Font Heading | SCDream 800 | 헤드라인, 질문 텍스트 |
| Font Body | SCDream 300 | 본문, 힌트 |
| Container | `container-prose` (max-w-6xl) | 레이아웃 |
| Card | `bg-background border-border rounded-2xl shadow-soft` | 카드 |
| Button Primary | `bg-primary text-primary-foreground rounded-full` | CTA |
| Button Ghost | `border border-primary/30 text-primary rounded-full` | 보조 버튼 |

---

## 5. 데이터 구조

### 5-1. content.ts에 추가할 상수

```typescript
// 무료 진단 7문항
export interface FreeDiagnosticQuestion {
  id: number;                    // 1~7
  question: string;              // 질문 텍스트
  hint: string;                  // 힌트 텍스트
  placeholder: string;           // 텍스트에어리어 placeholder
  diagnosticArea: FreeDiagnosticArea;  // 진단 영역
}

export type FreeDiagnosticArea =
  | "identity"           // 정체성 기준선
  | "coreValues"         // 핵심 가치 추출
  | "strengths"          // 핵심 강점 발굴
  | "authority"          // 자연 권위 영역
  | "targetAudience"     // 이상적 타깃 인식
  | "differentiation"    // 차별화 인식도
  | "message";           // 브랜드 메시지 준비도

export const FREE_DIAGNOSTIC_QUESTIONS: FreeDiagnosticQuestion[] = [
  // Q1~Q7 (위 Screen 2 표 참조)
];

// 경력 연수 옵션
export const CAREER_YEAR_OPTIONS = [
  "5년 미만", "5~10년", "10~15년", "15~20년",
  "20~25년", "25~30년", "30년 이상"
];

// 브랜딩 준비도 유형 4가지
export type FreeDiagnosisType = "explorer" | "preparer" | "transitioner" | "executor";

export const FREE_DIAGNOSIS_TYPES: Record<FreeDiagnosisType, {
  name: string;
  emoji: string;
  description: string;
  ctaMessage: string;
}> = {
  explorer: {
    name: "탐색형 브랜더",
    emoji: "🔍",
    description: "아직 방향을 찾는 중. 경력의 가치가 있다는 건 알지만 어떻게 표현해야 할지 모릅니다.",
    ctaMessage: "한끗 진단으로 방향을 찾아드립니다",
  },
  preparer: {
    name: "준비형 브랜더",
    emoji: "📦",
    description: "재료는 있지만 정리가 안 됐습니다. 강점도 있고 경험도 있는데 하나의 언어로 묶이지 않은 상태.",
    ctaMessage: "한끗 진단으로 정리해드립니다",
  },
  transitioner: {
    name: "전환형 브랜더",
    emoji: "🔄",
    description: "변화의 시기에 있습니다. 지금까지와 다른 다음 챕터를 알고 있지만 구체적 언어가 없습니다.",
    ctaMessage: "한끗 진단으로 전환을 설계합니다",
  },
  executor: {
    name: "실행형 브랜더",
    emoji: "🚀",
    description: "실행만 남았습니다. 자신이 누구인지 알고 누구를 돕는지도 압니다. 다만 세상이 알아듣는 언어로 정리되지 않았습니다.",
    ctaMessage: "한끗 진단으로 완성합니다",
  },
};
```

### 5-2. freeDiagnosticStore.ts (Zustand Store)

```typescript
interface FreeDiagnosticState {
  // 현재 화면 단계
  step: "email" | "form" | "loading" | "report" | "complete";

  // Screen 1: 리드 정보
  lead: {
    name: string;
    email: string;
    careerYears: string;
  } | null;
  agreedPrivacy: boolean;

  // Screen 2: 7문항 답변
  answers: Record<number, string>;   // { 1: "답변1", 2: "답변2", ... }
  currentQuestion: number;            // 0~6 (내부 인덱스)

  // Screen 4: 분석 결과
  result: FreeDiagnosticResult | null;

  // Actions
  setStep: (step: FreeDiagnosticState["step"]) => void;
  setLead: (lead: FreeDiagnosticState["lead"]) => void;
  setAgreedPrivacy: (agreed: boolean) => void;
  setAnswer: (questionId: number, value: string) => void;
  setCurrentQuestion: (index: number) => void;
  analyze: () => FreeDiagnosticResult;
  reset: () => void;
}
```

### 5-3. freeDiagnostic.ts (분석 로직)

```typescript
interface FreeDiagnosticResult {
  // 총점
  totalScore: number;          // 0~100

  // 유형
  type: FreeDiagnosisType;     // "explorer" | "preparer" | "transitioner" | "executor"
  typeInfo: { name: string; emoji: string; description: string; ctaMessage: string };

  // 4개 영역 점수
  scores: {
    identity: number;          // 정체성 명확도 (Q1 + Q7)
    strengths: number;         // 강점 자산 인식도 (Q2 + Q3)
    target: number;            // 타깃 설계도 (Q4 + Q5)
    differentiation: number;   // 차별화 인식도 (Q6)
  };

  // Section 2: 빛나는 순간의 공통점 (Q2 분석)
  shiningMoment: {
    keywords: [string, string];   // 핵심 가치 키워드 2개
    description: string;          // 설명 텍스트
  };

  // Section 3: 브랜드화 못한 3가지 자산 (Q3 분석)
  hiddenAssets: Array<{
    name: string;
    rarity: string;              // "이것이 희귀한 이유"
  }>;

  // Section 4: 사람들이 찾고 있는 것 (Q4 분석)
  naturalAuthority: {
    area: string;
    description: string;
  };

  // Section 5: 진단 갭 3가지
  gaps: {
    target: string;              // 타깃 갭 (Q5 분석)
    differentiation: string;     // 차별화 갭 (Q6 분석)
    message: string;             // 메시지 갭 (Q7 분석)
  };

  // Section 6~7: 잠금 콘텐츠 (블러용 더미 텍스트)
  locked: {
    oneLiner: string;            // 블러 처리될 원라이너 초안
    persona: string;             // 블러 처리될 페르소나 초안
  };
}
```

### 5-4. 점수 계산 로직

```
4개 영역 점수 계산 기준:

정체성 명확도 (Q1 + Q7):
  - 직함형 답변 → 20점
  - 가치형 답변 → 60점
  - 구체적 언어형 → 100점

강점 자산 인식도 (Q2 + Q3):
  - 막연함 → 20점
  - 부분 인식 → 50점
  - 3개 이상 구체적 → 80점

타깃 설계도 (Q4 + Q5):
  - "모든 사람" → 15점
  - 직업형 → 40점
  - 마음 상태형 → 80점 이상

차별화 인식도 (Q6):
  - "모르겠다" → 10점
  - 경력 기반 → 40점
  - 방법론 차별화 → 80점 이상

총점 = (정체성 + 강점 + 타깃 + 차별화) / 4

유형 분류:
  - 0~40점: 🔍 탐색형
  - 40~60점: 📦 준비형
  - 60~80점: 🔄 전환형
  - 80점 이상: 🚀 실행형
```

---

## 6. 적용 단계

### Phase 1: 데이터 & 로직 레이어 (먼저)

| 순서 | 작업 | 파일 |
|------|------|------|
| 1-1 | `content.ts`에 무료 진단 상수 추가 | `src/data/content.ts` |
| 1-2 | 무료 진단 분석 로직 생성 | `src/lib/freeDiagnostic.ts` |
| 1-3 | 무료 진단 Zustand store 생성 | `src/store/freeDiagnosticStore.ts` |

### Phase 2: CSS 애니메이션 추가

| 순서 | 작업 | 파일 |
|------|------|------|
| 2-1 | 펄스 스피너 키프레임 | `src/index.css` |
| 2-2 | 블러 잠금 섹션 스타일 | `src/index.css` |
| 2-3 | 진행률 바 애니메이션 | `src/index.css` |
| 2-4 | 순차 텍스트 페이드 | `src/index.css` |

### Phase 3: 5개 서브 컴포넌트 생성

| 순서 | 작업 | 파일 |
|------|------|------|
| 3-1 | Screen 1 — 이메일 선수집 | `src/components/free-diagnosis/EmailCollect.tsx` |
| 3-2 | Screen 2 — 7문항 폼 | `src/components/free-diagnosis/DiagnosisForm.tsx` |
| 3-3 | Screen 3 — AI 분석 로딩 | `src/components/free-diagnosis/AnalysisLoading.tsx` |
| 3-4 | Screen 4 — 레포트 | `src/components/free-diagnosis/Report.tsx` |
| 3-5 | Screen 5 — 완료 | `src/components/free-diagnosis/Complete.tsx` |

### Phase 4: 페이지 컨트롤러 교체

| 순서 | 작업 | 파일 |
|------|------|------|
| 4-1 | `Diagnosis.tsx` 전면 재작성 | `src/pages/Diagnosis.tsx` |

### Phase 5: 테스트 & 검증

| 순서 | 작업 |
|------|------|
| 5-1 | `npm run dev`로 전체 플로우 확인 |
| 5-2 | Screen 1 유효성 검증 테스트 |
| 5-3 | Screen 2 진행/이전 네비게이션 테스트 |
| 5-4 | Screen 3 로딩 애니메이션 + 타이밍 확인 |
| 5-5 | Screen 4 레포트 렌더링 + 블러 잠금 확인 |
| 5-6 | Screen 5 이메일 표시 확인 |
| 5-7 | 반응형 (모바일/태블릿/데스크톱) 확인 |

---

## 7. 나중에 실행할 프롬프트

아래 프롬프트를 순서대로 실행하면 전체 구현이 완료됩니다.

---

### 프롬프트 1: 데이터 & 로직 레이어

```
@implementation_plan_free_diagnosis.md 의 Phase 1을 실행해줘.

1. src/data/content.ts에 무료 진단용 상수를 추가해줘:
   - FREE_DIAGNOSTIC_QUESTIONS (7문항)
   - CAREER_YEAR_OPTIONS (경력 연수 드롭다운)
   - FREE_DIAGNOSIS_TYPES (4가지 유형)
   - 관련 타입 정의 (FreeDiagnosticQuestion, FreeDiagnosticArea, FreeDiagnosisType)

2. src/lib/freeDiagnostic.ts 파일을 새로 생성해줘:
   - FreeDiagnosticResult 인터페이스 정의
   - analyzeFree(answers) 함수 구현 — 7문항 답변으로 4개 영역 점수 계산 + 유형 분류 + 레포트 데이터 생성

3. src/store/freeDiagnosticStore.ts 파일을 새로 생성해줘:
   - Zustand + persist 미들웨어
   - step, lead, answers, result 상태
   - setStep, setLead, setAnswer, analyze, reset 액션

기존 16문항 관련 코드(DIAGNOSTIC_QUESTIONS, diagnostic.ts, diagnostic store)는 수정하지 마.
```

---

### 프롬프트 2: CSS 애니메이션

```
@implementation_plan_free_diagnosis.md 의 Phase 2를 실행해줘.

src/index.css에 다음 스타일을 추가해줘:

1. 펄스 스피너 애니메이션 (@keyframes pulse-ring)
   - Royal Blue 톤, 바깥으로 퍼지는 링 3개
2. 블러 잠금 섹션 스타일 (.locked-section)
   - filter: blur(8px), 위에 반투명 오버레이 + 🔒 아이콘
3. 진행률 바 애니메이션 (.progress-animate)
   - 0% → 100%, 12초, ease-in-out
4. 순차 텍스트 페이드 (@keyframes textFade)
   - opacity 0→1→0, 3초 주기

기존 CSS는 수정하지 말고 @layer utilities 안에 추가해줘.
```

---

### 프롬프트 3: Screen 1 — 이메일 선수집

```
@implementation_plan_free_diagnosis.md 의 Phase 3-1을 실행해줘.

src/components/free-diagnosis/EmailCollect.tsx 컴포넌트를 만들어줘.

디자인 요구사항:
- 기존 사이트의 editorial 스타일 유지 (container-prose, font-serif 헤딩, SCDream 폰트)
- 헤드라인: "30년을 일했는데, 나를 소개하는 한 문장이 없습니다." (Bold, text-3xl md:text-5xl)
- 서브: "5~8분 안에 내 경력의 숨겨진 가치를 발견합니다."
- 입력: 이름, 이메일, 경력연수(드롭다운) + 개인정보 동의 체크박스
- CTA: "무료 진단 시작하기" (bg-primary, rounded-full, 전체 너비)
- 신뢰 지표: "✓ 무료 ✓ 5~8분 완료 ✓ AI 즉시 분석"
- zod 유효성 검사
- freeDiagnosticStore 연동
```

---

### 프롬프트 4: Screen 2 — 7문항 진단 폼

```
@implementation_plan_free_diagnosis.md 의 Phase 3-2를 실행해줘.

src/components/free-diagnosis/DiagnosisForm.tsx 컴포넌트를 만들어줘.

디자인 요구사항:
- 기존 Diagnosis.tsx의 스타일 참고하되 새 7문항 데이터 사용
- 진행 바: "3 / 7" + 43% (프로그래스 바)
- 질문 배지: "Q3" (Royal Blue 원형, w-10 h-10)
- 질문 텍스트: font-serif, text-2xl md:text-4xl
- 힌트 텍스트: text-sm text-muted-foreground
- 텍스트에어리어: rows=8, 글자 수 카운터 (/1500)
- 하단 안내: "💡 길게 쓸수록 더 정확한 진단이 나옵니다"
- [← 이전] + [다음 →] 버튼
- fade-in 애니메이션 (기존 fadeUp 재사용)
- freeDiagnosticStore 연동
```

---

### 프롬프트 5: Screen 3 — AI 분석 로딩

```
@implementation_plan_free_diagnosis.md 의 Phase 3-3을 실행해줘.

src/components/free-diagnosis/AnalysisLoading.tsx 컴포넌트를 만들어줘.

디자인 요구사항:
- 화면 중앙 배치 (flex items-center justify-center, min-h 화면 높이)
- 펄스 원형 애니메이션 (CSS로 구현)
- "AI가 경력 가치를 분석 중입니다..." (Bold, text-2xl)
- 3초 간격 순차 메시지 (fade 전환):
  1. "30년의 경험을 분석하고 있어요"
  2. "숨겨진 강점을 발굴하고 있어요"
  3. "당신만의 차별화 포인트를 찾고 있어요"
  4. "경력 가치 레포트를 생성 중이에요"
- 진행률 바 (0→100%, 12초)
- "약 1~2분 소요됩니다. 창을 닫지 마세요."
- 12초 후 자동 전환: store.analyze() 호출 → onComplete()
```

---

### 프롬프트 6: Screen 4 — 경력 가치 레포트

```
@implementation_plan_free_diagnosis.md 의 Phase 3-4를 실행해줘.

src/components/free-diagnosis/Report.tsx 컴포넌트를 만들어줘.

이 컴포넌트는 가장 길고 복잡해. Section 1~7 + CTA를 모두 포함하는 스크롤 페이지야.

디자인 요구사항:
- 기존 Result.tsx의 editorial 스타일 참고
- [헤더] 이름 + 유형 배지 + 총점
- [Section 1] 4개 영역 점수 카드 (2×2 그리드, 각 카드에 점수 바)
- [Section 2] 파란색 배경 강조 박스 + 설명
- [Section 3] 강점 카드 3개 (세로) + "희귀한 이유"
- [Section 4] 자연 권위 영역 분석
- [Section 5] 진단 갭 3개 카드 (amber/orange 테두리) + "한끗 코칭에서 해결"
- [Section 6~7] 블러 잠금 섹션 (filter: blur) + 🔒 + [한끗 진단 신청하기]
- [CTA] bg-primary, "경력 가치는 있습니다" + 버튼 2개
- freeDiagnosticStore의 result, lead 데이터 사용
- "한끗 진단 신청하기" → /consultation 링크
- "레포트 이메일로 받기" → onSendEmail() prop 호출
```

---

### 프롬프트 7: Screen 5 — 완료 화면

```
@implementation_plan_free_diagnosis.md 의 Phase 3-5를 실행해줘.

src/components/free-diagnosis/Complete.tsx 컴포넌트를 만들어줘.

디자인 요구사항:
- 화면 중앙 배치, 심플하고 깔끔하게
- 파란색 원형(64px) + 흰색 체크 아이콘
- "레포트가 이메일로 발송됐습니다" (font-serif, text-2xl md:text-3xl)
- "{email}으로 발송됐어요. 스팸함도 확인해 주세요."
- 구분선
- "더 깊은 분석을 원하신다면" + [한끗 진단 신청하기] 버튼
- "3일 후 추가 인사이트 이메일을 보내드릴게요"
- freeDiagnosticStore의 lead.email 사용
```

---

### 프롬프트 8: 페이지 컨트롤러 교체

```
@implementation_plan_free_diagnosis.md 의 Phase 4를 실행해줘.

src/pages/Diagnosis.tsx를 전면 재작성해줘.

기존 16문항 코드를 제거하고, 5개 Screen 컴포넌트를 step에 따라 전환하는 컨트롤러로 만들어줘.

구조:
- freeDiagnosticStore의 step 구독
- step === "email" → <EmailCollect onNext={→ setStep("form")} />
- step === "form" → <DiagnosisForm onNext={→ setStep("loading")} onBack={→ setStep("email")} />
- step === "loading" → <AnalysisLoading onComplete={→ setStep("report")} />
- step === "report" → <Report onSendEmail={→ setStep("complete")} />
- step === "complete" → <Complete />

페이지 진입 시 store.reset() 호출하여 깨끗한 상태로 시작.
```

---

### 프롬프트 9: 테스트 & 검증

```
@implementation_plan_free_diagnosis.md 의 Phase 5를 실행해줘.

브라우저에서 전체 플로우를 테스트해줘:
1. /diagnosis 접속 → Screen 1 이메일 선수집 확인
2. 이메일 입력 → Screen 2 진단 폼 확인 (Q1~Q7 전환)
3. 7문항 완료 → Screen 3 로딩 애니메이션 확인
4. 12초 후 → Screen 4 레포트 확인 (Section 1~7 + CTA)
5. "레포트 이메일로 받기" → Screen 5 완료 화면 확인
6. 반응형 확인 (모바일/데스크톱)

문제 있으면 수정해줘.
```

---

## 8. 주의사항

### 8-1. 코드 관련

- **기존 16문항 코드를 삭제하지 않는다** — `DIAGNOSTIC_QUESTIONS`, `src/lib/diagnostic.ts`, `src/store/diagnostic.ts`는 유지. 유료 한끗 진단에서 재사용할 수 있음.
- **기존 `/result` 라우트는 유지한다** — App.tsx의 라우트 설정은 변경하지 않음. 무료 진단은 `/diagnosis` 페이지 내에서 결과까지 모두 처리.
- **공통 컴포넌트(Nav, Footer, Layout)는 변경하지 않는다** — 디자인 일관성 유지.
- **Zustand persist 키를 다르게 설정한다** — 기존 `kkummolda-diagnostic`과 충돌 방지를 위해 `kkummolda-free-diagnostic` 사용.

### 8-2. 디자인 관련

- **기존 디자인 시스템을 반드시 유지한다:**
  - Primary Blue `#0123B4` / `hsl(230 99% 35%)`
  - SCDream 폰트 (300/500/800)
  - `container-prose`, `editorial-section`, `shadow-soft` 등 기존 유틸리티 클래스 사용
  - `fade-in` 애니메이션 재사용
- **5060 타깃 고려:**
  - 글씨 크기 충분히 크게 (text-base 이상)
  - 텍스트에어리어 높이 충분히 (rows=8)
  - 버튼 클릭 영역 크게 (py-3.5 이상)
  - 명확한 시각적 피드백 (진행 바, 에러 메시지)

### 8-3. 데이터 관련

- **이메일은 현재 클라이언트(Zustand persist)에만 저장된다** — 실제 백엔드(Supabase) 연동은 이 계획의 범위 밖. 추후 별도 작업 필요.
- **AI 분석은 클라이언트 측 로직이다** — Screen 3의 로딩은 연출이며, 실제 API 호출은 없음. 추후 Claude API 연동 시 별도 작업 필요.
- **블러 잠금 섹션의 더미 텍스트는 반드시 그럴듯하게** — 블러 뒤로 비치는 텍스트가 실제 분석 결과처럼 보여야 전환 효과가 있음.

### 8-4. 실행 순서 관련

- **반드시 Phase 1 → 2 → 3 → 4 → 5 순서로 실행한다** — 데이터/로직 → CSS → 컴포넌트 → 컨트롤러 → 테스트
- **Phase 3 내에서도 3-1 → 3-2 → ... 순서를 지킨다** — 앞 컴포넌트가 뒤 컴포넌트의 의존성이 될 수 있음
- **각 프롬프트는 독립적으로 실행 가능하도록 설계되었다** — 하나가 완료된 후 다음을 실행

### 8-5. 추후 작업 (이 계획 범위 밖)

| 작업 | 설명 |
|------|------|
| Supabase 연동 | 이메일 리드 데이터를 실제 DB에 저장 |
| Claude API 연동 | Screen 3에서 실제 AI 분석 호출 |
| 이메일 발송 | Screen 5에서 실제 레포트 이메일 발송 (SendGrid 등) |
| 팔로업 이메일 | 3일 후 자동 이메일 발송 스케줄링 |
| 랜딩페이지 CTA 수정 | "경력 가치 무료 진단받기" 버튼의 라벨/디자인 업데이트 |
| GA4 이벤트 트래킹 | 각 Screen 전환, CTA 클릭 이벤트 추적 |

---

*꿈몰다 · 한끗프로젝트 | kkummolda.com*
