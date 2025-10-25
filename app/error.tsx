"use client"

import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Suppress ESLint warnings for unused parameters
  console.log('Error occurred:', error?.message)
  console.log('Reset function available:', typeof reset === 'function')
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#ffffff'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#000000'
        }}>
          Something went wrong
        </h1>
        <p style={{
          color: '#666666',
          marginBottom: '2rem',
          fontSize: '1rem'
        }}>
          An unexpected error occurred. Please try again.
        </p>
        <Link
          href="/"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#000000',
            color: '#ffffff',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}
