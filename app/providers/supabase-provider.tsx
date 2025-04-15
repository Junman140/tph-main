'use client';

import { createClient } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import type { Database } from '@/types/supabase';

// Ensure environment variables exist
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a Supabase client constructor with our custom types
const createSupabaseClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
};

// Create context with our client type
const SupabaseContext = createContext<ReturnType<typeof createSupabaseClient> | undefined>(undefined);

export function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken } = useAuth();
  const [supabase] = useState(() => createSupabaseClient());

  useEffect(() => {
    const updateSupabaseAuth = async () => {
      try {
        const token = await getToken({ template: 'supabase' });
        if (token) {
          supabase.auth.setSession({
            access_token: token,
            refresh_token: '',
          });
        }
      } catch (error) {
        console.error('Error setting Supabase auth:', error);
      }
    };

    updateSupabaseAuth();
  }, [getToken, supabase]);

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}; 