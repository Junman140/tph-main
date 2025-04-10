"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { dark, light } from "@clerk/themes"

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
      variant="ghost"
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
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative h-10 w-auto">
                <Image src="/TPH LOGO 2.png" alt="TPH Global" width={40} height={20} priority />
              </div>
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <NavLink href="/sermons" active={isActive("/sermons")}>
                Sermons
              </NavLink>
              <NavLink href="/events" active={isActive("/events")}>
                Events
              </NavLink>
              <NavLink href="/gallery" active={isActive("/gallery")}>
                Gallery
              </NavLink>
              <NavLink href="/prayer" active={isActive("/prayer")}>
                Prayer
              </NavLink>
              <NavLink href="/about" active={isActive("/about")}>
                About Us
              </NavLink>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />

              <SignedIn>
                <Button variant="outline" className="border-primary/20 text-primary">
                  Donate
                </Button>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    baseTheme: mounted ? (theme === "dark" ? "dark" as any : "light" as any) : "light" as any,
                    elements: {
                      avatarBox: "h-10 w-10",
                    }
                  }}
                />
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline">Sign In</Button>
                </SignInButton>
                <SignInButton mode="modal">
                  <Button>Join Us</Button>
                </SignInButton>
              </SignedOut>
            </div>

            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex-grow py-8">
                    <div className="flex flex-col space-y-6">
                      <ThemeToggle />
                      <MobileNavLink href="/sermons" onClick={() => setIsOpen(false)}>
                        Sermons
                      </MobileNavLink>
                      <MobileNavLink href="/events" onClick={() => setIsOpen(false)}>
                        Events
                      </MobileNavLink>
                      <MobileNavLink href="/gallery" onClick={() => setIsOpen(false)}>
                        Gallery
                      </MobileNavLink>
                      <MobileNavLink href="/prayer" onClick={() => setIsOpen(false)}>
                        Prayer
                      </MobileNavLink>
                      <MobileNavLink href="/about" onClick={() => setIsOpen(false)}>
                        About Us
                      </MobileNavLink>
                    </div>
                  </div>

                  <div className="border-t py-6">
                    <SignedIn>
                      <div className="space-y-4">
                        <UserButton
                          afterSignOutUrl="/"
                          appearance={{
                            baseTheme: mounted ? (theme === "dark" ? "dark" as any : "light" as any) : "light" as any,
                            elements: {
                              avatarBox: "h-10 w-10",
                            }
                          }}
                        />
                      </div>
                    </SignedIn>

                    <SignedOut>
                      <div className="flex flex-col space-y-3">
                        <SignInButton mode="modal">
                          <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                            Sign In
                          </Button>
                        </SignInButton>
                        <SignInButton mode="modal">
                          <Button className="w-full" onClick={() => setIsOpen(false)}>
                            Join Us
                          </Button>
                        </SignInButton>
                      </div>
                    </SignedOut>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className="relative group">
      <span
        className={`text-sm font-medium transition-colors ${
          active ? "text-primary" : "text-foreground/70 hover:text-foreground"
        }`}
      >
        {children}
      </span>
      {active && (
        <motion.span
          layoutId="activeIndicator"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Link>
  )
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string
  children: React.ReactNode
  onClick?: () => void
}) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`block px-2 py-1 text-lg font-medium transition-colors ${
        isActive ? "text-primary" : "text-foreground/70 hover:text-foreground"
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

