'use client';

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ExternalLink, AlertTriangle, CheckCircle2, Circle, GitBranch, Layers, Map } from 'lucide-react'
import {
  PLAYBOARD, calcStats, COVERAGE_DOMAINS,
  type CoverageStatus, type Phase, type ImplStatus,
} from '@/data/playboard'

const { screens, issues, changes } = PLAYBOARD

// ── 뷰 타입 ─────────────────────────────────────────────────
type View = 'board' | 'detail' | 'matrix'

// ── 색상 유틸 ────────────────────────────────────────────────
const PHASE_COLORS: Record<Phase, [string, string]> = {
  current:    ['#e8ecfb', '#0123B4'],
  p1:         ['#f3e8ff', '#7c3aed'],
  'current-p1':['#e0f2fe', '#0369a1'],
  p15:        ['#fef3c7', '#b45309'],
  p2:         ['#f3f4f6', '#374151'],
  p3:         ['#f3f4f6', '#374151'],
}
const PHASE_LABELS: Record<Phase, string> = {
  current: '현행', p1: 'P1', 'current-p1': '현행+P1', p15: 'P1.5', p2: 'P2', p3: 'P3',
}

const FE_COLORS: Record<ImplStatus, [string, string, string]> = {
  done:        ['#f0faf4', '#16a34a', '🟢 완료'],
  partial:     ['#fef9e7', '#b45309', '🟡 부분'],
  'not-started':['#fff0f0', '#c0392b', '🔴 미시작'],
  hold:        ['#f3f4f6', '#6b7280', '⚫ 보류'],
}

const COV_COLORS: Record<CoverageStatus, [string, string]> = {
  covered: ['#f0faf4', '#16a34a'],
  partial: ['#fef9e7', '#b45309'],
  gap:     ['#fff0f0', '#c0392b'],
  na:      ['#f9fafb', '#9ca3af'],
}
const COV_LABELS: Record<CoverageStatus, string> = {
  covered: '✓', partial: '△', gap: '✗', na: '—',
}

function badge(bg: string, color: string, text: string, small = false) {
  return (
    <span style={{
      display: 'inline-block', padding: small ? '.1rem .4rem' : '.15rem .55rem',
      borderRadius: 9999, fontSize: small ? '.65rem' : '.7rem',
      fontWeight: 700, background: bg, color, whiteSpace: 'nowrap',
    }}>{text}</span>
  )
}

// ── 공통 섹션 제목 ────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: '.95rem', fontWeight: 800, color: '#111827', marginBottom: '.75rem', paddingBottom: '.4rem', borderBottom: '2px solid #0123B4' }}>
      {children}
    </h2>
  )
}

// ============================================================
// 뷰 1: 상황판 (Board)
// ============================================================
function BoardView() {
  const stats = calcStats(screens)

  // 플로우별 진행률
  const flows = [
    { label: '고객 공개 플로우', ids: ['C-01','C-02','C-03','C-04','C-05','C-06','C-07','C-08','C-09','C-15'] },
    { label: '코칭 멤버 플로우', ids: ['C-10','C-11','C-12','C-13','C-14'] },
    { label: '어드민 운영 플로우', ids: ['A-01','A-02','A-03','A-04','A-05'] },
  ]

  const openIssues = issues.filter(i => i.status === 'open')

  return (
    <div>
      {/* 통계 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '.75rem', marginBottom: '2rem' }}>
        {[
          { label: '전체 화면', value: stats.total, color: '#111827' },
          { label: 'Phase 1 대상', value: stats.p1Total, color: '#0123B4' },
          { label: '🟡 FE 부분', value: stats.partial, color: '#b45309' },
          { label: '🔴 FE 미시작', value: stats.notStarted, color: '#c0392b' },
          { label: '⚫ 로드맵', value: stats.roadmap, color: '#6b7280' },
          { label: '🚨 미결 이슈', value: stats.openIssues, color: '#dc2626' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '.85rem 1rem' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: '.72rem', color: '#6b7280', fontWeight: 600, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* 백엔드 경고 */}
      <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 10, padding: '.85rem 1rem', marginBottom: '1.5rem' }}>
        <p style={{ margin: 0, fontWeight: 700, color: '#c2410c', fontSize: '.82rem' }}>
          ⚠️ 백엔드 전체 미구현 — Supabase Auth · DB · Edge Functions · OpenAI · Resend · 토스페이먼츠 모두 ❌
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* 플로우별 진행률 */}
        <div>
          <SectionTitle>플로우별 구현 진행률</SectionTitle>
          {flows.map(flow => {
            const flowScreens = screens.filter(s => flow.ids.includes(s.id))
            const done = flowScreens.filter(s => s.fe === 'done').length
            const partial = flowScreens.filter(s => s.fe === 'partial').length
            const total = flowScreens.length
            const pct = Math.round(((done + partial * 0.5) / total) * 100)
            return (
              <div key={flow.label} style={{ marginBottom: '1.1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8rem', fontWeight: 600, color: '#374151', marginBottom: '.3rem' }}>
                  <span>{flow.label}</span>
                  <span style={{ color: '#6b7280' }}>{done}/{total} 완료 · {partial} 부분</span>
                </div>
                <div style={{ height: 8, borderRadius: 9999, background: '#f3f4f6', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: '#0123B4', borderRadius: 9999, transition: 'width .4s' }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* 이슈 DAG */}
        <div>
          <SectionTitle>미결 이슈 의존성 ({openIssues.length}건)</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
            {openIssues.map(issue => (
              <div key={issue.id} style={{
                padding: '.6rem .8rem', borderRadius: 8,
                border: `1px solid ${issue.priority === 'high' ? '#fecaca' : issue.priority === 'medium' ? '#fed7aa' : '#e5e7eb'}`,
                background: issue.priority === 'high' ? '#fef2f2' : issue.priority === 'medium' ? '#fff7ed' : '#f9fafb',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: '.2rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '.75rem', color: '#0123B4' }}>{issue.id}</span>
                  {badge(
                    issue.priority === 'high' ? '#fef2f2' : issue.priority === 'medium' ? '#fff7ed' : '#f9fafb',
                    issue.priority === 'high' ? '#dc2626' : issue.priority === 'medium' ? '#d97706' : '#6b7280',
                    issue.priority === 'high' ? '🔴 High' : issue.priority === 'medium' ? '🟡 Mid' : '🟢 Low',
                    true
                  )}
                  {issue.screens.map(s => badge('#e8ecfb', '#0123B4', s, true))}
                </div>
                <p style={{ margin: 0, fontSize: '.75rem', color: '#374151', fontWeight: 600 }}>{issue.title}</p>
                {issue.blocks.length > 0 && (
                  <p style={{ margin: '.2rem 0 0', fontSize: '.68rem', color: '#9ca3af' }}>
                    → blocks: {issue.blocks.join(', ')}
                  </p>
                )}
                {issue.blockedBy.length > 0 && (
                  <p style={{ margin: '.2rem 0 0', fontSize: '.68rem', color: '#ef4444' }}>
                    ← blocked by: {issue.blockedBy.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phase 1 체크리스트 */}
      <div style={{ marginTop: '2rem' }}>
        <SectionTitle>Phase 1 구현 체크리스트</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '.75rem' }}>
          {([
            ['인프라', [
              { done: false, text: 'Supabase 프로젝트 생성 + .env.local' },
              { done: false, text: 'DB 마이그레이션 실행 (9개 테이블)' },
              { done: false, text: 'RLS 정책 적용' },
              { done: false, text: 'Vercel 환경변수 등록' },
            ]],
            ['공개 플로우', [
              { done: false, text: 'C-03 → submit-free-diagnosis 연동' },
              { done: false, text: 'C-05 4유형 분류 알고리즘 [ISSUE-02]' },
              { done: false, text: 'C-06 상담 신청 → DB insert' },
              { done: true,  text: 'C-15 /privacy 페이지·라우트 [ISSUE-03]', warn: true },
            ]],
            ['코칭 플로우', [
              { done: false, text: 'C-09 Supabase Auth signIn 연동' },
              { done: false, text: 'C-11 자동 저장 → coaching_answers' },
              { done: false, text: 'C-12 최종 제출 → session status' },
              { done: false, text: 'C-13 /coaching-status 폴링' },
            ]],
            ['어드민', [
              { done: false, text: 'A-01 리드 테이블 → Supabase 연동' },
              { done: false, text: 'A-03 Finalize + 이메일 트리거' },
              { done: false, text: 'A-05 Admin RBAC 게이트 활성화' },
              { done: false, text: '이메일 알림 4종 (Resend)' },
            ]],
          ] as [string, { done: boolean; text: string; warn?: boolean }[]][]).map(([title, items]) => (
            <div key={title} style={{ background: '#f9fafb', borderRadius: 10, padding: '.85rem 1rem' }}>
              <p style={{ fontWeight: 800, color: '#0123B4', fontSize: '.8rem', margin: '0 0 .5rem' }}>{title}</p>
              {items.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '.4rem', marginBottom: '.3rem' }}>
                  {item.done
                    ? <CheckCircle2 size={14} color={item.warn ? '#d97706' : '#16a34a'} style={{ marginTop: 1, flexShrink: 0 }} />
                    : <Circle size={14} color="#9ca3af" style={{ marginTop: 1, flexShrink: 0 }} />}
                  <span style={{ fontSize: '.75rem', color: item.done && !item.warn ? '#16a34a' : '#374151' }}>{item.text}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 최근 변경 이력 */}
      <div style={{ marginTop: '2rem' }}>
        <SectionTitle>최근 변경 이력 (CHG)</SectionTitle>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.78rem' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                {['ID', '날짜', '유형', '설명', '출처'].map(h => (
                  <th key={h} style={{ padding: '.4rem .7rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...changes].reverse().slice(0, 8).map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '.4rem .7rem', fontWeight: 700, color: '#0123B4' }}>{c.id}</td>
                  <td style={{ padding: '.4rem .7rem', color: '#6b7280' }}>{c.date}</td>
                  <td style={{ padding: '.4rem .7rem' }}>
                    {badge('#f3f4f6', '#374151', c.type, true)}
                  </td>
                  <td style={{ padding: '.4rem .7rem', color: '#374151' }}>{c.description}</td>
                  <td style={{ padding: '.4rem .7rem', color: '#6b7280' }}>{c.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 뷰 2: 화면 상세 (Detail)
// ============================================================
function DetailView() {
  const p1Screens = screens.filter(s => ['current', 'p1', 'current-p1'].includes(s.phase))
  const [selected, setSelected] = useState(p1Screens[0]?.id ?? '')
  const screen = screens.find(s => s.id === selected)
  const [specTab, setSpecTab] = useState<'fr' | 'nfr' | 'edge' | 'ac' | 'coverage'>('fr')

  return (
    <div>
      {/* 화면 선택 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginBottom: '1.25rem' }}>
        {p1Screens.map(s => (
          <button key={s.id} onClick={() => { setSelected(s.id); setSpecTab('fr') }}
            style={{
              padding: '.3rem .7rem', borderRadius: 8, border: '1px solid',
              borderColor: selected === s.id ? '#0123B4' : '#e5e7eb',
              background: selected === s.id ? '#0123B4' : '#fff',
              color: selected === s.id ? '#fff' : '#374151',
              fontSize: '.75rem', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '.3rem',
            }}>
            {s.isMissionCritical && <AlertTriangle size={11} />}
            {s.id}
          </button>
        ))}
      </div>

      {screen && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.25rem' }}>
          {/* 왼쪽: 프로토타입 미리보기 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.6rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#111827' }}>
                {screen.id} — {screen.name}
              </h3>
              {screen.isMissionCritical && badge('#fef2f2', '#dc2626', 'Mission-Critical')}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.35rem', marginBottom: '.85rem' }}>
              {badge(...PHASE_COLORS[screen.phase], PHASE_LABELS[screen.phase])}
              {badge(screen.auth === 'Guest' ? '#f0faf4' : screen.auth === 'Member' ? '#fef3c7' : '#fce7f3',
                     screen.auth === 'Guest' ? '#16a34a' : screen.auth === 'Member' ? '#b45309' : '#9d174d',
                     screen.auth)}
              {badge(...FE_COLORS[screen.fe])}
            </div>

            <p style={{ fontSize: '.78rem', color: '#6b7280', marginBottom: '.85rem', lineHeight: 1.6 }}>
              {screen.spec.purpose}
            </p>

            {/* 기술 연결 */}
            <div style={{ fontSize: '.75rem', marginBottom: '1rem' }}>
              {screen.spec.stores.length > 0 && (
                <div style={{ marginBottom: '.4rem' }}>
                  <span style={{ fontWeight: 700, color: '#374151' }}>Store: </span>
                  {screen.spec.stores.join(', ')}
                </div>
              )}
              {screen.spec.apis.length > 0 && (
                <div style={{ marginBottom: '.4rem' }}>
                  <span style={{ fontWeight: 700, color: '#374151' }}>API: </span>
                  {screen.spec.apis.join(' | ')}
                </div>
              )}
              {screen.route && !screen.route.includes('(') && (
                <div>
                  <span style={{ fontWeight: 700, color: '#374151' }}>Route: </span>
                  <Link href={screen.route.replace('/*', '')} style={{ color: '#0123B4', fontFamily: 'monospace' }}>{screen.route}</Link>
                </div>
              )}
            </div>

            {/* 프로토타입 iframe */}
            {screen.proto ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.4rem' }}>
                  <span style={{ fontSize: '.72rem', fontWeight: 700, color: '#6b7280' }}>프로토타입 미리보기</span>
                  <a href={`/hankkeut-prototype/${screen.proto}`} target="_blank" rel="noopener"
                    style={{ fontSize: '.72rem', color: '#0123B4', display: 'flex', alignItems: 'center', gap: 3 }}>
                    새탭 열기 <ExternalLink size={11} />
                  </a>
                </div>
                <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', height: 360, background: '#f9fafb' }}>
                  <iframe
                    src={`/hankkeut-prototype/${screen.proto}`}
                    title={screen.name}
                    style={{ width: '200%', height: '200%', border: 'none', transform: 'scale(0.5)', transformOrigin: '0 0', pointerEvents: 'none', overflow: 'hidden' }}
                    loading="lazy"
                  />
                </div>
              </div>
            ) : (
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', borderRadius: 10, color: '#9ca3af', fontSize: '.82rem' }}>
                프로토타입 없음
              </div>
            )}
          </div>

          {/* 오른쪽: 기술 명세 패널 */}
          <div>
            {/* 탭 */}
            <div style={{ display: 'flex', gap: '.3rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {([
                ['fr', `FR (${screen.frs.length})`],
                ['nfr', `NFR (${screen.nfrs.length})`],
                ['edge', `EDGE (${screen.edges.length})`],
                ['ac', `인수 조건 (${screen.acceptanceCriteria.length})`],
                ['coverage', '커버리지'],
              ] as [typeof specTab, string][]).map(([t, label]) => (
                <button key={t} onClick={() => setSpecTab(t)}
                  style={{
                    padding: '.3rem .7rem', borderRadius: 8,
                    border: `1px solid ${specTab === t ? '#0123B4' : '#e5e7eb'}`,
                    background: specTab === t ? '#0123B4' : '#fff',
                    color: specTab === t ? '#fff' : '#374151',
                    fontSize: '.72rem', fontWeight: 700, cursor: 'pointer',
                  }}>{label}</button>
              ))}
            </div>

            <div style={{ maxHeight: 480, overflowY: 'auto', paddingRight: '.25rem' }}>
              {specTab === 'fr' && screen.frs.map(fr => (
                <div key={fr.id} style={{ marginBottom: '1rem', padding: '.75rem', background: '#f9fafb', borderRadius: 8, borderLeft: '3px solid #0123B4' }}>
                  <div style={{ fontWeight: 800, fontSize: '.78rem', color: '#0123B4', marginBottom: '.3rem' }}>{fr.id} — {fr.title}</div>
                  <p style={{ margin: 0, fontSize: '.76rem', color: '#374151', lineHeight: 1.6 }}>{fr.detail}</p>
                  {fr.gate && (
                    <div style={{ marginTop: '.5rem', padding: '.35rem .6rem', background: '#f0faf4', borderRadius: 6, fontSize: '.7rem', color: '#15803d', fontWeight: 600 }}>
                      ✓ Gate: {fr.gate}
                    </div>
                  )}
                </div>
              ))}

              {specTab === 'nfr' && (screen.nfrs.length === 0
                ? <p style={{ color: '#9ca3af', fontSize: '.8rem' }}>NFR 미정의</p>
                : screen.nfrs.map(n => (
                  <div key={n.id} style={{ marginBottom: '.75rem', padding: '.75rem', background: '#f9fafb', borderRadius: 8 }}>
                    <div style={{ fontWeight: 800, fontSize: '.75rem', color: '#7c3aed', marginBottom: '.25rem' }}>{n.id}</div>
                    <p style={{ margin: 0, fontSize: '.76rem', color: '#374151' }}>{n.detail}</p>
                  </div>
                ))
              )}

              {specTab === 'edge' && (screen.edges.length === 0
                ? <p style={{ color: '#9ca3af', fontSize: '.8rem' }}>엣지 케이스 미정의</p>
                : screen.edges.map(e => (
                  <div key={e.id} style={{ marginBottom: '.75rem', padding: '.75rem', background: '#fff7ed', borderRadius: 8 }}>
                    <div style={{ fontWeight: 800, fontSize: '.75rem', color: '#b45309', marginBottom: '.3rem' }}>{e.id}</div>
                    <p style={{ margin: 0, fontSize: '.75rem', color: '#374151', marginBottom: '.25rem' }}><b>조건:</b> {e.condition}</p>
                    <p style={{ margin: 0, fontSize: '.75rem', color: '#374151' }}><b>동작:</b> {e.behavior}</p>
                  </div>
                ))
              )}

              {specTab === 'ac' && (screen.acceptanceCriteria.length === 0
                ? <p style={{ color: '#9ca3af', fontSize: '.8rem' }}>인수 조건 미정의</p>
                : screen.acceptanceCriteria.map((ac, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '.5rem', marginBottom: '.5rem' }}>
                    <CheckCircle2 size={14} color="#16a34a" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontSize: '.78rem', color: '#374151' }}>{ac}</span>
                  </div>
                ))
              )}

              {specTab === 'coverage' && (
                <div>
                  {COVERAGE_DOMAINS.map(domain => {
                    const status = screen.coverage[domain.key]
                    const [bg, color] = COV_COLORS[status]
                    return (
                      <div key={domain.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.5rem .75rem', borderRadius: 8, background: bg, marginBottom: '.4rem' }}>
                        <span style={{ fontSize: '.78rem', fontWeight: 600, color: '#374151' }}>{domain.label}</span>
                        <span style={{ fontSize: '.8rem', fontWeight: 800, color }}>{COV_LABELS[status]} {status}</span>
                      </div>
                    )
                  })}
                  {screen.openIssues.length > 0 && (
                    <div style={{ marginTop: '.75rem', padding: '.6rem .8rem', background: '#fef2f2', borderRadius: 8 }}>
                      <span style={{ fontSize: '.72rem', fontWeight: 700, color: '#dc2626' }}>관련 이슈: </span>
                      <span style={{ fontSize: '.72rem', color: '#374151' }}>{screen.openIssues.join(', ')}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// 뷰 3: 커버리지 매트릭스 (Matrix)
// ============================================================
function MatrixView() {
  const p1Screens = screens.filter(s => ['current', 'p1', 'current-p1'].includes(s.phase))

  // 도메인별 갭 카운트
  const gapCounts = useMemo(() =>
    COVERAGE_DOMAINS.map(d => ({
      ...d,
      gaps: p1Screens.filter(s => s.coverage[d.key] === 'gap').length,
      partial: p1Screens.filter(s => s.coverage[d.key] === 'partial').length,
    }))
  , [])

  return (
    <div>
      {/* 도메인 요약 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '.6rem', marginBottom: '1.5rem' }}>
        {gapCounts.map(d => (
          <div key={d.key} style={{
            padding: '.7rem .9rem', borderRadius: 10, background: d.gaps > 0 ? '#fef2f2' : d.partial > 0 ? '#fff7ed' : '#f0faf4',
            border: `1px solid ${d.gaps > 0 ? '#fecaca' : d.partial > 0 ? '#fed7aa' : '#bbf7d0'}`,
          }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: d.gaps > 0 ? '#dc2626' : d.partial > 0 ? '#d97706' : '#16a34a' }}>
              {d.gaps > 0 ? `${d.gaps}갭` : d.partial > 0 ? `${d.partial}부분` : '✓'}
            </div>
            <div style={{ fontSize: '.72rem', fontWeight: 600, color: '#6b7280', marginTop: 2 }}>{d.label}</div>
          </div>
        ))}
      </div>

      {/* 매트릭스 테이블 */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: '.72rem', minWidth: 800 }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: '.5rem .75rem', textAlign: 'left', fontWeight: 700, color: '#374151', position: 'sticky', left: 0, background: '#f9fafb', zIndex: 1, borderRight: '1px solid #e5e7eb', minWidth: 120 }}>
                도메인 \ 화면
              </th>
              {p1Screens.map(s => (
                <th key={s.id} style={{ padding: '.5rem .5rem', textAlign: 'center', fontWeight: 700, color: s.isMissionCritical ? '#dc2626' : '#374151', whiteSpace: 'nowrap', minWidth: 70 }}>
                  {s.isMissionCritical && <AlertTriangle size={10} style={{ display: 'inline' }} />}
                  {' '}{s.id}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COVERAGE_DOMAINS.map((domain, di) => (
              <tr key={domain.key} style={{ borderBottom: '1px solid #f3f4f6', background: di % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '.5rem .75rem', fontWeight: 700, color: '#374151', position: 'sticky', left: 0, background: di % 2 === 0 ? '#fff' : '#fafafa', borderRight: '1px solid #e5e7eb', zIndex: 1 }}>
                  {domain.label}
                </td>
                {p1Screens.map(s => {
                  const status = s.coverage[domain.key]
                  const [bg, color] = COV_COLORS[status]
                  return (
                    <td key={s.id} title={`${s.id} × ${domain.label}: ${status}`}
                      style={{ padding: '.35rem .5rem', textAlign: 'center', background: bg }}>
                      <span style={{ fontWeight: 800, fontSize: '.75rem', color }}>{COV_LABELS[status]}</span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 범례 */}
      <div style={{ display: 'flex', gap: '.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        {([['covered', '✓ 완료'], ['partial', '△ 부분'], ['gap', '✗ 갭 (기획 필요)'], ['na', '— 해당 없음']] as [CoverageStatus, string][]).map(([s, label]) => {
          const [bg, color] = COV_COLORS[s]
          return (
            <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', fontSize: '.73rem', color: '#374151' }}>
              <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 4, background: bg, border: `1px solid ${color}22` }} />
              {label}
            </span>
          )
        })}
        <span style={{ fontSize: '.73rem', color: '#9ca3af', marginLeft: 'auto' }}>
          ⚠️ = Mission-Critical 화면 (C-03, C-11, A-03)
        </span>
      </div>

      {/* 갭 상세 목록 */}
      <div style={{ marginTop: '1.5rem' }}>
        <SectionTitle>커버리지 갭 상세 (기획 필요 항목)</SectionTitle>
        {COVERAGE_DOMAINS.map(domain => {
          const gapScreens = p1Screens.filter(s => s.coverage[domain.key] === 'gap')
          if (gapScreens.length === 0) return null
          return (
            <div key={domain.key} style={{ marginBottom: '.75rem', padding: '.75rem 1rem', background: '#fef2f2', borderRadius: 10, borderLeft: '3px solid #dc2626' }}>
              <p style={{ margin: '0 0 .35rem', fontWeight: 800, fontSize: '.8rem', color: '#dc2626' }}>{domain.label} — {gapScreens.length}개 갭</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem' }}>
                {gapScreens.map(s => badge('#fff', '#dc2626', s.id + ' ' + s.name, true))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================
// 메인 컴포넌트
// ============================================================
export default function Playboard() {
  const [view, setView] = useState<View>('board')

  const tabs: { key: View; label: string; icon: React.ReactNode }[] = [
    { key: 'board',  label: '상황판',        icon: <GitBranch size={15} /> },
    { key: 'detail', label: '화면 상세',      icon: <Map size={15} /> },
    { key: 'matrix', label: '커버리지 매트릭스', icon: <Layers size={15} /> },
  ]

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem 1.5rem 6rem', fontFamily: 'Pretendard, sans-serif' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.4rem' }}>
          {badge('#e8ecfb', '#0123B4', 'INTERNAL · SoT v2.0')}
          <span style={{ fontSize: '.72rem', color: '#9ca3af' }}>
            src/data/playboard.ts · docs/PLAYBOARD.md · 마지막 갱신: {PLAYBOARD.lastUpdated}
          </span>
          <a href="/hankkeut-prototype/pages.html" target="_blank" rel="noopener"
            style={{ marginLeft: 'auto', fontSize: '.72rem', color: '#0123B4', display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}>
            박제 프로토타입 목록 <ExternalLink size={11} />
          </a>
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: 0 }}>
          PlayBoard — 한끗프로젝트 구현 상황판
        </h1>
      </div>

      {/* 탭 네비게이션 */}
      <div style={{ display: 'flex', gap: '.4rem', marginBottom: '1.75rem', borderBottom: '2px solid #f3f4f6', paddingBottom: '-.1rem' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setView(tab.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '.4rem',
              padding: '.55rem 1.1rem', border: 'none', cursor: 'pointer',
              fontSize: '.82rem', fontWeight: 700,
              borderBottom: view === tab.key ? '2px solid #0123B4' : '2px solid transparent',
              background: 'transparent',
              color: view === tab.key ? '#0123B4' : '#6b7280',
              marginBottom: -2,
              transition: 'color .15s',
            }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* 뷰 렌더링 */}
      {view === 'board'  && <BoardView />}
      {view === 'detail' && <DetailView />}
      {view === 'matrix' && <MatrixView />}
    </div>
  )
}
