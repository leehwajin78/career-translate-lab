/* ============================================================================
 * PlayBoard — 한끗프로젝트 SoT 레지스트리 (단일 진실 공급원)
 *
 *   이 파일이 모든 표면(index/plan/schedule/implement-summary/control-area/
 *   spec/scenario/ux-flow/mobile-flow/screens)의 유일한 데이터 출처다.
 *   표시되는 모든 것은 여기서 파생한다 — 두 곳을 손으로 맞추지 않는다.
 *
 *   원천: src/data/playboard.ts (career-translate-lab 운영 SoT) + 프로토타입
 *   (hankkeut-prototype/*.html). 화면 status는 (fe,be,phase)에서 파생:
 *     - phase p2/p3 또는 fe=not-started → planned (미착수·기획확정)
 *     - be(백엔드)가 머지됨(partial/done) → merged (구현·머지완료)
 *     - 그 외 fe=partial → partial (부분 구현)
 *     - 배포 검증 통과 → verified (현재 0건)
 *   상세 매핑은 README.md 부록 A 참조.
 * ========================================================================== */
(function () {
  'use strict';

  // ── 평면(Plane) — 산출물 화면 최상위 분류축 ──────────────────────────────
  var planes = [
    { id: 'customer', title: '고객', subtitle: '방문자·리드', desc: '공개 획득 퍼널 — 랜딩부터 신청까지' },
    { id: 'member',   title: '코칭 멤버', subtitle: '로그인 사용자', desc: '42문항 코칭 여정과 리포트 수령' },
    { id: 'operator', title: '운영자', subtitle: '코치·관리자', desc: '리드 CRM·검수·확정 콘솔' },
    { id: 'system',   title: '시스템 상태', subtitle: '전이 상태', desc: '로딩·분석·검수 대기 등 화면이라기보다 상태' }
  ];

  // ── 구현 상태(Status) — 순서 있는 4단계 (단일 정렬 기준) ─────────────────
  var screenStatuses = [
    { id: 'planned',  label: '미착수', tone: 'gray', rank: 0 },
    { id: 'partial',  label: '부분 구현', tone: 'warn', rank: 1 },
    { id: 'merged',   label: '구현·머지완료', tone: 'blue', rank: 2 },
    { id: 'verified', label: '검증 완료', tone: 'ok', rank: 3 }
  ];
  // 작업 항목 3단계 상태
  var workStatuses = [
    { id: 'todo',   label: '미착수', tone: 'gray' },
    { id: 'review', label: '리뷰 대기', tone: 'warn' },
    { id: 'done',   label: '완료', tone: 'ok' }
  ];

  // ── 단계(Phase) — 명시 순서 배열 ────────────────────────────────────────
  var phaseOrder = [
    { id: 'infra',         label: 'Phase 0 · 인프라' },
    { id: 'p1-mvp',        label: 'Phase 1 · MVP DB연동' },
    { id: 'p1-remaining',  label: 'Phase 1 · 잔여 출시작업' },
    { id: 'p1.5',          label: 'Phase 1.5 · 출시 직후' },
    { id: 'p2',            label: 'Phase 2 · AI 엔진' },
    { id: 'p3',            label: 'Phase 3 · 확장' }
  ];

  // ── 제어 영역(Control Area) — 횡단 비기능 정책축 (= 커버리지 6도메인) ────
  var controlAreas = [
    {
      area: 'auth', label: '인증·세션', goal: '비인가 접근을 차단하고 세션을 안전하게 유지한다.',
      summary: '게스트/멤버/운영자 3계층. 멤버·운영자 세션은 Supabase Auth 대신 profiles.password_hash(scrypt) + 서명 쿠키(hk_member / 관리자 게이트)로 발급한다. 무료 진단 제출은 개인정보 동의(consentAt) 게이트를 통과해야 한다.',
      policies: [
        { statement: '멤버·관리자 세션은 커스텀 scrypt 서명 쿠키로 발급', detail: 'Supabase Auth 대신 profiles.password_hash + SESSION_SECRET 서명. 관리자(admin 게이트)와 멤버(hk_member)가 동일 방식.' },
        { statement: '보호 라우트는 middleware에서 강제', detail: '/coaching·/api/coaching → 멤버 보호, /admin·/api/admin/** → 관리자 보호. 미인증 시 /login?redirect=, 비권한 시 /unauthorized.' },
        { statement: '무료 진단 제출은 개인정보 동의 게이트 통과 필수', detail: 'consentAt 서버 기록 + /privacy 링크. 동의 미체크 시 제출 버튼 비활성.' }
      ],
      decisions: [
        { name: '세션 서명 비밀키', value: 'SESSION_SECRET (Vercel env)' },
        { name: '관리자 비밀번호', value: 'ADMIN_PASSWORD_HASH (scrypt)' },
        { name: '비밀번호 정책', value: '8자 이상' },
        { name: '로그인 실패 잠금', value: '5회 → rate limit 메시지' }
      ],
      standards: [
        { title: '보안·권한 명세', path: 'docs/tech-spec/04-security.md' },
        { title: 'Mission-Critical 제어', path: 'docs/tech-spec/07-mission-critical.md' }
      ],
      workItems: ['WI-04', 'WI-05'],
      gaps: [
        'C-09·A-05의 Supabase Auth 흔적이 커스텀 세션으로 전환 중 — 잔존 분기 정리 필요',
        '초기 멤버 비밀번호 발급→강제 변경 UX 미확정 (ISSUE-06)'
      ]
    },
    {
      area: 'accessControl', label: '접근 제어', goal: '역할별로 데이터·기능 노출을 분리한다.',
      summary: '미들웨어 라우트 가드 + (예정) Supabase RLS. 멤버는 본인 세션만, 운영자만 워크스페이스·리드 접근. 코칭 리포트는 session.status=finalized일 때만 고객에게 노출한다.',
      policies: [
        { statement: '리포트는 finalized 상태에서만 공개', detail: '코치 검수·확정(A-03 Finalize) 전에는 C-14가 R-01 검수 대기 화면을 렌더한다. "AI 초안 → 코치 검수 → 고객 전달" 원칙을 게이트로 강제.' },
        { statement: '운영자 전용 API 분리', detail: '/api/admin/** 는 관리자 세션에서만. 리드·멤버·코칭 조회/변경 권한 분리.' }
      ],
      decisions: [
        { name: 'RLS 적용 대상', value: 'coaching_*, leads, profiles, memberships' },
        { name: '리포트 노출 조건', value: 'session.status === "finalized"' }
      ],
      standards: [
        { title: '보안·권한 명세', path: 'docs/tech-spec/04-security.md' },
        { title: 'DB 데이터 모델', path: 'docs/tech-spec/02-data-model.md' }
      ],
      workItems: ['WI-04', 'WI-05', 'WI-09'],
      gaps: [
        'Supabase RLS 정책 미작성 — 현재 미들웨어 + 서버 측 검증으로 대체',
        'C-14 리포트 공개 게이트 E2E 미검증'
      ]
    },
    {
      area: 'dataIntegrity', label: '데이터 무결성', goal: '사용자 입력 유실 0, 서버 검증을 일원화한다.',
      summary: 'Zod 클라이언트+서버 이중 검증, 42문항은 1초 debounce upsert + localStorage 백업, finalize는 상태 갱신+이메일 발송을 원자적으로 처리한다.',
      policies: [
        { statement: '입력은 Zod로 클라이언트·서버 이중 검증', detail: '무료 진단·상담·신청·코칭 답변 모두. 클라이언트 통과만으로 신뢰하지 않는다.' },
        { statement: '코칭 답변은 자동 저장 + 로컬 백업', detail: '타이핑 멈춤 1초 후 upsert, 실패 시 localStorage 임시 저장 후 재시도.' },
        { statement: 'Finalize는 트랜잭션 처리', detail: 'status 갱신 + 멤버 이메일 발송의 원자성 보장(부분 성공 금지).' }
      ],
      decisions: [
        { name: '자동 저장 간격', value: '1s debounce' },
        { name: '코칭 답변 최대', value: '5000자' },
        { name: '진단 답변 길이', value: '5~2000자' }
      ],
      standards: [
        { title: 'DB 데이터 모델', path: 'docs/tech-spec/02-data-model.md' },
        { title: 'API 명세', path: 'docs/tech-spec/03-api-spec.md' }
      ],
      workItems: ['WI-02', 'WI-06'],
      gaps: [
        'A-03 Finalize 트랜잭션 경계 미정의 (ISSUE-05 연계)',
        '백업 복구 시나리오 E2E 미검증'
      ]
    },
    {
      area: 'failureRecovery', label: '장애·복구', goal: '네트워크·서버 오류에도 데이터와 UX를 회복한다.',
      summary: '진단 제출 10초 타임아웃 + 오프라인 감지·자동 재시도, 자동 저장 실패 재시도, 음성 업로드 실패→텍스트 폴백, 이메일은 email_queue 재시도 패턴.',
      policies: [
        { statement: '제출은 타임아웃 + 재시도', detail: '10초 타임아웃, navigator.onLine 오프라인 감지 후 복구 시 자동 재시도. 답변은 로컬 보존.' },
        { statement: '음성 실패는 텍스트로 폴백', detail: '음성 업로드 실패 시 텍스트 모드 유지 + 재시도 버튼.' },
        { statement: '이메일은 큐 기반 재시도', detail: 'email_queue 재시도 패턴(Resend).' }
      ],
      decisions: [
        { name: 'API 타임아웃', value: '10s' },
        { name: '분석 폴링 타임아웃', value: '30분 (60회)' }
      ],
      standards: [
        { title: '운영·CI/CD', path: 'docs/tech-spec/05-operations.md' },
        { title: 'Mission-Critical 제어', path: 'docs/tech-spec/07-mission-critical.md' }
      ],
      workItems: ['WI-02', 'WI-11'],
      gaps: [
        '전역 장애 대응 런북 미작성',
        '재시도 상한·백오프 정책 미정의'
      ]
    },
    {
      area: 'observability', label: '관측성', goal: '실패와 전환을 추적해 운영 의사결정의 근거를 만든다.',
      summary: '제출 성공/실패, 저장 실패율, 로그인 시도, finalize audit, CSV 다운로드 audit 등 핵심 이벤트가 대부분 미정의 — 가장 큰 갭 영역이다.',
      policies: [
        { statement: '핵심 전환·실패 이벤트를 정의·수집(예정)', detail: '제출·저장·로그인·확정 이벤트의 스키마와 적재 위치를 우선 확정한다.' }
      ],
      decisions: [],
      standards: [
        { title: '운영·CI/CD', path: 'docs/tech-spec/05-operations.md' }
      ],
      workItems: [],
      gaps: [
        '진단/상담 제출 성공·실패 로그 미정의 (C-03·C-05·A-01)',
        '코칭 자동 저장 실패율 미추적 (C-11)',
        '로그인 실패 시도 미추적 (C-09)',
        'A-03 Finalize audit log 미정의',
        '리드 CSV 다운로드 audit 처리 미결 (ISSUE-07)'
      ]
    },
    {
      area: 'performance', label: '성능·캐시', goal: '시니어 사용자의 체감 속도를 확보한다.',
      summary: '랜딩 LCP<2.5s·CLS<0.1, 단계 전환<200ms, 제출 10초 타임아웃, manualChunks 번들 예산 gzip 80KB, font-display:swap.',
      policies: [
        { statement: '번들 예산 gzip 80KB 유지', detail: 'manualChunks + lazy 라우트로 유지.' },
        { statement: '랜딩 성능 목표 고정', detail: 'LCP < 2.5s, CLS < 0.1 (Lighthouse 모바일 ≥ 80).' },
        { statement: '단계 전환 < 200ms', detail: '진단 폼 단계 애니메이션 200ms 이하.' }
      ],
      decisions: [
        { name: '번들 예산', value: 'gzip 80KB' },
        { name: 'LCP 목표', value: '< 2.5s' },
        { name: 'CLS 목표', value: '< 0.1' }
      ],
      standards: [
        { title: '시스템 아키텍처', path: 'docs/tech-spec/01-architecture.md' },
        { title: '운영·CI/CD', path: 'docs/tech-spec/05-operations.md' }
      ],
      workItems: [],
      gaps: [
        '코칭 자동 저장 SLA 미정의 (C-11)',
        '이미지·리포트 캐시 전략 미정의'
      ]
    }
  ];

  // 화면별·영역별 특이 요점(있는 경우만). 없으면 generic 파생.
  // key = "screenId::area"
  var NOTE = {
    'C-03::auth': 'consentAt 개인정보 동의 게이트 — 미동의 시 제출 차단',
    'C-03::dataIntegrity': 'Zod 클라이언트 + 서버 이중 검증, 24h Rate Limit',
    'C-03::failureRecovery': 'localStorage 백업 + 오프라인 복구 자동 재시도',
    'C-03::performance': '10초 타임아웃 + 단계 전환 200ms',
    'C-03::observability': '제출 성공/실패 로그 정의 필요',
    'C-11::dataIntegrity': '1초 debounce upsert + localStorage 백업',
    'C-11::failureRecovery': '저장 실패 재시도 + 음성→텍스트 폴백',
    'C-11::auth': '멤버 세션(hk_member) 필요',
    'C-11::accessControl': '본인 세션 답변만 접근',
    'C-11::performance': 'debounce 정의, 저장 SLA 미정의',
    'A-03::auth': '관리자 세션 필요',
    'A-03::accessControl': '운영자만 워크스페이스 접근',
    'A-03::dataIntegrity': 'Finalize 트랜잭션 경계 미정의 (갭)',
    'A-01::observability': 'Realtime 피드, CSV audit 미결',
    'C-13::observability': '분석 상태 폴링 추적',
    'C-01::performance': 'LCP<2.5s · CLS<0.1 목표'
  };

  // ── 산출물 화면(Screen) 레지스트리 ──────────────────────────────────────
  // coverage 키 순서 = controlAreas 순서. 값: covered|partial|gap|na
  // controlAreaNotes 는 coverage(covered|partial)에서 파생(정규화 단계).
  var screens = [
    // ── customer 평면 ─────────────────────────────────────────────────────
    s('customer', 'landing', 'C-01', '메인 랜딩', '/', '서비스형', 'p1-mvp', 'Guest',
      '히어로 + 가치 제안 + 상품 안내 + FAQ. 무료 진단·상담 유입 관문.',
      { auth: 'na', accessControl: 'na', dataIntegrity: 'na', failureRecovery: 'gap', observability: 'gap', performance: 'covered' },
      {
        authGate: '공개(게스트) — 가드 없음',
        clientActions: ['CTA 2종(무료 진단 / 무료 상담) 라우팅', 'IntersectionObserver 네비 자동 활성화', 'FAQ 아코디언 키보드(Enter/Space)'],
        serverActions: [], dataReads: [], dataWrites: [],
        telemetryEvents: ['(정의 필요) CTA 클릭 전환'],
        exceptionStates: [], workItems: [], requirementRefs: ['PRD v3.0 §랜딩'], implLocation: 'src/pages/Index.tsx'
      }),
    s('customer', 'service', 'C-02', '서비스 소개', '/service', '콘텐츠형', 'p1-mvp', 'Guest',
      '한끗 방법론 3단계·6주 타임라인·산출물 6종·상품 가격 소개.',
      { auth: 'na', accessControl: 'na', dataIntegrity: 'na', failureRecovery: 'gap', observability: 'gap', performance: 'gap' },
      {
        authGate: '공개(게스트)', clientActions: ['프로그램 안내서 PDF(Drive) 새 탭', '6주 타임라인 반응형 그리드'],
        serverActions: [], dataReads: [], dataWrites: [], telemetryEvents: [],
        exceptionStates: [], workItems: [], requirementRefs: ['PRD v3.0 §서비스'], implLocation: 'src/pages/Service.tsx'
      }),
    s('customer', 'diagnosis', 'C-03', '무료 진단 폼', '/diagnosis', '서비스형', 'p1-mvp', 'Guest',
      '무료 리드 수집 핵심 관문. 이름·이메일·7문항 답변 → leads/free_diagnostics 저장.',
      { auth: 'covered', accessControl: 'na', dataIntegrity: 'covered', failureRecovery: 'covered', observability: 'partial', performance: 'covered' },
      {
        authGate: '공개 — 단, 제출은 개인정보 동의(consentAt) 게이트 필수',
        clientActions: ['9단계 폼 진행/뒤로', '실시간 localStorage 저장(diag_answers)', '글자 수 표시', '제출 → 분석 로딩'],
        serverActions: ['POST submit-free-diagnosis (Zod 검증·24h Rate Limit·insert)'],
        dataReads: ['free_diagnostics(중복 체크)'], dataWrites: ['free_diagnostics', 'leads'],
        telemetryEvents: ['(정의 필요) 진단 제출 성공/실패'],
        exceptionStates: ['analyzing-free'], workItems: ['WI-02'], requirementRefs: ['SRS FR-FREE-01', 'FR-PRIV'],
        implLocation: 'src/pages/Diagnosis.tsx + supabase/functions/submit-free-diagnosis'
      }, { mc: true, statusNote: '제출 + 규칙 기반 분류 서버 영속화 머지(CHG-020) — LLM 분류는 Phase 2' }),
    s('customer', 'report-free', 'C-05', '무료 진단 리포트', '/diagnosis (report)', '콘텐츠형', 'p1-mvp', 'Guest',
      '4유형 분류 + 5영역 점수 시각화. 유료 전환 CTA.',
      { auth: 'na', accessControl: 'na', dataIntegrity: 'na', failureRecovery: 'gap', observability: 'partial', performance: 'gap' },
      {
        authGate: '공개 — diagnosticStore 없으면 /diagnosis 리다이렉트',
        clientActions: ['유형 표시(4종)', '5영역 차트', '전환 CTA(상담/빌드)'],
        serverActions: [], dataReads: ['diagnosticStore(type, scores)'], dataWrites: [],
        telemetryEvents: ['(정의 필요) 리포트 조회·CTA'],
        exceptionStates: [], workItems: ['WI-07', 'WI-08'], requirementRefs: ['SRS FR-FREE-04'], implLocation: 'src/components/free-diagnosis/Report.tsx (인페이지)'
      }, { statusNote: '리포트는 인페이지 즉시 렌더 + 서버 분류 영속화(CHG-020). System 2(/result) 제거 완료(CHG-021). 잔여: E2E' }),
    s('customer', 'consultation', 'C-06', '무료 상담 신청', '/consultation', '서비스형', 'p1-mvp', 'Guest',
      '상담 신청 리드 수집. ConsultationSchema 폼 → DB insert.',
      { auth: 'covered', accessControl: 'na', dataIntegrity: 'covered', failureRecovery: 'partial', observability: 'gap', performance: 'na' },
      {
        authGate: '공개 — 제출 시 개인정보 동의 필수',
        clientActions: ['상담 신청 폼(목적 복수선택)', '동의 체크 + /privacy'],
        serverActions: ['POST submit-consultation (insert, 24h 중복 409)'],
        dataReads: [], dataWrites: ['leads'], telemetryEvents: [],
        exceptionStates: [], workItems: [], requirementRefs: ['SRS FR-LEAD'], implLocation: 'src/pages/Consultation.tsx'
      }),
    s('customer', 'apply', 'C-07', '유료 상품 신청', '/apply/*', '서비스형', 'p1-mvp', 'Guest',
      '4상품 신청 리드 수집(ApplyForm 공통). 계약은 오프라인.',
      { auth: 'na', accessControl: 'na', dataIntegrity: 'na', failureRecovery: 'gap', observability: 'gap', performance: 'gap' },
      {
        authGate: '공개 — 제출 시 동의 필수',
        clientActions: ['상품 확인 카드(라우트별)', 'ApplyForm 공통 폼', '제출 → 완료'],
        serverActions: ['POST submit-apply (insert)'], dataReads: [], dataWrites: ['leads'],
        telemetryEvents: [], exceptionStates: [], workItems: [], requirementRefs: ['SRS FR-LEAD-02'], implLocation: 'src/pages/apply/Apply*.tsx'
      }),
    s('customer', 'apply-thank-you', 'C-08', '신청 완료', '/apply/thank-you', '콘텐츠형', 'p1-mvp', 'Guest',
      '신청 접수 완료 안내 + 다음 절차(영업일 2일 내 연락).',
      { auth: 'na', accessControl: 'na', dataIntegrity: 'na', failureRecovery: 'gap', observability: 'gap', performance: 'gap' },
      {
        authGate: '공개 — leadsStore 없으면 / 리다이렉트',
        clientActions: ['완료 메시지 + 다음 절차'], serverActions: [], dataReads: [], dataWrites: [],
        telemetryEvents: [], exceptionStates: [], workItems: [], requirementRefs: ['SRS FR-LEAD-03'], implLocation: 'src/pages/apply/ApplyThankYou.tsx'
      }),
    s('customer', 'login', 'C-09', '멤버 로그인', '/login', '서비스형', 'p1-mvp', 'Guest',
      '멤버 인증. currentMember 세팅 후 /coaching 또는 이전 경로로 이동.',
      { auth: 'gap', accessControl: 'gap', dataIntegrity: 'covered', failureRecovery: 'partial', observability: 'gap', performance: 'na' },
      {
        authGate: '공개 진입 — 성공 시 멤버 세션(hk_member) 발급',
        clientActions: ['이메일+비밀번호 폼', '비번 표시 토글', '성공 → 이전 경로 복원'],
        serverActions: ['POST /api/auth/login (profiles.password_hash scrypt 검증, 서명 쿠키)', 'GET /api/auth/me'],
        dataReads: ['profiles'], dataWrites: ['세션 쿠키'],
        telemetryEvents: ['(정의 필요) 로그인 실패 시도'],
        exceptionStates: [], workItems: ['WI-05'], requirementRefs: ['SRS FR-AUTH-03'], implLocation: 'src/pages/Login.tsx + src/app/api/auth/*'
      }, { statusNote: '커스텀 세션 DB화 머지(PR1, be partial) — Supabase Auth 잔흔 정리 필요' }),
    s('customer', 'privacy', 'C-15', '개인정보 처리방침', '/privacy', '콘텐츠형', 'p1-remaining', 'Guest',
      '개인정보처리방침 전문. 동의 링크 착지점.',
      { auth: 'na', accessControl: 'na', dataIntegrity: 'na', failureRecovery: 'gap', observability: 'gap', performance: 'gap' },
      {
        authGate: '공개', clientActions: ['처리방침 전문', '동의 링크 새 탭 착지'],
        serverActions: [], dataReads: [], dataWrites: [], telemetryEvents: [],
        exceptionStates: [], workItems: ['WI-03'], requirementRefs: ['SRS FR-PRIV'], implLocation: 'src/pages/Privacy.tsx'
      }, { statusNote: 'ISSUE-03 해결 — 라우트 등록(CHG-011)' }),

    // ── member 평면 ───────────────────────────────────────────────────────
    s('member', 'coaching-dashboard', 'C-10', '코칭 대시보드', '/coaching', '서비스형', 'p1-mvp', 'Member',
      '4파트 진행률 + 세션 상태별 CTA.',
      { auth: 'covered', accessControl: 'covered', dataIntegrity: 'partial', failureRecovery: 'partial', observability: 'gap', performance: 'gap' },
      {
        authGate: '멤버 세션 필요 — 미인증 시 /login',
        clientActions: ['Part1~4 진행률 + 전체 N/42', '상태별 CTA(이어쓰기/검토중/리포트)'],
        serverActions: ['GET /api/coaching/session (상태·진행률)'], dataReads: ['coaching_sessions', 'coaching_answers'], dataWrites: [],
        telemetryEvents: [], exceptionStates: [], workItems: ['WI-06'], requirementRefs: ['SRS FR-COACH-01'], implLocation: 'src/pages/coaching/CoachingDashboard.tsx'
      }),
    s('member', 'coaching-questions', 'C-11', '42문항 작성', '/coaching/questions', '서비스형', 'p1-mvp', 'Member',
      '42문항 텍스트/음성 입력. 1초 debounce 자동 저장. 코칭 핵심 데이터 수집.',
      { auth: 'covered', accessControl: 'covered', dataIntegrity: 'covered', failureRecovery: 'covered', observability: 'gap', performance: 'partial' },
      {
        authGate: '멤버 세션 필요',
        clientActions: ['문항 사이드바(완료/미완료)', '텍스트/음성 모드 탭', '1초 debounce 자동 저장', '파트 구조(Part1~4)'],
        serverActions: ['POST /api/coaching/answers (upsert)', 'POST upload-voice [P1.5]'],
        dataReads: ['coaching_answers'], dataWrites: ['coaching_answers'],
        telemetryEvents: ['(정의 필요) 저장 실패율'],
        exceptionStates: ['coaching-analyzing'], workItems: ['WI-06', 'WI-12'], requirementRefs: ['SRS FR-COACH-02', 'FR-COACH-04'],
        implLocation: 'src/pages/coaching/CoachingQuestions.tsx + src/lib/coaching.ts'
      }, { mc: true, statusNote: '텍스트 답변 DB화 머지(PR2, be partial) — 음성 후순위(ISSUE-04)' }),
    s('member', 'coaching-review', 'C-12', '답변 리뷰·제출', '/coaching/review', '서비스형', 'p1-mvp', 'Member',
      '42문항 전체 검토 + 최종 제출. session.status="submitted".',
      { auth: 'covered', accessControl: 'covered', dataIntegrity: 'partial', failureRecovery: 'partial', observability: 'gap', performance: 'gap' },
      {
        authGate: '멤버 세션 필요',
        clientActions: ['파트별 답변 일람', '미답변 강조 + 작성 링크', '최종 제출 잠금 확인'],
        serverActions: ['POST /api/coaching/submit (status=submitted)'], dataReads: ['coaching_answers'], dataWrites: ['coaching_sessions'],
        telemetryEvents: [], exceptionStates: ['coaching-analyzing'], workItems: ['WI-06'], requirementRefs: ['SRS FR-COACH-05'], implLocation: 'src/pages/coaching/CoachingReview.tsx'
      }, { statusNote: '제출 DB화 머지(PR2)' }),
    s('member', 'coaching-report', 'C-14', '코칭 리포트', '/coaching/report', '콘텐츠형', 'p1-remaining', 'Member',
      'Admin finalize 후에만 표시. 브랜드 프로필 + 문항별 인사이트 + PDF.',
      { auth: 'covered', accessControl: 'covered', dataIntegrity: 'partial', failureRecovery: 'partial', observability: 'gap', performance: 'gap' },
      {
        authGate: '멤버 세션 필요 — status!=finalized 시 R-01 렌더',
        clientActions: ['검수 게이트(미확정→대기)', '브랜드 프로필', 'PDF 다운로드(print)'],
        serverActions: ['GET /api/coaching/report'], dataReads: ['coaching_reports', 'coaching_sessions'], dataWrites: [],
        telemetryEvents: [], exceptionStates: ['report-pending'], workItems: ['WI-09'], requirementRefs: ['SRS FR-WORK-04'], implLocation: 'src/pages/coaching/CoachingReport.tsx'
      }),
    s('member', 'change-report', 'R-14', '변화 리포트', null, '콘텐츠형', 'p3', 'Member',
      '재진단 전후 브랜드 변화 시각화. (Phase 3 로드맵)',
      naCov(),
      roadmapEng('member', '재진단 비교 — Phase 3 미구현')),

    // ── operator 평면 ─────────────────────────────────────────────────────
    s('operator', 'admin', 'A-01', '관리자 콘솔', '/admin', '서비스형', 'p1-mvp', 'Admin',
      '리드 CRM + 멤버 계정 발급 2탭. 전체 운영 허브.',
      { auth: 'covered', accessControl: 'covered', dataIntegrity: 'partial', failureRecovery: 'partial', observability: 'partial', performance: 'na' },
      {
        authGate: '관리자 세션 필요 — Member 접근 시 /unauthorized',
        clientActions: ['리드 CRM 테이블(필터·페이지네이션)', '멤버 발급 폼', '대시보드 카드', '실시간 피드'],
        serverActions: ['GET /api/leads, PATCH /api/leads/[id]', 'GET/POST /api/admin/members'],
        dataReads: ['leads', 'profiles', 'memberships', 'coaching_sessions'], dataWrites: ['leads(memo,status)', 'profiles', 'memberships'],
        telemetryEvents: ['(정의 필요) CSV 다운로드 audit'],
        exceptionStates: [], workItems: ['WI-04', 'WI-05'], requirementRefs: ['SRS FR-ADMIN-01', 'FR-AUTH-04'], implLocation: 'src/screens/admin/AdminDashboard.tsx + src/app/api/leads|admin'
      }, { statusNote: '리드 CRM·멤버 발급 DB화 머지(CHG-017/018, be partial)' }),
    s('operator', 'admin-lead-detail', 'A-02', '리드 상세', '/admin (panel)', '서비스형', 'p1-mvp', 'Admin',
      '7문항 답변 전문 + 5영역 점수 + 메모 + 상태 변경.',
      { auth: 'covered', accessControl: 'covered', dataIntegrity: 'partial', failureRecovery: 'partial', observability: 'gap', performance: 'na' },
      {
        authGate: '관리자 세션 필요',
        clientActions: ['답변 전문 + 점수 + 추천 패키지', '인라인 메모', '상태 드롭다운'],
        serverActions: ['GET /api/leads/[id], PATCH /api/leads/[id]'], dataReads: ['leads', 'free_diagnostics'], dataWrites: ['leads(memo,status)'],
        telemetryEvents: [], exceptionStates: [], workItems: ['WI-04'], requirementRefs: ['SRS FR-ADMIN-02'], implLocation: 'src/screens/admin/AdminDashboard.tsx (LeadDetail)'
      }, { statusNote: 'leads.memo DB 영속화(CHG-016/017)' }),
    s('operator', 'workspace', 'A-03', '코칭 워크스페이스', '/coaching/workspace/:id', '서비스형', 'p1-remaining', 'Admin',
      '42문항 검토 + 코치 메모 + AIDraft 수정 + Finalize. 리포트 공개 게이트.',
      { auth: 'covered', accessControl: 'covered', dataIntegrity: 'gap', failureRecovery: 'partial', observability: 'gap', performance: 'na' },
      {
        authGate: '관리자 세션 필요 — finalized 세션은 AIDraft 읽기 전용',
        clientActions: ['42문항 조회 + 음성 재생', '문항별 메모', 'AIDraft 인라인 수정', 'Finalize(상태 갱신+이메일)'],
        serverActions: ['GET /api/admin/coaching/[memberId]', 'PATCH coaching-sessions', 'POST send-report-ready [Resend]'],
        dataReads: ['coaching_answers', 'coaching_reports'], dataWrites: ['coaching_sessions(status)', 'coaching_reports'],
        telemetryEvents: ['(정의 필요) Finalize audit log'],
        exceptionStates: [], workItems: ['WI-09', 'WI-10'], requirementRefs: ['SRS FR-WORK-01~04'], implLocation: 'src/pages/coaching/CoachingWorkspace.tsx'
      }, { mc: true, statusNote: '관리자 조회 DB화(PR2) — Finalize·이메일은 PR4 대기' }),
    s('operator', 'admin-notifications', 'A-04', '알림 시스템', '/admin (overlay)', '서비스형', 'p1-mvp', 'Admin',
      '실시간 알림. 미읽음 카운트 뱃지.',
      { auth: 'covered', accessControl: 'covered', dataIntegrity: 'partial', failureRecovery: 'partial', observability: 'gap', performance: 'na' },
      {
        authGate: '관리자 세션 필요',
        clientActions: ['헤더 벨 미읽음 뱃지', '알림 목록 + 읽음 처리', '멀티탭 동기화'],
        serverActions: ['Realtime 구독(리드/제출/결제)'], dataReads: ['notifications'], dataWrites: ['notifications(read)'],
        telemetryEvents: [], exceptionStates: [], workItems: [], requirementRefs: ['SRS FR-NOTIF'], implLocation: 'notificationStore + Header bell'
      }),
    s('operator', 'admin-auth', 'A-05', '어드민 인증 게이트', '/admin (guard)', '서비스형', 'p1-remaining', 'Admin',
      '관리자 세션 검사. 미충족 → /unauthorized.',
      { auth: 'gap', accessControl: 'gap', dataIntegrity: 'na', failureRecovery: 'partial', observability: 'gap', performance: 'na' },
      {
        authGate: '관리자 쿠키 세션 게이트(middleware)',
        clientActions: ['세션 만료 감지 → /login?redirect=/admin'],
        serverActions: ['POST /api/admin/login (ADMIN_PASSWORD_HASH scrypt)', 'middleware 검증'],
        dataReads: [], dataWrites: ['관리자 세션 쿠키'], telemetryEvents: [],
        exceptionStates: [], workItems: ['WI-04'], requirementRefs: ['SRS FR-AUTH-01', 'FR-AUTH-02'], implLocation: 'src/middleware.ts + src/app/api/admin/login'
      }, { statusNote: '쿠키 세션 게이트 머지(CHG-017) — RLS·RBAC 강화 잔여' }),

    // operator 평면 — Phase 2/3 로드맵 (admin AI/확장)
    roadmap('operator', 'admin-brief', 'R-02', '마스터 브리프 (F1)', 'p2', '42문항 → 8섹션 브리프 자동 생성 (GPT-4o)'),
    roadmap('operator', 'admin-oneliner', 'R-03', '원라이너 3종', 'p2', '전문성형·공감형·결과형 3종 초안 생성'),
    roadmap('operator', 'admin-questions', 'R-04', '질문 아키텍처 (F9)', 'p2', '42문항 분류·트리거 관리'),
    roadmap('operator', 'admin-patterns', 'R-05', '패턴 분류기 (F10)', 'p2', '답변 → 10개 패턴 자동 분류 (NLP + LLM)'),
    roadmap('operator', 'admin-mapper', 'R-06', '브랜딩 매퍼 (F11)', 'p2', '답변 → 8대 브랜딩 요소 매핑'),
    roadmap('operator', 'admin-feedback', 'R-07', '코칭 피드백 (F12)', 'p2', '코칭 스크립트 자동 생성'),
    roadmap('operator', 'admin-rules', 'R-08', '리포트 룰 엔진 (F13)', 'p2', '일관성 ≥95% 규칙 기반 리포트 생성'),
    roadmap('operator', 'admin-crosscheck', 'R-09', '교차검증', 'p2', '답변 간 관계 패턴 분석 (9개 매트릭스)'),
    roadmap('operator', 'admin-handoff', 'R-10', '휴먼 핸드오프 (F14)', 'p2', 'AI 한계 감지 시 코치 개입 트리거'),
    roadmap('operator', 'admin-airuns', 'R-11', 'AI 호출 로그', 'p2', 'API 호출 성공/실패·비용 추적'),
    roadmap('operator', 'admin-retainer', 'R-12', '리테이너 관리', 'p3', '한끗 파트너 월 구독 결제·운영 (토스페이먼츠)'),
    roadmap('operator', 'admin-export', 'R-13', 'PPT Export', 'p3', '브랜드 프로필 → PPT/PDF 자동 출력'),

    // ── system 평면 (전이 상태) ────────────────────────────────────────────
    s('system', 'analyzing-free', 'C-04', '분석 로딩', '/diagnosis (loading)', '시스템상태', 'p1-mvp', 'Guest',
      'Edge Function 응답 대기 연출. 완료 시 /result 자동 이동.',
      { auth: 'na', accessControl: 'na', dataIntegrity: 'na', failureRecovery: 'gap', observability: 'gap', performance: 'gap' },
      {
        authGate: '공개(전이 상태)',
        clientActions: ['로딩 연출', '응답 수신 → /result replace', '10초 초과 → 타임아웃 안내'],
        serverActions: ['submit-free-diagnosis 응답 대기'], dataReads: [], dataWrites: [], telemetryEvents: [],
        exceptionStates: [], workItems: ['WI-02'], requirementRefs: ['SRS FR-FREE-02'], implLocation: 'src/pages/Diagnosis.tsx (loading)'
      }),
    s('system', 'coaching-analyzing', 'C-13', 'AI 분석 진행', '/coaching/analyzing', '시스템상태', 'p1-mvp', 'Member',
      '30초 폴링으로 분석 완료 감지 → /coaching/report 자동 이동.',
      { auth: 'covered', accessControl: 'covered', dataIntegrity: 'partial', failureRecovery: 'partial', observability: 'partial', performance: 'gap' },
      {
        authGate: '멤버 세션 필요(전이 상태)',
        clientActions: ['분석 연출 + 단계 메시지', '30초 상태 폴링', '30분 초과 → 폴링 중단 + 이메일 안내'],
        serverActions: ['GET /api/coaching/session(status)'], dataReads: ['coaching_sessions'], dataWrites: [], telemetryEvents: ['분석 상태 폴링'],
        exceptionStates: [], workItems: ['WI-10'], requirementRefs: ['SRS FR-COACH'], implLocation: 'src/pages/coaching/CoachingAnalyzing.tsx'
      }, { statusNote: '폴링 vs Realtime 선택 미결(ISSUE-08, 폴링 권장)' }),
    s('system', 'report-pending', 'R-01', '검수 대기 안내', '/coaching/report (대기)', '시스템상태', 'p1.5', 'Member',
      '제출 후 / 분석 전 대기 화면. 이메일 알림 연계.',
      { auth: 'covered', accessControl: 'covered', dataIntegrity: 'partial', failureRecovery: 'partial', observability: 'gap', performance: 'gap' },
      {
        authGate: '멤버 세션 필요(전이 상태)',
        clientActions: ['"리포트 준비 중" + 예상 완료일 + 이메일 알림 안내'],
        serverActions: [], dataReads: ['coaching_sessions'], dataWrites: [], telemetryEvents: [],
        exceptionStates: [], workItems: ['WI-11'], requirementRefs: ['SRS FR-WORK-04(보조)'], implLocation: 'src/pages/coaching/CoachingReport.tsx (status=submitted)'
      }, { statusNote: 'Phase 1.5 — 미착수' })
  ];

  // ── 작업 항목(Work Item) DAG ────────────────────────────────────────────
  var workItems = [
    w('WI-01', 'Supabase 인프라 초기화', 'infra', 'done', 'CHG-012', [], [],
      'client.ts + migrations(profiles·leads·memberships·coaching_*) 4종'),
    w('WI-02', '무료 진단 Edge Function', 'p1-mvp', 'done', 'CHG-013', ['WI-01'], ['customer/diagnosis', 'system/analyzing-free'],
      'submit-free-diagnosis(Zod·24h RateLimit·insert)'),
    w('WI-03', '/privacy 라우트 등록', 'p1-mvp', 'done', 'CHG-011 · ISSUE-03', [], ['customer/privacy'],
      'Privacy.tsx + 라우트 등록'),
    w('WI-04', '관리자 쿠키 세션 + 리드 CRM DB', 'p1-mvp', 'done', 'CHG-017', ['WI-01'], ['operator/admin', 'operator/admin-lead-detail', 'operator/admin-auth'],
      'middleware + /api/admin/login(scrypt) + /api/leads(GET/PATCH)'),
    w('WI-05', '멤버 인증 DB화 (PR1)', 'p1-mvp', 'done', 'CHG-018 · PR#?', ['WI-04'], ['customer/login', 'operator/admin'],
      'profiles.password_hash + hk_member 세션 + /api/auth + /api/admin/members'),
    w('WI-06', '42문항 코칭 답변 DB (PR2)', 'p1-mvp', 'done', 'CHG-019 · 7bc13c2', ['WI-05'], ['member/coaching-questions', 'member/coaching-review', 'member/coaching-dashboard', 'operator/admin'],
      'coaching_sessions/answers + /api/coaching + useDbCoaching'),
    w('WI-07', '4유형 분류 결정·서버 영속화', 'p1-remaining', 'done', 'CHG-020 · ISSUE-01/02', ['WI-02'], ['customer/diagnosis', 'customer/report-free'],
      '규칙 기반 analyzeFree를 /api/diagnoses 서버에서 계산 → free_diagnostics.score·leads.score 영속화'),
    w('WI-08', '무료 진단 리포트 검증(E2E) + CI', 'p1-remaining', 'done', 'CHG-022~024', ['WI-07'], ['customer/report-free'],
      'green: vitest 16/16(분류 8 + /api/diagnoses 영속화 5) + Playwright E2E 2/2(퍼널→리포트, /result 리다이렉트). CI 연결 완료(.github/workflows/ci.yml: unit + e2e 잡)'),
    w('WI-09', '워크스페이스 Finalize + 리포트 공개 (PR4)', 'p1-remaining', 'todo', '', ['WI-06'], ['operator/workspace', 'member/coaching-report'],
      'Finalize 트랜잭션 + RLS 공개 게이트'),
    w('WI-10', 'AI 분석 파이프라인 (GPT-4o, PR4)', 'p1-remaining', 'todo', '', ['WI-06'], ['system/coaching-analyzing', 'operator/workspace'],
      'submitted → analyzed 자동 분석'),
    w('WI-11', '이메일 알림 (Resend) + 검수 대기', 'p1.5', 'todo', '', ['WI-09'], ['operator/workspace', 'system/report-pending'],
      'send-report-ready + email_queue 재시도'),
    w('WI-12', '음성 입력 재활성화', 'p1.5', 'todo', 'ISSUE-04', ['WI-06'], ['member/coaching-questions'],
      'MediaRecorder + upload-voice + Storage'),
    w('WI-13', 'AI 엔진군 (브리프·원라이너·패턴·매퍼)', 'p2', 'todo', '', ['WI-10'], ['operator/admin-brief', 'operator/admin-oneliner', 'operator/admin-patterns', 'operator/admin-mapper'],
      'LLM API 연동 — Phase 2 엔진 활성화'),
    w('WI-14', '결제·리테이너 (토스페이먼츠)', 'p3', 'todo', '', ['WI-13'], ['operator/admin-retainer'],
      '한끗 파트너 월 구독'),
    w('WI-15', 'PPT Export / 변화 리포트', 'p3', 'todo', '', ['WI-13'], ['operator/admin-export', 'member/change-report'],
      '산출물 자동 출력 + 재진단 비교')
  ];

  // ── 흐름(Flow) ──────────────────────────────────────────────────────────
  var flows = [
    { id: 'customer', plane: 'customer', kind: 'sequence', title: '고객 획득 퍼널',
      desc: '방문 → 무료 진단 → 리포트 → 상담·신청 → 접수. 10분 안에 리드로 전환되는 핵심 퍼널.',
      screens: ['landing', 'service', 'diagnosis', 'report-free', 'consultation', 'apply', 'apply-thank-you'] },
    { id: 'member', plane: 'member', kind: 'sequence', title: '멤버 코칭 여정',
      desc: '로그인 후 대시보드 → 42문항 작성 → 검토·제출 → (검수) → 확정 리포트 수령.',
      screens: ['coaching-dashboard', 'coaching-questions', 'coaching-review', 'coaching-report'] },
    { id: 'operator', plane: 'operator', kind: 'sequence', title: '운영자 검수 루프',
      desc: '1인 운영 루프 — 알림 수신 → 리드 검토 → 워크스페이스 검수 → 확정. "AI 초안 → 코치 검수 → 고객 전달"을 게이트로 강제.',
      screens: ['admin-notifications', 'admin', 'admin-lead-detail', 'workspace'] },
    { id: 'system', plane: 'system', kind: 'set', title: '시스템 상태 케이스',
      desc: '순서가 없는 전이/대기 상태 집합 — 다른 화면의 예외 상태로 참조된다.',
      screens: ['analyzing-free', 'coaching-analyzing', 'report-pending'] }
  ];

  // ── 메타 ────────────────────────────────────────────────────────────────
  var meta = {
    project: '한끗프로젝트',
    subtitle: '5060 경력 자산화 · 퍼스널 브랜딩 코칭',
    version: 'PlayBoard 1.0 (SoT: playboard.ts v2.0)',
    lastUpdated: '2026-06-27',
    anchor: '2026-06-29',           // Day1 기준일 (wave 추정)
    coverageDomainKeys: controlAreas.map(function (a) { return a.area; })
  };

  /* ==========================================================================
   * 화면 authoring 헬퍼
   * ======================================================================== */
  function s(plane, slug, id, title, route, designSpecType, phase, auth, purpose, coverage, eng, opt) {
    opt = opt || {};
    return {
      plane: plane, slug: slug, id: id, title: title, route: route,
      designSpecType: designSpecType, phase: phase, auth: auth, purpose: purpose,
      flowNote: purpose, coverage: coverage,
      status: deriveStatus(phase, opt),  // 정규화 단계에서 fe/be 반영. opt.status 우선.
      statusNote: opt.statusNote || null,
      isMissionCritical: !!opt.mc,
      engineering: eng,
      requirementRefs: eng.requirementRefs || [],
      workItems: eng.workItems || [],
      implLocation: eng.implLocation || null,
      proto: slug  // 프로토타입 파일명 = slug
    };
  }
  function naCov() {
    return { auth: 'na', accessControl: 'na', dataIntegrity: 'na', failureRecovery: 'na', observability: 'na', performance: 'na' };
  }
  function roadmapEng(plane, note) {
    return {
      authGate: plane === 'operator' ? '관리자 세션 필요 (미구현)' : '멤버 세션 필요 (미구현)',
      clientActions: [note], serverActions: ['(Phase 2/3 — LLM/결제 연동 시 구현)'],
      dataReads: [], dataWrites: [], telemetryEvents: [], exceptionStates: [],
      workItems: [], requirementRefs: ['PRD v3.0 로드맵'], implLocation: null
    };
  }
  function roadmap(plane, slug, id, title, phase, purpose) {
    var sc = s(plane, slug, id, title, null, '로드맵', phase, plane === 'operator' ? 'Admin' : 'Member',
      purpose, naCov(), roadmapEng(plane, purpose));
    // 로드맵 화면을 관련 작업에 연결 (역참조용)
    return sc;
  }
  function w(id, title, phase, status, externalRefs, dependsOn, screensArr, doc) {
    return { id: id, title: title, phase: phase, status: status, externalRefs: externalRefs, dependsOn: dependsOn, screens: screensArr, doc: doc };
  }
  // 화면 status 파생 규칙(README 부록 A): roadmap(p2/p3)=planned, 그 외는 명시.
  function deriveStatus(phase, opt) {
    if (opt.status) return opt.status;
    if (phase === 'p2' || phase === 'p3') return 'planned';
    if (phase === 'p1.5') return 'planned';   // R-01 검수대기 미착수
    return 'partial';  // 정규화 단계에서 merged 승격
  }

  /* ==========================================================================
   * 정규화 — be 머지 화면을 merged 로 승격 + controlAreaNotes 파생
   * ======================================================================== */
  // be(백엔드)가 머지된 화면(PR 통과) = merged. 원천: CHANGES PR1/PR2 + Edge/리드.
  var MERGED = { 'C-03': 1, 'C-05': 1, 'C-09': 1, 'C-11': 1, 'C-12': 1, 'A-01': 1, 'A-02': 1, 'A-05': 1 };
  var areaKeys = controlAreas.map(function (a) { return a.area; });
  var areaLabel = {};
  controlAreas.forEach(function (a) { areaLabel[a.area] = a.label; });

  screens.forEach(function (sc) {
    if (MERGED[sc.id] && sc.status === 'partial') sc.status = 'merged';
    // controlAreaNotes 파생: coverage covered|partial → 노트 존재(●)
    sc.engineering.controlAreaNotes = {};
    areaKeys.forEach(function (area) {
      var cov = sc.coverage[area];
      if (cov === 'covered' || cov === 'partial') {
        var key = sc.id + '::' + area;
        var txt = NOTE[key] || (areaLabel[area] + ' — ' + (cov === 'covered' ? '충족' : '부분 충족'));
        sc.engineering.controlAreaNotes[area] = { text: txt, level: cov };
      }
    });
  });

  /* ==========================================================================
   * 파생 함수 (순수 조회)
   * ======================================================================== */
  var byKey = {};
  screens.forEach(function (sc) { byKey[sc.plane + '/' + sc.slug] = sc; });

  function getScreen(plane, slug) { return byKey[plane + '/' + slug] || null; }
  function getScreenById(id) { for (var i = 0; i < screens.length; i++) if (screens[i].id === id) return screens[i]; return null; }
  function screensOfPlane(plane) { return screens.filter(function (sc) { return sc.plane === plane; }); }
  function getPlane(id) { for (var i = 0; i < planes.length; i++) if (planes[i].id === id) return planes[i]; return null; }
  function getFlow(id) { for (var i = 0; i < flows.length; i++) if (flows[i].id === id) return flows[i]; return null; }
  function getArea(area) { for (var i = 0; i < controlAreas.length; i++) if (controlAreas[i].area === area) return controlAreas[i]; return null; }
  function getWorkItem(id) { for (var i = 0; i < workItems.length; i++) if (workItems[i].id === id) return workItems[i]; return null; }
  function statusMeta(id) { for (var i = 0; i < screenStatuses.length; i++) if (screenStatuses[i].id === id) return screenStatuses[i]; return null; }
  function workStatusMeta(id) { for (var i = 0; i < workStatuses.length; i++) if (workStatuses[i].id === id) return workStatuses[i]; return null; }

  // 상태별 화면 카운트
  function screenStatusCounts(list) {
    list = list || screens;
    var c = {}; screenStatuses.forEach(function (st) { c[st.id] = 0; });
    list.forEach(function (sc) { c[sc.status] = (c[sc.status] || 0) + 1; });
    return c;
  }
  // 상태별 작업 카운트
  function workStatusCounts() {
    var c = {}; workStatuses.forEach(function (st) { c[st.id] = 0; });
    workItems.forEach(function (wi) { c[wi.status] = (c[wi.status] || 0) + 1; });
    return c;
  }
  // 영역 커버리지 = controlAreaNotes[area] 존재 화면 수 / 전체
  function areaCoverage(area, list) {
    list = list || screens;
    var covered = list.filter(function (sc) { return sc.engineering.controlAreaNotes[area]; });
    return { covered: covered.length, total: list.length, screens: covered };
  }
  // 영역 노트를 가진 화면(대응 화면)
  function screensForArea(area) {
    return screens.filter(function (sc) { return sc.engineering.controlAreaNotes[area]; });
  }

  /* 병렬 Wave 파생 (위상 레벨) — SPEC §7.2 */
  function computeWaves() {
    var done = {}; workItems.forEach(function (wi) { if (wi.status === 'done') done[wi.id] = 1; });
    var memo = {}, visiting = {};
    function level(id) {
      var wi = getWorkItem(id);
      if (!wi) return 0;
      if (wi.status === 'done') return -1;       // 관계 밖
      if (wi.status === 'review') return 0;      // 최우선
      if (memo[id] !== undefined) return memo[id];
      if (visiting[id]) return 0;                // 사이클 방어
      visiting[id] = 1;
      var incomplete = (wi.dependsOn || []).filter(function (d) { return !done[d]; });
      var lv = incomplete.length
        ? Math.max.apply(null, incomplete.map(function (d) { return level(d); })) + 1
        : 0;                                     // 미완료 선행 없음 → 즉시 착수(레벨 0)
      visiting[id] = 0; memo[id] = lv; return lv;
    }
    var buckets = {};
    workItems.forEach(function (wi) {
      if (wi.status === 'done') return;
      var lv = level(wi.id);
      (buckets[lv] = buckets[lv] || []).push(wi);
    });
    var levels = Object.keys(buckets).map(Number).sort(function (a, b) { return a - b; });
    var anchor = new Date(meta.anchor + 'T00:00:00');
    function fmt(d) {
      var m = ('0' + (d.getMonth() + 1)).slice(-2), day = ('0' + d.getDate()).slice(-2);
      return d.getFullYear() + '-' + m + '-' + day;   // 로컬 날짜(UTC 변환 금지)
    }
    return levels.map(function (lv, i) {
      var d = new Date(anchor); d.setDate(d.getDate() + lv);
      return {
        index: i + 1, level: lv,
        startDate: fmt(d),
        items: buckets[lv]
      };
    });
  }

  // 작업 항목을 차단하는 미완료 선행만
  function blockingDeps(wi) {
    var done = {}; workItems.forEach(function (x) { if (x.status === 'done') done[x.id] = 1; });
    return (wi.dependsOn || []).filter(function (d) { return !done[d]; });
  }

  // 노출 게이트 (정적 사이트에선 항상 노출, 계약만 표기)
  function isEnabled() {
    try {
      var host = location.hostname;
      return host === 'localhost' || host === '127.0.0.1' || location.protocol === 'file:' ||
        /\bPROTOTYPE_ENABLED=true\b/.test(location.search) || true;
    } catch (e) { return true; }
  }

  /* ==========================================================================
   * 노출
   * ======================================================================== */
  window.PB = {
    meta: meta,
    planes: planes,
    screenStatuses: screenStatuses,
    workStatuses: workStatuses,
    phaseOrder: phaseOrder,
    controlAreas: controlAreas,
    screens: screens,
    workItems: workItems,
    flows: flows,
    // 파생
    getScreen: getScreen, getScreenById: getScreenById, screensOfPlane: screensOfPlane,
    getPlane: getPlane, getFlow: getFlow, getArea: getArea, getWorkItem: getWorkItem,
    statusMeta: statusMeta, workStatusMeta: workStatusMeta,
    screenStatusCounts: screenStatusCounts, workStatusCounts: workStatusCounts,
    areaCoverage: areaCoverage, screensForArea: screensForArea,
    computeWaves: computeWaves, blockingDeps: blockingDeps,
    isEnabled: isEnabled,
    // 프로토타입 데모 경로 (live iframe = 캡처 대상)
    demoPath: function (sc) { return '../hankkeut-prototype/' + sc.proto + '.html'; }
  };
})();
