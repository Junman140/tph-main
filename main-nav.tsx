"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

export function MainNav() {
  const { user, logoutMutation } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

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

  const isActive = (path: string) => pathname === path

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <span className="text-xl font-bold text-primary">TPH Global</span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <NavLink href="/sermons" active={isActive("/sermons")}>
                Sermons
              </NavLink>
              <NavLink href="/events" active={isActive("/events")}>
                Events
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
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
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
                <Button variant="outline" className="border-primary/20 text-primary">
                  Donate
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        {user.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="p-2 border-b">
                      <p className="font-medium">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground">{user.username}</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <a className="cursor-pointer w-full">Profile</a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <a className="cursor-pointer w-full">Settings</a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => logoutMutation.mutate()}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
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
                <Link href="/auth">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/auth?tab=register">
                  <Button>Join Us</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-4">
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
                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="text-lg font-medium hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <MobileNavLink href="/sermons" onClick={() => setIsOpen(false)}>
                        Sermons
                      </MobileNavLink>
                      <MobileNavLink href="/events" onClick={() => setIsOpen(false)}>
                        Events
                      </MobileNavLink>
                      <MobileNavLink href="/prayer" onClick={() => setIsOpen(false)}>
                        Prayer
                      </MobileNavLink>
                      <MobileNavLink href="/about" onClick={() => setIsOpen(false)}>
                        About Us
                      </MobileNavLink>
                    </>
                  ) : (
                    <div className="flex flex-col space-y-3">
                      <Link href="/auth">
                        <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth?tab=register">
                        <Button className="w-full" onClick={() => setIsOpen(false)}>
                          Join Us
                        </Button>
                      </Link>
                    </div>
                  )}
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
    <Link href={href}>
      <a className="relative group">
        <span
          className={`text-sm font-medium transition-colors ${active ? "text-primary" : "text-foreground/70 hover:text-foreground"}`}
        >
          {children}
        </span>
        {active && (
          <motion.span
            layoutId="activeIndicator"
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
        {!active && (
          <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
        )}
      </a>
    </Link>
  )
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <a className="text-xl font-medium px-2 py-2 hover:text-primary transition-colors" onClick={onClick}>
        {children}
      </a>
    </Link>
  )
}

