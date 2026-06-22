import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE, verifySession } from '@/lib/session'

/* =============================================================
 * 라우트 보호 (MVP)
 *  - /api/leads/**  : 관리자 세션 없으면 401
 *  - /admin, /admin/**(단 /admin/auth 제외) : 세션 없으면 /admin/auth 로 리다이렉트
 *
 * Phase 2에서 /coaching/**(회원) 보호를 추가 예정.
 * ============================================================= */

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/leads/:path*'],
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session = await verifySession(req.cookies.get(ADMIN_COOKIE)?.value)

  if (pathname.startsWith('/api/leads')) {
    if (!session) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }
    return NextResponse.next()
  }

  // 로그인 화면 자체는 공개
  if (pathname === '/admin/auth' || pathname.startsWith('/admin/auth/')) {
    return NextResponse.next()
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (!session) {
      const url = req.nextUrl.clone()
      url.pathname = '/admin/auth'
      url.search = ''
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}
