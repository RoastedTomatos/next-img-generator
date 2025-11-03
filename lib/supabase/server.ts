import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function createServerClient() {
  const cookieStore = await cookies()
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      getSession: async () => {
        const token = cookieStore.get('sb-access-token')?.value
        if (!token) return { data: { session: null }, error: null }
        
        // This is a simplified version - in production, verify the token
        return { data: { session: { access_token: token } }, error: null }
      },
    },
  })
}

