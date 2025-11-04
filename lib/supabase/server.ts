import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const createServerClient = () => {
  try {
    const cookieStore = cookies()
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { 'x-client-info': 'nextjs-server' } },
      auth: {
        autoRefreshToken: true,
        persistSession: false,
        detectSessionInUrl: false,
      },
    })
  } catch {
    return createClient(supabaseUrl, supabaseAnonKey)
  }
}

export const getServerSession = async () => {
  const supabase = createServerClient()
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()
  if (error) console.error('Supabase session error:', error)
  return session
}
