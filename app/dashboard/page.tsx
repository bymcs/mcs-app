import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/file-upload"
import { ModeToggle } from "@/components/mode-toggle"
import CaseStudyCard from "@/components/receipt"

export default async function DashboardPage() {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      redirect("/login")
    }

    return (
      <div className="container mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.user.email}</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Your activity overview</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add your dashboard content here */}
              <p>Dashboard content coming soon...</p>
            </CardContent>
          </Card>
          
          <FileUpload />

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Your activity overview</CardDescription>
            </CardHeader>
            <CardContent>
            <CaseStudyCard
  image="https://images.unsplash.com/photo-1675285410608-ddd6bb430b19?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  link="https://BYMCS.com"
  type="simple-image"
/>
            </CardContent>
          </Card>

        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in dashboard:', error)
    redirect("/login")
  }
}