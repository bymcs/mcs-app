import { useQuery, useQueryClient } from '@tanstack/react-query'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import React from 'react'

const supabase = createClient()

export function useSupabase() {
  const queryClient = useQueryClient()

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      return session?.user ?? null
    },
    staleTime: 1000 * 60 * 5, // 5 dakika
    gcTime: 1000 * 60 * 60, // 1 saat
  })

  // Oturum değişikliklerini dinle
  React.useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Önbelleği güncelle
      queryClient.setQueryData(['user'], session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient])

  return {
    user,
    loading: isLoading,
    supabase,
  }
} 