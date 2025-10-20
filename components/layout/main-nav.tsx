"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

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
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full w-8 h-8 p-0 flex items-center justify-center bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

export function MainNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
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
            <Image src="/TPH LOGO 2.png" alt="TPH Logo" width={40} height={40} className="h-10 w-auto" />
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
              href="/pastors"
              className={`text-base font-medium transition-colors hover:text-primary ${
                pathname === "/pastors" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Pastors
            </Link>
            <Link
              href="/customize"
              className={`text-base font-medium transition-colors hover:text-primary ${
                pathname === "/blog" ? "text-primary" : "text-foreground/60"
              }`}
            >
              DP
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
            <div className="hidden md:flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/donate">Donate</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="md:hidden"
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
                        <Image src="/TPH LOGO 2.png" alt="TPH Logo" width={40} height={40} className="h-10 w-auto" />
                      </Link>
                      <Button
                        className="bg-transparent p-2"
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
                        href="/prayer"
                        className={`text-lg font-medium hover:text-primary ${
                          pathname === "/prayer" ? "text-primary" : "text-foreground/60"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        Pastors
                      </Link>
                      <Link
                        href="/customize"
                        className={`text-lg font-medium hover:text-primary ${
                          pathname === "/customize" ? "text-primary" : "text-foreground/60"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        dp
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
                    <div className="flex flex-col space-y-3">
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/donate" onClick={() => setIsOpen(false)}>
                          Donate
                        </Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link href="/contact" onClick={() => setIsOpen(false)}>
                          Contact Us
                        </Link>
                      </Button>
                    </div>
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
