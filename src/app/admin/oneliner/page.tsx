'use client'

import dynamic from 'next/dynamic'
import PageLoader from '@/components/PageLoader'

const Page = dynamic(() => import('@/screens/admin/AdminOneliner'), { ssr: false, loading: () => <PageLoader /> })

export default function Route() {
  return <Page />
}
