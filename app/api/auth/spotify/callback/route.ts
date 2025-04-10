import { NextResponse } from 'next/server'

const BASE_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export async function GET(request: Request) {
  // Handle Spotify OAuth callback
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (state === null) {
    return NextResponse.redirect(`${BASE_URL}/login?error=state_mismatch`)
  }

  if (code) {
    // Here you would exchange the code for an access token
    // For now, we'll just redirect to a success page
    return NextResponse.redirect(`${BASE_URL}/auth/spotify/success`)
  }

  return NextResponse.redirect(`${BASE_URL}/login?error=invalid_code`)
} 