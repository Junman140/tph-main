import { NextResponse } from "next/server"

const BIBLE_API_KEY = process.env.BIBLE_API_KEY
const BIBLE_API_URL = "https://api.scripture.api.bible/v1"

// Bible IDs for different translations
const BIBLE_IDS = {
  KJV: "de4e12af7f28f599-01", // King James Version
  NIV: "06125adad2d5898a-01", // New International Version
  ESV: "7142879509583d59-01", // English Standard Version
  NKJV: "40072c4a5aba4022-01", // New King James Version
  NLT: "a5924207b3ffa2b9-01", // New Living Translation
  NASB: "06125adad2d5898a-01", // New American Standard Bible
  CSB: "7142879509583d59-01", // Christian Standard Bible
  MSG: "7142879509583d59-01"  // The Message
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const verseId = searchParams.get("verseId")
    const translation = searchParams.get("translation") || "KJV"

    if (!BIBLE_API_KEY) {
      console.error("Bible API key not configured")
      return NextResponse.json(
        { error: "Bible API key not configured" },
        { status: 500 }
      )
    }

    if (!verseId) {
      return NextResponse.json(
        { error: "Verse ID is required" },
        { status: 400 }
      )
    }

    const bibleId = BIBLE_IDS[translation as keyof typeof BIBLE_IDS]
    if (!bibleId) {
      return NextResponse.json(
        { error: `Translation ${translation} not found` },
        { status: 404 }
      )
    }

    // Format the verse ID according to API.Bible format
    const [book, chapter, verse] = verseId.split(".")
    const formattedVerseId = `${book}.${chapter}.${verse}`

    // Now fetch the verse using the correct Bible ID
    const response = await fetch(
      `${BIBLE_API_URL}/bibles/${bibleId}/verses/${formattedVerseId}?content-type=text&include-notes=false&include-titles=true&include-chapter-numbers=true&include-verse-numbers=true`,
      {
        headers: {
          "api-key": BIBLE_API_KEY,
          "Accept": "application/json"
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      console.error("Bible API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        url: response.url,
        verseId: formattedVerseId
      })
      return NextResponse.json(
        { error: `Failed to fetch verse: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    // Extract just the text from the API response
    return NextResponse.json({
      text: data.data.content,
      reference: data.data.reference
    })
  } catch (error) {
    console.error("Error fetching Bible verse:", error)
    return NextResponse.json(
      { error: "Failed to fetch Bible verse" },
      { status: 500 }
    )
  }
}