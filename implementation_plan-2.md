# [무료 진단 퍼널 '산출물 중심' 보강 계획]

무료 진단 퍼널을 정체성/자기탐색 중심에서 잠재 고객의 실제 전환 동기인 '산출물(강의안, 제안서, 프로필 등)' 중심으로 보강하는 설계 제안서입니다.

---

## 1. 코드베이스 실사 및 대상 파일 분석

실제 코드베이스 확인 결과, 수정할 위치 및 파일은 다음과 같습니다:

1. **무료 진단 7문항 정의 및 배열 데이터:**
   * **파일:** [content.ts](file:///e:/꿈몰다/외부사업/2026/모두의연구소/career-translate-lab/src/data/content.ts)
   * **위치:** `FREE_DIAGNOSTIC_QUESTIONS` 상수 배열 (라인 203-253)

2. **무료 진단 문항 렌더링 컴포넌트:**
   * **파일:** [DiagnosisForm.tsx](file:///e:/꿈몰다/외부사업/2026/모두의연구소/career-translate-lab/src/components/free-diagnosis/DiagnosisForm.tsx)
   * **역할:** 주관식 텍스트 필드를 렌더링하고 `useFreeDiagnosticStore`를 활용해 응답을 제어합니다.

3. **진단 진입 페이지 "단 7개의 질문" 문구 위치:**
   * **파일:** [EmailCollect.tsx](file:///e:/꿈몰다/외부사업/2026/모두의연구소/career-translate-lab/src/components/free-diagnosis/EmailCollect.tsx)
   * **위치:** 라인 63의 서브텍스트 `"단 7개의 질문으로 내 경력의 빛나는 순간과 숨겨진 핵심 자산을 진단해 보세요."`

4. **진단 결과 리포트 컴포넌트:**
   * **파일:** [Report.tsx](file:///e:/꿈몰다/외부사업/2026/모두의연구소/career-translate-lab/src/components/free-diagnosis/Report.tsx)
   * **역할:** 점수 4축 및 진단 갭(Gap)을 시각화하고 하단 CTA 영역을 렌더링합니다.

5. **리포트 점수 산출 로직:**
   * **파일:** [freeDiagnostic.ts](file:///e:/꿈몰다/외부사업/2026/모두의연구소/career-translate-lab/src/lib/freeDiagnostic.ts)
   * **위치:** `analyzeFree(answers)` 함수 (라인 94-221)

6. **상태 관리 및 데이터 제출 흐름:**
   * **파일:** [freeDiagnosticStore.ts](file:///e:/꿈몰다/외부사업/2026/모두의연구소/career-translate-lab/src/store/freeDiagnosticStore.ts) (무료 진단 로컬 상태)
   * **파일:** [leads.ts](file:///e:/꿈몰다/외부사업/2026/모두의연구소/career-translate-lab/src/store/leads.ts) (리드 데이터 인터페이스 및 저장소)
   * **파일:** [Consultation.tsx](file:///e:/꿈몰다/외부사업/2026/모두의연구소/career-translate-lab/src/pages/Consultation.tsx) (1:1 상담 신청 제출 흐름)

---

## 2. 세부 구현 계획

### [Component 1] 무료 진단 데이터 및 상태 계층 보강

#### [MODIFY] [content.ts](file:///e:/꿈몰다/외부사업/2026/모두의연구소/career-translate-lab/src/data/content.ts)
* `FREE_DIAGNOSTIC_QUESTIONS`에 8번째 문항(Q8) 추가:
  * `id: 8`
  * `question`: `"지금 누군가 '강의 한번 해주세요' 또는 '제안서 보내주세요'라고 한다면, 바로 보낼 수 있는 자료를 모두 골라주세요."`
  * `hint`: `"없는 게 정상입니다. 머릿속엔 다 있는데, 아직 꺼낼 형태가 없을 뿐입니다."`
  * `placeholder`: `""`
  * `diagnosticArea`: `"differentiation"`
* Q8의 선택지(배열)를 관리하기 위한 `Q8_OPTIONS` 상수 정의 추가:
  ```typescript
  export const Q8_OPTIONS = [
    { key: "oneliner", label: "나를 한 문장으로 소개하는 메시지" },
    { key: "profile", label: "전문가 프로필 (A4 1장)" },
    { key: "lecture", label: "대표 강의안" },
    { key: "proposal", label: "기업·기관에 보낼 B2B 제안서" },
    { key: "online", label: "온라인에 정리된 소개 페이지" },
    { key: "none", label: "아직 정리된 자료가 없습니다" },
  ];
  ```

#### [MODIFY] [freeDiagnosticStore.ts](file:///e:/꿈몰다/외부사업/2026/모두의연구소/career-translate-lab/src/store/freeDiagnosticStore.ts)
* `FreeDiagnosticState` 인터페이스 및 스토어에 `outputAssets: string[]` 필드 및 `setOutputAssets: (assets: string[]) => void` 액션 추가.
* `reset` 시 `outputAssets: []`로 초기화하도록 수정.
* `analyze()` 호출 시 `analyzeFree(get().answers, get().outputAssets)` 형태로 전달하도록 수정.

#### [MODIFY] [leads.ts](file:///e:/꿈몰다/외부사업/2026/모두의연구소/career-translate-lab/src/store/leads.ts)
* `Lead` 인터페이스에 `outputAssets?: string[]` 필드 추가하여 리드 데이터 이식 지원.

#### [MODIFY] [Consultation.tsx](file:///e:/꿈몰다/외부사업/2026/모두의연구소/career-translate-lab/src/pages/Consultation.tsx)
* `addLead` 호출부(라인 124-142)에서 무료 진단 결과의 `outputAssets` 배열을 이식하도록 수정:
  ```typescript
  addLead({
    ...
    answers: freeAnswers,
    outputAssets: freeResult?.outputAssets || [], // 추가
    ...
  });
  ```

---

### [Component 2] 질문 화면 및 진입 페이지 보강

#### [MODIFY] [EmailCollect.tsx](file:///e:/꿈몰다/외부사업/2026/모두의연구소/career-translate-lab/src/components/free-diagnosis/EmailCollect.tsx)
* 라인 63의 서브텍스트 수정:
  * (기존) `"단 7개의 질문으로 내 경력의 빛나는 순간과 숨겨진 핵심 자산을 진단해 보세요."`
  * (수정) `"단 8개의 질문으로 내 경력의 빛나는 순간과 숨겨진 핵심 자산을 진단해 보세요."`

#### [MODIFY] [DiagnosisForm.tsx](file:///e:/꿈몰다/외부사업/2026/모두의연구소/career-translate-lab/src/components/free-diagnosis/DiagnosisForm.tsx)
* 스토어에서 `outputAssets`, `setOutputAssets`를 구독합니다.
* `currentQuestion === 7` (즉, Q8 문항)일 때:
  * `<Textarea>` 입력 상자 대신 `Q8_OPTIONS` 체크박스 목록을 렌더링합니다.
  * 체크 박스를 선택했을 때의 토글 핸들러(`handleToggleAsset`)를 작성합니다:
    * `"none"` 선택 시: 다른 모든 선택 해제하고 `["none"]`만 선택.
    * 일반 항목 선택 시: `"none"`을 제거한 후 해당 항목의 선택 여부를 토글. 모든 일반 항목이 해제되면 자동으로 `["none"]`이 선택되도록 하거나, 사용자 조작에 맞춤.
    * 변경 시 스토어의 `outputAssets`를 업데이트하는 동시에 `answers[8]`에 선택된 항목들의 한국어 라벨명을 쉼표 `,`로 연결하여 저장합니다. (예: `"대표 강의안, B2B 제안서"`). 이 처리를 통해 관리자 페이지(`Admin.tsx`)에서 별도 코드 수정 없이 Q8 답변을 텍스트로 자동 렌더링할 수 있게 합니다.
  * Q8 진입 시, 하나라도 선택되지 않은 경우(즉 `outputAssets.length === 0`) "진단 완료" 버튼을 비활성화(`disabled`)하여 필수 선택을 유도합니다.

---

### [Component 3] 리포트 페이지 및 점수 산출 로직 보강

#### [MODIFY] [freeDiagnostic.ts](file:///e:/꿈몰다/외부사업/2026/모두의연구소/career-translate-lab/src/lib/freeDiagnostic.ts)
* `FreeDiagnosticResult` 인터페이스에 `outputAssets?: string[]` 및 `outputAssetScore: number` 추가.
* `analyzeFree` 매개변수에 `outputAssets?: string[]` 추가:
  `export function analyzeFree(answers: Record<number, string>, outputAssets?: string[])`
* 산출물 보유 점수 계산 로직 추가:
  * `none`을 포함하거나 `outputAssets`가 없는 경우 `outputAssetScore = 0`
  * 그 외의 경우 `(선택된 산출물 수 ÷ 5) × 100` 계산 (정수 반올림)
  * 이 점수는 기존 4축 점수 및 종합 점수(`totalScore`) 계산 로직에는 **절대 합산하거나 반영하지 않고** 별도로만 반환합니다.

#### [MODIFY] [Report.tsx](file:///e:/꿈몰다/외부사업/2026/모두의연구소/career-translate-lab/src/components/free-diagnosis/Report.tsx)
* **신규 블록 추가:**
  * 기존 '진단 갭' 섹션(Section 5) 바로 아래에 **"지금 손에 쥔 것 vs 아직 없는 것"** 블록(Section 5.5)을 디자인 가이드에 맞춰 추가합니다.
  * 5개 항목(한 문장 소개, 전문가 프로필, 대표 강의안, B2B 제안서, 온라인 소개 페이지)을 그리드(또는 리스트) 형태로 체크리스트로 렌더링합니다.
  * Q8(`result.outputAssets`)에서 선택된 항목은 `✓ 보유` (로열블루 테두리/텍스트), 선택 안 된 항목은 `— 아직 없음` (회색 텍스트)으로 표시합니다.
  * 블록 상단에 `산출물 보유 점수: {result.outputAssetScore}점`을 표시합니다.
  * 블록 하단에 작게 아래 문구를 배치합니다:
    `"경력 가치는 충분합니다. 다만 시장이 읽을 형태로 아직 만들어지지 않았습니다."`
* **하단 CTA 카피 교체:**
  * 라인 242-248의 기존 카피를 아래와 같이 교체합니다:
    ```html
    <!-- 기존 -->
    <h2 className="font-serif text-3xl md:text-4xl leading-snug max-w-3xl mx-auto">
      경력 가치는 있습니다.
      <br />
      아직 언어가 없을 뿐입니다.
    </h2>
    <p className="mt-6 text-primary-foreground/80 text-lg max-w-2xl mx-auto leading-relaxed">
      브랜드 원라이너, 고객 페르소나, 핵심 메시지 — 한끗 코칭에서 완성합니다.
    </p>

    <!-- 수정 -->
    <h2 className="font-serif text-3xl md:text-4xl leading-snug max-w-3xl mx-auto">
      경력 가치는 있습니다.
      <br />
      아직 시장이 읽을 형태가 없을 뿐입니다.
    </h2>
    <p className="mt-6 text-primary-foreground/80 text-lg max-w-2xl mx-auto leading-relaxed">
      6주 뒤, 강의안·제안서·프로필을 손에 쥡니다.
    </p>
    ```

---

## 3. 검증 계획

### 수동 검증 시나리오
1. `/diagnosis` 진입 및 선수집 양식 서브텍스트 확인 ("단 8개의 질문으로...")
2. 무료 진단 정상 시작 후 Q1 ~ Q7 주관식 입력 완료.
3. Q8 객관식 복수 선택 화면 렌더링 및 기능 검증:
   * `"아직 정리된 자료가 없습니다"` 선택 시 나머지 항목 전부 해제 확인.
   * 다른 항목(예: `대표 강의안`, `B2B 제안서`) 선택 시 `"아직 정리된 자료가 없습니다"` 해제 확인.
   * 아무것도 선택하지 않았을 때 "진단 완료" 버튼 비활성화 여부 확인.
4. "진단 완료" 클릭 → 로딩 페이지 노출 → 결과 리포트 화면 확인:
   * 신규 블록 **"지금 손에 쥔 것 vs 아직 없는 것"** 렌더링 확인.
   * Q8에서 선택한 항목이 정확히 `✓ 보유`로, 선택하지 않은 항목은 `— 아직 없음`으로 나오는지 확인.
   * `none` 선택 시 5개 항목 전부 `— 아직 없음` 표시 및 보유 점수 `0점` 확인.
   * 2개 항목 선택 시 보유 점수가 `40점`으로 올바르게 계산 및 표시되는지 확인.
   * 종합 점수 및 4축 점수가 산출물 보유 점수에 영향받지 않고 온전히 기존 점수를 유지하는지 확인.
   * 하단 CTA 헤드라인 및 서브텍스트가 지정된 형태와 정확히 일치하게 노출되는지 확인.
5. 1:1 상담 신청서 작성 완료 후 관리자 콘솔(`/admin`) 확인:
   * 해당 리드의 상세 보기에서 Q8 질문과 답변이 한국어 텍스트로 잘 표현되는지 확인.

### 자동 빌드 및 린트 검증
* `npm run build` 또는 `tsc --noEmit` 실행하여 컴파일 오류가 없는지 최종 확인.
