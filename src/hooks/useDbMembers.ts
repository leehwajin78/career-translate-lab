'use client'

import { useCallback, useEffect, useState } from 'react'

/* =============================================================
 * 관리자 멤버 관리 훅 (DB 기반)
 *
 * 기존 useAuthStore의 { members, addMember, removeMember, updateMember }
 * 인터페이스를 흉내내 AdminDashboard 교체를 최소화한다.
 * - members: GET /api/admin/members
 * - addMember: POST /api/admin/members
 * - removeMember/updateMember: DELETE/PATCH /api/admin/members/[id]
 * ============================================================= */

export interface DbMember {
  id: string
  name: string
  email: string
  productKey: string
  createdAt: string
  /** 42문항 응답 완료 수 (기본 0) */
  answeredCount: number
  /** 코칭 세션 상태 (in-progress | submitted | ...) */
  coachingStatus: string
}

export function useDbMembers() {
  const [members, setMembers] = useState<DbMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/members', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setMembers(Array.isArray(data.members) ? data.members : [])
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : '멤버를 불러오지 못했습니다')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  /** 발급 → 성공 시 DbMember, 실패 시 { error } */
  const addMember = useCallback(
    async (input: { name: string; email: string; password: string; productKey: string }): Promise<
      { member: DbMember } | { error: string }
    > => {
      const res = await fetch('/api/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        return { error: data?.message || '발급에 실패했습니다.' }
      }
      setMembers((prev) => [data.member, ...prev])
      return { member: data.member }
    },
    [],
  )

  const removeMember = useCallback(async (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id))
    await fetch(`/api/admin/members/${id}`, { method: 'DELETE' }).catch(() => {})
  }, [])

  const updateMember = useCallback(async (id: string, updates: { productKey?: string }) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)))
    await fetch(`/api/admin/members/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch(() => {})
  }, [])

  return { members, loading, error, refresh, addMember, removeMember, updateMember }
}
