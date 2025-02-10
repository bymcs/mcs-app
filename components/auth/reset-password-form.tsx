"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Icons } from "@/components/icons"
import { useSupabase } from "@/hooks/use-supabase"

const resetSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
})

type ResetValues = z.infer<typeof resetSchema>

export function ResetPasswordForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const { supabase } = useSupabase()

  const form = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: ResetValues) {
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${location.origin}/auth/callback?type=PASSWORD_RECOVERY`,
      })

      if (error) {
        toast({
          variant: "destructive",
          title: "Şifre sıfırlama başarısız",
          description: error.message,
        })
        return
      }

      toast({
        title: "Şifre sıfırlama bağlantısı gönderildi",
        description: "E-posta adresinizi kontrol edin.",
      })

      router.push("/auth/login")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Şifre sıfırlama başarısız",
        description: "Bir hata oluştu. Lütfen tekrar deneyin.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              placeholder="ornek@firma.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Şifre Sıfırlama Bağlantısı Gönder
          </Button>
        </div>
      </form>
    </div>
  )
} 