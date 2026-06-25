'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { TOTAL_QUESTIONS } from '@/data/coachingQuestions'

/* =============================================================
 * 멤버 코칭 42문항 훅 (DB 기반)
 *
 * 기존 useCoachingStore(localStorage)를 대체. 멤버는 쿠키로 식별되므로
 * memberId 인자가 필요 없다. (서버가 세션에서 profileId 도출)
 * - 마운트 시 GET /api/coaching/session
 * - saveText: 낙관적 갱신 + 800ms 디바운스 PUT /api/coaching/answers
 * - flush: 디바운스 중인 저장을 즉시 반영 (페이지 이탈·제출 전)
 * - submit: flush 후 POST /api/coaching/submit
 * ============================================================= */

export type CoachingStatus =
  | 'in-progress'
  | 'submitted'
  | 'analyzing'
  | 'analyzed'
  | 'finalized'

export interface CoachingAnswers {
  [questionId: number]: { text: string }
}

export function useDbCoaching() {
  const [answers, setAnswers] = useState<CoachingAnswers>({})
  const [status, setStatus] = useState<CoachingStatus>('in-progress')
  const [submittedAt, setSubmittedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({})
  const pending = useRef<Record<number, string>>({})

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/coaching/session', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const s = data.session
      if (s) {
        setAnswers(s.answers ?? {})
        setStatus((s.status as CoachingStatus) ?? 'in-progress')
        setSubmittedAt(s.submittedAt ?? null)
      }
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : '코칭 정보를 불러오지 못했습니다')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const putAnswer = async (questionId: number, text: string) => {
    delete pending.current[questionId]
    await fetch('/api/coaching/answers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, text }),
    }).catch(() => {})
  }

  const saveText = useCallback((questionId: number, text: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { text } }))
    pending.current[questionId] = text
    clearTimeout(timers.current[questionId])
    timers.current[questionId] = setTimeout(() => {
      void putAnswer(questionId, pending.current[questionId] ?? text)
    }, 800)
  }, [])

  /** 디바운스 대기 중인 모든 저장을 즉시 반영 */
  const flush = useCallback(async () => {
    const entries = Object.entries(pending.current)
    Object.values(timers.current).forEach((t) => clearTimeout(t))
    timers.current = {}
    await Promise.all(entries.map(([qid, text]) => putAnswer(Number(qid), text)))
  }, [])

  const submit = useCallback(async (): Promise<boolean> => {
    await flush()
    try {
      const res = await fetch('/api/coaching/submit', { method: 'POST' })
      if (!res.ok) return false
      const d = await res.json().catch(() => ({}))
      if (d.ok) {
        setStatus('submitted')
        setSubmittedAt(new Date().toISOString())
        return true
      }
      return false
    } catch {
      return false
    }
  }, [flush])

  const completedCount = Object.values(answers).filter(
    (a) => a.text && a.text.trim().length > 0,
  ).length
  const progress = Math.round((completedCount / TOTAL_QUESTIONS) * 100)

  return {
    answers,
    status,
    submittedAt,
    loading,
    error,
    refresh,
    saveText,
    flush,
    submit,
    completedCount,
    progress,
  }
}
