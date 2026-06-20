'use client'

import dynamic from 'next/dynamic'
import PageLoader from '@/components/PageLoader'

const Page = dynamic(() => import('@/screens/Index'), { ssr: false, loading: () => <PageLoader /> })

export default function Route() {
  return <Page />
}
