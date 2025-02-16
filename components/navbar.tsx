"use client"

import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { Icons } from "@/components/icons"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"

interface NavbarProps {
  user: {
    email?: string
    user_metadata?: {
      avatar_url?: string
      full_name?: string
    }
  } | null
}

interface AuthButton {
  href: string
  label: string
  icon: keyof typeof Icons
  variant: "default" | "outline"
}

const authButtons: AuthButton[] = [
  {
    href: "/auth/login",
    label: "Giriş Yap",
    icon: "login",
    variant: "outline"
  },
  {
    href: "/auth/register",
    label: "Kayıt Ol",
    icon: "userplus",
    variant: "default"
  }
]

export function Navbar({ user: initialUser }: NavbarProps) {
  const router = useRouter()
  const [user, setUser] = useState(initialUser)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const renderAuthButtons = (isMobile: boolean = false) => {
    return authButtons.map(({ href, label, icon, variant }) => {
      const Icon = Icons[icon]
      return (
        <Button
          key={href}
          variant={variant}
          asChild
          className={isMobile ? "w-full justify-start" : ""}
          onClick={() => isMobile && setIsMenuOpen(false)}
        >
          <Link href={href} className="flex items-center">
            <Icon className="mr-2 h-4 w-4" />
            {label}
          </Link>
        </Button>
      )
    })
  }

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-2xl">
            BYMCS
          </Link>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <UserNav user={user} />
            ) : (
              <div className="flex items-center gap-2">
                {renderAuthButtons()}
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {user ? (
              <UserNav user={user} isMobile={true} />
            ) : (
              <div className="space-y-2">
                {renderAuthButtons(true)}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}