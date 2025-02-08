"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Icons } from "@/components/icons"
import { useToast } from "@/hooks/use-toast"

export function ResetPasswordForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${location.origin}/auth/callback?type=PASSWORD_RECOVERY`
      })

      if (error) throw error

      setSuccess("Check your email for the password reset link.")
      toast({
        title: "Success!",
        description: "Password reset instructions have been sent to your email.",
      })
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
            <Label className="text-sm font-medium" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="h-11 px-4 border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-offset-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <Icons.alert className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <Icons.check className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Button className="h-11 font-medium" disabled={loading}>
            {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Reset Password
          </Button>
        </div>
      </form>
    </div>
  )
} 