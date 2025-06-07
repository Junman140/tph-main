'use client';

import { createClient } from '@supabase/supabase-js';
import { createContext, useContext, useState } from 'react';
import type { Database } from '@/types/supabase';

// Ensure environment variables exist
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a Supabase client constructor with our custom types
const createSupabaseClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
};

// Create context with our client type
const SupabaseContext = createContext<ReturnType<typeof createSupabaseClient> | undefined>(undefined);

export function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createSupabaseClient());

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