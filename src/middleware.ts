import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE, MEMBER_COOKIE, verifySession } from '@/lib/session'

/* =============================================================
 * 라우트 보호
 *  관리자(hk_admin):
 *   - /api/leads/**, /api/admin/**(단 /api/admin/login 제외) : 없으면 401
 *   - /admin, /admin/**(단 /admin/auth 제외) : 없으면 /admin/auth 리다이렉트
 *   - /coaching/workspace/** (코치 전용) : 없으면 /admin/auth 리다이렉트
 *  멤버(hk_member):
 *   - /api/coaching/** : 없으면 401
 *   - /coaching, /coaching/**(workspace 제외) : 없으면 /login 리다이렉트
 * ============================================================= */

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/api/leads/:path*',
    '/api/admin/:path*',
    '/coaching',
    '/coaching/:path*',
    '/api/coaching/:path*',
  ],
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 공개: 관리자 로그인 엔드포인트
  if (pathname.startsWith('/api/admin/login')) return NextResponse.next()

  const adminSession = await verifySession(req.cookies.get(ADMIN_COOKIE)?.value)
  const isAdmin = adminSession?.role === 'admin'

  const redirectTo = (path: string) => {
    const url = req.nextUrl.clone()
    url.pathname = path
    url.search = ''
    return NextResponse.redirect(url)
  }

  // ── 관리자 API ──
  if (pathname.startsWith('/api/leads') || pathname.startsWith('/api/admin')) {
    if (!isAdmin) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    return NextResponse.next()
  }

  // ── 코칭 워크스페이스: 코치(관리자) 전용 ──
  if (pathname.startsWith('/coaching/workspace')) {
    if (!isAdmin) return redirectTo('/admin/auth')
    return NextResponse.next()
  }

  // ── 관리자 페이지 ──
  if (pathname === '/admin/auth' || pathname.startsWith('/admin/auth/')) {
    return NextResponse.next()
  }
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (!isAdmin) return redirectTo('/admin/auth')
    return NextResponse.next()
  }

  // ── 멤버 인가 ──
  const memberSession = await verifySession(req.cookies.get(MEMBER_COOKIE)?.value)
  const isMember = memberSession?.role === 'member'

  if (pathname.startsWith('/api/coaching')) {
    if (!isMember) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    return NextResponse.next()
  }

  if (pathname === '/coaching' || pathname.startsWith('/coaching/')) {
    if (!isMember) return redirectTo('/login')
    return NextResponse.next()
  }

  return NextResponse.next()
}
