"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Only run client-side logic after component is mounted
    if (typeof window !== 'undefined') {
      const adminData = localStorage.getItem('admin')
      const adminToken = localStorage.getItem('adminToken')

      if (!adminData || !adminToken) {
        router.push('/admin/login')
      } else {
        router.push('/admin/dashboard')
      }
    }
  }, [router])

  // Don't render anything until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  )
}
