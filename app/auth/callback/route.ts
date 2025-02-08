import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const type = requestUrl.searchParams.get("type")

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  // Handle password recovery flow
  if (type === "PASSWORD_RECOVERY" && code) {
    try {
      // Exchange code for session
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) throw error

      // Redirect to update password page after successful code exchange
      return NextResponse.redirect(new URL("/update-password", requestUrl.origin))
    } catch (error) {
      return NextResponse.redirect(
        new URL("/login?error=Invalid or expired password reset link", requestUrl.origin)
      )
    }
  }

  // Handle normal auth callback
  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) throw error
      return NextResponse.redirect(new URL("/dashboard", requestUrl.origin))
    } catch (error) {
      return NextResponse.redirect(new URL("/login", requestUrl.origin))
    }
  }

  return NextResponse.redirect(new URL("/login", requestUrl.origin))
}