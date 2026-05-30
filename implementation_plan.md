# 한끗프로젝트 신청 페이지 4종 + 완료 페이지 구현 계획

## 배경
기존 React + Vite + Tailwind CSS SPA에 신청 페이지 5개를 추가합니다. 기존 Layout(Nav/Footer)을 재사용하고, 디자인 시스템(색상, 폰트, 간격)을 일관되게 유지합니다.

---

## Proposed Changes

### 1. 상품 데이터 추가

#### [MODIFY] [content.ts](file:///e:/%EA%BF%88%EB%AA%B0%EB%8B%A4/%EC%99%B8%EB%B6%80%EC%82%AC%EC%97%85/2026/%EB%AA%A8%EB%91%90%EC%9D%98%EC%97%B0%EA%B5%AC%EC%86%8C/career-translate-lab/src/data/content.ts)

`APPLY_PRODUCTS` 데이터를 추가합니다. 4개 상품의 정보를 중앙에서 관리:

| 키 | 상품명 | 가격 | 기간 | 한 줄 약속 |
|---|---|---|---|---|
| `diagnosis` | 한끗 진단 | 500,000원 | 1주 | "내 경력이 시장에서 어디에 서 있는지 명확하게 진단합니다" |
| `build` | 한끗 빌드 | 3,500,000원 | 6주 | "강의안·프로필·제안서를 손에 쥐고 시장으로 나갑니다" |
| `launch` | 한끗 론칭 | 7,000,000원 | 3개월 | "실제 무대와 수익 기회에 접근합니다" |
| `partner` | 한끗 파트너 | 월 1,000,000원 | 월 단위 | "매월 점검하고, 다음 기회를 설계합니다" |

포함 내용(체크리스트)은 기존 [Index.tsx](file:///e:/%EA%BF%88%EB%AA%B0%EB%8B%A4/%EC%99%B8%EB%B6%80%EC%82%AC%EC%97%85/2026/%EB%AA%A8%EB%91%90%EC%9D%98%EC%97%B0%EA%B5%AC%EC%86%8C/career-translate-lab/src/pages/Index.tsx#L353-L440) 카드의 체크리스트와 동일하게 사용.

---

### 2. 공통 신청 폼 컴포넌트

#### [NEW] `src/components/site/ApplyForm.tsx`

10개 폼 항목을 구현하는 재사용 컴포넌트:

1. **성함** — 텍스트, 필수
2. **연락처** — tel, 필수
3. **이메일** — email, 필수
4. **연락 받기 편한 방법** — 라디오(전화/카카오톡/이메일), 필수
   - "카카오톡" 선택 시 → 카톡 ID 입력 필드 자동 노출
5. **연락 받기 편한 시간대** — 체크박스 다중 선택, 필수
6. **현재 상황** — textarea, 선택
7. **시작 희망 시기** — 라디오, 필수
8. **세금계산서 발행 여부** — 라디오, 필수
   - "네" 선택 시 → 사업자번호/사업자명 입력 필드 자동 노출
9. **개인정보 수집·이용 동의** — 체크박스 + 토글 상세보기, 필수
10. **제출 버튼** — "신청서 보내기"

**Netlify Forms 대응**: `<form>` 태그에 `data-netlify="true"` 속성 추가, hidden input으로 `form-name` 전달. React SPA에서 Netlify Forms가 작동하도록 `fetch` API로 폼 데이터를 POST.

**유효성 검사**: zod 스키마로 클라이언트 사이드 검증 (기존 Consultation.tsx 패턴 동일).

---

### 3. 상품 확인 카드 컴포넌트

#### [NEW] `src/components/site/ProductConfirmCard.tsx`

페이지 상단에 표시되는 큼직한 상품 확인 카드:
- 라벤더 배경 (`bg-[#F0EFFB]`)
- 좌측 진한 파랑 세로 바 (5px, `border-l-[5px] border-[#1E2D8C]`)
- STEP 라벨, 상품명(세리프), 가격, 기간, 한 줄 약속
- 포함 내용 체크리스트
- 하단 "다른 상품을 선택하시려면 여기를 누르세요" 링크 → `/#packages`

Props로 `productKey`를 받아 `APPLY_PRODUCTS` 데이터에서 해당 상품 정보 표시.

---

### 4. 신청 페이지 4개

#### [NEW] `src/pages/apply/ApplyDiagnosis.tsx`
#### [NEW] `src/pages/apply/ApplyBuild.tsx`
#### [NEW] `src/pages/apply/ApplyLaunch.tsx`
#### [NEW] `src/pages/apply/ApplyPartner.tsx`

4개 모두 동일한 구조 (섹션 1~4):
1. **헤더** — 기존 Nav 그대로 (Layout에서 제공)
2. **상품 확인 카드** — `<ProductConfirmCard productKey="diagnosis|build|launch|partner" />`
3. **신청 폼** — `<ApplyForm productKey="..." />`
4. **안내 박스** — "신청 후 어떻게 진행되나요?" 공통

> [!NOTE]
> 4개 페이지의 구조가 거의 동일하므로, 실제로는 **1개의 공통 페이지 컴포넌트** `ApplyPage.tsx`를 만들고 URL params로 상품을 구분하는 방식도 가능합니다. 하지만 사용자의 요청대로 **별도 파일 4개**를 만들되, 공통 레이아웃 컴포넌트를 공유하는 방식으로 구현합니다.

실제 구현: `ApplyPage.tsx` 공통 컴포넌트 1개 + 4개 페이지는 이를 래핑하는 얇은 파일.

---

### 5. 완료 페이지

#### [NEW] `src/pages/apply/ApplyThankYou.tsx`

- "신청이 접수되었습니다" 메시지
- 어떤 상품을 신청했는지 표시 (URL 쿼리파라미터 `?product=diagnosis|build|launch|partner`)
- 진행 안내 (1~4 단계)
- "홈으로 돌아가기" / "단계별 상품 다시 보기" 링크
- 문의: 070-4090-2161 / kkummolda@kkummolda.com

---

### 6. 라우팅 등록

#### [MODIFY] [App.tsx](file:///e:/%EA%BF%88%EB%AA%B0%EB%8B%A4/%EC%99%B8%EB%B6%80%EC%82%AC%EC%97%85/2026/%EB%AA%A8%EB%91%90%EC%9D%98%EC%97%B0%EA%B5%AC%EC%86%8C/career-translate-lab/src/App.tsx)

5개 Route 추가:
```tsx
<Route path="/apply/diagnosis" element={<ApplyDiagnosis />} />
<Route path="/apply/build" element={<ApplyBuild />} />
<Route path="/apply/launch" element={<ApplyLaunch />} />
<Route path="/apply/partner" element={<ApplyPartner />} />
<Route path="/apply/thank-you" element={<ApplyThankYou />} />
```

---

### 7. 랜딩페이지 CTA 링크 업데이트

#### [MODIFY] [Index.tsx](file:///e:/%EA%BF%88%EB%AA%B0%EB%8B%A4/%EC%99%B8%EB%B6%80%EC%82%AC%EC%97%85/2026/%EB%AA%A8%EB%91%90%EC%9D%98%EC%97%B0%EA%B5%AC%EC%86%8C/career-translate-lab/src/pages/Index.tsx#L371-L439)

4개 상품 카드의 "신청하기" 버튼 링크를 `/consultation` → `/apply/xxx`로 변경:

| 카드 | 현재 | 변경 |
|---|---|---|
| 한끗 진단 | `/consultation` | `/apply/diagnosis` |
| 한끗 빌드 | `/consultation` | `/apply/build` |
| 한끗 론칭 | `/consultation` | `/apply/launch` |
| 한끗 파트너 | `/consultation` | `/apply/partner` |

---

## 금지 표현 체크리스트

- ❌ "결제하기", "지금 바로 결제", "즉시 시작"
- ❌ "AI" (사이트 정책)
- ❌ "5060 전문가" → ✅ "30년 경력 전문가"
- ✅ 버튼 텍스트: "신청서 보내기"
- ✅ 안내: "결제는 통화 후 진행되므로, 지금은 결제하지 않습니다."

## 디자인 준수

- 메인 컬러: `#1E2D8C` (진한 파랑)
- 보조: `#F0EFFB` (라벤더)
- 포인트: `#C4A265` (골드)
- 폰트: 기존 SCDream/Pretendard + Noto Serif KR (세리프 제목)
- 본문 16px(데스크톱) / 17px(모바일), 행간 1.7
- 카드 border-radius 12px, 옅은 그림자
- 모바일 반응형: 제출 버튼 90%+ 폭
- 14px 이하 폰트 사용 금지
- 회색 텍스트 #999 이하 금지

## Verification Plan

### 빌드 확인
- `npm run build` 성공 여부

### 수동 확인
- 개발 서버에서 4개 신청 페이지 접근 확인
- 폼 조건부 필드(카카오톡 ID, 사업자번호) 동작 확인
- 폼 유효성 검사 동작 확인
- 완료 페이지 이동 확인
- 모바일 반응형 확인
- 랜딩페이지 CTA 링크 변경 확인
