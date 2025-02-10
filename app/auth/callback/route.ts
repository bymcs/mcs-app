import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const type = requestUrl.searchParams.get("type")

  if (!code) {
    return NextResponse.redirect(new URL("/auth/login", requestUrl.origin))
  }

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) throw error

    // Handle password recovery flow
    if (type === "PASSWORD_RECOVERY") {
      return NextResponse.redirect(new URL("/auth/update-password", requestUrl.origin))
    }

    // Handle normal auth callback
    return NextResponse.redirect(new URL("/dashboard", requestUrl.origin))
  } catch (error) {
    console.error("Auth callback error:", error)
    return NextResponse.redirect(
      new URL("/auth/login?error=Auth callback failed", requestUrl.origin)
    )
  }
}