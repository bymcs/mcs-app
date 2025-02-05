import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { pathname } = req.nextUrl

  // Check if the route is public
  if (publicRoutes.includes(pathname)) {
    return res
  }

  try {
    const { data: { session } } = await supabase.auth.getSession()

    // If no session and trying to access protected route, redirect to login
    if (!session && !publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    return res
  } catch (error) {
    // Handle auth errors by redirecting to login
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}