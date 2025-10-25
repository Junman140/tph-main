"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function MainNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: 'transparent',
          height: '4rem'
        }}
      >
        <nav style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', height: '4rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
              <Image src="/TPH LOGO 2.png" alt="TPH Logo" width={40} height={40} style={{ height: '2.5rem', width: 'auto' }} />
            </Link>
          </div>
        </nav>
      </header>
    )
  }

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s',
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(8px)' : 'none',
        boxShadow: isScrolled ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
      }}
    >
      <nav style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', height: '4rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <Image src="/TPH LOGO 2.png" alt="TPH Logo" width={40} height={40} style={{ height: '2.5rem', width: 'auto' }} />
          </Link>
          
          {/* Center navigation items */}
          <div style={{ display: 'none', gap: '2rem', justifyContent: 'center', flex: 1 }} className="md:flex">
            <Link
              href="/sermons"
              style={{
                fontSize: '1rem',
                fontWeight: '500',
                color: pathname === "/sermons" ? '#000000' : '#666666',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
            >
              Sermons
            </Link>
            <Link
              href="/events"
              style={{
                fontSize: '1rem',
                fontWeight: '500',
                color: pathname === "/events" ? '#000000' : '#666666',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
            >
              Events
            </Link>
            <Link
              href="/gallery"
              style={{
                fontSize: '1rem',
                fontWeight: '500',
                color: pathname === "/gallery" ? '#000000' : '#666666',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
            >
              Gallery
            </Link>
            <Link
              href="/pastors"
              style={{
                fontSize: '1rem',
                fontWeight: '500',
                color: pathname === "/pastors" ? '#000000' : '#666666',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
            >
              Pastors
            </Link>
            <Link
              href="/customize"
              style={{
                fontSize: '1rem',
                fontWeight: '500',
                color: pathname === "/blog" ? '#000000' : '#666666',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
            >
              DP
            </Link>
            <Link
              href="/about"
              style={{
                fontSize: '1rem',
                fontWeight: '500',
                color: pathname === "/about" ? '#000000' : '#666666',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
            >
              About Us
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="md:flex">
              <ThemeToggle />
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
                  style={{ display: 'block' }}
                  className="md:hidden"
                >
                  <Menu style={{ height: '1.5rem', width: '1.5rem' }} />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" style={{ width: '300px' }} className="sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                </SheetHeader>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setIsOpen(false)}>
                        <Image src="/TPH LOGO 2.png" alt="TPH Logo" width={40} height={40} style={{ height: '2.5rem', width: 'auto' }} />
                      </Link>
                      <Button
                        style={{ backgroundColor: 'transparent', padding: '0.5rem' }}
                        onClick={() => setIsOpen(false)}
                      >
                        <X style={{ height: '1.5rem', width: '1.5rem' }} />
                      </Button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <Link
                        href="/sermons"
                        style={{
                          fontSize: '1.125rem',
                          fontWeight: '500',
                          color: pathname === "/sermons" ? '#000000' : '#666666',
                          textDecoration: 'none'
                        }}
                        onClick={() => setIsOpen(false)}
                      >
                        Sermons
                      </Link>
                      <Link
                        href="/events"
                        style={{
                          fontSize: '1.125rem',
                          fontWeight: '500',
                          color: pathname === "/events" ? '#000000' : '#666666',
                          textDecoration: 'none'
                        }}
                        onClick={() => setIsOpen(false)}
                      >
                        Events
                      </Link>
                      <Link
                        href="/gallery"
                        style={{
                          fontSize: '1.125rem',
                          fontWeight: '500',
                          color: pathname === "/gallery" ? '#000000' : '#666666',
                          textDecoration: 'none'
                        }}
                        onClick={() => setIsOpen(false)}
                      >
                        Gallery
                      </Link>
                      <Link
                        href="/pastors"
                        style={{
                          fontSize: '1.125rem',
                          fontWeight: '500',
                          color: pathname === "/pastors" ? '#000000' : '#666666',
                          textDecoration: 'none'
                        }}
                        onClick={() => setIsOpen(false)}
                      >
                        Pastors
                      </Link>
                      <Link
                        href="/customize"
                        style={{
                          fontSize: '1.125rem',
                          fontWeight: '500',
                          color: pathname === "/customize" ? '#000000' : '#666666',
                          textDecoration: 'none'
                        }}
                        onClick={() => setIsOpen(false)}
                      >
                        DP
                      </Link>
                      <Link
                        href="/about"
                        style={{
                          fontSize: '1.125rem',
                          fontWeight: '500',
                          color: pathname === "/about" ? '#000000' : '#666666',
                          textDecoration: 'none'
                        }}
                        onClick={() => setIsOpen(false)}
                      >
                        About Us
                      </Link>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid #e5e7eb', padding: '1.5rem 1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                        <ThemeToggle />
                      </div>
                      <Button asChild variant="outline" style={{ width: '100%' }}>
                        <Link href="/donate" onClick={() => setIsOpen(false)}>
                          Donate
                        </Link>
                      </Button>
                      <Button asChild style={{ width: '100%' }}>
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
