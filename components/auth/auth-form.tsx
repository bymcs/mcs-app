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

import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"

import { useEffect } from "react";

export function AuthForm({ type }: { type: "login" | "register" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (type === "login") {
        const { error, data } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
        
        if (error) throw error;
        
        if (data.session) {
          toast({
            title: "Success!",
            description: "You have successfully logged in.",
          });
          router.refresh();
          router.push("/dashboard");
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            emailRedirectTo: `${location.origin}/auth/callback`,
          },
        });
        
        if (error) throw error;
        
        setSuccess("Check your email for the confirmation link.");
        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }

  const handleGitHubSignIn = async () => {
    setGithubLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) throw error;

      toast({
        title: "GitHub Yönlendirmesi",
        description: "GitHub hesabınıza yönlendiriliyorsunuz...",
        variant: "default"
      });

    } catch (error: any) {
      console.error('GitHub authentication error:', error);
      
      const errorMessages: { [key: string]: string } = {
        'Multiple accounts': "Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapın veya farklı bir hesap kullanın.",
        'Authentication failed': "GitHub doğrulaması başarısız oldu. Lütfen tekrar deneyin.",
        'Connection error': "Bağlantı hatası. İnternet bağlantınızı kontrol edin."
      };

      const errorMessage = errorMessages[error.message] || "GitHub ile giriş yapılırken bir hata oluştu.";

      toast({
        title: "Hata",
        description: errorMessage,
        variant: "destructive",
        action: type === "register" ? (
          <ToastAction altText="Giriş Yap" onClick={() => router.push("/auth/login")}>
            Giriş Yap
          </ToastAction>
        ) : undefined
      });
    } finally {
      setGithubLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
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
            <div className="grid gap-1">
              <Label className="text-sm font-medium" htmlFor="password">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  autoCapitalize="none"
                  autoComplete={type === "login" ? "current-password" : "new-password"}
                  autoCorrect="off"
                  className="h-11 px-4 border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-offset-1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                >
                  {showPassword ? (
                    <Icons.eyeOff className="h-5 w-5" />
                  ) : (
                    <Icons.eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {type === "login" && (
            <div className="flex items-center justify-end">
              <Link
                href="/auth/reset-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          )}

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
            {type === "login" ? "Sign In" : "Create Account"}
          </Button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-neutral-200 dark:border-neutral-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="h-11 font-medium" 
        disabled={loading || githubLoading} 
        onClick={handleGitHubSignIn}
      >
        {githubLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}
        GitHub ile {type === "login" ? "Giriş Yap" : "Kayıt Ol"}
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        {type === "login" ? (
          <>
            Don't have an account?{" "}
            <Link href="/auth/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
