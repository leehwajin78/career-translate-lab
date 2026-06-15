import { Link } from 'react-router-dom'
import { ExternalLink, FileText, CheckCircle2, Circle, Minus, Clock } from 'lucide-react'

// ──────────────────────────────────────────────
// 타입 정의
// ──────────────────────────────────────────────
type FEStatus = 'partial' | 'not-started' | 'hold'
type BEStatus = 'done' | 'not-started' | 'hold'
type Phase = 'current' | 'p1' | 'current-p1' | 'p15' | 'p2' | 'p3'
type Auth = 'Guest' | 'Member' | 'Admin'

interface Screen {
  id: string
  name: string
  route: string | null        // React 라우트 (null = 미등록)
  proto: string | null        // 정적 HTML 프로토타입 경로
  component: string           // React 컴포넌트 경로
  phase: Phase
  auth: Auth
  fe: FEStatus
  be: BEStatus
  note?: string
}

// ──────────────────────────────────────────────
// 화면 데이터 (PLAYBOARD.md SoT 반영)
// ──────────────────────────────────────────────
const SCREENS: Screen[] = [
  // ── Phase 1 공개 ──
  { id: 'C-01', name: '메인 랜딩',         route: '/',                    proto: 'landing.html',           component: 'pages/Index.tsx',                phase: 'current',    auth: 'Guest',  fe: 'partial',      be: 'not-started' },
  { id: 'C-02', name: '서비스 소개',        route: '/service',             proto: 'service.html',           component: 'pages/Service.tsx',              phase: 'current',    auth: 'Guest',  fe: 'partial',      be: 'not-started' },
  { id: 'C-03', name: '무료 진단 폼',       route: '/diagnosis',           proto: 'diagnosis.html',         component: 'pages/Diagnosis.tsx',            phase: 'current-p1', auth: 'Guest',  fe: 'partial',      be: 'not-started', note: 'Mission-Critical' },
  { id: 'C-04', name: '분석 로딩',          route: '/diagnosis',           proto: 'analyzing-free.html',    component: 'pages/Diagnosis.tsx (state)',    phase: 'current',    auth: 'Guest',  fe: 'partial',      be: 'not-started' },
  { id: 'C-05', name: '무료 진단 리포트',   route: '/result',              proto: 'report-free.html',       component: 'pages/Result.tsx',               phase: 'current',    auth: 'Guest',  fe: 'partial',      be: 'not-started' },
  { id: 'C-06', name: '무료 상담 신청',     route: '/consultation',        proto: 'consultation.html',      component: 'pages/Consultation.tsx',         phase: 'current-p1', auth: 'Guest',  fe: 'partial',      be: 'not-started' },
  { id: 'C-07', name: '유료 상품 신청',     route: '/apply/*',             proto: 'apply.html',             component: 'pages/apply/Apply*.tsx',         phase: 'current-p1', auth: 'Guest',  fe: 'partial',      be: 'not-started' },
  { id: 'C-08', name: '신청 완료',          route: '/apply/thank-you',     proto: 'apply-thank-you.html',   component: 'pages/apply/ApplyThankYou.tsx',  phase: 'current',    auth: 'Guest',  fe: 'partial',      be: 'not-started' },
  { id: 'C-09', name: '멤버 로그인',        route: '/login',               proto: 'login.html',             component: 'pages/Login.tsx',                phase: 'current-p1', auth: 'Guest',  fe: 'partial',      be: 'not-started' },
  { id: 'C-15', name: '개인정보 처리방침',  route: null,                   proto: 'privacy.html',           component: '❌ 미생성',                       phase: 'p1',         auth: 'Guest',  fe: 'not-started',  be: 'not-started', note: 'ISSUE-03' },
  // ── Phase 1 멤버 ──
  { id: 'C-10', name: '코칭 대시보드',      route: '/coaching',            proto: 'coaching-dashboard.html', component: 'pages/coaching/CoachingDashboard.tsx', phase: 'current', auth: 'Member', fe: 'partial', be: 'not-started' },
  { id: 'C-11', name: '42문항 작성',        route: '/coaching/questions',  proto: 'coaching-questions.html', component: 'pages/coaching/CoachingQuestions.tsx', phase: 'current-p1', auth: 'Member', fe: 'partial', be: 'not-started', note: 'Mission-Critical' },
  { id: 'C-12', name: '답변 리뷰·제출',    route: '/coaching/review',     proto: 'coaching-review.html',   component: 'pages/coaching/CoachingReview.tsx',    phase: 'current', auth: 'Member', fe: 'partial', be: 'not-started' },
  { id: 'C-13', name: 'AI 분석 진행',       route: '/coaching/analyzing',  proto: 'coaching-analyzing.html', component: 'pages/coaching/CoachingAnalyzing.tsx', phase: 'current', auth: 'Member', fe: 'partial', be: 'not-started' },
  { id: 'C-14', name: '코칭 리포트',        route: '/coaching/report',     proto: 'coaching-report.html',   component: 'pages/coaching/CoachingReport.tsx',    phase: 'current-p1', auth: 'Member', fe: 'partial', be: 'not-started' },
  // ── Phase 1 어드민 ──
  { id: 'A-01', name: '관리자 콘솔',        route: '/admin',               proto: 'admin.html',             component: 'pages/Admin.tsx',                phase: 'current-p1', auth: 'Admin', fe: 'partial', be: 'not-started' },
  { id: 'A-02', name: '리드 상세',          route: '/admin (panel)',        proto: 'admin-lead-detail.html', component: 'pages/Admin.tsx (LeadDetail)',    phase: 'current',    auth: 'Admin', fe: 'partial', be: 'not-started' },
  { id: 'A-03', name: '코칭 워크스페이스', route: '/coaching/workspace/:id', proto: 'workspace.html',        component: 'pages/coaching/CoachingWorkspace.tsx', phase: 'current-p1', auth: 'Admin', fe: 'partial', be: 'not-started', note: 'Mission-Critical' },
  { id: 'A-04', name: '알림 시스템',        route: '/admin (overlay)',      proto: 'admin-notifications.html', component: 'notificationStore + Header',  phase: 'current',    auth: 'Admin', fe: 'partial', be: 'not-started' },
  { id: 'A-05', name: '어드민 인증 게이트', route: '/admin (guard)',        proto: 'admin-auth.html',        component: 'components/ProtectedRoute.tsx',  phase: 'p1',         auth: 'Admin', fe: 'not-started', be: 'not-started' },
  // ── Phase 1.5 ──
  { id: 'R-01', name: '검수 대기 안내',     route: '/coaching/report',     proto: 'report-pending.html',    component: 'pages/coaching/CoachingReport (state)', phase: 'p15', auth: 'Member', fe: 'not-started', be: 'not-started' },
  // ── Phase 2 로드맵 ──
  { id: 'R-02', name: '마스터 브리프 (F1)', route: null, proto: 'admin-brief.html',     component: '—', phase: 'p2', auth: 'Admin', fe: 'hold', be: 'hold' },
  { id: 'R-03', name: '원라이너 3종',       route: null, proto: 'admin-oneliner.html',  component: '—', phase: 'p2', auth: 'Admin', fe: 'hold', be: 'hold' },
  { id: 'R-04', name: '질문 아키텍처 (F9)', route: null, proto: 'admin-questions.html', component: '—', phase: 'p2', auth: 'Admin', fe: 'hold', be: 'hold' },
  { id: 'R-05', name: '패턴 분류기 (F10)', route: null, proto: 'admin-patterns.html',  component: '—', phase: 'p2', auth: 'Admin', fe: 'hold', be: 'hold' },
  { id: 'R-06', name: '브랜딩 매퍼 (F11)', route: null, proto: 'admin-mapper.html',    component: '—', phase: 'p2', auth: 'Admin', fe: 'hold', be: 'hold' },
  { id: 'R-07', name: '코칭 피드백 (F12)', route: null, proto: 'admin-feedback.html',  component: '—', phase: 'p2', auth: 'Admin', fe: 'hold', be: 'hold' },
  { id: 'R-08', name: '리포트 룰 엔진 (F13)', route: null, proto: 'admin-rules.html', component: '—', phase: 'p2', auth: 'Admin', fe: 'hold', be: 'hold' },
  { id: 'R-09', name: '교차검증',           route: null, proto: 'admin-crosscheck.html', component: '—', phase: 'p2', auth: 'Admin', fe: 'hold', be: 'hold' },
  { id: 'R-10', name: '휴먼 핸드오프 (F14)', route: null, proto: 'admin-handoff.html', component: '—', phase: 'p2', auth: 'Admin', fe: 'hold', be: 'hold' },
  { id: 'R-11', name: 'AI 호출 로그',       route: null, proto: 'admin-airuns.html',   component: '—', phase: 'p2', auth: 'Admin', fe: 'hold', be: 'hold' },
  // ── Phase 3 로드맵 ──
  { id: 'R-12', name: '리테이너 관리',      route: null, proto: 'admin-retainer.html', component: '—', phase: 'p3', auth: 'Admin', fe: 'hold', be: 'hold' },
  { id: 'R-13', name: 'PPT Export',         route: null, proto: 'admin-export.html',   component: '—', phase: 'p3', auth: 'Admin', fe: 'hold', be: 'hold' },
  { id: 'R-14', name: '변화 리포트',        route: null, proto: 'change-report.html',  component: '—', phase: 'p3', auth: 'Member', fe: 'hold', be: 'hold' },
]

// ──────────────────────────────────────────────
// 헬퍼: 뱃지 렌더링
// ──────────────────────────────────────────────
function FEBadge({ status }: { status: FEStatus }) {
  if (status === 'partial')
    return <span style={badge('#e8ecfb', '#0123B4')}>🟡 FE 부분</span>
  if (status === 'not-started')
    return <span style={badge('#fff0f0', '#c0392b')}>🔴 미시작</span>
  return <span style={badge('#f3f4f6', '#6b7280')}>⚫ 보류</span>
}

function BEBadge({ status }: { status: BEStatus }) {
  if (status === 'done')
    return <span style={badge('#f0faf4', '#16a34a')}>🟢 완료</span>
  if (status === 'not-started')
    return <span style={badge('#fff0f0', '#c0392b')}>❌ 미구현</span>
  return <span style={badge('#f3f4f6', '#6b7280')}>⚫ 보류</span>
}

function PhaseBadge({ phase }: { phase: Phase }) {
  const map: Record<Phase, [string, string, string]> = {
    'current':    ['현행',     '#0123B4', '#e8ecfb'],
    'p1':         ['Phase 1',  '#7c3aed', '#f3e8ff'],
    'current-p1': ['현행+P1',  '#0369a1', '#e0f2fe'],
    'p15':        ['P 1.5',    '#b45309', '#fef3c7'],
    'p2':         ['Phase 2',  '#374151', '#f3f4f6'],
    'p3':         ['Phase 3',  '#374151', '#f3f4f6'],
  }
  const [label, color, bg] = map[phase]
  return <span style={badge(bg, color)}>{label}</span>
}

function AuthBadge({ auth }: { auth: Auth }) {
  const map: Record<Auth, [string, string]> = {
    Guest:  ['#f0faf4', '#16a34a'],
    Member: ['#fef3c7', '#b45309'],
    Admin:  ['#fce7f3', '#9d174d'],
  }
  const [bg, color] = map[auth]
  return <span style={badge(bg, color)}>{auth}</span>
}

function badge(bg: string, color: string): React.CSSProperties {
  return {
    display: 'inline-block',
    padding: '.15rem .5rem',
    borderRadius: '9999px',
    fontSize: '.68rem',
    fontWeight: 700,
    letterSpacing: '.01em',
    background: bg,
    color,
    whiteSpace: 'nowrap',
  }
}

// ──────────────────────────────────────────────
// 통계 계산
// ──────────────────────────────────────────────
function calcStats() {
  const p1 = SCREENS.filter(s => ['current', 'p1', 'current-p1'].includes(s.phase))
  const partial = p1.filter(s => s.fe === 'partial').length
  const notStarted = p1.filter(s => s.fe === 'not-started').length
  const done = p1.filter(s => s.fe === 'done').length
  const roadmap = SCREENS.filter(s => ['p15', 'p2', 'p3'].includes(s.phase)).length
  return { total: SCREENS.length, p1Total: p1.length, done, partial, notStarted, roadmap }
}

// ──────────────────────────────────────────────
// 그룹 정의
// ──────────────────────────────────────────────
const GROUPS = [
  { label: 'Phase 1 — 공개 페이지 (Guest)', phases: ['current', 'p1', 'current-p1'] as Phase[], auth: 'Guest' as Auth },
  { label: 'Phase 1 — 멤버 전용 (Member)', phases: ['current', 'p1', 'current-p1'] as Phase[], auth: 'Member' as Auth },
  { label: 'Phase 1 — 관리자 (Admin)',     phases: ['current', 'p1', 'current-p1'] as Phase[], auth: 'Admin' as Auth },
  { label: 'Phase 1.5 — 출시 직후 보강',   phases: ['p15'] as Phase[],                         auth: null },
  { label: 'Phase 2 — AI 연동 로드맵',     phases: ['p2'] as Phase[],                          auth: null },
  { label: 'Phase 3 — 비즈니스 확장',      phases: ['p3'] as Phase[],                          auth: null },
]

// ──────────────────────────────────────────────
// 메인 컴포넌트
// ──────────────────────────────────────────────
export default function Playboard() {
  const stats = calcStats()

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem 6rem', fontFamily: 'Pretendard, sans-serif' }}>

      {/* ── 헤더 ── */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.5rem' }}>
          <span style={{ fontSize: '.75rem', fontWeight: 700, color: '#0123B4', background: '#e8ecfb', padding: '.2rem .6rem', borderRadius: '9999px' }}>INTERNAL</span>
          <span style={{ fontSize: '.75rem', color: '#6b7280' }}>SoT: docs/PLAYBOARD.md</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>PlayBoard — 한끗프로젝트 구현 상황판</h1>
        <p style={{ margin: '.4rem 0 0', color: '#6b7280', fontSize: '.9rem' }}>
          전체 {stats.total}개 화면의 구현 현황 · 프로토타입 링크 · 기술 명세를 한눈에.
          &nbsp;
          <a href="/hankkeut-prototype/pages.html" target="_blank" rel="noopener"
            style={{ color: '#0123B4', textDecoration: 'none', fontWeight: 600 }}>
            박제된 프로토타입 목록 <ExternalLink size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </a>
        </p>
      </div>

      {/* ── 통계 카드 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <StatCard label="전체 화면" value={stats.total} color="#111827" />
        <StatCard label="Phase 1 대상" value={stats.p1Total} color="#0123B4" />
        <StatCard label="🟡 FE 부분구현" value={stats.partial} color="#b45309" />
        <StatCard label="🔴 FE 미시작" value={stats.notStarted} color="#c0392b" />
        <StatCard label="🟢 FE 완료" value={stats.done} color="#16a34a" />
        <StatCard label="⚫ 로드맵 보류" value={stats.roadmap} color="#6b7280" />
      </div>

      {/* ── 백엔드 현황 ── */}
      <section style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ margin: 0, fontWeight: 700, color: '#c2410c', fontSize: '.85rem' }}>
          ⚠️ 백엔드 전체 미구현 — Supabase Auth · DB · Edge Functions · OpenAI · Resend · 토스페이먼츠 모두 ❌
        </p>
        <p style={{ margin: '.25rem 0 0', color: '#9a3412', fontSize: '.8rem' }}>
          현재 상태: localStorage 임시 저장 + authStore 하드코딩. Phase 1 구현 블로커.
        </p>
      </section>

      {/* ── 미결 이슈 요약 ── */}
      <section style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ margin: 0, fontWeight: 700, color: '#991b1b', fontSize: '.85rem' }}>🚨 미결 이슈 (High Priority)</p>
        <ul style={{ margin: '.5rem 0 0', padding: '0 0 0 1.25rem', color: '#7f1d1d', fontSize: '.8rem', lineHeight: 1.8 }}>
          <li><strong>ISSUE-01</strong> C-03: 무료 진단 결과 즉시 표시 vs. 어드민 검수 후 이메일 발송 — 정책 결정 필요</li>
          <li><strong>ISSUE-02</strong> C-05: 4유형 분류 알고리즘 미정의 (점수 가중치·임계값)</li>
          <li><strong>ISSUE-03</strong> C-15: <code>/privacy</code> 라우트 미등록 + Privacy.tsx 미생성</li>
        </ul>
      </section>

      {/* ── 화면 테이블 (그룹별) ── */}
      {GROUPS.map(group => {
        const screens = group.auth
          ? SCREENS.filter(s => group.phases.includes(s.phase) && s.auth === group.auth)
          : SCREENS.filter(s => group.phases.includes(s.phase))
        if (screens.length === 0) return null
        return (
          <section key={group.label} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', marginBottom: '.75rem', paddingBottom: '.5rem', borderBottom: '2px solid #0123B4' }}>
              {group.label} <span style={{ fontWeight: 400, color: '#6b7280', fontSize: '.85rem' }}>({screens.length}개)</span>
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.82rem' }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    {['ID', '화면명', 'Phase', '권한', 'Route', '프로토타입', 'React 컴포넌트', 'FE', 'BE'].map(h => (
                      <th key={h} style={{ padding: '.5rem .75rem', textAlign: 'left', fontWeight: 700, color: '#374151', whiteSpace: 'nowrap', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {screens.map((s, i) => (
                    <tr key={s.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '.5rem .75rem', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: 700, color: '#0123B4' }}>{s.id}</span>
                        {s.note && <span style={{ display: 'block', fontSize: '.65rem', color: '#6b7280', marginTop: 2 }}>{s.note}</span>}
                      </td>
                      <td style={{ padding: '.5rem .75rem', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>{s.name}</td>
                      <td style={{ padding: '.5rem .75rem' }}><PhaseBadge phase={s.phase} /></td>
                      <td style={{ padding: '.5rem .75rem' }}><AuthBadge auth={s.auth} /></td>
                      <td style={{ padding: '.5rem .75rem' }}>
                        {s.route && !s.route.includes('(') ? (
                          <Link to={s.route.replace('/*', '')} style={{ color: '#0123B4', textDecoration: 'none', fontWeight: 600, fontFamily: 'monospace' }}>
                            {s.route}
                          </Link>
                        ) : (
                          <span style={{ color: '#9ca3af', fontFamily: 'monospace' }}>{s.route ?? '—'}</span>
                        )}
                      </td>
                      <td style={{ padding: '.5rem .75rem' }}>
                        {s.proto ? (
                          <a href={`/hankkeut-prototype/${s.proto}`} target="_blank" rel="noopener"
                            style={{ color: '#0123B4', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            {s.proto.replace('.html', '')} <ExternalLink size={11} />
                          </a>
                        ) : '—'}
                      </td>
                      <td style={{ padding: '.5rem .75rem', color: '#374151', fontFamily: 'monospace', fontSize: '.75rem' }}>{s.component}</td>
                      <td style={{ padding: '.5rem .75rem' }}><FEBadge status={s.fe} /></td>
                      <td style={{ padding: '.5rem .75rem' }}><BEBadge status={s.be} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )
      })}

      {/* ── Phase 1 체크리스트 요약 ── */}
      <section style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 12, padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0369a1', margin: '0 0 1rem' }}>Phase 1 구현 체크리스트 (주요 항목)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '.5rem' }}>
          {[
            ['인프라', [
              { done: false, text: 'Supabase 프로젝트 생성 + 환경변수' },
              { done: false, text: 'DB 마이그레이션 실행 (9개 테이블)' },
              { done: false, text: 'RLS 정책 적용' },
              { done: false, text: 'Vercel 환경변수 등록' },
            ]],
            ['공개 플로우', [
              { done: false, text: 'C-03 무료 진단 → Edge Function 연동' },
              { done: false, text: 'C-05 4유형 분류 알고리즘 구현' },
              { done: false, text: 'C-06 상담 신청 → DB insert' },
              { done: false, text: 'C-15 /privacy 페이지 생성 (ISSUE-03)' },
            ]],
            ['코칭 플로우', [
              { done: false, text: 'C-09 Supabase Auth 로그인 연동' },
              { done: false, text: 'C-11 자동 저장 → coaching_answers' },
              { done: false, text: 'C-12 최종 제출 → session status' },
              { done: false, text: 'C-13 /coaching-status 폴링' },
            ]],
            ['어드민', [
              { done: false, text: 'A-01 리드 테이블 → Supabase 연동' },
              { done: false, text: 'A-03 워크스페이스 finalize 기능' },
              { done: false, text: 'A-05 Admin RBAC 게이트 활성화' },
              { done: false, text: '이메일 알림 4종 (Resend)' },
            ]],
          ].map(([title, items]) => (
            <div key={title as string}>
              <p style={{ fontWeight: 700, color: '#0369a1', fontSize: '.8rem', margin: '0 0 .4rem' }}>{title as string}</p>
              {(items as { done: boolean; text: string }[]).map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: '.25rem' }}>
                  {item.done
                    ? <CheckCircle2 size={14} color="#16a34a" />
                    : <Circle size={14} color="#9ca3af" />}
                  <span style={{ fontSize: '.78rem', color: item.done ? '#16a34a' : '#374151' }}>{item.text}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── 문서 링크 ── */}
      <section>
        <h2 style={{ fontSize: '.9rem', fontWeight: 700, color: '#374151', marginBottom: '.75rem' }}>연결 문서</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
          {[
            ['PlayBoard (SoT)', 'https://github.com/leehwajin78/career-translate-lab/blob/feat/tech-spec-upgrade/docs/PLAYBOARD.md'],
            ['01 아키텍처', 'https://github.com/leehwajin78/career-translate-lab/blob/feat/tech-spec-upgrade/docs/tech-spec/01-architecture.md'],
            ['02 데이터모델', 'https://github.com/leehwajin78/career-translate-lab/blob/feat/tech-spec-upgrade/docs/tech-spec/02-data-model.md'],
            ['03 API 명세', 'https://github.com/leehwajin78/career-translate-lab/blob/feat/tech-spec-upgrade/docs/tech-spec/03-api-spec.md'],
            ['04 보안', 'https://github.com/leehwajin78/career-translate-lab/blob/feat/tech-spec-upgrade/docs/tech-spec/04-security.md'],
            ['05 운영', 'https://github.com/leehwajin78/career-translate-lab/blob/feat/tech-spec-upgrade/docs/tech-spec/05-operations.md'],
            ['프로토타입 목록', '/hankkeut-prototype/pages.html'],
          ].map(([label, url]) => (
            <a key={label} href={url} target="_blank" rel="noopener"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '.35rem .8rem', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '.8rem', color: '#374151', textDecoration: 'none', background: '#fff', fontWeight: 600 }}>
              <FileText size={13} /> {label}
            </a>
          ))}
        </div>
      </section>

    </div>
  )
}

// ──────────────────────────────────────────────
// 통계 카드 컴포넌트
// ──────────────────────────────────────────────
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1rem 1.25rem' }}>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: '.78rem', color: '#6b7280', fontWeight: 600, marginTop: 2 }}>{label}</div>
    </div>
  )
}
