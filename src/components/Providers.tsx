'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export function Providers({ children }: { children: React.ReactNode }) {
  // QueryClient는 클라이언트당 1회 생성 (요청 간 캐시 공유 방지)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              if (error && typeof error === 'object' && 'status' in error) {
                const status = (error as { status: number }).status
                if (status >= 400 && status < 500) return false
              }
              return failureCount < 3
            },
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
            staleTime: 1000 * 60 * 5,
          },
        },
      }),
  )

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {children}
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
