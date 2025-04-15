"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { SignIn, SignUp, UserButton, SignedIn, SignedOut } from "@clerk/nextjs"

// Separate theme toggle component
function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-8 h-8" /> // Placeholder with same dimensions
  }

  return (
    <Button
      type="button"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full w-8 h-8"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export function MainNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-sm shadow-sm" : ""
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/TPH LOGO 2.png" alt="TPH Logo" className="h-10 w-auto" />
          </Link>
          
          {/* Center navigation items */}
          <div className="hidden md:flex flex-1 justify-center space-x-8">
            <Link
              href="/sermons"
              className={`text-base font-medium transition-colors hover:text-primary ${
                pathname === "/sermons" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Sermons
            </Link>
            <Link
              href="/events"
              className={`text-base font-medium transition-colors hover:text-primary ${
                pathname === "/events" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Events
            </Link>
            <Link
              href="/gallery"
              className={`text-base font-medium transition-colors hover:text-primary ${
                pathname === "/gallery" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Gallery
            </Link>
            <Link
              href="/bible"
              className={`text-base font-medium transition-colors hover:text-primary ${
                pathname === "/bible" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Bible
            </Link>
            <Link
              href="/prayer"
              className={`text-base font-medium transition-colors hover:text-primary ${
                pathname === "/prayer" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Prayer
            </Link>
            <Link
              href="/blog"
              className={`text-base font-medium transition-colors hover:text-primary ${
                pathname === "/blog" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Blog
            </Link>
            <Link
              href="/about"
              className={`text-base font-medium transition-colors hover:text-primary ${
                pathname === "/about" ? "text-primary" : "text-foreground/60"
              }`}
            >
              About Us
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </SignedIn>
            <SignedOut>
              <Button asChild variant="ghost" className="hidden md:inline-flex">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild className="hidden md:inline-flex">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </SignedOut>

            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="md:hidden"
                  size="icon"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto py-6 px-4">
                    <div className="flex items-center justify-between mb-8">
                      <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                        <img src="/TPH LOGO 2.png" alt="TPH Logo" className="h-10 w-auto" />
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(false)}
                      >
                        <X className="h-6 w-6" />
                      </Button>
                    </div>
                    <div className="flex flex-col space-y-6">
                      <Link
                        href="/sermons"
                        className={`text-lg font-medium hover:text-primary ${
                          pathname === "/sermons" ? "text-primary" : "text-foreground/60"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        Sermons
                      </Link>
                      <Link
                        href="/events"
                        className={`text-lg font-medium hover:text-primary ${
                          pathname === "/events" ? "text-primary" : "text-foreground/60"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        Events
                      </Link>
                      <Link
                        href="/gallery"
                        className={`text-lg font-medium hover:text-primary ${
                          pathname === "/gallery" ? "text-primary" : "text-foreground/60"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        Gallery
                      </Link>
                      <Link
                        href="/bible"
                        className={`text-lg font-medium hover:text-primary ${
                          pathname === "/bible" ? "text-primary" : "text-foreground/60"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        Bible
                      </Link>
                      <Link
                        href="/prayer"
                        className={`text-lg font-medium hover:text-primary ${
                          pathname === "/prayer" ? "text-primary" : "text-foreground/60"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        Prayer
                      </Link>
                      <Link
                        href="/blog"
                        className={`text-lg font-medium hover:text-primary ${
                          pathname === "/blog" ? "text-primary" : "text-foreground/60"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        Blog
                      </Link>
                      <Link
                        href="/about"
                        className={`text-lg font-medium hover:text-primary ${
                          pathname === "/about" ? "text-primary" : "text-foreground/60"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        About Us
                      </Link>
                    </div>
                  </div>
                  <div className="border-t border-border px-4 py-6">
                    <SignedIn>
                      <div className="flex items-center space-x-4">
                        <UserButton />
                        <span className="text-sm font-medium">Account</span>
                      </div>
                    </SignedIn>
                    <SignedOut>
                      <div className="flex flex-col space-y-3">
                        <Button asChild variant="outline" className="w-full">
                          <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                            Sign In
                          </Link>
                        </Button>
                        <Button asChild className="w-full">
                          <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                            Sign Up
                          </Link>
                        </Button>
                      </div>
                    </SignedOut>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  )
}
