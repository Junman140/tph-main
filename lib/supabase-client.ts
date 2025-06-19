import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  }
  if (!supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Helper to check database connectivity
export async function checkDatabaseConnection() {
  const supabase = getSupabaseClient()
  try {
    // First test a simple connection
    const { data, error: pingError } = await supabase.from('user_profiles').select('count')
    
    if (pingError) {
      if (pingError.code === 'PGRST116') {
        return { 
          ok: false, 
          error: 'Authentication failed - please check your Supabase anon key'
        }
      }
      if (pingError.code === '42P01') {
        return { 
          ok: false, 
          error: 'Table user_profiles not found - please check your database schema'
        }
      }
      if (pingError.code === '28P01') {
        return {
          ok: false,
          error: 'Invalid database credentials'
        }
      }
      return {
        ok: false,
        error: `Database error (${pingError.code}): ${pingError.message}`
      }
    }

    return { ok: true }
  } catch (error) {
    console.error('Database connection error:', error)
    // Check for network-level errors
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        return {
          ok: false,
          error: 'Network error - unable to reach Supabase. Check your NEXT_PUBLIC_SUPABASE_URL'
        }
      }
      return { 
        ok: false, 
        error: error.message 
      }
    }
    return { 
      ok: false, 
      error: 'Unknown database error - check browser console for details'
    }
  }
} 