import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bdalbmiplklduytmyqpu.supabase.co'
const SUPABASE_ANON = 'YOUR_ANON_KEY_HERE' // ← replace this

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
