import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/auth/reset-password', '/']
const AUTH_ROUTES = ['/auth/callback', '/auth/update-password']

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const { pathname } = request.nextUrl

  try {
    // Oturum kontrolü
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Public route kontrolü
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
    const isAuthRoute = AUTH_ROUTES.includes(pathname)

    // Auth callback işlemi
    if (pathname === '/auth/callback') {
      const code = request.nextUrl.searchParams.get('code')
      if (code) return res
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Oturum yoksa ve public route değilse login'e yönlendir
    if (!session && !isPublicRoute && !isAuthRoute) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Oturum varsa ve public route ise dashboard'a yönlendir
    if (session && isPublicRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}