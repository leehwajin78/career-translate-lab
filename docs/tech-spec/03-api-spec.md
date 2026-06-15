# 03 — API 명세

> **Base URL**: `https://{SUPABASE_PROJECT}.supabase.co`  
> **Auth**: `Authorization: Bearer {JWT}` (Supabase Auth)  
> **Content-Type**: `application/json`  
> **버전 전략**: URL 버전 없음 (Supabase PostgREST 자동 관리), Edge Function은 /v1/ 접두어

---

## 1. 인증 API (Supabase Auth 내장)

### POST /auth/v1/signup — 회원가입

```json
// Request
{
  "email": "user@example.com",
  "password": "securePassword123!",
  "options": {
    "data": { "name": "김명진", "role": "guest" }
  }
}

// Response 200
{
  "user": { "id": "uuid", "email": "...", "created_at": "..." },
  "session": { "access_token": "...", "refresh_token": "...", "expires_in": 3600 }
}

// Error 400
{ "error": "User already registered", "error_description": "..." }
```

---

### POST /auth/v1/token?grant_type=password — 로그인

```json
// Request
{ "email": "user@example.com", "password": "..." }

// Response 200
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "user": { "id": "uuid", "email": "...", "user_metadata": { "name": "...", "role": "..." } }
}

// Error 400
{ "error": "invalid_grant", "error_description": "Invalid login credentials" }
```

**보안 제어**:
- 로그인 실패 5회 → 15분 잠금 (Supabase 내장 Rate Limit)
- Refresh Token: 7일, Rotate 정책

---

### POST /auth/v1/logout — 로그아웃

```
Authorization: Bearer {access_token}
→ 204 No Content
```

---

## 2. 무료 진단 API

### POST /functions/v1/free-diagnosis-submit — 진단 제출

> Edge Function — 이메일 발송 + DB 저장 통합

```json
// Request
{
  "email": "user@example.com",
  "name": "김명진",
  "careerYears": "20~25년",
  "answers": {
    "q1": "30년 제조업 경험으로...",
    "q2": "팀을 이끌어 위기를 극복했을 때...",
    "q3": ["협상", "팀 리딩", "원가분석"],
    "q4": "협상 및 갈등 해결",
    "q5": "퇴직 후 방향을 못 찾는 50대 전문가",
    "q6": "대기업과 중소기업 양측 경험",
    "q7": "경험은 누구나 쌓지만 자산으로 만드는 사람은 드뭅니다"
  },
  "bonusChecks": ["없음"],
  "consentAt": "2026-06-15T10:30:00Z"
}

// Response 200
{
  "diagnosisId": "uuid",
  "score": {
    "total": 72,
    "identityLanguage": 15,
    "coreValues": 18,
    "expertisePositioning": 14,
    "targetClarity": 12,
    "marketAssets": 13,
    "diagnosisType": "hidden-expert",
    "recommendedPackage": "build"
  },
  "emailSent": true
}

// Error 422 — 유효성 오류
{
  "error": "VALIDATION_ERROR",
  "message": "이메일 형식이 올바르지 않습니다.",
  "field": "email"
}

// Error 429 — 동일 이메일 24시간 내 재제출
{
  "error": "RATE_LIMITED",
  "message": "동일 이메일로 24시간 내 재진단은 1회만 허용됩니다.",
  "retryAfter": 86400
}
```

---

### GET /rest/v1/free_diagnostics?id=eq.{id} — 진단 결과 조회

```
Authorization: Bearer {access_token}

// Response 200
[{
  "id": "uuid",
  "email": "...",
  "score": { ... },
  "status": "completed",
  "created_at": "..."
}]
```

---

## 3. 코칭 API

### GET /rest/v1/coaching_sessions?profile_id=eq.{uid} — 세션 조회

```json
// Response 200
[{
  "id": "uuid",
  "membership_id": "uuid",
  "status": "in_progress",
  "submitted_at": null,
  "created_at": "2026-06-01T09:00:00Z"
}]
```

---

### POST /rest/v1/coaching_answers — 답변 저장 (Upsert)

```json
// Request (단건 또는 배열)
{
  "session_id": "uuid",
  "question_id": 3,
  "text_answer": "특별히 애쓰지 않아도...",
  "voice_url": null,
  "voice_mime": null,
  "voice_duration": null
}

// 헤더 추가: Prefer: resolution=merge-duplicates
// → question_id 중복 시 UPDATE

// Response 201 / 200
{ "id": "uuid", "question_id": 3, "updated_at": "..." }
```

---

### POST /functions/v1/upload-voice — 음성 파일 업로드

```json
// Request: multipart/form-data
// Fields:
//   session_id: "uuid"
//   question_id: 3
//   audio: [Blob]
//   mime_type: "audio/webm"
//   duration: 45  (초)

// Response 200
{
  "voiceUrl": "https://...supabase.co/storage/v1/object/sign/voice-recordings/uuid/3.webm?token=...",
  "expiresAt": "2026-06-16T10:30:00Z"
}

// Error 413 — 파일 크기 초과 (제한: 10MB)
{ "error": "FILE_TOO_LARGE", "maxSize": 10485760 }
```

---

### POST /functions/v1/submit-coaching — 제출 + AI 분석 트리거

```json
// Request
{ "session_id": "uuid" }

// 처리 흐름:
// 1. 미완료 문항 수 체크 (1개 이상 미입력 시 경고만, 차단 안 함)
// 2. session status → "submitted"
// 3. Edge Function 비동기 AI 분석 시작 (status → "analyzing")
// 4. 완료 시 status → "analyzed" + 이메일 발송

// Response 202 Accepted
{
  "sessionId": "uuid",
  "status": "analyzing",
  "estimatedMinutes": 3,
  "message": "분석이 시작되었습니다. 완료 시 이메일로 알림을 보내드립니다."
}

// Error 409 — 이미 제출됨
{ "error": "ALREADY_SUBMITTED", "status": "analyzing" }
```

---

### GET /functions/v1/coaching-status/{session_id} — 분석 진행 상태 폴링

```json
// Response 200
{
  "sessionId": "uuid",
  "status": "analyzing",  // in_progress | submitted | analyzing | analyzed | finalized
  "progress": 60,         // 0~100 (추정치)
  "startedAt": "2026-06-15T10:30:00Z"
}
```

---

### GET /rest/v1/coaching_reports?session_id=eq.{id} — 리포트 조회

```json
// Response 200
[{
  "id": "uuid",
  "brand_profile": {
    "oneLiner": "30년 제조업 현장 경험으로 중소기업의 품질 문제를 직접 해결하는 전문가",
    "coreValues": ["현장감", "문제해결", "신뢰"],
    "strengthStatement": "...",
    "targetAudience": "...",
    "differentiator": "...",
    "keyMessages": ["...", "..."],
    "suggestedTitle": "제조업 혁신 컨설턴트",
    "suggestedBio": "..."
  },
  "generated_at": "2026-06-15T10:35:00Z",
  "version": 1
}]
```

---

## 4. 결제 API (Edge Function)

### POST /functions/v1/create-payment — 결제 요청 생성

```json
// Request
{
  "productKey": "build",
  "successUrl": "https://career-translate-lab-2.vercel.app/apply/thank-you",
  "failUrl":    "https://career-translate-lab-2.vercel.app/apply/build?error=payment"
}

// Response 200
{
  "orderId":     "HK-20260615-abc123",
  "orderName":   "한끗 빌드",
  "amount":      3500000,
  "clientKey":   "test_ck_...",  // 토스 클라이언트 키 (공개)
  "customerEmail": "user@example.com",
  "customerName":  "김명진"
}
```

---

### POST /functions/v1/confirm-payment — 결제 승인 (토스 Webhook 수신)

```json
// 토스페이먼츠 → Supabase Edge Function Webhook
// Request (토스 서버에서 전송)
{
  "paymentKey": "tgen_...",
  "orderId":    "HK-20260615-abc123",
  "amount":     3500000,
  "status":     "DONE"
}

// 처리:
// 1. HMAC 서명 검증
// 2. orderId로 payments 레코드 조회
// 3. amount 검증 (DB값 vs Webhook값 일치)
// 4. payments.status → "paid"
// 5. memberships 생성 (status: "active")
// 6. 환영 이메일 발송
// 7. 코칭 세션 자동 생성 (build 이상)

// Response 200 (토스에 200 반환 필수)
{ "success": true }

// Error 400 — 금액 불일치 (보안 이벤트 로그)
{ "success": false, "error": "AMOUNT_MISMATCH" }
```

---

## 5. Admin API

### GET /rest/v1/leads?order=created_at.desc — 리드 목록

```
Authorization: Bearer {admin_jwt}
Query: status=eq.new&limit=20&offset=0
```

### PATCH /rest/v1/leads?id=eq.{id} — 리드 상태 변경

```json
{ "status": "contacted", "assigned_to": "admin_uuid" }
```

### GET /rest/v1/profiles?role=eq.member — 멤버 목록

### POST /rest/v1/profiles — 멤버 계정 수동 생성 (Admin 전용)

---

## 6. 공통 에러 코드

| HTTP | 에러 코드 | 설명 |
|---|---|---|
| 400 | INVALID_REQUEST | 요청 형식 오류 |
| 401 | UNAUTHORIZED | 미인증 또는 토큰 만료 |
| 403 | FORBIDDEN | 권한 없음 (RLS 위반) |
| 404 | NOT_FOUND | 리소스 없음 |
| 409 | CONFLICT | 중복 데이터 (이메일 등) |
| 422 | VALIDATION_ERROR | 유효성 검사 실패 |
| 429 | RATE_LIMITED | 요청 횟수 초과 |
| 500 | INTERNAL_ERROR | 서버 내부 오류 |
| 503 | SERVICE_UNAVAILABLE | OpenAI / Resend 외부 API 장애 |

### 에러 응답 공통 포맷

```json
{
  "error": "VALIDATION_ERROR",
  "message": "사람이 읽을 수 있는 메시지",
  "field": "email",          // 선택적 (유효성 오류 시)
  "requestId": "uuid",       // 로그 추적용
  "timestamp": "2026-06-15T10:30:00Z"
}
```

---

## 7. Rate Limiting 정책

| 엔드포인트 | 제한 | 단위 |
|---|---|---|
| /auth/v1/token (로그인) | 5회 실패 | IP당 15분 잠금 |
| /functions/v1/free-diagnosis-submit | 1회 | 이메일당 24시간 |
| /functions/v1/upload-voice | 100회 | 세션당 |
| /functions/v1/submit-coaching | 3회 | 세션당 (재제출 허용) |
| 기타 REST | 1000 req | IP당 1시간 |
