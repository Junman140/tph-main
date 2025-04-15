import { auth } from "@clerk/nextjs"
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { title, slug, content, tags, isDraft } = body

    // Convert comma-separated tags string to array
    const tagsArray = tags.split(",").map((tag: string) => tag.trim()).filter(Boolean)

    const { data, error } = await supabase
      .from("blog_posts")
      .insert([
        {
          title,
          slug,
          content,
          tags: tagsArray,
          author_id: userId,
          published_at: isDraft ? null : new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      console.error(error)
      return new NextResponse("Database Error", { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const isDraft = searchParams.get("isDraft") === "true"

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("published_at", isDraft ? null : "not.is.null")

    if (error) {
      console.error(error)
      return new NextResponse("Database Error", { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 