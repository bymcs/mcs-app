"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Icons } from "@/components/icons"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

interface UserNavProps {
  user: {
    email?: string
    user_metadata?: {
      avatar_url?: string
      full_name?: string
    }
  }
  isMobile?: boolean
}

interface NavigationItem {
  label: string
  href: string
  icon: keyof typeof Icons
}

const navigationItems: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "info" },
  { label: "Profil", href: "/profile", icon: "user" },
  { label: "Ayarlar", href: "/settings", icon: "settings" },
  { label: "Görevler", href: "/dashboard/tasks", icon: "check" },
]

export function UserNav({ user, isMobile }: UserNavProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push("/")
  }

  const renderNavigationItems = (onClick?: () => void) => {
    return navigationItems.map(({ label, href, icon }) => {
      const Icon = Icons[icon]
      return isMobile ? (
        <Button
          key={href}
          variant="ghost"
          className="w-full justify-start"
          asChild
        >
          <Link href={href}>
            <Icon className="mr-2 h-4 w-4" />
            {label}
          </Link>
        </Button>
      ) : (
        <DropdownMenuItem key={href} onClick={() => router.push(href)}>
          <Icon className="mr-2 h-4 w-4" />
          {label}
        </DropdownMenuItem>
      )
    })
  }

  const renderUserInfo = () => (
    <div className="flex flex-col space-y-1">
      {user?.user_metadata?.full_name && (
        <p className="text-sm font-medium leading-none">
          {user.user_metadata.full_name}
        </p>
      )}
      <p className={`text-xs leading-none ${isMobile ? "text-muted-foreground" : "text-muted-foreground"}`}>
        {user.email}
      </p>
    </div>
  )

  if (isMobile) {
    return (
      <div className="space-y-2">
        <div className="px-2 py-1.5 flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
            <AvatarFallback>{user?.email?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          {renderUserInfo()}
        </div>
        <div className="border-t my-2" />
        {renderNavigationItems()}
        <div className="flex items-center justify-between px-2 py-1.5">
          <ModeToggle showLabel label="Tema Seçenekleri" buttonVariant="ghost" />
          <Button
            variant="ghost"
            className="justify-start text-red-500"
            onClick={handleSignOut}
          >
            <Icons.loguot className="mr-2 h-4 w-4" />
            Çıkış Yap
          </Button>
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
            <AvatarFallback>{user?.email?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          {renderUserInfo()}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {renderNavigationItems()}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <ModeToggle showLabel label="Tema Seçenekleri" buttonVariant="ghost" className="w-full" />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
          <Icons.loguot className="mr-2 h-4 w-4" />
          Çıkış Yap
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
