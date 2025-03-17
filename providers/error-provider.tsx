'use client';

import { createContext, useContext, useEffect } from 'react';
import { toast  } from "react-hot-toast";

export const ErrorContext = createContext(null);

export function ErrorProvider({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    const handleHashChange = () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const error = hashParams.get("error");
      const errorDescription = hashParams.get("error_description");

      if (error) {
        const formattedDescription = decodeURIComponent(errorDescription || '')
          .replace(/\+/g, ' ')
          .replace(/%20/g, ' ');

        toast.error(formattedDescription);

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