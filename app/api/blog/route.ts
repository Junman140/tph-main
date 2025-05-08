import { auth, currentUser } from "@clerk/nextjs"
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    // Get authentication information from Clerk
    const { userId } = await auth()
    if (!userId) {
      console.log('Unauthorized: No user ID found in Clerk auth')
      return new NextResponse("Unauthorized: You must be signed in", { status: 401 })
    }
    
    // Get user information from Clerk to check admin status
    const user = await currentUser()
    
    if (!user) {
      console.log('Unable to get user details from Clerk')
      return new NextResponse("Unauthorized: Unable to verify user", { status: 401 })
    }
    
    // Check if user is an admin
    const userEmail = user.emailAddresses[0]?.emailAddress
    const isAdmin = userEmail === 'godswillitina@gmail.com' || 
                   userEmail === 'thepeculiarhouseglobal@gmail.com'
    
    if (!isAdmin) {
      console.log(`User ${userEmail} is not an admin`)
      return new NextResponse("Forbidden: Admin access required", { status: 403 })
    }

    const body = await req.json()
    const { title, slug, content, description, tags, reading_time, isDraft } = body

    // Convert comma-separated tags string to array if it's a string
    const tagsArray = typeof tags === 'string' 
      ? tags.split(",").map((tag: string) => tag.trim()).filter(Boolean)
      : tags

    console.log('Creating blog post with data:', {
      title,
      slug,
      content,
      description,
      tags: tagsArray,
      userId,
      reading_time
    })

    // Create a service role client to bypass RLS
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!serviceRoleKey) {
      console.error('SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables')
      return new NextResponse("Server configuration error", { status: 500 })
    }
    
    // Create admin client with service role key
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    )
    console.log('Using service role client to bypass RLS')

    const { data, error } = await adminSupabase
      .from("blog_posts")
      .insert([
        {
          title,
          slug,
          content,
          description,
          tags: tagsArray,
          date: new Date().toISOString(),
          reading_time: reading_time || 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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