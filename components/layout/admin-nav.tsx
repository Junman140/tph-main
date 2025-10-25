"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Menu, X, LogOut, Home, Calendar, Image as ImageIcon, Users, ClipboardList, FileText } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function AdminNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin')
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  const adminNavItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/events", label: "Events", icon: Calendar },
    { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
    { href: "/admin/pastors", label: "Pastors", icon: Users },
    { href: "/admin/attendance", label: "Attendance", icon: ClipboardList },
    { href: "/blog/admin", label: "Blog", icon: FileText },
  ]

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
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #e5e7eb',
          height: '4rem'
        }}
      >
        <nav style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', height: '4rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/admin/dashboard" style={{ display: 'flex', alignItems: 'center' }}>
              <Image src="/TPH LOGO 2.png" alt="TPH Logo" width={40} height={40} style={{ height: '2.5rem', width: 'auto' }} />
              <span style={{ marginLeft: '0.75rem', fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
                Admin Panel
              </span>
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
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: isScrolled ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
      }}
    >
      <nav style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', height: '4rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/admin/dashboard" style={{ display: 'flex', alignItems: 'center' }}>
            <Image src="/TPH LOGO 2.png" alt="TPH Logo" width={40} height={40} style={{ height: '2.5rem', width: 'auto' }} />
            <span style={{ marginLeft: '0.75rem', fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
              Admin Panel
            </span>
          </Link>
          
          {/* Center navigation items */}
          <div style={{ display: 'none', gap: '1.5rem', justifyContent: 'center', flex: 1 }} className="md:flex">
            {adminNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: isActive ? '#1f2937' : '#6b7280',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.375rem',
                    backgroundColor: isActive ? '#f3f4f6' : 'transparent'
                  }}
                >
                  <Icon style={{ height: '1rem', width: '1rem' }} />
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="md:flex">
              <ThemeToggle />
              <Button asChild variant="ghost" size="sm">
                <Link href="/">View Site</Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <LogOut style={{ height: '1rem', width: '1rem' }} />
                Logout
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
                  <SheetTitle className="sr-only">Admin Navigation Menu</SheetTitle>
                </SheetHeader>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                      <Link href="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setIsOpen(false)}>
                        <Image src="/TPH LOGO 2.png" alt="TPH Logo" width={40} height={40} style={{ height: '2.5rem', width: 'auto' }} />
                        <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                          Admin Panel
                        </span>
                      </Link>
                      <Button
                        style={{ backgroundColor: 'transparent', padding: '0.5rem' }}
                        onClick={() => setIsOpen(false)}
                      >
                        <X style={{ height: '1.5rem', width: '1.5rem' }} />
                      </Button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {adminNavItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              fontSize: '1rem',
                              fontWeight: '500',
                              color: isActive ? '#1f2937' : '#6b7280',
                              textDecoration: 'none',
                              padding: '0.75rem 1rem',
                              borderRadius: '0.5rem',
                              backgroundColor: isActive ? '#f3f4f6' : 'transparent',
                              transition: 'all 0.2s'
                            }}
                            onClick={() => setIsOpen(false)}
                          >
                            <Icon style={{ height: '1.25rem', width: '1.25rem' }} />
                            {item.label}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid #e5e7eb', padding: '1.5rem 1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                        <ThemeToggle />
                      </div>
                      <Button asChild variant="outline" style={{ width: '100%' }}>
                        <Link href="/" onClick={() => setIsOpen(false)}>
                          View Site
                        </Link>
                      </Button>
                      <Button 
                        variant="destructive" 
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        onClick={() => {
                          handleLogout()
                          setIsOpen(false)
                        }}
                      >
                        <LogOut style={{ height: '1rem', width: '1rem' }} />
                        Logout
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
