import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { HeroGeometric } from "@/components/ui/shape-landing-hero"


export default async function Test() {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      redirect("/auth/login")
    }

    return (
      <HeroGeometric badge="MCS UI"
        title1="BYMCS"
        title2="Digital Vision" />
    )
  } catch (error) {
    console.error('Error in dashboard:', error)
    redirect("/auth/login")
  }
}