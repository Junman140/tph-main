"use client"

import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import { ClerkProvider } from "@clerk/nextjs"
import { ConvexProvider, ConvexReactClient } from "convex/react"

import "./globals.css"
import { Footer } from "@/components/layout/footer"
import { MainNav } from "@/components/layout/main-nav"

const inter = Inter({ subsets: ["latin"] })

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexProvider client={convex}>
          <ClerkProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <MainNav />
              {children}
              <Footer />
              <Toaster position="bottom-right" />
            </ThemeProvider>
          </ClerkProvider>
        </ConvexProvider>
      </body>
    </html>
  )
}