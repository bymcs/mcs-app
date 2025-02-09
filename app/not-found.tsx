import Link from "next/link"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  title: "404 - Sayfa Bulunamadı",
  description: "Aradığınız sayfa bulunamadı.",
}

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2">
      <Icons.alert className="h-10 w-10 text-muted-foreground" />
      <h2 className="text-2xl font-semibold">Sayfa Bulunamadı</h2>
      <p className="text-muted-foreground">
        Üzgünüz, aradığınız sayfaya ulaşamadık
      </p>
      <Button asChild className="mt-4">
        <Link href="/" className="flex items-center gap-2">
          <Icons.home className="h-4 w-4" />
          Ana Sayfaya Dön
        </Link>
      </Button>
    </main>
  )
}