# 04 — 보안·권한 설계

---

## 1. 인증 흐름 (Authentication Flow)

```
[사용자]
    │
    ├─ Guest (미인증)
    │       └─ 랜딩, 무료진단, 서비스 소개 접근 허용
    │          → 이메일+비밀번호 회원가입 또는 OTP 로그인
    │
    └─ 로그인 요청
            │
            ▼
    [Supabase Auth]
            │ JWT 발급 (access_token: 1시간, refresh_token: 7일)
            │ access_token → localStorage 저장 (httpOnly 불가: SPA 특성상)
            │ → XSS 방어를 Content Security Policy로 보완
            ▼
    [React App]
            │ authStore.ts가 JWT 보관
            │ API 호출 시 Authorization: Bearer {token} 헤더 자동 주입
            ▼
    [Supabase RLS]
            │ auth.uid() 기반 행 수준 접근 제어
            └─ 각 테이블 Policy 참조 (02-data-model.md)
```

### 토큰 갱신 전략

```typescript
// src/lib/supabaseClient.ts
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    authStore.getState().setSession(session)
  }
  if (event === 'SIGNED_OUT') {
    authStore.getState().clearSession()
    // 민감 페이지 접근 시 /login으로 리다이렉트
  }
})
```

---

## 2. 권한 체계 (RBAC)

### 역할 정의

| 역할 | 획득 조건 | 권한 범위 |
|---|---|---|
| `guest` | 회원가입 기본값 | 무료 진단, 서비스 소개 |
| `member` | Admin이 멤버십 활성화 후 role 변경 | 코칭 워크스페이스 (본인 데이터만) |
| `admin` | DB 직접 부여 (초기 운영자) | 전체 데이터, 멤버 관리 |

### 화면별 접근 제어

```typescript
// src/components/ProtectedRoute.tsx
type RequiredRole = 'guest' | 'member' | 'admin'

function ProtectedRoute({ role, children }: { role: RequiredRole, children: ReactNode }) {
  const { currentUser } = useAuthStore()
  
  if (!currentUser) return <Navigate to="/login" replace />
  
  const roleLevel = { guest: 0, member: 1, admin: 2 }
  if (roleLevel[currentUser.role] < roleLevel[role]) {
    return <Navigate to="/unauthorized" replace />
  }
  
  return <>{children}</>
}

// App.tsx 라우트 적용
<Route path="/coaching/*" element={
  <ProtectedRoute role="member"><CoachingLayout /></ProtectedRoute>
} />
<Route path="/admin/*" element={
  <ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>
} />
```

### Admin 계정 보호

- Admin role은 Supabase 대시보드에서만 부여 (UI로 변경 불가)
- Admin 전용 기능은 별도 RLS Policy로 이중 검증
- Admin 세션 타임아웃: 4시간 (일반 사용자: 1시간)

---

## 3. 민감정보 처리

### 개인정보 항목별 처리 기준

| 항목 | 분류 | 저장 위치 | 암호화 | 보존 기간 |
|---|---|---|---|---|
| 이름 | 일반 개인정보 | DB (평문) | Transport (TLS) | 2년 |
| 이메일 | 일반 개인정보 | DB (평문) | Transport (TLS) | 2년 |
| 전화번호 | 일반 개인정보 | DB (평문) | Transport (TLS) | 2년 |
| 진단 답변 | 민감 개인정보 | DB (JSONB) | TLS + RLS | 2년 |
| 음성 녹음 | 민감 개인정보 | Storage (Private) | AES-256 at rest | 6개월 |
| 비밀번호 | 인증정보 | Auth (bcrypt hash) | bcrypt | 계정 유지 중 |
| 결제 카드정보 | 금융정보 | **저장 안 함** | 토스페이먼츠 위임 | - |

### 음성 파일 접근 제어

```
Storage 버킷: voice-recordings
정책: PRIVATE (signed URL만 허용)
서명 TTL: 1시간
경로 규칙: {session_id}/{question_id}.{ext}

RLS (Storage): 
  - 본인 세션 ID 포함 경로만 읽기 허용
  - 쓰기: Edge Function (service_role)만 허용
```

### 개인정보 삭제 요청 처리 (GDPR/개인정보보호법)

```typescript
// /functions/v1/delete-account Edge Function
// 처리 순서:
// 1. auth.users 삭제 (Cascade → profiles 삭제)
// 2. free_diagnostics: email anonymize (email → 'deleted@...')
// 3. coaching_answers: text_answer → null, voice_url → null + Storage 파일 삭제
// 4. leads: email anonymize
// 5. payments: 보존 (국세청 5년 규정)
// 6. 삭제 완료 이메일 발송
// SLA: 요청 후 30일 이내 처리
```

---

## 4. API 보안

### Supabase anon key vs service_role key

| 키 | 사용 위치 | 접근 가능 |
|---|---|---|
| `anon key` | 클라이언트 (VITE_SUPABASE_ANON_KEY) | RLS 적용된 테이블만 |
| `service_role key` | Edge Function (서버사이드) | RLS 우회 (전체 접근) |

**절대 클라이언트에 service_role key 노출 금지**

### Edge Function 내 외부 API 키 보호

```typescript
// supabase/functions/analyze-coaching/index.ts
const OPENAI_KEY = Deno.env.get('OPENAI_API_KEY')  // 환경변수
const RESEND_KEY = Deno.env.get('RESEND_API_KEY')

// 클라이언트는 Edge Function URL만 호출 → 키 노출 없음
```

### Webhook 서명 검증 (결제)

```typescript
// supabase/functions/payment-webhook/index.ts
const TOSS_SECRET = Deno.env.get('TOSSPAYMENTS_SECRET_KEY')

function verifyWebhookSignature(body: string, signature: string): boolean {
  const hmac = createHmac('sha256', TOSS_SECRET)
  hmac.update(body)
  const expected = hmac.digest('base64')
  // timing-safe compare
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}
```

---

## 5. 프론트엔드 보안

### Content Security Policy (CSP)

```
# vercel.json headers 설정
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://js.tosspayments.com;
  style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
  font-src 'self' https://cdn.jsdelivr.net;
  connect-src 'self' https://*.supabase.co https://api.openai.com;
  img-src 'self' data: https://*.supabase.co;
  media-src 'self' blob: https://*.supabase.co;
  frame-src https://js.tosspayments.com;
```

### XSS 방어

- React의 JSX 자동 이스케이프로 대부분 방어
- `dangerouslySetInnerHTML` 사용 금지 (AI 생성 콘텐츠 포함)
- AI 리포트 텍스트: DOMPurify로 sanitize 후 렌더링

```typescript
import DOMPurify from 'dompurify'
// coaching 리포트에서 AI 생성 HTML 표시 시
const safeHtml = DOMPurify.sanitize(report.brand_profile.suggestedBio)
```

### CSRF 방어

- Supabase JWT 헤더 인증 → Cookie 미사용 → CSRF 원천 차단
- 결제 Webhook: HMAC 서명 검증으로 위변조 방어

### 입력값 검증

```typescript
// src/lib/validation.ts — Zod 스키마 정의
const FreeDiagnosisSchema = z.object({
  email:       z.string().email('올바른 이메일을 입력해주세요'),
  name:        z.string().min(1).max(50),
  careerYears: z.enum(['10년 미만','10~15년','15~20년','20~25년','25~30년','30년 이상']),
  answers:     z.record(z.string().min(5, '5자 이상 입력해주세요').max(2000)),
  consentAt:   z.string().datetime()
})
// React Hook Form + Zod resolver로 폼 레벨 검증
// Edge Function에서도 동일 스키마로 서버사이드 재검증
```

---

## 6. 감사 로그 (Audit Log)

Admin 행위와 민감 데이터 접근은 별도 테이블에 기록한다.

```sql
CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    UUID REFERENCES profiles(id),
  action      TEXT NOT NULL,   -- 'member.create', 'lead.status_change', 'report.finalize'
  target_type TEXT,            -- 'membership', 'lead', 'coaching_report'
  target_id   UUID,
  before_val  JSONB,
  after_val   JSONB,
  ip_address  INET,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Admin만 조회 가능, 삭제 불가 (INSERT only)
```

---

## 7. 보안 체크리스트 (배포 전)

- [ ] HTTPS 강제 리다이렉트 (Vercel 자동)
- [ ] Supabase anon key만 클라이언트 노출 확인
- [ ] CSP 헤더 vercel.json 설정 완료
- [ ] 결제 Webhook HMAC 검증 구현 완료
- [ ] RLS 전체 테이블 적용 확인 (`pg_tables`로 검증)
- [ ] 음성 파일 버킷 Public 설정 해제 확인
- [ ] 관리자 계정 초기 비밀번호 변경
- [ ] 로그인 Rate Limit 테스트 (5회 실패 후 잠금 확인)
- [ ] OWASP Top 10 검토 완료
- [ ] 개인정보처리방침 privacy.html 최신화 확인
