import { Inter } from "next/font/google"
import { JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "mcs-app",
  description: "Modern web application built with Next.js and Supabase",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased min-h-screen bg-background`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <Navbar user={user} />
              <main className="flex-1">{children}</main>
            </div>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    )
  } catch (error) {
    console.error('Error:', error)
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased min-h-screen bg-background`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <Navbar user={null} />
              <main className="flex-1">{children}</main>
            </div>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    )
  }
}