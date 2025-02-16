"use client"

import * as React from "react"
import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ThemeOption {
  value: 'light' | 'dark' | 'system'
  label: string
  icon: React.ReactNode
  description: string
}

interface ModeToggleProps {
  showLabel?: boolean
  label?: string
  align?: "start" | "center" | "end"
  className?: string
  iconClassName?: string
  buttonVariant?: "default" | "ghost" | "outline"
  showTooltip?: boolean
  tooltipSide?: "top" | "right" | "bottom" | "left"
}

export function ModeToggle({
  showLabel = false,
  label = "Tema",
  align = "end",
  className,
  iconClassName,
  buttonVariant = "ghost",
  showTooltip = true,
  tooltipSide = "bottom"
}: ModeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Hydration için mount kontrolü
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const themeOptions: ThemeOption[] = React.useMemo(() => [
    {
      value: 'light',
      label: 'Aydınlık',
      icon: <Sun className="h-4 w-4" />,
      description: 'Aydınlık tema'
    },
    {
      value: 'dark',
      label: 'Karanlık',
      icon: <Moon className="h-4 w-4" />,
      description: 'Karanlık tema'
    },
    {
      value: 'system',
      label: 'Sistem',
      icon: <Laptop className="h-4 w-4" />,
      description: 'Sistem teması'
    }
  ], [])

  // Mount olmadan önce null döndür
  if (!mounted) {
    return null
  }

  const activeTheme = themeOptions.find((option) => option.value === theme) || themeOptions[2]

  const toggleButton = (
    <Button
      variant={buttonVariant}
      size={showLabel ? "default" : "icon"}
      className={cn(
        "relative transition-colors",
        showLabel ? "gap-2" : "w-9 h-9",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {React.cloneElement(activeTheme.icon as React.ReactElement, {
          className: cn("transition-all", iconClassName, showLabel ? "h-4 w-4" : "h-5 w-5")
        } as React.SVGProps<SVGSVGElement>)}
        {showLabel && <span className="text-sm font-medium">{label}</span>}
      </div>
      <span className="sr-only">Tema değiştir</span>
    </Button>
  )

  const menu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {toggleButton}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-[200px]">
        {themeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {option.icon}
              <div>
                <p className="text-sm font-medium">{option.label}</p>
                <p className="text-xs text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </div>
            {theme === option.value && (
              <span className="text-sm text-primary">
                <Icons.check className="h-4 w-4" />
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  if (!showTooltip) return menu

  return (
    <TooltipProvider>
      <Tooltip>
        {menu}
        <TooltipContent side={tooltipSide}>
          <p>Tema değiştir</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
