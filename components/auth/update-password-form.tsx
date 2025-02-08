"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Icons } from "@/components/icons"
import { useToast } from "@/hooks/use-toast"

export function UpdatePasswordForm() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      toast({
        title: "Success!",
        description: "Your password has been updated. Please sign in with your new password.",
      })

      await supabase.auth.signOut()
      router.push("/login")
    } catch (err: any) {
      setError(err.message)
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <Label className="text-sm font-medium" htmlFor="password">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect="off"
                className="h-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-700"
              >
                {showPassword ? (
                  <Icons.eyeOff className="h-5 w-5" />
                ) : (
                  <Icons.eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="grid gap-1">
            <Label className="text-sm font-medium" htmlFor="confirmPassword">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect="off"
                className="h-11"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <Icons.alert className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button className="h-11 font-medium" disabled={loading}>
            {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Update Password
          </Button>
        </div>
      </form>
    </div>
  )
}