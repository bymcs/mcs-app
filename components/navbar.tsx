"use client"

import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { Icons } from "@/components/icons"
import { UserNav } from "@/components/user-nav"

export function Navbar({ user: initialUser }: { user: any }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(initialUser)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.refresh()
    router.push("/")
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-2xl">
            BYMCS
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <UserNav user={user} />
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login" className="flex items-center">
                    <Icons.login className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/register" className="flex items-center">
                    <Icons.userplus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2"> {/* space-y-2 eklendi */}
            {user ? (
              <UserNav user={user} isMobile={true} />
            ) : (
              <div className="space-y-2"> {/* Butonları sarmak için div eklendi */}
                <Button
                  variant="outline"
                  asChild
                  className="w-full justify-start"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link href="/login" className="flex items-center">
                    <Icons.login className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-start"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link href="/register" className="flex items-center">
                    <Icons.userplus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}