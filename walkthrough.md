# 한끗프로젝트 신청 페이지 구현 완료

## 변경 요약

5개 신청 페이지를 기존 React SPA에 추가했습니다.

| 경로 | 용도 |
|---|---|
| `/apply/diagnosis` | 한끗 진단 신청 (50만원) |
| `/apply/build` | 한끗 빌드 신청 (350만원) |
| `/apply/launch` | 한끗 론칭 신청 (700만원) |
| `/apply/partner` | 한끗 파트너 신청 (월 100만원) |
| `/apply/thank-you` | 신청 완료 (공통) |

---

## 신규 생성 파일 (8개)

### 데이터
- [content.ts](file:///e:/%EA%BF%88%EB%AA%B0%EB%8B%A4/%EC%99%B8%EB%B6%80%EC%82%AC%EC%97%85/2026/%EB%AA%A8%EB%91%90%EC%9D%98%EC%97%B0%EA%B5%AC%EC%86%8C/career-translate-lab/src/data/content.ts) — `APPLY_PRODUCTS` 4개 상품 데이터 추가

### 공통 컴포넌트
- [ProductConfirmCard.tsx](file:///e:/%EA%BF%88%EB%AA%B0%EB%8B%A4/%EC%99%B8%EB%B6%80%EC%82%AC%EC%97%85/2026/%EB%AA%A8%EB%91%90%EC%9D%98%EC%97%B0%EA%B5%AC%EC%86%8C/career-translate-lab/src/components/site/ProductConfirmCard.tsx) — 상품 확인 카드 (라벤더 배경 + 좌측 파랑 바)
- [ApplyForm.tsx](file:///e:/%EA%BF%88%EB%AA%B0%EB%8B%A4/%EC%99%B8%EB%B6%80%EC%82%AC%EC%97%85/2026/%EB%AA%A8%EB%91%90%EC%9D%98%EC%97%B0%EA%B5%AC%EC%86%8C/career-translate-lab/src/components/site/ApplyForm.tsx) — 10개 폼 항목 + zod 유효성 검사 + Netlify Forms 제출

### 페이지
- [ApplyPage.tsx](file:///e:/%EA%BF%88%EB%AA%B0%EB%8B%A4/%EC%99%B8%EB%B6%80%EC%82%AC%EC%97%85/2026/%EB%AA%A8%EB%91%90%EC%9D%98%EC%97%B0%EA%B5%AC%EC%86%8C/career-translate-lab/src/pages/apply/ApplyPage.tsx) — 공통 레이아웃 (카드 + 폼 + 안내 박스)
- [ApplyDiagnosis.tsx](file:///e:/%EA%BF%88%EB%AA%B0%EB%8B%A4/%EC%99%B8%EB%B6%80%EC%82%AC%EC%97%85/2026/%EB%AA%A8%EB%91%90%EC%9D%98%EC%97%B0%EA%B5%AC%EC%86%8C/career-translate-lab/src/pages/apply/ApplyDiagnosis.tsx), [ApplyBuild.tsx](file:///e:/%EA%BF%88%EB%AA%B0%EB%8B%A4/%EC%99%B8%EB%B6%80%EC%82%AC%EC%97%85/2026/%EB%AA%A8%EB%91%90%EC%9D%98%EC%97%B0%EA%B5%AC%EC%86%8C/career-translate-lab/src/pages/apply/ApplyBuild.tsx), [ApplyLaunch.tsx](file:///e:/%EA%BF%88%EB%AA%B0%EB%8B%A4/%EC%99%B8%EB%B6%80%EC%82%AC%EC%97%85/2026/%EB%AA%A8%EB%91%90%EC%9D%98%EC%97%B0%EA%B5%AC%EC%86%8C/career-translate-lab/src/pages/apply/ApplyLaunch.tsx), [ApplyPartner.tsx](file:///e:/%EA%BF%88%EB%AA%B0%EB%8B%A4/%EC%99%B8%EB%B6%80%EC%82%AC%EC%97%85/2026/%EB%AA%A8%EB%91%90%EC%9D%98%EC%97%B0%EA%B5%AC%EC%86%8C/career-translate-lab/src/pages/apply/ApplyPartner.tsx) — 4개 래퍼
- [ApplyThankYou.tsx](file:///e:/%EA%BF%88%EB%AA%B0%EB%8B%A4/%EC%99%B8%EB%B6%80%EC%82%AC%EC%97%85/2026/%EB%AA%A8%EB%91%90%EC%9D%98%EC%97%B0%EA%B5%AC%EC%86%8C/career-translate-lab/src/pages/apply/ApplyThankYou.tsx) — 완료 페이지

---

## 수정된 파일 (2개)

- [App.tsx](file:///e:/%EA%BF%88%EB%AA%B0%EB%8B%A4/%EC%99%B8%EB%B6%80%EC%82%AC%EC%97%85/2026/%EB%AA%A8%EB%91%90%EC%9D%98%EC%97%B0%EA%B5%AC%EC%86%8C/career-translate-lab/src/App.tsx) — 5개 Route 추가
- [Index.tsx](file:///e:/%EA%BF%88%EB%AA%B0%EB%8B%A4/%EC%99%B8%EB%B6%80%EC%82%AC%EC%97%85/2026/%EB%AA%A8%EB%91%90%EC%9D%98%EC%97%B0%EA%B5%AC%EC%86%8C/career-translate-lab/src/pages/Index.tsx) — 4개 CTA 버튼 링크 `/consultation` → `/apply/xxx`

---

## 주요 기능

### 폼 항목 (10개)
1. 성함 (필수)
2. 연락처 (필수, tel)
3. 이메일 (필수, email)
4. 연락 받기 편한 방법 (필수, 라디오) — 카카오톡 선택 시 ID 입력 자동 노출
5. 연락 받기 편한 시간대 (필수, 체크박스 다중)
6. 현재 상황 (선택, textarea)
7. 시작 희망 시기 (필수, 라디오)
8. 세금계산서 발행 여부 (필수, 라디오) — "네" 선택 시 사업자번호/사업자명 자동 노출
9. 개인정보 수집·이용 동의 (필수, 토글 상세보기)
10. 제출 버튼: "신청서 보내기"

### Netlify Forms
- 숨김 `<form>` 태그로 Netlify 봇 인식
- `fetch` POST로 SPA 제출 처리
- 폼 이름: `apply-diagnosis`, `apply-build`, `apply-launch`, `apply-partner`

### 디자인 준수
- 메인 컬러 `#1E2D8C`, 보조 `#F0EFFB`, 기존 디자인 시스템 일관
- 본문 16px+ / 행간 1.7 / 5060 가독성 확보
- 모바일 반응형, 제출 버튼 전폭
- 금지 표현 미사용 확인 완료

---

## 검증 결과
- ✅ `tsc --noEmit` — 타입 에러 없음
- ✅ `vite build` — 빌드 성공 (9초)

---

## 🐛 버그 수정: 한글 자음 연속 입력 오류 해결 (2026-05-30)

### 현상
- 신청 페이지의 텍스트 입력창(성함, 연락처, 이메일 등)에서 한글을 타이핑할 때 자음 하나만 써지고 글자가 조합되지 않는 현상이 발생함. (예: `김`을 치려는데 `ㄱ`만 입력됨)

### 원인
- `ApplyForm.tsx` 내부에서 개별 필드를 렌더링하는 헬퍼 컴포넌트인 `Field`가 **`ApplyForm` 컴포넌트의 렌더 함수 내부에서 선언**되어 있었음.
- 이로 인해 입력창의 `onChange` 이벤트가 발생해 `form` 상태가 변경될 때마다 `ApplyForm`이 재렌더링되며 `Field` 컴포넌트도 매번 새로 생성(Unmount & Remount)되었습니다.
- 컴포넌트가 Unmount 및 Remount 되는 과정에서 Input 엘리먼트가 새로 그려지게 되고, 이로 인해 **한글 IME(입력기) 조합 중인 세션이 완전히 취소 및 중단**되어 첫 번째 입력(자음 하나) 후 더 이상 타이핑이 이어지지 않는 버그였습니다.

### 해결 조치
- 헬퍼 컴포넌트인 `Field`를 `ApplyForm` 컴포넌트 **외부(Top-level)**로 분리 정의하여 렌더링 시 참조가 변하지 않도록 변경했습니다.
- 외부로 분리된 `Field` 컴포넌트가 개별 입력창의 유효성 검사 에러 정보(`errors`)에 접근할 수 있도록 `error` 프로퍼티를 추가하여 컴포넌트 렌더링 위계를 올바르게 구축했습니다.
- 수정 후 Vite Production 빌드 검증을 마쳤으며, 한글 조합(IME)이 끊기지 않고 자연스럽게 전체 텍스트를 정상 입력할 수 있도록 해결되었습니다.

---

## 📂 접수된 신청서 확인 방법

접수된 신청서는 크게 **두 가지 경로**에서 확인할 수 있습니다.

### 1. 실서비스 운영 환경 (Netlify Dashboard)
* 신청서가 제출되면 실제로 Netlify 서버로 폼 데이터가 안정적으로 전송됩니다.
* **확인 방법**: Netlify 콘솔 로그인 ➔ 진행 중인 사이트 선택 ➔ **Forms** 탭으로 이동하면 `apply-diagnosis`, `apply-build`, `apply-launch`, `apply-partner` 양식별로 접수된 신청자 데이터(성함, 연락처, 이메일, 상담 요청 세부사항, 세금계산서 정보 등)를 통합 관리하고 내려받을 수 있습니다.

### 2. 로컬 개발/운영자 관리 화면 (`/admin`)
* 관리자의 빠른 확인과 로컬 테스트를 위해, 신청 페이지에서 제출 성공 시 **로컬 어드민 관리 스토어(`useLeadsStore`)에도 자동으로 리드가 추가**되도록 연동 설정을 마쳤습니다.
* **확인 방법**: 사이트 내의 어드민 페이지인 `http://localhost:8080/admin` (혹은 배포 주소의 `/admin`) 경로로 이동하시면 "상담 리드 관리" 화면에서 실시간으로 추가된 신청서를 볼 수 있습니다.
* 해당 화면에서는 신청인 정보 밑에 `[신청] 한끗 진단` 등 어떤 상품을 신청했는지 한눈에 파악할 수 있으며, **보기 ▼** 버튼을 눌러 상세 요구사항(연락 편한 방법, 시간대, 세금계산서 발행 정보 등)도 모두 조회할 수 있습니다.


