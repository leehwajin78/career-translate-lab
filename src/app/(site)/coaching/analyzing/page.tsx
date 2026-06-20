'use client'

import dynamic from 'next/dynamic'
import PageLoader from '@/components/PageLoader'
import { ProtectedRoute } from '@/components/ProtectedRoute'

const Page = dynamic(() => import('@/screens/coaching/CoachingAnalyzing'), { ssr: false, loading: () => <PageLoader /> })

export default function Route() {
  return (
    <ProtectedRoute role="member">
      <Page />
    </ProtectedRoute>
  )
}
