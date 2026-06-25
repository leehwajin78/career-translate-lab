'use client'

import { useCallback, useState } from 'react'

/* =============================================================
 * 관리자: 멤버별 코칭 세션 조회/상태변경 (DB)
 * - fetchMember: GET /api/admin/coaching/[memberId] (답변 조회 시 on-demand)
 * - patchStatus: PATCH /api/admin/coaching/[memberId]
 * ============================================================= */

export interface AdminMemberSession {
  status: string
  submittedAt: string | null
  answers: Record<number, { text: string }>
  completedCount: number
}

export function useAdminCoaching() {
  const [cache, setCache] = useState<Record<string, AdminMemberSession>>({})
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({})

  const fetchMember = useCallback(async (memberId: string) => {
    setLoadingIds((p) => ({ ...p, [memberId]: true }))
    try {
      const res = await fetch(`/api/admin/coaching/${memberId}`, { cache: 'no-store' })
      const data = await res.json()
      if (data.session) setCache((p) => ({ ...p, [memberId]: data.session }))
    } catch {
      /* ignore */
    } finally {
      setLoadingIds((p) => ({ ...p, [memberId]: false }))
    }
  }, [])

  const patchStatus = useCallback(async (memberId: string, status: string) => {
    await fetch(`/api/admin/coaching/${memberId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => {})
  }, [])

  return { cache, loadingIds, fetchMember, patchStatus }
}
