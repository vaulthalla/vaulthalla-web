import { NextRequest, NextResponse } from 'next/server'

export const config = { matcher: ['/((?!dashboard|login|api|_next/static|_next/image|favicon.ico).*)'] }

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public routes
  if (pathname === '/login') return NextResponse.next()

  // Strict validation via same-origin proxy route
  const validateUrl = new URL('/api/auth/session', req.url)

  const res = await fetch(validateUrl, {
    method: 'GET',
    headers: {
      // forward cookies so /api/auth/session can forward them again to preview server
      cookie: req.headers.get('cookie') ?? '',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
