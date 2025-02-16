"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { toast as toastify } from "react-hot-toast";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Form şeması
const authFormSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z
    .string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
});

type AuthFormValues = z.infer<typeof authFormSchema>;

interface AuthFormProps {
  type: "login" | "register";
}

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });

  const onSubmit = async (datafp: AuthFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      if (type === "login") {
        const { data,error } = await supabase.auth.signInWithPassword({
          email: datafp.email,
          password: datafp.password,
        });
        if (error) throw error;
        toastify.promise(Promise.resolve(data), {
          loading: "Giriş yapılıyor...",
          success: "Giriş başarılı. Yönlendiriliyorsunuz...",
          error: "Giriş yaparken bir hata oluştu. Lütfen tekrar deneyin.",
        });
        router.refresh();
        router.push("/dashboard");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: datafp.email,
          password: datafp.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });
        if (error) throw error;
        
        toastify.success("Kayıt başarılı. Lütfen email adresinizi doğrulayın.");
        router.refresh();
        router.push("/auth/login");

      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      toastify.success("Redirecting to GitHub for authentication.");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{type === "login" ? "Giriş Yap" : "Kayıt Ol"}</CardTitle>
        <CardDescription>
          {type === "login"
            ? "Hesabınıza giriş yapın"
            : "Yeni bir hesap oluşturun"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              {...form.register("email")}
              disabled={isLoading}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...form.register("password")}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Icons.eyeOff /> : <Icons.eye />}
              </Button>
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="space-y-1">
              <Icons.alert className="h-4 w-4 space-y-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : null}
            {type === "login" ? "Giriş Yap" : "Kayıt Ol"}
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Veya devam et
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          type="button"
          className="w-full"
          onClick={handleGithubLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : (
            <Icons.gitHub className="mr-2 h-4 w-4" />
          )}
          GitHub ile {type === "login" ? "Giriş Yap" : "Kayıt Ol"}
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {type === "login" ? (
            <>
              Hesabınız yok mu?{" "}
              <Button variant="link" className="p-0" onClick={() => router.push("/auth/register")}>
                Kayıt Ol
              </Button>
            </>
          ) : (
            <>
              Zaten hesabınız var mı?{" "}
              <Button variant="link" className="p-0" onClick={() => router.push("/auth/login")}>
                Giriş Yap
              </Button>
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  );
}
