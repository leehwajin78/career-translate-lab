'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Lead, LeadStatus } from '@/store/leads'

/* =============================================================
 * 관리자 리드 데이터 훅 (DB 기반)
 *
 * 기존 useLeadsStore(localStorage)의 { leads, updateStatus, updateMemo }
 * 인터페이스를 그대로 흉내내, 관리자 화면 교체를 최소화한다.
 * - leads: GET /api/leads
 * - updateStatus / updateMemo: PATCH /api/leads/[id] (낙관적 갱신, 메모는 디바운스)
 * ============================================================= */

export function useDbLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const memoTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/leads', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setLeads(Array.isArray(data.leads) ? data.leads : [])
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : '리드를 불러오지 못했습니다')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const updateStatus = useCallback(async (id: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    try {
      await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
    } catch {
      /* 네트워크 실패 시 다음 새로고침에서 정합성 복구 */
    }
  }, [])

  const updateMemo = useCallback((id: string, memo: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, memo } : l)))
    clearTimeout(memoTimers.current[id])
    memoTimers.current[id] = setTimeout(() => {
      void fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memo }),
      }).catch(() => {})
    }, 600)
  }, [])

  return { leads, loading, error, refresh, updateStatus, updateMemo }
}
