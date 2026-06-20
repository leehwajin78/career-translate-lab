'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

type RequiredRole = 'guest' | 'member' | 'admin'

const ROLE_LEVEL: Record<RequiredRole, number> = {
  guest: 0,
  member: 1,
  admin: 2,
}

interface ProtectedRouteProps {
  role: RequiredRole
  children: React.ReactNode
}

/**
 * 클라이언트 사이드 라우트 보호.
 * 기존 localStorage 기반 인증 동작을 그대로 유지하기 위해 미들웨어 대신
 * 클라이언트에서 가드한다. 하이드레이션 완료 전에는 아무것도 렌더링하지
 * 않아 SSR/CSR 불일치와 잘못된 리다이렉트를 방지한다.
 */
export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const router = useRouter()
  const [hydrated, setHydrated] = useState(false)
  const currentMember = useAuthStore((s) => s.currentMember)

  useEffect(() => setHydrated(true), [])

  const userRole = (currentMember as { role?: RequiredRole } | null)?.role ?? 'member'
  const allowed =
    !!currentMember && ROLE_LEVEL[userRole] >= ROLE_LEVEL[role]

  useEffect(() => {
    if (!hydrated) return
    if (!allowed) router.replace('/login')
  }, [hydrated, allowed, router])

  if (!hydrated || !allowed) return null

  return <>{children}</>
}
