'use client';

import { createClient } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import type { Database } from '@/types/supabase';

// Ensure environment variables exist
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}
// Type assertions after guard
const safeSupabaseUrl = supabaseUrl as string;
const safeSupabaseAnonKey = supabaseAnonKey as string;

import type { SupabaseClient } from '@supabase/supabase-js';
type SupabaseContextType = {
  supabaseClient: SupabaseClient<Database, "public", any> | null;
  isAdmin: boolean;
};

const SupabaseContext = createContext<SupabaseContextType>({
  supabaseClient: null,
  isAdmin: false,
});

export function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize with default options that work better with Clerk
  const [supabaseClient] = useState(() => 
    createClient<Database, "public", any>(safeSupabaseUrl, safeSupabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        flowType: 'pkce',
        storage: {
          getItem: (key) => {
            return null; // Don't try to load from storage
          },
          setItem: (key, value) => {},
          removeItem: (key) => {},
        },
      },
    })
  );
  const { getToken, isSignedIn } = useAuth();
  const [isInitialized, setIsInitialized] = useState(true);

  // Get the Clerk user to check for admin status
  const { user } = useUser();
  // Check if user's email is in the admin list
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdmin = userEmail === 'godswillitina@gmail.com' || 
                 userEmail === 'thepeculiarhouseglobal@gmail.com';
                 
  // For debugging
  useEffect(() => {
    if (user) {
      console.log('Current user email:', userEmail);
      console.log('Is admin:', isAdmin);
    }
  }, [user, userEmail, isAdmin]);

  useEffect(() => {
    if (!isInitialized || !supabaseClient) return;

    const setupAuth = async () => {
      if (isSignedIn) {
        try {
          // Get token with the supabase template
          const token = await getToken({ template: 'supabase' });
          
          if (token) {
            // Create a new session object with the token
            const session = {
              access_token: token,
              refresh_token: '', // Not needed with Clerk
              expires_in: 3600, // 1 hour
              expires_at: Math.floor(Date.now() / 1000) + 3600,
              token_type: 'bearer',
              user: null
            };
            
            // Set the session manually to avoid the missing session error
            const { data, error } = await supabaseClient.auth.setSession(session);
            
            if (error) {
              console.error('Error setting Supabase session:', error);
            } else {
              console.log('Supabase auth session set successfully');
              // Log the JWT to debug
              try {
                const jwtPayload = JSON.parse(atob(token.split('.')[1]));
                console.log('JWT payload:', jwtPayload);
              } catch (e) {
                console.error('Failed to parse JWT:', e);
              }
            }
          } else {
            console.error('No token received from Clerk');
          }
        } catch (error) {
          console.error('Failed to set Supabase auth session:', error);
        }
      } else {
        console.log('User not signed in');
      }
    };

    setupAuth();

    // Set up interval to refresh the token periodically
    const intervalId = setInterval(setupAuth, 10 * 60 * 1000); // every 10 minutes

    return () => clearInterval(intervalId);
  }, [getToken, isSignedIn, isInitialized, supabaseClient]);

  return (
    <SupabaseContext.Provider value={{ supabaseClient, isAdmin }}>
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

export const useIsAdmin = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useIsAdmin must be used within a SupabaseProvider');
  }
  return context.isAdmin;
};

// For authenticated operations
export const useAuthenticatedSupabase = () => {
  const supabase = useSupabase();
  const { isSignedIn } = useAuth();
  const isAdmin = useIsAdmin();
  
  // We'll use this to ensure operations only run when authenticated
  const executeAuthenticatedQuery = async <T,>(queryFn: (client: ReturnType<typeof createClient<Database>>) => Promise<T>): Promise<T> => {
    if (!isSignedIn) {
      throw new Error('User must be signed in');
    }
    return queryFn(supabase);
  };
  
  return {
    supabase,
    executeAuthenticatedQuery,
    isSignedIn,
    isAdmin
  };
};

// For compatibility with existing code
export const useSupabaseWithAuth = () => {
  const supabase = useSupabase();
  return {
    supabase,
    isAuthReady: true // Always return true for compatibility
  };
};