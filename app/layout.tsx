'use client';

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/layout/main-nav"
import { Footer } from "@/components/layout/footer"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "@/hooks/use-auth"
import { ClerkProvider } from '@clerk/nextjs'
import { dark, neobrutalism } from '@clerk/themes'

const inter = Inter({ subsets: ["latin"] })

const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: [dark, neobrutalism],
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <MainNav />
                {children}
                <Footer />
              </AuthProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}