# State Management

이 프로토타입은 서버나 백엔드 데이터베이스 없이 클라이언트 측 상태 관리 라이브러리인 **Zustand**와 **localStorage (Persist Middleware)**를 사용하여 사용자 데이터를 유지하고 흐름을 제어합니다. 메인 MVP 개발 시, 이 부분의 상태들이 백엔드(Supabase/Firebase) 및 전역 상태로 마이그레이션 되어야 합니다.

## 1. Diagnostic Store (`src/store/diagnostic.ts`)
진단 폼을 진행하면서 입력하는 응답과 분석 결과를 저장하고 관리합니다.

### State Interface
- `answers`: 사용자가 입력한 각 문항의 응답. (`{ [id: number]: string }`)
- `contact`: 사용자 연락처 정보 (이름, 전화번호, 이메일 등).
- `result`: 진단 응답을 분석한 최종 결과 (`DiagnosticResult` 객체).

### Actions
- `setAnswer(id, value)`: 특정 문항의 응답을 업데이트.
- `setContact(ContactInfo)`: 상담 신청 시 연락처 정보를 저장.
- `finalize()`: 현재까지의 `answers`를 `analyze()` 유틸리티 함수를 통해 분석하고 `result`에 저장 후 반환.
- `reset()`: 모든 진단 데이터를 초기화.

### 데이터 흐름
`Diagnosis.tsx` (응답 입력: `setAnswer`) -> `Diagnosis.tsx` 마지막 스텝에서 `finalize()` 호출 -> `Result.tsx` (결과 표시: `result` 읽기)

---

## 2. Leads Store (`src/store/leads.ts`)
상담 신청이 완료된 잠재 고객(리드) 목록을 저장하고 관리하는 스토어입니다. 관리자 페이지(`/admin`)에서 주로 사용됩니다.

### State Interface
- `leads`: 수집된 `Lead` 객체들의 배열.

### Actions
- `addLead(data)`: 새로운 리드를 생성하고 목록의 최상단에 추가. 생성 시 `id`, `createdAt`, 기본 상태(`신규 리드`)가 자동 부여됨.
- `updateStatus(id, status)`: 특정 리드의 진행 상태를 변경. (상태: `신규 리드`, `상담 예정`, `상담 완료`, `제안서 발송`, `계약 완료`, `보류`)
- `updateMemo(id, memo)`: 특정 리드에 관리자용 메모를 추가 또는 수정.

### 데이터 흐름
`Consultation.tsx` (폼 제출: `addLead`) -> `Admin.tsx` (목록 표시: `leads` 읽기, 상태 변경: `updateStatus`, `updateMemo`)
