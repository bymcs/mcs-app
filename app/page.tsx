import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="container mx-auto space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Our Platform</h1>
          <p className="text-xl text-muted-foreground">
            A secure and modern application built with Next.js and Supabase
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/register">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Secure Authentication</h3>
            <p className="text-muted-foreground">
              Powered by Supabase for reliable and secure user authentication.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Modern Dashboard</h3>
            <p className="text-muted-foreground">
              Beautiful and responsive dashboard interface for managing your data.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Real-time Updates</h3>
            <p className="text-muted-foreground">
              Stay synchronized with real-time data updates and notifications.
            </p>
          </Card>
        </section>

        {/* Tech Stack Section */}
        <section className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Built With</h2>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary">Next.js</Badge>
            <Badge variant="secondary">TypeScript</Badge>
            <Badge variant="secondary">Tailwind CSS</Badge>
            <Badge variant="secondary">Shadcn UI</Badge>
            <Badge variant="secondary">Supabase</Badge>
          </div>
        </section>
      </div>
    </main>
  )
}