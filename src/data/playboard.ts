// ============================================================
// PlayBoard — SoT 데이터 스키마 (Phase A)
//
// 이 파일이 모든 화면 명세·이슈·변경 이력의 단일 데이터 출처입니다.
// PLAYBOARD.md 는 이 파일의 산문 뷰입니다.
// UI는 src/pages/Playboard.tsx 가 이 파일을 읽어 렌더링합니다.
//
// 수정 규칙 (CLAUDE.md §2 참조):
//  - 구현 완료 → fe / be 상태 갱신
//  - 신규 요구사항 → frs 배열에 FR 추가 + changes 배열에 CHG 추가
//  - 신규 이슈 → issues 배열에 추가
// ============================================================

// ── 기본 열거형 ─────────────────────────────────────────────
export type ImplStatus  = 'done' | 'partial' | 'not-started' | 'hold'
export type Phase       = 'current' | 'p1' | 'current-p1' | 'p15' | 'p2' | 'p3'
export type Auth        = 'Guest' | 'Member' | 'Admin'
export type CoverageStatus = 'covered' | 'partial' | 'gap' | 'na'
export type IssueType   = 'decision' | 'design' | 'impl' | 'qa'
export type IssuePriority = 'high' | 'medium' | 'low'
export type IssueStatus = 'open' | 'resolved' | 'deferred'
export type ChangeType  = 'add' | 'modify' | 'delete' | 'decision' | 'arch'

// ── 기능 요구사항 ────────────────────────────────────────────
export interface FR {
  id: string           // FR-C03-01
  title: string
  detail: string
  gate?: string        // 이 FR이 통과해야 다음 단계로 넘어갈 수 있는 조건
}

// ── 비기능 요구사항 ──────────────────────────────────────────
export interface NFR {
  id: string           // NFR-C03-01
  detail: string
}

// ── 엣지 케이스 ─────────────────────────────────────────────
export interface EdgeCase {
  id: string           // EDGE-C03-01
  condition: string
  behavior: string
}

// ── 커버리지 매트릭스 (Phase C 도메인) ───────────────────────
export interface CoverageMatrix {
  auth:           CoverageStatus   // 인증·세션
  accessControl:  CoverageStatus   // 접근 제어
  dataIntegrity:  CoverageStatus   // 데이터 무결성·백업
  failureRecovery:CoverageStatus   // 장애·복구
  observability:  CoverageStatus   // 관측성
  performance:    CoverageStatus   // 성능·캐시
}

// ── 기술 명세 (per screen) ────────────────────────────────────
export interface ScreenSpec {
  purpose: string
  stores: string[]         // 읽거나 쓰는 Zustand store
  apis: string[]           // 호출하는 Edge Function 경로
  dataContract: {
    in: Record<string, string>   // { 필드명: 타입 }
    out: Record<string, string>
  }
}

// ── 화면 노드 (핵심 엔티티) ──────────────────────────────────
export interface Screen {
  id: string               // C-01, A-03, R-02
  name: string
  route: string | null     // React Router 경로 (null = 미등록)
  proto: string | null     // hankkeut-prototype/*.html 파일명
  component: string        // src/pages/... 경로
  phase: Phase
  auth: Auth
  fe: ImplStatus
  be: ImplStatus
  isMissionCritical: boolean
  spec: ScreenSpec
  frs: FR[]
  nfrs: NFR[]
  edges: EdgeCase[]
  acceptanceCriteria: string[]
  coverage: CoverageMatrix
  openIssues: string[]     // ISSUE-xx ID 참조
}

// ── 이슈 노드 ────────────────────────────────────────────────
export interface Issue {
  id: string               // ISSUE-01
  screens: string[]        // 연관 화면 ID
  type: IssueType
  priority: IssuePriority
  status: IssueStatus
  title: string
  body: string
  blockedBy: string[]      // 이 이슈 해결을 막는 다른 이슈 ID
  blocks: string[]         // 이 이슈가 해결되어야 unblock 되는 이슈 ID
  resolvedBy?: string      // CHG-xxx
}

// ── 변경 이력 노드 ────────────────────────────────────────────
export interface Change {
  id: string               // CHG-001
  date: string             // ISO 8601
  screens: string[]
  type: ChangeType
  description: string
  source: string           // PRD 업데이트 / PM 요청 / 기술 결정
}

// ── PlayBoard 루트 타입 ───────────────────────────────────────
export interface PlayBoardData {
  version: string
  lastUpdated: string
  screens: Screen[]
  issues: Issue[]
  changes: Change[]
}

// ============================================================
// 데이터
// ============================================================

// ── 커버리지 기본값 (공개 정적 페이지용) ─────────────────────
const COV_STATIC: CoverageMatrix = {
  auth: 'na', accessControl: 'na', dataIntegrity: 'na',
  failureRecovery: 'gap', observability: 'gap', performance: 'gap',
}

// ── 커버리지 기본값 (회원 전용 페이지용) ─────────────────────
const COV_MEMBER_BASE: CoverageMatrix = {
  auth: 'covered', accessControl: 'covered', dataIntegrity: 'partial',
  failureRecovery: 'partial', observability: 'gap', performance: 'gap',
}

// ── 커버리지 기본값 (어드민 전용 페이지용) ────────────────────
const COV_ADMIN_BASE: CoverageMatrix = {
  auth: 'covered', accessControl: 'covered', dataIntegrity: 'partial',
  failureRecovery: 'partial', observability: 'gap', performance: 'na',
}

// ── 빈 spec 기본값 ───────────────────────────────────────────
function emptySpec(purpose: string): ScreenSpec {
  return { purpose, stores: [], apis: [], dataContract: { in: {}, out: {} } }
}

// ============================================================
// SCREENS 배열 (34개)
// ============================================================
const SCREENS: Screen[] = [

  // ── C-01 메인 랜딩 ─────────────────────────────────────────
  {
    id: 'C-01', name: '메인 랜딩', route: '/',
    proto: 'landing.html', component: 'src/pages/Index.tsx',
    phase: 'current', auth: 'Guest', fe: 'partial', be: 'not-started',
    isMissionCritical: false,
    spec: {
      purpose: '히어로 + 가치 제안 + 상품 안내 + FAQ. 무료 진단·상담 유입 관문.',
      stores: [], apis: [],
      dataContract: { in: {}, out: {} },
    },
    frs: [
      { id: 'FR-C01-01', title: '히어로 섹션', detail: 'CTA 2개: "경력 가치 무료 진단받기" → /diagnosis, "30분 무료 상담 신청하기" → /consultation' },
      { id: 'FR-C01-02', title: '네비게이션', detail: '로고→/, 서비스 소개→/service, 진행 과정→/#process, 상품 안내→/#products. IntersectionObserver 자동 활성화', gate: '스크롤 중 앵커 링크 색상 전환 확인' },
      { id: 'FR-C01-03', title: '상품 안내 섹션', detail: '4개 상품 카드. 한끗 빌드 "핵심" 뱃지. 론칭·파트너 "별도 문의"' },
      { id: 'FR-C01-04', title: 'FAQ 아코디언', detail: '8개 항목. 키보드 접근(Enter/Space) 지원' },
    ],
    nfrs: [
      { id: 'NFR-C01-01', detail: 'LCP < 2.5s (Lighthouse 모바일 ≥ 80)' },
      { id: 'NFR-C01-02', detail: 'CLS < 0.1 (font-display: swap)' },
    ],
    edges: [
      { id: 'EDGE-C01-01', condition: '브라우저 뒤로가기', behavior: 'scrollRestoration = manual 로 앵커 위치 복원' },
      { id: 'EDGE-C01-02', condition: '모바일 768px 미만', behavior: '햄버거 메뉴 전환, 클릭 시 자동 닫힘' },
    ],
    acceptanceCriteria: [
      'Lighthouse 모바일 Performance ≥ 80',
      'CTA 2개 올바른 라우트 이동',
      'FAQ 키보드 동작 (Enter/Space)',
    ],
    coverage: { ...COV_STATIC, performance: 'covered' },
    openIssues: [],
  },

  // ── C-02 서비스 소개 ───────────────────────────────────────
  {
    id: 'C-02', name: '서비스 소개', route: '/service',
    proto: 'service.html', component: 'src/pages/Service.tsx',
    phase: 'current', auth: 'Guest', fe: 'partial', be: 'not-started',
    isMissionCritical: false,
    spec: { purpose: '한끗 방법론 3단계, 6주 타임라인, 산출물 6종, 상품 가격 소개', stores: [], apis: [], dataContract: { in: {}, out: {} } },
    frs: [
      { id: 'FR-C02-01', title: 'PDF 다운로드', detail: '"프로그램 상세 안내서 다운로드" → Google Drive 별도 탭' },
      { id: 'FR-C02-02', title: '6주 타임라인 그리드', detail: '3열 2행 (주 1~3 / 주 4~6). 모바일 1열 전환' },
      { id: 'FR-C02-03', title: '상품 가격 섹션', detail: '한끗 진단 50만원 | 빌드 350만원 | 론칭 별도 문의 | 파트너 별도 문의' },
    ],
    nfrs: [], edges: [],
    acceptanceCriteria: ['PDF 버튼 → 별도 탭', '6주 그리드 모바일 1열 전환'],
    coverage: COV_STATIC,
    openIssues: [],
  },

  // ── C-03 무료 진단 폼 (Mission-Critical) ──────────────────
  {
    id: 'C-03', name: '무료 진단 폼', route: '/diagnosis',
    proto: 'diagnosis.html', component: 'src/pages/Diagnosis.tsx',
    phase: 'current-p1', auth: 'Guest', fe: 'partial', be: 'not-started',
    isMissionCritical: true,
    spec: {
      purpose: '무료 리드 수집 핵심 관문. 이름·이메일·7문항 답변 수집 → leads 테이블 저장.',
      stores: ['diagnosticStore'],
      apis: ['POST /functions/v1/submit-free-diagnosis'],
      dataContract: {
        in: {
          name: 'string (1~50자)',
          email: 'string (email 형식)',
          careerYears: "'10년 미만'|'10~15년'|...",
          answers: 'Record<q1~q7, string (5자~2000자)>',
          bonusChecks: 'string[]',
          consentAt: 'string (ISO 8601)',
        },
        out: {
          id: 'string (UUID)',
          type: "'준비형'|'성과형'|'관계형'|'통합형'",
          scores: '{ expertise, originality, visibility, trust, scalability: number }',
        },
      },
    },
    frs: [
      { id: 'FR-C03-01', title: '9단계 폼', detail: 'STEP 0 (기본정보) → STEP 1~7 (주관식) → STEP 8 (보너스) → 완료 화면', gate: '9단계 전체 이동 및 뒤로가기 정상 동작' },
      { id: 'FR-C03-02', title: '진행률 표시', detail: '프로그레스 바: (step/8)×100%. 텍스트: "Q{n}/7 진행 중"' },
      { id: 'FR-C03-03', title: '클라이언트 유효성', detail: 'STEP 0: 이름·이메일·경력연수·동의 필수. STEP 1~7: 최소 5자', gate: '실패 시 정확한 필드별 에러 메시지' },
      { id: 'FR-C03-04', title: '실시간 저장', detail: 'localStorage key: diag_answers. 새로고침 후 마지막 단계 복원', gate: '새로고침 후 복원 확인' },
      { id: 'FR-C03-05', title: '글자 수 표시', detail: '각 textarea 우하단 실시간 "N자"' },
      { id: 'FR-C03-06', title: '제출 처리', detail: 'POST /functions/v1/submit-free-diagnosis. 로딩 스피너. 성공→C-04. 실패→Toast+재시도', gate: '제출 성공 → C-04 전환, 실패 → Toast 재시도 가능' },
      { id: 'FR-C03-07', title: '개인정보 동의', detail: '동의 체크 + /privacy 링크. consentAt 서버 기록' },
    ],
    nfrs: [
      { id: 'NFR-C03-01', detail: '단계 전환 애니메이션 < 200ms' },
      { id: 'NFR-C03-02', detail: '모바일 키패드 오픈 시 레이아웃 이탈 없음' },
      { id: 'NFR-C03-03', detail: '제출 API 타임아웃 10초' },
    ],
    edges: [
      { id: 'EDGE-C03-01', condition: '동일 이메일 24시간 내 재제출', behavior: '서버 429 → "이미 진단하셨습니다. {email} 확인해주세요."' },
      { id: 'EDGE-C03-02', condition: '네트워크 단절 중 제출', behavior: '"인터넷 연결 확인. 답변 저장됨." Toast + 온라인 복구 시 자동 재시도' },
      { id: 'EDGE-C03-03', condition: 'STEP 7 완료 후 브라우저 닫기', behavior: 'localStorage 복원 → 마지막 단계로 이동' },
      { id: 'EDGE-C03-04', condition: '이메일 입력 후 STEP 0 복귀', behavior: '이메일 필드 읽기 전용' },
      { id: 'EDGE-C03-05', condition: '동의 미체크', behavior: '"다음" 버튼 DOM disabled' },
    ],
    acceptanceCriteria: [
      '9단계 전체 이동·뒤로가기 동작',
      '유효성 실패 시 필드별 에러',
      '새로고침 후 복원',
      '제출 성공 → C-04 전환',
      '제출 실패 → Toast + 재시도',
      '동일 이메일 재제출 → 429 메시지',
    ],
    coverage: {
      auth: 'covered',           // consentAt 동의 게이트
      accessControl: 'na',
      dataIntegrity: 'covered',  // Zod 클라이언트 + 서버 검증
      failureRecovery: 'covered',// localStorage 백업 + 네트워크 재시도
      observability: 'partial',  // 제출 성공/실패 로그 정의 필요
      performance: 'covered',    // 10초 타임아웃 + 200ms 전환
    },
    openIssues: ['ISSUE-01', 'ISSUE-02'],
  },

  // ── C-04 분석 로딩 ─────────────────────────────────────────
  {
    id: 'C-04', name: '분석 로딩', route: '/diagnosis',
    proto: 'analyzing-free.html', component: 'src/pages/Diagnosis.tsx (loading state)',
    phase: 'current', auth: 'Guest', fe: 'partial', be: 'not-started',
    isMissionCritical: false,
    spec: { purpose: 'Edge Function 응답 대기 연출. 완료 시 /result 자동 이동.', stores: ['diagnosticStore'], apis: ['POST /functions/v1/submit-free-diagnosis (응답 대기)'], dataContract: { in: {}, out: {} } },
    frs: [
      { id: 'FR-C04-01', title: '로딩 연출', detail: '펄스 아이콘 + "답변을 분석하고 있습니다..."' },
      { id: 'FR-C04-02', title: '완료 시 이동', detail: 'Edge Function 응답 수신 → navigate("/result", { replace: true })' },
      { id: 'FR-C04-03', title: '타임아웃', detail: '10초 초과 → "분석 지연" 안내 + 재시도' },
    ],
    nfrs: [], edges: [
      { id: 'EDGE-C04-01', condition: '뒤로가기', behavior: '/diagnosis 폼으로 이동 (분석 중단 안내)' },
    ],
    acceptanceCriteria: ['10초 응답 없으면 타임아웃 메시지', '응답 수신 시 /result 자동 이동'],
    coverage: COV_STATIC,
    openIssues: ['ISSUE-01'],
  },

  // ── C-05 무료 진단 리포트 ──────────────────────────────────
  {
    id: 'C-05', name: '무료 진단 리포트', route: '/result',
    proto: 'report-free.html', component: 'src/pages/Result.tsx',
    phase: 'current', auth: 'Guest', fe: 'partial', be: 'not-started',
    isMissionCritical: false,
    spec: {
      purpose: '4유형 분류 + 5영역 점수 시각화. 유료 전환 CTA.',
      stores: ['diagnosticStore'],
      apis: [],
      dataContract: {
        in: { type: '4유형 중 1', scores: '5영역 숫자' },
        out: {},
      },
    },
    frs: [
      { id: 'FR-C05-01', title: '유형 표시', detail: '4종 중 1종: 준비형/성과형/관계형/통합형 브랜더. "{이름} 님은 {유형}입니다"', gate: '4유형 정확 분기 확인' },
      { id: 'FR-C05-02', title: '5영역 점수', detail: '전문성·독창성·가시성·신뢰도·확장성. 레이더 차트 또는 바 차트' },
      { id: 'FR-C05-03', title: '전환 CTA', detail: '"무료 상담 신청" → /consultation, "한끗 빌드 알아보기" → /apply/build' },
    ],
    nfrs: [{ id: 'NFR-C05-01', detail: '인쇄 시 CTA 버튼 숨김' }],
    edges: [
      { id: 'EDGE-C05-01', condition: '/result 직접 접근 (diagnosticStore 없음)', behavior: '/diagnosis 리다이렉트' },
    ],
    acceptanceCriteria: ['4유형 정확 표시', '5영역 차트 렌더링', '직접 접근 시 리다이렉트'],
    coverage: { ...COV_STATIC, observability: 'partial' },
    openIssues: ['ISSUE-02'],
  },

  // ── C-06 무료 상담 신청 ────────────────────────────────────
  {
    id: 'C-06', name: '무료 상담 신청', route: '/consultation',
    proto: 'consultation.html', component: 'src/pages/Consultation.tsx',
    phase: 'current-p1', auth: 'Guest', fe: 'partial', be: 'not-started',
    isMissionCritical: false,
    spec: {
      purpose: '상담 신청 리드 수집. ConsultationSchema 폼 → DB insert.',
      stores: ['leadsStore'],
      apis: ['POST /functions/v1/submit-consultation'],
      dataContract: {
        in: { name: 'string', email: 'string', phone: 'string', careerField: 'string', careerYears: 'enum', message: 'string?', consentAt: 'ISO8601' },
        out: { id: 'UUID' },
      },
    },
    frs: [
      { id: 'FR-C06-01', title: '상담 신청 폼', detail: '이름·이메일·전화·전문분야·경력연수·목적(복수)·메시지(선택)·선호시간(선택)' },
      { id: 'FR-C06-02', title: '개인정보 동의 [P1]', detail: '동의 체크 필수 + /privacy 링크' },
      { id: 'FR-C06-03', title: '제출 처리', detail: 'POST 성공 → Toast "신청 완료". 실패 → Toast 에러 + 재시도' },
    ],
    nfrs: [], edges: [
      { id: 'EDGE-C06-01', condition: '동일 이메일 24시간 내 재신청', behavior: '서버 409 → "이미 신청하셨습니다. 담당자가 연락드립니다."' },
    ],
    acceptanceCriteria: ['ConsultationSchema 유효성 통과 시 제출', '동일 이메일 24h → 409 처리'],
    coverage: { auth: 'covered', accessControl: 'na', dataIntegrity: 'covered', failureRecovery: 'partial', observability: 'gap', performance: 'na' },
    openIssues: [],
  },

  // ── C-07 유료 상품 신청 ────────────────────────────────────
  {
    id: 'C-07', name: '유료 상품 신청', route: '/apply/*',
    proto: 'apply.html', component: 'src/pages/apply/Apply*.tsx',
    phase: 'current-p1', auth: 'Guest', fe: 'partial', be: 'not-started',
    isMissionCritical: false,
    spec: { purpose: '4상품 신청 리드 수집 (ApplyForm 공통).', stores: ['leadsStore'], apis: ['POST /functions/v1/submit-apply'], dataContract: { in: { product: 'diagnosis|build|launch|partner', name: 'string', email: 'string', phone: 'string', motivation: 'string (200자+)' }, out: { id: 'UUID' } } },
    frs: [
      { id: 'FR-C07-01', title: '상품 확인 카드', detail: '라우트별 상품명·가격·기간 자동 선택' },
      { id: 'FR-C07-02', title: 'ApplyForm 공통 폼', detail: '이름·이메일·전화·전문분야·경력연수·신청동기(200자+)·동의' },
      { id: 'FR-C07-03', title: '제출 → 완료', detail: '성공 → /apply/thank-you' },
    ],
    nfrs: [], edges: [
      { id: 'EDGE-C07-01', condition: '론칭·파트너 신청', behavior: '"가격 별도 문의" 명시' },
    ],
    acceptanceCriteria: ['4개 상품 라우트 각각 올바른 상품 표시', '제출 성공 → /apply/thank-you'],
    coverage: COV_STATIC,
    openIssues: [],
  },

  // ── C-08 신청 완료 ─────────────────────────────────────────
  {
    id: 'C-08', name: '신청 완료', route: '/apply/thank-you',
    proto: 'apply-thank-you.html', component: 'src/pages/apply/ApplyThankYou.tsx',
    phase: 'current', auth: 'Guest', fe: 'partial', be: 'not-started',
    isMissionCritical: false,
    spec: { purpose: '신청 접수 완료 안내 + 다음 절차.', stores: ['leadsStore'], apis: [], dataContract: { in: {}, out: {} } },
    frs: [{ id: 'FR-C08-01', title: '완료 메시지', detail: '접수 확인 + 영업일 2일 내 연락 안내' }],
    nfrs: [], edges: [
      { id: 'EDGE-C08-01', condition: 'leadsStore 없이 직접 접근', behavior: '/ 리다이렉트' },
    ],
    acceptanceCriteria: ['직접 접근 시 / 리다이렉트'],
    coverage: COV_STATIC,
    openIssues: [],
  },

  // ── C-09 멤버 로그인 ───────────────────────────────────────
  {
    id: 'C-09', name: '멤버 로그인', route: '/login',
    proto: 'login.html', component: 'src/pages/Login.tsx',
    phase: 'current-p1', auth: 'Guest', fe: 'partial', be: 'not-started',
    isMissionCritical: false,
    spec: {
      purpose: 'Supabase Auth 로그인. currentMember 세팅 후 /coaching 또는 이전 경로로 이동.',
      stores: ['authStore'],
      apis: ['Supabase auth.signInWithPassword()'],
      dataContract: { in: { email: 'string', password: 'string (8자+)' }, out: { session: 'SupabaseSession', user: 'SupabaseUser' } },
    },
    frs: [
      { id: 'FR-C09-01', title: '로그인 폼', detail: '이메일 + 비밀번호 + 비번 표시 토글' },
      { id: 'FR-C09-02', title: '성공 처리', detail: 'authStore.currentMember 갱신 → state.from 복원 또는 /coaching', gate: '로그인 성공 시 이전 경로 복원' },
      { id: 'FR-C09-03', title: '실패 처리', detail: '5회 실패 → "잠시 후 다시 시도해주세요." (rate limiting)' },
    ],
    nfrs: [{ id: 'NFR-C09-01', detail: '비밀번호 마스킹 + 표시/숨김 토글' }],
    edges: [
      { id: 'EDGE-C09-01', condition: '이미 로그인 상태', behavior: '/coaching 자동 이동' },
      { id: 'EDGE-C09-02', condition: '세션 만료 후 보호 라우트 접근', behavior: '/login?redirect={경로}' },
    ],
    acceptanceCriteria: ['Supabase Auth 연동 후 실제 로그인', '로그인 성공 시 이전 경로 복원', '5회 실패 rate limit 메시지'],
    coverage: {
      auth: 'gap',           // Supabase Auth 미연동
      accessControl: 'gap',
      dataIntegrity: 'covered',
      failureRecovery: 'partial',
      observability: 'gap',  // 실패 로그인 시도 미추적
      performance: 'na',
    },
    openIssues: ['ISSUE-06'],
  },

  // ── C-10 코칭 대시보드 ─────────────────────────────────────
  {
    id: 'C-10', name: '코칭 대시보드', route: '/coaching',
    proto: 'coaching-dashboard.html', component: 'src/pages/coaching/CoachingDashboard.tsx',
    phase: 'current', auth: 'Member', fe: 'partial', be: 'not-started',
    isMissionCritical: false,
    spec: { purpose: '4파트 진행률 + 세션 상태별 CTA.', stores: ['coachingStore', 'authStore'], apis: ['GET /functions/v1/coaching-status'], dataContract: { in: {}, out: { session: '{ status, answeredCount, totalCount }' } } },
    frs: [
      { id: 'FR-C10-01', title: '4파트 진행률', detail: 'Part 1~4 각 진행률 바 + 전체 N/42' },
      { id: 'FR-C10-02', title: '상태별 CTA', detail: 'in_progress→"이어서 작성", submitted→"검토 중"(비활성), analyzed→"리포트 보기"' },
    ],
    nfrs: [], edges: [
      { id: 'EDGE-C10-01', condition: '미인증 접근', behavior: 'ProtectedRoute → /login' },
    ],
    acceptanceCriteria: ['세션 상태별 CTA 분기 정확'],
    coverage: COV_MEMBER_BASE,
    openIssues: [],
  },

  // ── C-11 42문항 작성 (Mission-Critical) ────────────────────
  {
    id: 'C-11', name: '42문항 작성', route: '/coaching/questions',
    proto: 'coaching-questions.html', component: 'src/pages/coaching/CoachingQuestions.tsx',
    phase: 'current-p1', auth: 'Member', fe: 'partial', be: 'not-started',
    isMissionCritical: true,
    spec: {
      purpose: '42문항 텍스트/음성 입력. 1초 debounce 자동 저장. 코칭의 핵심 데이터 수집.',
      stores: ['coachingStore'],
      apis: ['POST /functions/v1/save-answer', 'POST /functions/v1/upload-voice [P1]'],
      dataContract: {
        in: { sessionId: 'UUID', questionId: 'int 1~42', textAnswer: 'string (5000자)', voiceUrl: 'string?', voiceMime: 'string?', voiceDuration: 'int? (0~600s)' },
        out: { saved: 'boolean', savedAt: 'ISO8601' },
      },
    },
    frs: [
      { id: 'FR-C11-01', title: '레이아웃', detail: '좌: 문항 사이드바 (42개 목록, 완료/미완료). 우: 현재 문항 본문 + 입력', gate: '사이드바 완료 상태 실시간 반영' },
      { id: 'FR-C11-02', title: '텍스트/음성 모드', detail: '탭 전환. 텍스트: textarea 5000자. 음성: MediaRecorder [P1]' },
      { id: 'FR-C11-03', title: '자동 저장', detail: '타이핑 멈춤 1초 후 Supabase upsert. 사이드바: "저장 중..." / "저장됨"', gate: '자동 저장 후 Supabase DB 확인' },
      { id: 'FR-C11-04', title: '음성 녹음 [P1]', detail: 'MediaRecorder. iOS Safari mp4 자동 감지. 최대 10분/10MB. upload-voice 업로드 후 VoicePlayer' },
      { id: 'FR-C11-05', title: '파트 구조', detail: 'Part1(Q1~10):경력정체성, Part2(Q11~21):전문성, Part3(Q22~32):영향력, Part4(Q33~42):미래' },
    ],
    nfrs: [
      { id: 'NFR-C11-01', detail: '자동 저장 실패 시 로컬 임시 저장 후 재시도' },
      { id: 'NFR-C11-02', detail: '음성 업로드 실패 → 텍스트 모드 유지 + 재시도' },
    ],
    edges: [
      { id: 'EDGE-C11-01', condition: '음성 업로드 실패', behavior: '텍스트 모드 유지 + 재시도 버튼' },
      { id: 'EDGE-C11-02', condition: '녹음 중 탭 전환', behavior: 'MediaRecorder 백그라운드 유지' },
      { id: 'EDGE-C11-03', condition: 'iOS Safari', behavior: 'audio/mp4 자동 감지' },
      { id: 'EDGE-C11-04', condition: '42문항 미완료 → /coaching/review 접근', behavior: '허용하되 미완료 경고 표시' },
    ],
    acceptanceCriteria: [
      '42문항 전체 이동 (사이드바 + 버튼)',
      '자동 저장 후 Supabase DB 확인',
      '새로고침 후 현재 문항 유지',
      '음성 녹음 → 업로드 → 재생 [P1]',
    ],
    coverage: {
      auth: 'covered',
      accessControl: 'covered',
      dataIntegrity: 'covered',  // debounce + localStorage 백업
      failureRecovery: 'covered',// 저장 실패 재시도 + 음성 폴백
      observability: 'gap',      // 저장 실패율 미추적
      performance: 'partial',    // debounce 정의, 저장 SLA 미정의
    },
    openIssues: ['ISSUE-04'],
  },

  // ── C-12 답변 리뷰·제출 ────────────────────────────────────
  {
    id: 'C-12', name: '답변 리뷰·제출', route: '/coaching/review',
    proto: 'coaching-review.html', component: 'src/pages/coaching/CoachingReview.tsx',
    phase: 'current', auth: 'Member', fe: 'partial', be: 'not-started',
    isMissionCritical: false,
    spec: { purpose: '42문항 전체 검토 + 최종 제출. session.status = "submitted".', stores: ['coachingStore'], apis: ['POST /functions/v1/submit-coaching'], dataContract: { in: { sessionId: 'UUID' }, out: { status: "'submitted'", submittedAt: 'ISO8601' } } },
    frs: [
      { id: 'FR-C12-01', title: '전체 답변 일람', detail: '파트별 그룹. 미답변 → 빨간 강조 + "작성하러 가기" 링크' },
      { id: 'FR-C12-02', title: '최종 제출', detail: '미답변 → 경고 다이얼로그. 전체 완료 → "제출 후 수정 불가" 확인', gate: '제출 후 /coaching/analyzing 이동' },
    ],
    nfrs: [], edges: [
      { id: 'EDGE-C12-01', condition: '제출 후 뒤로가기', behavior: '"이미 제출된 세션" 안내' },
    ],
    acceptanceCriteria: ['미답변 강조 정확', '제출 후 /coaching/analyzing 이동'],
    coverage: COV_MEMBER_BASE,
    openIssues: [],
  },

  // ── C-13 AI 분석 진행 ──────────────────────────────────────
  {
    id: 'C-13', name: 'AI 분석 진행', route: '/coaching/analyzing',
    proto: 'coaching-analyzing.html', component: 'src/pages/coaching/CoachingAnalyzing.tsx',
    phase: 'current', auth: 'Member', fe: 'partial', be: 'not-started',
    isMissionCritical: false,
    spec: { purpose: '30초 폴링으로 분석 완료 감지 → /coaching/report 자동 이동.', stores: ['coachingStore'], apis: ['GET /functions/v1/coaching-status'], dataContract: { in: {}, out: { status: 'string' } } },
    frs: [
      { id: 'FR-C13-01', title: '분석 연출', detail: '로딩 애니메이션 + 단계 메시지 자동 전환' },
      { id: 'FR-C13-02', title: '상태 폴링', detail: '30초마다 /functions/v1/coaching-status. analyzed → /coaching/report replace' },
      { id: 'FR-C13-03', title: '타임아웃', detail: '30분(60회) 초과 → 폴링 중단 + 이메일 알림 안내' },
    ],
    nfrs: [], edges: [], acceptanceCriteria: ['폴링 30초 간격 확인', '30분 초과 시 폴링 중단'],
    coverage: { ...COV_MEMBER_BASE, observability: 'partial' },
    openIssues: ['ISSUE-08'],
  },

  // ── C-14 코칭 리포트 ───────────────────────────────────────
  {
    id: 'C-14', name: '코칭 리포트', route: '/coaching/report',
    proto: 'coaching-report.html', component: 'src/pages/coaching/CoachingReport.tsx',
    phase: 'current-p1', auth: 'Member', fe: 'partial', be: 'not-started',
    isMissionCritical: false,
    spec: { purpose: 'Admin finalize 후에만 표시. 브랜드 프로필 + 문항별 인사이트 + PDF 다운로드.', stores: ['coachingStore'], apis: ['GET /functions/v1/coaching-report'], dataContract: { in: {}, out: { status: 'string', profile: 'BrandProfile', insights: 'Insight[]' } } },
    frs: [
      { id: 'FR-C14-01', title: '검수 게이트', detail: 'status !== "finalized" → R-01 대기 화면 표시' },
      { id: 'FR-C14-02', title: '브랜드 프로필', detail: '원라이너·핵심 가치·차별점·타깃' },
      { id: 'FR-C14-03', title: 'PDF 다운로드', detail: 'window.print(). 인쇄 CSS: CTA/네비 숨김' },
    ],
    nfrs: [], edges: [
      { id: 'EDGE-C14-01', condition: 'status = submitted (미확정)', behavior: 'R-01 화면 렌더' },
      { id: 'EDGE-C14-02', condition: 'PDF 인쇄 시 차트 누락', behavior: 'canvas 대신 SVG 사용' },
    ],
    acceptanceCriteria: ['status !== finalized → R-01 표시', 'finalized → 브랜드 프로필 표시', 'PDF 인쇄 동작'],
    coverage: COV_MEMBER_BASE,
    openIssues: [],
  },

  // ── C-15 개인정보 처리방침 ────────────────────────────────
  {
    id: 'C-15', name: '개인정보 처리방침', route: null,
    proto: 'privacy.html', component: '❌ src/pages/Privacy.tsx 미생성',
    phase: 'p1', auth: 'Guest', fe: 'not-started', be: 'not-started',
    isMissionCritical: false,
    spec: { purpose: '개인정보처리방침 전문. 동의 링크 착지점.', stores: [], apis: [], dataContract: { in: {}, out: {} } },
    frs: [
      { id: 'FR-C15-01', title: '처리방침 전문', detail: '수집항목·목적·보관기간·제3자·권리·문의처' },
      { id: 'FR-C15-02', title: '동의 링크 연결', detail: 'C-03·C-06 폼 내 링크에서 별도 탭 오픈' },
    ],
    nfrs: [], edges: [],
    acceptanceCriteria: ['Privacy.tsx 생성', '/privacy 라우트 등록', 'C-03·C-06 링크 연결'],
    coverage: COV_STATIC,
    openIssues: ['ISSUE-03'],
  },

  // ── A-01 관리자 콘솔 ───────────────────────────────────────
  {
    id: 'A-01', name: '관리자 콘솔', route: '/admin',
    proto: 'admin.html', component: 'src/pages/Admin.tsx',
    phase: 'current-p1', auth: 'Admin', fe: 'partial', be: 'not-started',
    isMissionCritical: false,
    spec: { purpose: '리드 CRM + 멤버 계정 발급 2탭. 전체 운영 허브.', stores: ['leadsStore', 'authStore'], apis: ['GET /functions/v1/leads', 'GET /functions/v1/members', 'POST /functions/v1/create-member'], dataContract: { in: {}, out: {} } },
    frs: [
      { id: 'FR-A01-01', title: '리드 CRM 탭', detail: '테이블: 이름·이메일·소스·상태·생성일. 필터: 상태별·날짜. 행 클릭 → A-02' },
      { id: 'FR-A01-02', title: '멤버 발급 탭', detail: '발급 폼: 이름·이메일·상품·기간. 발급 시 Auth 계정 생성 + 이메일' },
      { id: 'FR-A01-03', title: '대시보드 카드', detail: '오늘 신규 리드·진행 중 멤버·완료 세션 카운트' },
      { id: 'FR-A01-04', title: '실시간 피드', detail: 'Supabase Realtime 구독. 리드 수신·제출 완료·결제 알림' },
    ],
    nfrs: [{ id: 'NFR-A01-01', detail: '리드 테이블 20건/page 페이지네이션' }],
    edges: [
      { id: 'EDGE-A01-01', condition: 'Member 권한으로 /admin 접근', behavior: 'ProtectedRoute → /unauthorized' },
    ],
    acceptanceCriteria: ['Admin 권한 필터링', 'Realtime 리드 수신 확인', 'CSV 다운로드 [ISSUE-07]'],
    coverage: { ...COV_ADMIN_BASE, observability: 'partial' },
    openIssues: ['ISSUE-07'],
  },

  // ── A-02 리드 상세 ─────────────────────────────────────────
  {
    id: 'A-02', name: '리드 상세', route: '/admin (panel)',
    proto: 'admin-lead-detail.html', component: 'src/pages/Admin.tsx (LeadDetail panel)',
    phase: 'current', auth: 'Admin', fe: 'partial', be: 'not-started',
    isMissionCritical: false,
    spec: { purpose: '7문항 답변 전문 + 5영역 점수 + 메모 + 상태 변경.', stores: ['leadsStore'], apis: ['GET /functions/v1/leads/{id}', 'PATCH /functions/v1/leads/{id}'], dataContract: { in: {}, out: {} } },
    frs: [
      { id: 'FR-A02-01', title: '답변 전문', detail: '7문항 전체 + 5영역 점수 + AI 추천 패키지' },
      { id: 'FR-A02-02', title: '메모·상태', detail: '인라인 메모 추가/수정 + 상태 드롭다운 변경' },
    ],
    nfrs: [], edges: [],
    acceptanceCriteria: ['메모 저장 → DB 반영', '상태 변경 → DB 반영'],
    coverage: COV_ADMIN_BASE,
    openIssues: [],
  },

  // ── A-03 코칭 워크스페이스 (Mission-Critical) ───────────────
  {
    id: 'A-03', name: '코칭 워크스페이스', route: '/coaching/workspace/:id',
    proto: 'workspace.html', component: 'src/pages/coaching/CoachingWorkspace.tsx',
    phase: 'current-p1', auth: 'Admin', fe: 'partial', be: 'not-started',
    isMissionCritical: true,
    spec: {
      purpose: '42문항 검토 + 코치 메모 + AIDraft 수정 + Finalize. 리포트 공개 Gate.',
      stores: [],
      apis: ['GET /functions/v1/workspace/{memberId}', 'PATCH /functions/v1/coaching-sessions/{id}', 'POST /functions/v1/send-report-ready [Resend]'],
      dataContract: {
        in: { memberId: 'UUID' },
        out: { answers: 'CoachingAnswer[]', aiDraft: 'AIDraft', finalProfile: 'BrandProfile?' },
      },
    },
    frs: [
      { id: 'FR-A03-01', title: '42문항 조회', detail: '텍스트 + 음성 재생 (VoicePlayer)' },
      { id: 'FR-A03-02', title: '코치 메모', detail: '문항별 인라인 메모' },
      { id: 'FR-A03-03', title: 'AIDraft 수정', detail: 'AI 원라이너 3종·핵심 가치·브랜드 프로필 초안 인라인 수정' },
      { id: 'FR-A03-04', title: 'Finalize', detail: '"최종 확정" → session.status = "finalized" + 멤버 이메일 발송', gate: 'finalize 후 C-14에서 리포트 표시 확인' },
      { id: 'FR-A03-05', title: '세션 상태 뱃지', detail: 'submitted/analyzed/finalized' },
    ],
    nfrs: [{ id: 'NFR-A03-01', detail: 'Finalize는 트랜잭션으로 처리 (status 갱신 + 이메일 발송 원자성)' }],
    edges: [
      { id: 'EDGE-A03-01', condition: '이미 finalized 세션', behavior: 'AIDraft 읽기 전용' },
      { id: 'EDGE-A03-02', condition: '음성 재생 실패', behavior: '텍스트 답변만 표시 + 오류 안내' },
    ],
    acceptanceCriteria: [
      'Finalize → session.status 갱신 확인',
      'Finalize → 멤버 이메일 수신 확인',
      'Finalize 후 C-14에서 리포트 표시 확인',
    ],
    coverage: {
      auth: 'covered',
      accessControl: 'covered',
      dataIntegrity: 'gap',    // finalize 트랜잭션 경계 미정의
      failureRecovery: 'partial',
      observability: 'gap',   // finalize audit log 미정의
      performance: 'na',
    },
    openIssues: ['ISSUE-05'],
  },

  // ── A-04 알림 시스템 ───────────────────────────────────────
  {
    id: 'A-04', name: '알림 시스템', route: '/admin (overlay)',
    proto: 'admin-notifications.html', component: 'notificationStore + Header bell',
    phase: 'current', auth: 'Admin', fe: 'partial', be: 'not-started',
    isMissionCritical: false,
    spec: { purpose: 'Supabase Realtime 실시간 알림. 미읽음 카운트 뱃지.', stores: ['notificationStore'], apis: ['Supabase Realtime 구독'], dataContract: { in: {}, out: {} } },
    frs: [
      { id: 'FR-A04-01', title: '미읽음 뱃지', detail: '헤더 벨 아이콘 미읽음 수' },
      { id: 'FR-A04-02', title: '알림 목록', detail: '리드 수신·제출 완료·결제 알림 + 읽음 처리' },
      { id: 'FR-A04-03', title: 'Realtime', detail: 'Supabase Realtime 멀티탭 동기화' },
    ],
    nfrs: [], edges: [],
    acceptanceCriteria: ['Supabase Realtime 수신 후 즉시 뱃지 갱신'],
    coverage: COV_ADMIN_BASE,
    openIssues: [],
  },

  // ── A-05 어드민 인증 게이트 ────────────────────────────────
  {
    id: 'A-05', name: '어드민 인증 게이트', route: '/admin (guard)',
    proto: 'admin-auth.html', component: 'src/components/ProtectedRoute.tsx (role=admin)',
    phase: 'p1', auth: 'Admin', fe: 'not-started', be: 'not-started',
    isMissionCritical: false,
    spec: { purpose: 'Supabase RBAC role=admin 검사. 미충족 → /unauthorized.', stores: ['authStore'], apis: ['Supabase auth.getUser()', 'onAuthStateChange'], dataContract: { in: {}, out: {} } },
    frs: [
      { id: 'FR-A05-01', title: 'RBAC 검사', detail: 'app_metadata.role === "admin" 확인. 미충족 → /unauthorized' },
      { id: 'FR-A05-02', title: '세션 만료 감지', detail: 'onAuthStateChange → /login?redirect=/admin' },
    ],
    nfrs: [], edges: [
      { id: 'EDGE-A05-01', condition: '미로그인 → /admin 직접 접근', behavior: '/login 리다이렉트' },
      { id: 'EDGE-A05-02', condition: 'Member로 /admin 접근', behavior: '/unauthorized' },
    ],
    acceptanceCriteria: ['Supabase Auth 연동 후 role 검사 동작'],
    coverage: {
      auth: 'gap', accessControl: 'gap', dataIntegrity: 'na',
      failureRecovery: 'partial', observability: 'gap', performance: 'na',
    },
    openIssues: [],
  },

  // ── Phase 1.5 ──────────────────────────────────────────────
  {
    id: 'R-01', name: '검수 대기 안내', route: '/coaching/report',
    proto: 'report-pending.html', component: 'src/pages/coaching/CoachingReport.tsx (status=submitted)',
    phase: 'p15', auth: 'Member', fe: 'not-started', be: 'not-started',
    isMissionCritical: false,
    spec: { purpose: '제출 후 / 분석 전 대기 화면. 이메일 알림 연계.', stores: ['coachingStore'], apis: [], dataContract: { in: {}, out: {} } },
    frs: [{ id: 'FR-R01-01', title: '대기 안내', detail: '"리포트 준비 중" + 예상 완료일 + 이메일 알림 안내' }],
    nfrs: [], edges: [], acceptanceCriteria: [], coverage: COV_MEMBER_BASE, openIssues: [],
  },

  // ── Phase 2 로드맵 (10개) ──────────────────────────────────
  ...[
    { id: 'R-02', name: '마스터 브리프 (F1)',   proto: 'admin-brief.html',      purpose: '42문항 → 8섹션 브리프 자동 생성 (GPT-4o)' },
    { id: 'R-03', name: '원라이너 3종',         proto: 'admin-oneliner.html',   purpose: '전문성형·공감형·결과형 3종 초안 생성' },
    { id: 'R-04', name: '질문 아키텍처 (F9)',   proto: 'admin-questions.html',  purpose: '42문항 분류·트리거 관리' },
    { id: 'R-05', name: '패턴 분류기 (F10)',    proto: 'admin-patterns.html',   purpose: '답변 → 10개 패턴 자동 분류 (NLP + LLM)' },
    { id: 'R-06', name: '브랜딩 매퍼 (F11)',    proto: 'admin-mapper.html',     purpose: '답변 → 8대 브랜딩 요소 매핑' },
    { id: 'R-07', name: '코칭 피드백 (F12)',    proto: 'admin-feedback.html',   purpose: '코칭 스크립트 자동 생성' },
    { id: 'R-08', name: '리포트 룰 엔진 (F13)', proto: 'admin-rules.html',      purpose: '일관성 ≥95% 규칙 기반 리포트 생성' },
    { id: 'R-09', name: '교차검증',             proto: 'admin-crosscheck.html', purpose: '답변 간 관계 패턴 분석 (9개 매트릭스)' },
    { id: 'R-10', name: '휴먼 핸드오프 (F14)',  proto: 'admin-handoff.html',    purpose: 'AI 한계 감지 시 코치 개입 트리거' },
    { id: 'R-11', name: 'AI 호출 로그',         proto: 'admin-airuns.html',     purpose: 'API 호출 성공/실패·비용 추적' },
  ].map(({ id, name, proto, purpose }): Screen => ({
    id, name, route: null, proto, component: '— (Phase 2 미구현)',
    phase: 'p2', auth: 'Admin', fe: 'hold', be: 'hold', isMissionCritical: false,
    spec: emptySpec(purpose), frs: [], nfrs: [], edges: [], acceptanceCriteria: [],
    coverage: { auth: 'na', accessControl: 'na', dataIntegrity: 'na', failureRecovery: 'na', observability: 'na', performance: 'na' },
    openIssues: [],
  })),

  // ── Phase 3 로드맵 (3개) ───────────────────────────────────
  ...[
    { id: 'R-12', name: '리테이너 관리', proto: 'admin-retainer.html', purpose: '한끗 파트너 월 구독 결제·운영 (토스페이먼츠)' },
    { id: 'R-13', name: 'PPT Export',    proto: 'admin-export.html',   purpose: '브랜드 프로필 → PPT/PDF 자동 출력' },
    { id: 'R-14', name: '변화 리포트',   proto: 'change-report.html',  purpose: '재진단 전후 브랜드 변화 시각화' },
  ].map(({ id, name, proto, purpose }): Screen => ({
    id, name, route: null, proto, component: '— (Phase 3 미구현)',
    phase: 'p3', auth: id === 'R-14' ? 'Member' : 'Admin',
    fe: 'hold', be: 'hold', isMissionCritical: false,
    spec: emptySpec(purpose), frs: [], nfrs: [], edges: [], acceptanceCriteria: [],
    coverage: { auth: 'na', accessControl: 'na', dataIntegrity: 'na', failureRecovery: 'na', observability: 'na', performance: 'na' },
    openIssues: [],
  })),
]

// ============================================================
// ISSUES (의존성 DAG)
// ============================================================
const ISSUES: Issue[] = [
  {
    id: 'ISSUE-01', screens: ['C-03', 'C-04', 'C-05'],
    type: 'decision', priority: 'high', status: 'open',
    title: '무료 진단 결과 표시 정책',
    body: '제출 후 즉시 결과를 보여줄지 vs. 어드민 검수 후 이메일로 발송할지 정책 결정 필요. 즉시: UX 좋음, 자동화 필요. 이메일: 품질 관리 가능, 전환율 저하 위험.',
    blockedBy: [],
    blocks: ['ISSUE-02'],
  },
  {
    id: 'ISSUE-02', screens: ['C-05'],
    type: 'design', priority: 'high', status: 'open',
    title: '4유형 분류 알고리즘 미정의',
    body: '준비형/성과형/관계형/통합형 분류를 위한 5개 영역 점수 가중치·임계값 정의 필요. Edge Function submit-free-diagnosis의 핵심 로직.',
    blockedBy: ['ISSUE-01'],
    blocks: [],
  },
  {
    id: 'ISSUE-03', screens: ['C-15'],
    type: 'impl', priority: 'high', status: 'open',
    title: '/privacy 라우트 미등록',
    body: 'src/pages/Privacy.tsx 미생성, App.tsx에 /privacy 라우트 없음. C-03·C-06 동의 링크 착지점 없음. 즉시 해결 가능 (prototype 파일 있음).',
    blockedBy: [],
    blocks: [],
  },
  {
    id: 'ISSUE-04', screens: ['C-11'],
    type: 'decision', priority: 'medium', status: 'open',
    title: '음성 입력 Phase 포함 범위',
    body: '음성 녹음·업로드 기능을 Phase 1에 포함할지 Phase 1.5로 연기할지. P1 포함 시: upload-voice Edge Function + Supabase Storage 추가 작업. P1.5 연기 시: 텍스트 입력만으로 MVP 출시 가능.',
    blockedBy: [],
    blocks: [],
  },
  {
    id: 'ISSUE-05', screens: ['A-03'],
    type: 'design', priority: 'medium', status: 'open',
    title: 'AIDraft 생성 시점 결정',
    body: '제출(submitted) 즉시 GPT-4o 자동 생성 vs. 코치 수동 트리거 중 선택. 자동: UX 빠름, API 비용 제어 어려움. 수동: 비용 예측 가능, 운영 부하.',
    blockedBy: [],
    blocks: [],
  },
  {
    id: 'ISSUE-06', screens: ['C-09', 'A-01'],
    type: 'design', priority: 'medium', status: 'open',
    title: '초기 멤버 비밀번호 발급 흐름',
    body: 'Admin 발급 → 초기 비밀번호 이메일 → 첫 로그인 시 강제 변경 UX 설계 필요. Supabase Admin API로 계정 생성 시 비번 정책 확인 필요.',
    blockedBy: [],
    blocks: ['ISSUE-03'],
  },
  {
    id: 'ISSUE-07', screens: ['A-01'],
    type: 'qa', priority: 'low', status: 'open',
    title: '리드 CSV 다운로드 개인정보 처리',
    body: '다운로드 이벤트를 audit_logs 테이블에 기록해야 하는지 검토. 다운로드 파일 암호화 필요 여부.',
    blockedBy: [],
    blocks: [],
  },
  {
    id: 'ISSUE-08', screens: ['C-13'],
    type: 'design', priority: 'low', status: 'open',
    title: '상태 감지: 폴링 vs Realtime',
    body: '30초 폴링 (구현 단순, 지연 최대 30초) vs. Supabase Realtime 구독 (UX 즉각, 추가 채널 관리). MVP는 폴링 권장.',
    blockedBy: [],
    blocks: [],
  },
]

// ============================================================
// CHANGES (변경 이력)
// ============================================================
const CHANGES: Change[] = [
  { id: 'CHG-001', date: '2026-06-15', screens: ['C-02'], type: 'modify', description: '히어로 아이브로우 "SERVICE" → "1:1 맞춤 6주 과정"', source: 'PM 요청' },
  { id: 'CHG-002', date: '2026-06-15', screens: ['C-02'], type: 'modify', description: '한끗 론칭·파트너 가격 → "별도 문의"', source: 'PM 요청' },
  { id: 'CHG-003', date: '2026-06-15', screens: ['C-02'], type: 'add',    description: 'PDF 다운로드 버튼 → Google Drive 링크', source: 'PM 요청' },
  { id: 'CHG-004', date: '2026-06-15', screens: ['C-01'], type: 'modify', description: '네비게이션 클릭 시 로열블루 활성화', source: 'PM 요청' },
  { id: 'CHG-005', date: '2026-06-15', screens: [],        type: 'arch',  description: 'proto-hide.js: Vercel 배포 환경에서 proto-bar 자동 숨김', source: '기술 결정' },
  { id: 'CHG-006', date: '2026-06-15', screens: [],        type: 'add',   description: 'docs/tech-spec/ 기술기획서 7개 문서 작성', source: 'PM 지시' },
  { id: 'CHG-007', date: '2026-06-15', screens: [],        type: 'arch',  description: 'React 고도화: ProtectedRoute, ErrorBoundary, Zod, lazy loading, manualChunks', source: '기술 결정' },
  { id: 'CHG-008', date: '2026-06-15', screens: [],        type: 'add',   description: 'PLAYBOARD 작성 — 모든 요구사항의 단일 SoT 지정', source: 'PM 지시' },
  { id: 'CHG-009', date: '2026-06-15', screens: [],        type: 'add',   description: '/playboard 라우트 신설 + src/pages/Playboard.tsx 구현 상황판 페이지 생성', source: 'PM 지시' },
  { id: 'CHG-010', date: '2026-06-15', screens: [],        type: 'arch',  description: 'Phase A: SoT 스키마를 src/data/playboard.ts 로 분리. Phase B: Playboard.tsx 3뷰 재구축. Phase C: 07-mission-critical.md 작성. Phase D: CLAUDE.md + AGENTS.md 신설.', source: 'PM 지시' },
]

// ============================================================
// 루트 export
// ============================================================
export const PLAYBOARD: PlayBoardData = {
  version: '2.0',
  lastUpdated: '2026-06-15',
  screens: SCREENS,
  issues: ISSUES,
  changes: CHANGES,
}

// ── 유틸: 상태 집계 ───────────────────────────────────────────
export function calcStats(screens: Screen[]) {
  const p1 = screens.filter(s => ['current', 'p1', 'current-p1'].includes(s.phase))
  return {
    total: screens.length,
    p1Total: p1.length,
    done: p1.filter(s => s.fe === 'done').length,
    partial: p1.filter(s => s.fe === 'partial').length,
    notStarted: p1.filter(s => s.fe === 'not-started').length,
    roadmap: screens.filter(s => ['p15', 'p2', 'p3'].includes(s.phase)).length,
    missionCritical: screens.filter(s => s.isMissionCritical).length,
    openIssues: ISSUES.filter(i => i.status === 'open').length,
    highIssues: ISSUES.filter(i => i.status === 'open' && i.priority === 'high').length,
  }
}

export const COVERAGE_DOMAINS = [
  { key: 'auth',            label: '인증·세션' },
  { key: 'accessControl',   label: '접근 제어' },
  { key: 'dataIntegrity',   label: '데이터 무결성' },
  { key: 'failureRecovery', label: '장애·복구' },
  { key: 'observability',   label: '관측성' },
  { key: 'performance',     label: '성능·캐시' },
] as const satisfies { key: keyof CoverageMatrix; label: string }[]
