import { lazy, Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from '@/components/site/Layout'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ProtectedRoute } from '@/components/ProtectedRoute'

// 즉시 로드 (초기 번들)
import Index from './pages/Index'
import Service from './pages/Service'
import Diagnosis from './pages/Diagnosis'
import Result from './pages/Result'
import Consultation from './pages/Consultation'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

// 지연 로드 (로그인 후 접근 페이지 — 초기 번들 제외)
const Admin            = lazy(() => import('./pages/Admin'))
const ApplyDiagnosis   = lazy(() => import('./pages/apply/ApplyDiagnosis'))
const ApplyBuild       = lazy(() => import('./pages/apply/ApplyBuild'))
const ApplyLaunch      = lazy(() => import('./pages/apply/ApplyLaunch'))
const ApplyPartner     = lazy(() => import('./pages/apply/ApplyPartner'))
const ApplyThankYou    = lazy(() => import('./pages/apply/ApplyThankYou'))
const CoachingDashboard  = lazy(() => import('./pages/coaching/CoachingDashboard'))
const CoachingQuestions  = lazy(() => import('./pages/coaching/CoachingQuestions'))
const CoachingReview     = lazy(() => import('./pages/coaching/CoachingReview'))
const CoachingAnalyzing  = lazy(() => import('./pages/coaching/CoachingAnalyzing'))
const CoachingReport     = lazy(() => import('./pages/coaching/CoachingReport'))
const CoachingWorkspace  = lazy(() => import('./pages/coaching/CoachingWorkspace'))

const queryClient = new QueryClient({
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
})

function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
      <div style={{ color: '#0123B4', fontSize: '.9rem' }}>불러오는 중...</div>
    </div>
  )
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<Layout />}>
                {/* Public — Guest */}
                <Route path="/"            element={<Index />} />
                <Route path="/service"     element={<Service />} />
                <Route path="/diagnosis"   element={<Diagnosis />} />
                <Route path="/result"      element={<Result />} />
                <Route path="/consultation" element={<Consultation />} />
                <Route path="/login"       element={<Login />} />

                {/* Apply 플로우 — Guest (결제 전) */}
                <Route path="/apply/diagnosis"  element={<ApplyDiagnosis />} />
                <Route path="/apply/build"      element={<ApplyBuild />} />
                <Route path="/apply/launch"     element={<ApplyLaunch />} />
                <Route path="/apply/partner"    element={<ApplyPartner />} />
                <Route path="/apply/thank-you"  element={<ApplyThankYou />} />

                {/* Coaching 플로우 — Member 전용 */}
                <Route path="/coaching" element={
                  <ProtectedRoute role="member"><CoachingDashboard /></ProtectedRoute>
                } />
                <Route path="/coaching/questions" element={
                  <ProtectedRoute role="member"><CoachingQuestions /></ProtectedRoute>
                } />
                <Route path="/coaching/question" element={
                  <ProtectedRoute role="member"><CoachingQuestions /></ProtectedRoute>
                } />
                <Route path="/coaching/review" element={
                  <ProtectedRoute role="member"><CoachingReview /></ProtectedRoute>
                } />
                <Route path="/coaching/analyzing" element={
                  <ProtectedRoute role="member"><CoachingAnalyzing /></ProtectedRoute>
                } />
                <Route path="/coaching/report" element={
                  <ProtectedRoute role="member"><CoachingReport /></ProtectedRoute>
                } />

                {/* Workspace — Admin 전용 */}
                <Route path="/coaching/workspace/:memberId" element={
                  <ProtectedRoute role="admin"><CoachingWorkspace /></ProtectedRoute>
                } />

                {/* Admin 포털 — Admin 전용 */}
                <Route path="/admin" element={
                  <ProtectedRoute role="admin"><Admin /></ProtectedRoute>
                } />
                <Route path="/admin/*" element={
                  <ProtectedRoute role="admin"><Admin /></ProtectedRoute>
                } />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
)

export default App
