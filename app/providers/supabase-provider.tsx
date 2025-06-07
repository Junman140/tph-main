'use client';

import { createClient } from '@supabase/supabase-js';
import { createContext, useContext, useState } from 'react';
import type { Database } from '@/types/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

// Ensure environment variables exist
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}
// Type assertions after guard
const safeSupabaseUrl = supabaseUrl as string;
const safeSupabaseAnonKey = supabaseAnonKey as string;

type SupabaseContextType = {
  supabaseClient: SupabaseClient<Database, "public", any> | null;
};

const SupabaseContext = createContext<SupabaseContextType>({
  supabaseClient: null,
});

export function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize Supabase client with anonymous access only
  const [supabaseClient] = useState(() => 
    createClient<Database, "public", any>(safeSupabaseUrl, safeSupabaseAnonKey)
  );
  return (
    <SupabaseContext.Provider value={{ supabaseClient }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  if (!context.supabaseClient) {
    throw new Error('Supabase client not initialized');
  }
  return context.supabaseClient;
};

// For compatibility with existing code
export const useSupabaseWithAuth = () => {
  const supabase = useSupabase();
  return {
    supabase,
    isAuthReady: true // Always return true for compatibility
  };
};

// For compatibility with existing code - no auth functionality
export const useAuthenticatedSupabase = () => {
  const supabase = useSupabase();
  
  return {
    supabase,
    isSignedIn: false,
    userId: null,
    isAdmin: false
  };
};