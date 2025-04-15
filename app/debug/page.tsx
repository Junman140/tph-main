"use client"

import { useEffect, useState } from 'react'
import { checkDatabaseConnection } from '@/lib/supabase-client'
import { Card } from '@/components/ui/card'

export default function DebugPage() {
  const [dbStatus, setDbStatus] = useState<{ok: boolean, error?: string}>()
  const [envVars, setEnvVars] = useState<{[key: string]: boolean}>({})

  useEffect(() => {
    // Check environment variables
    setEnvVars({
      'NEXT_PUBLIC_SUPABASE_URL': !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      'NEXT_PUBLIC_SUPABASE_ANON_KEY': !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY': !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    })

    // Check database connection
    checkDatabaseConnection().then(setDbStatus)
  }, [])

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">System Debug</h1>
      
      <div className="space-y-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
          <ul className="space-y-2">
            {Object.entries(envVars).map(([key, exists]) => (
              <li key={key} className="flex items-center">
                <span className={exists ? "text-green-500" : "text-red-500"}>
                  {exists ? "✓" : "✗"}
                </span>
                <span className="ml-2">{key}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Database Connection</h2>
          {dbStatus ? (
            <div>
              <p className={dbStatus.ok ? "text-green-500" : "text-red-500"}>
                {dbStatus.ok ? "Connected successfully" : "Connection failed"}
              </p>
              {dbStatus.error && (
                <p className="text-sm text-red-500 mt-2">{dbStatus.error}</p>
              )}
            </div>
          ) : (
            <p>Checking connection...</p>
          )}
        </Card>
      </div>
    </div>
  )
} 