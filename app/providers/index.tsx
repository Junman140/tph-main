"use client";

import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SupabaseProvider } from "./supabase-provider";
import { AuthErrorFallback } from "@/components/auth/auth-error-fallback";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [clerkError, setClerkError] = useState(false);

  // Handle Clerk errors
  useEffect(() => {
    const handleClerkError = (event: ErrorEvent) => {
      // Check if the error is from Clerk
      if (event.message?.includes('ClerkJS') || 
          (event.error?.stack && event.error.stack.includes('clerk'))) {
        console.warn('Clerk authentication error detected:', event.message);
        setClerkError(true);
      }
    };

    // Listen for errors
    window.addEventListener('error', handleClerkError);
    
    return () => {
      window.removeEventListener('error', handleClerkError);
    };
  }, []);

  return (
<<<<<<< HEAD
    <QueryClientProvider client={queryClient}>
      <SupabaseProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </SupabaseProvider>
    </QueryClientProvider>
=======
    <ClerkProvider
      afterSignInUrl="/"
      afterSignUpUrl="/"
      appearance={{
        elements: {
          // Add some basic fallback styling
          rootBox: clerkError ? 'opacity-50' : undefined,
        }
      }}
    >
      <QueryClientProvider client={queryClient}>
        <SupabaseProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="bottom-right" />
            {clerkError && <AuthErrorFallback />}
          </ThemeProvider>
        </SupabaseProvider>
      </QueryClientProvider>
    </ClerkProvider>
>>>>>>> 1cf74a4c204a145ed64b21e282601a5d5b79fa19
  );
}