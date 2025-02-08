import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes - authentication not required
const publicRoutes = ['/login', '/register', '/', '/reset-password']

// Protected routes - authentication required
const protectedRoutes = ['/dashboard']

// Auth flow routes - special handling required
const authFlowRoutes = ['/auth/callback', '/update-password']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const path = req.nextUrl.pathname

  // Public routes are always accessible
  if (publicRoutes.includes(path)) {
    return res
  }

  // Handle auth flow routes
  if (authFlowRoutes.includes(path)) {
    if (path === '/auth/callback') {
      const { searchParams } = new URL(req.url)
      const code = searchParams.get('code')
      if (code) return res
    }

    if (path === '/update-password') {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) return res
    }

    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Protected routes require authentication
  if (protectedRoutes.includes(path)) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}