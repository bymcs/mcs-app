'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

interface QueryProviderProps {
  children: React.ReactNode
  initialState?: unknown
}

const defaultQueryClientOptions = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 dakika
      gcTime: 1000 * 60 * 60, // 1 saat
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
}

export function QueryProvider({ children, initialState }: QueryProviderProps) {
  const [queryClient] = useState(
    () => new QueryClient(defaultQueryClientOptions)
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}