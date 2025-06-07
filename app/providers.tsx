"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { SupabaseProvider } from "./providers/supabase-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  // Create a new supabase client for the browser
  const supabase = createClientComponentClient()
  
  // Create a new React Query client
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  }))

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <SupabaseProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster />
          </ThemeProvider>
        </QueryClientProvider>
      </SupabaseProvider>
    </SessionContextProvider>
  )
}
