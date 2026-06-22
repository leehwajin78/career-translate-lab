import AdminLayout from '@/screens/admin/AdminLayout'

/*
 * 관리자 구역 보호는 서버 미들웨어(src/middleware.ts, 서명 쿠키 세션)가 담당한다.
 * 기존 localStorage 기반 ProtectedRoute(role="admin")는 쿠키 세션과 충돌하고
 * /admin/auth 로그인 화면까지 /login 으로 튕겨내므로 제거했다.
 */
export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}
