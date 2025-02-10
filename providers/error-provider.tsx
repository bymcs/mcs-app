'use client';

import { createContext, useContext, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export const ErrorContext = createContext(null);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();

  useEffect(() => {
    const handleHashChange = () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const error = hashParams.get("error");
      const errorDescription = hashParams.get("error_description");

      if (error) {
        const formattedDescription = decodeURIComponent(errorDescription || '')
          .replace(/\+/g, ' ')
          .replace(/%20/g, ' ');

        toast({
          variant: "destructive",
          title: "Error",
          description: formattedDescription,
          duration: 5000
        });

        // URL'i temizle
        window.history.replaceState(null, '', window.location.pathname);
      }
    };

    // Sayfa ilk yüklendiğinde kontrol et
    handleHashChange();

    // Hash değişikliklerini dinle
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [toast]);

  return <>{children}</>;
}