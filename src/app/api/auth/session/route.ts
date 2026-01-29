import { NextRequest, NextResponse } from 'next/server'

const PREVIEW_ORIGIN = process.env.NEXT_PUBLIC_PREVIEW_ORIGIN

export async function GET(req: NextRequest) {
  if (!PREVIEW_ORIGIN) {
    return NextResponse.json({ ok: false, error: 'Missing PREVIEW_ORIGIN' }, { status: 500 })
  }

  // Forward cookies to your preview server so it can read httpOnly refresh cookie
  const cookieHeader = req.headers.get('cookie') ?? ''

  const upstream = await fetch(`${PREVIEW_ORIGIN}/auth/session`, {
    method: 'GET',
    headers: { cookie: cookieHeader },
    cache: 'no-store',
  })

  // Pass through status; you can also pass JSON body if you want
  if (!upstream.ok) return NextResponse.json({ ok: false }, { status: 401 })

  const data = await upstream.text()
  return new NextResponse(data, {
    status: 200,
    headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
  })
}
