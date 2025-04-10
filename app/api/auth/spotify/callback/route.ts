import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Handle Spotify OAuth callback
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (state === null) {
    return NextResponse.redirect('https://tph-main.vercel.app/login?error=state_mismatch')
  }

  if (code) {
    // Here you would exchange the code for an access token
    // For now, we'll just redirect to a success page
    return NextResponse.redirect('https://tph-main.vercel.app/auth/spotify/success')
  }

  return NextResponse.redirect('https://tph-main.vercel.app/login?error=invalid_code')
} 