# 05 — 운영 설계

---

## 1. 에러 처리 전략

### 계층별 에러 처리

```
[사용자 입력 에러]  → 폼 레벨 Zod 검증 → 인라인 에러 메시지
[네트워크 에러]     → React Query 재시도 + Toast 알림
[서버 에러 (4xx)]   → 에러 코드별 사용자 안내 메시지
[서버 에러 (5xx)]   → Error Boundary + 관리자 알림
[예기치 않은 에러]   → Global Error Boundary → Fallback UI
```

### Global Error Boundary

```typescript
// src/components/ErrorBoundary.tsx
class ErrorBoundary extends Component<Props, State> {
  componentDidCatch(error: Error, info: ErrorInfo) {
    // 1. Sentry 에러 리포팅
    Sentry.captureException(error, { extra: info })
    
    // 2. 운영자 Slack 알림 (치명적 에러)
    if (isCritical(error)) {
      notifySlack(`🚨 Critical Error: ${error.message}`)
    }
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={() => window.location.reload()} />
    }
    return this.props.children
  }
}
```

### React Query 에러 처리 및 재시도

```typescript
// src/lib/queryClient.ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // 4xx 에러는 재시도 안 함
        if (error instanceof ApiError && error.status < 500) return false
        return failureCount < 3
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 1000 * 60 * 5,  // 5분
    },
    mutations: {
      onError: (error) => {
        toast.error(getErrorMessage(error))
      }
    }
  }
})
```

### 사용자 에러 메시지 매핑

```typescript
// src/lib/errorMessages.ts
const ERROR_MESSAGES: Record<string, string> = {
  UNAUTHORIZED:        '로그인이 필요합니다.',
  FORBIDDEN:           '접근 권한이 없습니다.',
  RATE_LIMITED:        '잠시 후 다시 시도해주세요.',
  ALREADY_SUBMITTED:   '이미 제출된 답변입니다.',
  FILE_TOO_LARGE:      '파일 크기가 10MB를 초과합니다.',
  SERVICE_UNAVAILABLE: '서비스가 일시적으로 불안정합니다. 잠시 후 다시 시도해주세요.',
  INTERNAL_ERROR:      '오류가 발생했습니다. 문제가 지속되면 070-4090-2161로 연락해주세요.',
}
```

---

## 2. 코칭 AI 분석 실패 처리 (Mission-Critical)

코칭 분석은 외부 AI API 의존으로 실패 가능성이 높다. 반드시 재시도 및 폴백 처리가 필요하다.

```
[AI 분석 요청]
      │
      ▼
[Edge Function: analyze-coaching]
      │
      ├─ OpenAI 호출 성공 → 리포트 저장 → 이메일 발송 → 완료
      │
      ├─ OpenAI 타임아웃 (30초) → 재시도 (3회, exponential backoff)
      │       └─ 3회 실패 시 → status: "analyze_failed"
      │                        → Admin Slack 알림
      │                        → 고객 "수동 분석 진행" 이메일 발송
      │
      └─ 부분 응답 (JSON 파싱 실패)
              └─ 기본 템플릿으로 부분 리포트 생성
                 + Admin 검토 플래그 설정
```

### 분석 실패 시 고객 커뮤니케이션

```
제목: [한끗프로젝트] 분석 결과 안내
내용: 
  AI 분석 과정에서 일시적인 기술 문제가 발생했습니다.
  이화진 대표가 직접 검토하여 {영업일 2일} 이내에 결과를 전달드립니다.
  불편을 드려 죄송합니다.
```

---

## 3. 모니터링

### 핵심 지표 (KPI Dashboards)

| 카테고리 | 지표 | 임계값 | 알림 채널 |
|---|---|---|---|
| **가용성** | API 응답률 | < 99% → 경고 | Slack #ops |
| **성능** | API P95 응답시간 | > 3s → 경고 | Slack #ops |
| **비즈니스** | 무료 진단 완료율 | < 60% → 검토 | Weekly 리포트 |
| **비즈니스** | 진단 → 상담 전환율 | < 10% → 검토 | Weekly 리포트 |
| **에러** | 5xx 비율 | > 1% → 즉시 | PagerDuty |
| **AI** | 분석 실패율 | > 5% → 즉시 | Slack #ops |
| **결제** | 결제 실패율 | > 3% → 즉시 | Slack #ops |

### 로깅 전략

```typescript
// 구조화 로그 (JSON Lines)
// Edge Function 내부
console.log(JSON.stringify({
  level:     'info',
  event:     'free_diagnosis.completed',
  diagnosisId: id,
  email:     maskEmail(email),   // yeki7***@gmail.com
  score:     score.total,
  duration:  Date.now() - startTime,
  requestId: requestId
}))

// 로그 레벨
// DEBUG: 개발환경만
// INFO:  정상 플로우 (진단 완료, 결제 성공, 이메일 발송)
// WARN:  비정상이지만 복구 가능 (재시도, 파티컬 실패)
// ERROR: 즉시 대응 필요 (분석 실패, 결제 오류, 인증 침해 시도)
```

### Sentry 설정

```typescript
// src/main.tsx
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.2,    // 20% 트랜잭션 추적
  replaysOnErrorSampleRate: 1.0,  // 에러 시 세션 리플레이 100%
  beforeSend(event) {
    // 개인정보 마스킹
    if (event.user?.email) {
      event.user.email = maskEmail(event.user.email)
    }
    return event
  }
})
```

---

## 4. CI/CD 파이프라인

### GitHub Actions 워크플로우

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, staging, feat/*]
  pull_request:
    branches: [main, staging]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run test          # Vitest
      - run: npm run build         # 빌드 성공 여부

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/staging'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-prod:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 배포 프로세스

```
[개발자]
    │ git push feat/xxx
    ▼
[GitHub Actions] → lint + test + build
    │ 성공
    ▼
[PR 생성 → main/staging]
    │ 코드 리뷰 (선택)
    ▼
[Merge]
    │
    ▼
[Vercel 자동 배포]
    │ 빌드 실패 시 → Slack 알림 + 이전 버전 유지
    ▼
[배포 완료]
    │ Vercel Preview URL 생성
    ▼
[검증] → 사이트 정상 확인 후 종료
```

### 롤백 절차

```bash
# Vercel Dashboard → Deployments → 이전 배포 → Promote to Production
# 소요 시간: < 30초

# 또는 git revert
git revert HEAD --no-edit
git push origin main
# → Vercel 자동 재배포
```

---

## 5. 성능 최적화

### 이미지 최적화

```typescript
// Vercel Image Optimization 활용
// next/image 미사용 (Vite SPA) → 수동 최적화
// WebP 포맷, 적절한 sizes 속성
<img 
  src="/images/hero.webp" 
  srcSet="/images/hero-640.webp 640w, /images/hero-1280.webp 1280w"
  sizes="(max-width: 640px) 640px, 1280px"
  loading="lazy"
  decoding="async"
/>
```

### 코드 스플리팅 구현

```typescript
// src/App.tsx
const CoachingQuestions = lazy(() => import('./pages/coaching/CoachingQuestions'))
const CoachingReport    = lazy(() => import('./pages/coaching/CoachingReport'))
const Admin             = lazy(() => import('./pages/Admin'))

// Suspense Fallback
<Suspense fallback={<PageSkeleton />}>
  <Routes> ... </Routes>
</Suspense>
```

### 무료 진단 로컬 분석 캐싱

```typescript
// 동일 답변에 대한 중복 분석 방지
// src/lib/diagnostic.ts
const analysisCache = new Map<string, DiagnosticResult>()

export function analyze(answers: Answers): DiagnosticResult {
  const cacheKey = JSON.stringify(answers)
  if (analysisCache.has(cacheKey)) return analysisCache.get(cacheKey)!
  const result = runAnalysis(answers)
  analysisCache.set(cacheKey, result)
  return result
}
```

---

## 6. 장애 시나리오 대응표

| 시나리오 | 감지 방법 | 자동 대응 | 수동 대응 | RTO |
|---|---|---|---|---|
| Vercel 배포 실패 | GitHub Actions 알림 | 이전 버전 유지 | 이전 커밋으로 재배포 | < 5분 |
| Supabase DB 다운 | 5xx 모니터링 | React Query 재시도 | Supabase Status 확인 | Supabase SLA 기준 |
| OpenAI API 다운 | 분석 실패율 | 3회 재시도 → 수동 처리 플래그 | Admin 수동 분석 + 이메일 | 2 영업일 |
| 이메일 발송 실패 | Resend Webhook | 1회 재발송 (1시간 후) | Admin 수동 발송 | 24시간 |
| 결제 Webhook 누락 | 결제 상태 불일치 감지 | 재전송 버튼 (토스 대시보드) | 수동 결제 확인 후 DB 업데이트 | 2시간 |
| 음성 파일 업로드 실패 | 클라이언트 에러 | 3회 재시도 | 텍스트 입력으로 대체 안내 | 즉시 대체 |

---

## 7. SLA 목표

| 항목 | 목표 |
|---|---|
| 서비스 가용성 | 99.5% (월 기준 최대 3.6시간 다운) |
| 무료 진단 → 이메일 수신 | < 5분 |
| 코칭 AI 분석 완료 | < 10분 (P90) |
| 고객 문의 응답 | 영업일 1일 이내 |
| 개인정보 삭제 요청 처리 | 30일 이내 |
