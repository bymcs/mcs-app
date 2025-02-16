import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { createServerClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as MToaster } from "react-hot-toast";
import { QueryProvider } from "@/providers/query-provider";
import { ErrorProvider } from "@/providers/error-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MCS App",
  description: "Modern Cloud Solutions Application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createServerClient();
  let user = null;

  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;
  } catch (error) {
    console.error("Auth error:", error);
  }

  return (
    <html lang="tr" suppressHydrationWarning>
      <head />
      <body className={`${inter.className} antialiased min-h-screen bg-background`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ErrorProvider>
              <div className="relative flex min-h-screen flex-col">
                <Navbar user={user} />
                <main className="flex-1">{children}</main>
              </div>
              <Toaster />
              <MToaster />
            </ErrorProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}