export type Database = {
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
          excerpt: string | null
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
          excerpt?: string | null
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
          excerpt?: string | null
          tags?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "user_mappings"
            referencedColumns: ["id"]
          }
        ]
      },
      events: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          start_time: string
          end_time: string | null
          location: string | null
          status: 'upcoming' | 'past' | 'cancelled'
          max_attendees: number | null
          organizer_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          start_time: string
          end_time?: string | null
          location?: string | null
          status?: 'upcoming' | 'past' | 'cancelled'
          max_attendees?: number | null
          organizer_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string | null
          location?: string | null
          status?: 'upcoming' | 'past' | 'cancelled'
          max_attendees?: number | null
          organizer_id?: string | null
        }
      }
      prayers: {
        Row: {
          id: string
          created_at: string
          user_id: string
          title: string
          content: string
          category: string
          is_private: boolean
          status: 'pending' | 'answered'
          answered_at: string | null
          tags: string[]
          prayer_count: number
          supporting_verses: string[]
          verse_reference: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          title: string
          content: string
          category: string
          is_private?: boolean
          status?: 'pending' | 'answered'
          answered_at?: string | null
          tags?: string[]
          prayer_count?: number
          supporting_verses?: string[]
          verse_reference?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          title?: string
          content?: string
          category?: string
          is_private?: boolean
          status?: 'pending' | 'answered'
          answered_at?: string | null
          tags?: string[]
          prayer_count?: number
          supporting_verses?: string[]
          verse_reference?: string | null
        }
      }
      prayer_support: {
        Row: {
          id: string
          created_at: string
          user_id: string
          prayer_id: string
          commitment: 'once' | 'daily' | 'weekly'
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          prayer_id: string
          commitment?: 'once' | 'daily' | 'weekly'
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          prayer_id?: string
          commitment?: 'once' | 'daily' | 'weekly'
        }
      }
      testimonies: {
        Row: {
          id: string
          created_at: string
          user_id: string
          prayer_id: string
          title: string
          content: string
          is_anonymous: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          prayer_id: string
          title: string
          content: string
          is_anonymous?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          prayer_id?: string
          title?: string
          content?: string
          is_anonymous?: boolean
        }
      }

    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_prayer_count: {
        Args: { prayer_id_param: string }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
} 