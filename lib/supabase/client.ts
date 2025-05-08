import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          created_at: string
          title: string
          content: string
          author_id: string
          published: boolean
          slug: string
          excerpt: string
          tags: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          content: string
          author_id: string
          published?: boolean
          slug: string
          excerpt: string
          tags?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          content?: string
          author_id?: string
          published?: boolean
          slug?: string
          excerpt?: string
          tags?: string[]
        }
      },
      event_registrations: {
        Row: {
          id: string
          created_at: string
          event_id: string
          user_id: string | null
          full_name: string
          email: string
          phone_number: string
          location: string
          notes: string | null
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          event_id: string
          user_id?: string | null
          full_name: string
          email: string
          phone_number: string
          location: string
          notes?: string | null
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          event_id?: string
          user_id?: string | null
          full_name?: string
          email?: string
          phone_number?: string
          location?: string
          notes?: string | null
          status?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 