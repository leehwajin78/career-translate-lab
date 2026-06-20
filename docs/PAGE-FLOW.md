# 한끗프로젝트 전체 페이지 순서도

> 사용자 유형 3가지: **비회원(Guest)** · **멤버(Member)** · **어드민(Admin)**  
> 최종 업데이트: 2026-06-20

---

## 1. 전체 플로우 개요

```mermaid
flowchart TD
    ENTRY([🌐 사이트 진입]) --> IDX

    subgraph PUBLIC["🔓 공개 영역 — 비회원 접근 가능"]
        IDX["🏠 랜딩페이지\n/"]
        SVC["📋 서비스 소개\n/service"]
        CONS["💬 무료 상담 신청\n/consultation"]
        LOGIN["🔑 로그인\n/login"]
        TERMS["📄 이용약관\n/terms"]
        PRIV["🔒 개인정보처리방침\n/privacy"]
    end

    subgraph DIAG["🆓 무료 진단 플로우 — 비회원"]
        D1["📧 이메일·이름 입력\n/diagnosis · step 1"]
        D2["📝 경력 진단 8문항\n/diagnosis · step 2"]
        D3["⏳ AI 분석 중\n/diagnosis · step 3\n12초 로딩"]
        D4["📊 진단 결과 리포트\n/diagnosis · step 4"]
        D5["✅ 이메일 발송 완료\n/diagnosis · step 5"]
    end

    subgraph APPLY["💳 유료 신청 플로우 — 비회원"]
        A1["🎯 한끗 진단 신청\n/apply/diagnosis"]
        A2["🏗️ 한끗 빌드 신청\n/apply/build"]
        A3["🚀 한끗 론칭 신청\n/apply/launch"]
        A4["🤝 한끗 파트너 신청\n/apply/partner"]
        ATY["🎉 신청 완료\n/apply/thank-you"]
    end

    subgraph COACHING["👤 코칭 플로우 — 멤버 전용"]
        C0["🏠 코칭 대시보드\n/coaching"]
        C1["✍️ 42문항 답변 입력\n/coaching/questions"]
        C2["🔍 내 답변 검토\n/coaching/review"]
        C3["🤖 AI 분석 중\n/coaching/analyzing"]
        C4["🏆 최종 리포트\n/coaching/report\nfinalized 상태만 접근"]
    end

    subgraph ADMIN["🛠️ 어드민 포털 — 어드민 전용"]
        AD["📊 어드민 대시보드\n/admin"]
        AD_LEAD["👤 리드 상세\n/admin/lead/:id"]
        AD_AI["🤖 AI 코칭 워크플로우\n/admin/brief ~ /admin/export"]
        AD_WS["🖥️ 코칭 워크스페이스\n/coaching/workspace/:memberId"]
        AD_FINALIZE{{"✅ 코칭 완료\n(Finalize 처리)"}}
    end

    IDX --> SVC
    IDX --> CONS
    IDX --> D1
    IDX --> LOGIN
    IDX --> A1
    IDX --> A2
    IDX --> A3
    IDX --> A4
    SVC --> D1
    SVC --> A1
    SVC --> A2
    SVC --> CONS

    D1 --> D2 --> D3 --> D4 --> D5
    D4 -->|서비스 신청 유도| A1

    A1 --> ATY
    A2 --> ATY
    A3 --> ATY
    A4 --> ATY

    LOGIN -->|멤버 계정| C0
    LOGIN -->|어드민 계정| AD

    C0 --> C1
    C0 -->|42문항 완료 후| C2
    C2 --> C1
    C2 -->|최종 제출| C3
    C3 -->|finalized 처리 후| C4
    C4 -->|대시보드로| C0

    AD --> AD_LEAD
    AD --> AD_AI
    AD_AI --> AD_WS
    AD_WS --> AD_FINALIZE
    AD_FINALIZE -->|멤버 리포트 열람 가능| C4

    IDX -.->|하단 링크| TERMS
    IDX -.->|하단 링크| PRIV
```

---

## 2. 비회원(Guest) 플로우

```mermaid
flowchart LR
    A([진입]) --> B["🏠 랜딩페이지\n/"]

    B --> C1["📋 서비스 소개\n/service"]
    B --> C2["🆓 무료 진단 시작\n/diagnosis"]
    B --> C3["💬 무료 상담 신청\n/consultation"]
    B --> C4["💳 상품 신청\n/apply/*"]

    C1 --> C2
    C1 --> C4

    C2 --> D1["① 이름·이메일 입력\n+ 개인정보 동의"]
    D1 --> D2["② 경력 진단 8문항"]
    D2 --> D3["③ AI 분석 중 (12초)"]
    D3 --> D4["④ 진단 리포트 확인"]
    D4 --> D5["⑤ 결과 이메일 발송 완료"]
    D4 -->|신청 유도 CTA| C4

    C4 --> E1["신청서 제출"]
    E1 --> E2["🎉 신청 완료\n/apply/thank-you"]
    E2 -->|운영자 연락 대기| F1(["📞 어드민 확인·연락"])

    C3 --> G1["상담 신청 폼 제출"]
    G1 --> F1
```

---

## 3. 멤버(Member) 코칭 플로우

```mermaid
flowchart TD
    START([어드민으로부터\n계정 수령]) --> LOGIN["🔑 로그인\n/login"]
    LOGIN --> DASH["🏠 코칭 대시보드\n/coaching"]

    DASH --> STATUS{세션 상태?}

    STATUS -->|in-progress| Q["✍️ 42문항 답변 입력\n/coaching/questions\n\n텍스트 또는 음성 입력\n파트 1~4 순서 진행"]

    Q -->|문항 이동| Q
    Q -->|답변 저장 후 검토| R["🔍 내 답변 전체 검토\n/coaching/review"]
    R -->|수정 필요 시| Q
    R -->|최종 제출| AN["🤖 AI 분석 대기 중\n/coaching/analyzing\n\n어드민이 분석 시작 후 진행됨"]

    STATUS -->|analyzing| AN
    AN -->|어드민이 Finalize 완료 시| DASH

    STATUS -->|finalized| RPT["🏆 최종 코칭 리포트\n/coaching/report\n\n• 포지셔닝 한 줄\n• 핵심 키워드\n• 산출물 목록\n• 출력·저장 가능"]
    RPT --> DASH

    DASH -->|로그아웃| HOME["🏠 랜딩페이지\n/"]
```

---

## 4. 어드민(Admin) 운영 플로우

```mermaid
flowchart TD
    ADMIN_LOGIN["🔑 로그인\nadmin@kkummolda.com"] --> AD["📊 어드민 대시보드\n/admin\n\n리드 목록·상태 관리\n알림 확인"]

    AD --> LEAD["👤 리드 상세\n/admin/lead/:id\n\n신청 내용 확인\n상태 변경(신규→검토→계약→진행중)"]

    AD --> NOTI["🔔 알림 관리\n/admin/notifications"]
    AD --> AUTH["🔐 계정 관리\n/admin/auth\n멤버 계정 발급"]

    AUTH -->|계정 발급 후 안내| MEMBER_LOGIN(["👤 멤버 로그인"])

    AD --> AIRUNS["📋 AI 실행 내역\n/admin/airuns"]

    subgraph AI_WORKFLOW["🤖 AI 코칭 워크플로우 (순서대로)"]
        WF1["1️⃣ 브리프 작성\n/admin/brief"]
        WF2["2️⃣ 한줄 포지셔닝\n/admin/oneliner"]
        WF3["3️⃣ 질문 관리\n/admin/questions"]
        WF4["4️⃣ 패턴 분석\n/admin/patterns"]
        WF5["5️⃣ 경력 매핑\n/admin/mapper"]
        WF6["6️⃣ 피드백 관리\n/admin/feedback"]
        WF7["7️⃣ 규칙 설정\n/admin/rules"]
        WF8["8️⃣ 교차 검증\n/admin/crosscheck"]
        WF9["9️⃣ 코칭 인계\n/admin/handoff"]
        WF1 --> WF2 --> WF3 --> WF4 --> WF5 --> WF6 --> WF7 --> WF8 --> WF9
    end

    AD --> WF1
    WF9 --> WS["🖥️ 코칭 워크스페이스\n/coaching/workspace/:memberId\n\n멤버 답변 확인·편집\n최종 리포트 작성"]

    WS --> FINAL{{"✅ Finalize\n처리"}}
    FINAL -->|멤버 세션 status → finalized| MEMBER_RPT(["👤 멤버 리포트 열람 가능"])

    AD --> RETAINER["📦 리테이너 구독\n/admin/retainer\n(Phase 3)"]
    AD --> EXPORT["📤 리포트 출력\n/admin/export\n(Phase 3)"]
```

---

## 5. 전체 페이지 목록

### 공개 페이지 (비회원 접근 가능)

| 경로 | 페이지명 | 역할 |
|---|---|---|
| `/` | 랜딩페이지 | 서비스 진입점, 전체 안내 |
| `/service` | 서비스 소개 | 방법론·산출물·비교표 상세 |
| `/consultation` | 무료 상담 신청 | 상담 신청 폼 |
| `/login` | 로그인 | 멤버·어드민 공통 로그인 |
| `/terms` | 이용약관 | 법적 약관 |
| `/privacy` | 개인정보처리방침 | 개인정보 처리 안내 |

### 무료 진단 플로우 (비회원, `/diagnosis` 단일 라우트)

| 단계 | 컴포넌트 | 역할 |
|---|---|---|
| Step 1 | `EmailCollect` | 이름·이메일·경력연수 입력, 개인정보 동의 |
| Step 2 | `DiagnosisForm` | 경력 진단 8문항 응답 |
| Step 3 | `AnalysisLoading` | AI 분석 로딩 (12초) |
| Step 4 | `Report` | 진단 결과 리포트 확인 |
| Step 5 | `Complete` | 이메일 발송 완료 안내 |

### 유료 서비스 신청 플로우 (비회원)

| 경로 | 페이지명 | 상품 |
|---|---|---|
| `/apply/diagnosis` | 한끗 진단 신청 | 50만원 · 진단 패키지 |
| `/apply/build` | 한끗 빌드 신청 | 350만원 · 경력 자산화 |
| `/apply/launch` | 한끗 론칭 신청 | 별도 문의 · 실전 런칭 |
| `/apply/partner` | 한끗 파트너 신청 | 별도 문의 · 장기 파트너십 |
| `/apply/thank-you` | 신청 완료 | 신청 접수 확인 |

### 코칭 플로우 (멤버 전용)

| 경로 | 페이지명 | 역할 | 접근 조건 |
|---|---|---|---|
| `/coaching` | 코칭 대시보드 | 진행 현황·상태 확인 | 멤버 로그인 |
| `/coaching/questions` | 42문항 답변 입력 | 텍스트·음성 입력, 파트별 진행 | 멤버 로그인 |
| `/coaching/review` | 내 답변 검토 | 제출 전 전체 답변 검토·수정 | 멤버 로그인 |
| `/coaching/analyzing` | AI 분석 대기 | 어드민 분석 중 대기 화면 | 멤버 로그인 |
| `/coaching/report` | 최종 코칭 리포트 | 포지셔닝·산출물 확인·출력 | finalized 상태 |

### 어드민 포털 (어드민 전용)

| 경로 | 페이지명 | 역할 |
|---|---|---|
| `/admin` | 어드민 대시보드 | 리드 목록·상태 관리·알림 |
| `/admin/lead/:id` | 리드 상세 | 개별 신청자 정보·상태 변경 |
| `/admin/notifications` | 알림 관리 | 신규 신청·메시지 알림 |
| `/admin/auth` | 계정 관리 | 멤버 계정 발급·관리 |
| `/admin/airuns` | AI 실행 내역 | AI 분석 기록 확인 |
| `/admin/brief` | 브리프 작성 | AI 코칭 워크플로우 Step 1 |
| `/admin/oneliner` | 한줄 포지셔닝 | AI 코칭 워크플로우 Step 2 |
| `/admin/questions` | 질문 관리 | AI 코칭 워크플로우 Step 3 |
| `/admin/patterns` | 패턴 분석 | AI 코칭 워크플로우 Step 4 |
| `/admin/mapper` | 경력 매핑 | AI 코칭 워크플로우 Step 5 |
| `/admin/feedback` | 피드백 관리 | AI 코칭 워크플로우 Step 6 |
| `/admin/rules` | 규칙 설정 | AI 코칭 워크플로우 Step 7 |
| `/admin/crosscheck` | 교차 검증 | AI 코칭 워크플로우 Step 8 |
| `/admin/handoff` | 코칭 인계 | AI 코칭 워크플로우 Step 9 |
| `/coaching/workspace/:memberId` | 코칭 워크스페이스 | 멤버 답변 확인·최종 리포트 작성 |
| `/admin/retainer` | 리테이너 구독 | 구독 관리 (Phase 3) |
| `/admin/export` | 리포트 출력 | PPT·PDF 출력 (Phase 3) |

---

## 6. 권한별 접근 범위

```mermaid
flowchart LR
    subgraph GUEST["👥 비회원 (Guest)"]
        G1["랜딩 /"]
        G2["서비스 소개 /service"]
        G3["무료 진단 /diagnosis"]
        G4["상담 신청 /consultation"]
        G5["상품 신청 /apply/*"]
        G6["로그인 /login"]
        G7["이용약관 /terms"]
        G8["개인정보처리방침 /privacy"]
    end

    subgraph MEMBER["👤 멤버 (Member)"]
        M0["비회원 전체 포함"]
        M1["코칭 대시보드 /coaching"]
        M2["42문항 입력 /coaching/questions"]
        M3["답변 검토 /coaching/review"]
        M4["AI 분석 대기 /coaching/analyzing"]
        M5["최종 리포트 /coaching/report\n(finalized 후)"]
    end

    subgraph ADMIN["🛡️ 어드민 (Admin)"]
        A0["멤버 전체 포함"]
        A1["어드민 포털 /admin/*"]
        A2["코칭 워크스페이스\n/coaching/workspace/:id"]
    end

    GUEST --> MEMBER
    MEMBER --> ADMIN
```

---

## 7. 핵심 상태 전환

멤버의 코칭 세션은 4가지 상태로 관리됩니다.

```mermaid
stateDiagram-v2
    [*] --> in_progress: 계정 발급·최초 로그인
    in_progress --> in_progress: 문항 답변 저장 중
    in_progress --> analyzing: 최종 제출 (CoachingReview → 제출)
    analyzing --> analyzing: 어드민 AI 분석 작업 중
    analyzing --> finalized: 어드민 Finalize 처리
    finalized --> finalized: 리포트 열람·출력

    in_progress: in-progress\n42문항 작성 중
    analyzing: analyzing\n어드민 분석 대기
    finalized: finalized\n리포트 열람 가능
```

---

*이 문서는 `src/App.tsx` 라우트 구성을 기반으로 작성되었습니다.*
