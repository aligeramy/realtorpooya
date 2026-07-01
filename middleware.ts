import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Hosts that are the main site — everything else is treated as a connected
// custom landing-page domain and rewritten to the /d resolver.
const PRIMARY = new Set([
  'realtorpooya.com', 'www.realtorpooya.com',
  'realtorpooya.ca', 'www.realtorpooya.ca',
])

export function middleware(req: NextRequest) {
  const host = (req.headers.get('host') || '').split(':')[0].toLowerCase()
  if (!host || PRIMARY.has(host) || host.endsWith('.vercel.app') || host === 'localhost' || host.endsWith('.local')) {
    return NextResponse.next()
  }
  // Custom domain → render its landing page (host is preserved for the resolver).
  const url = req.nextUrl.clone()
  url.pathname = '/d'
  return NextResponse.rewrite(url)
}

export const config = {
  // Skip API, Next internals and static files; everything else on a custom host
  // resolves to the landing page.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'],
}
