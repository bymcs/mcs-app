import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const createClient = () => {
  return createClientComponentClient({
    options: {
      db: {
        schema: 'public',
      }
    },
  })
}