import { NextResponse } from 'next/server'

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'
// Get your show ID from your Spotify podcast URL
// Example: https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk
// The ID would be: 4rOoJ6Egrf8K2IrywzwOMk
const SPOTIFY_SHOW_ID = process.env.SPOTIFY_SHOW_ID
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

async function getAccessToken() {
  console.log('Checking Spotify credentials:', {
    hasClientId: !!SPOTIFY_CLIENT_ID,
    hasClientSecret: !!SPOTIFY_CLIENT_SECRET
  })

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error('Missing Spotify credentials')
  }

  const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials'
    })
  })

  console.log('Token request status:', response.status)

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Token request error:', errorText)
    throw new Error('Failed to get Spotify access token')
  }

  const data = await response.json()
  return data.access_token
}

export async function GET() {
  try {
    if (!SPOTIFY_SHOW_ID) {
      throw new Error('Spotify show ID is not configured')
    }

    const accessToken = await getAccessToken()
    console.log('Got access token:', accessToken ? 'Yes' : 'No')
    
    // Get the show episodes
    const response = await fetch(
      `${SPOTIFY_API_BASE}/shows/${SPOTIFY_SHOW_ID}/episodes?market=US&limit=3`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
          revalidate: 3600 // Cache for 1 hour
        }
      }
    )

    console.log('Spotify API Response Status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Spotify API Error Response:', errorText)
      throw new Error(`Failed to fetch Spotify episodes: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Successfully fetched episodes:', data.items?.length || 0)
    
    // Transform the data to match our frontend expectations
    const transformedEpisodes = data.items.map(episode => ({
      id: episode.id,
      title: episode.name,
      description: episode.description,
      date: episode.release_date,
      duration: episode.duration_ms,
      imageUrl: episode.images[0]?.url,
      audioUrl: episode.external_urls.spotify
    }))

    return NextResponse.json(transformedEpisodes)
  } catch (error) {
    console.error("[SPOTIFY_API_ERROR]", error)
    // Return empty array instead of error to prevent UI from showing error state
    return NextResponse.json([])
  }
} 