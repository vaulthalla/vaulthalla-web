import { NextRequest, NextResponse } from 'next/server'

export const config = { matcher: ['/((?!dashboard|login|api|_next/static|_next/image|favicon.ico).*)'] }

export async function middleware(req: NextRequest) {
  const url = new URL('/api/auth/session', req.url)

  const res = await fetch(url, {
    method: 'GET',
    headers: { cookie: req.headers.get('cookie') ?? '' },
    cache: 'no-store',
  })

  if (!res.ok) {
    const redir = req.nextUrl.clone()
    redir.pathname = '/login'
    redir.searchParams.set('next', req.nextUrl.pathname)
    return NextResponse.redirect(redir)
  }

  return NextResponse.next()
}
