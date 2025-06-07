<<<<<<< HEAD
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
=======
import { auth, currentUser } from "@clerk/nextjs"
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
>>>>>>> 1cf74a4c204a145ed64b21e282601a5d5b79fa19

export async function POST(request: Request) {
  try {
<<<<<<< HEAD
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, content, published, slug, excerpt, tags } = await request.json();

    // Validate required fields
    if (!title || !content || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert the post
    const { data, error } = await supabase
      .from('posts')
=======
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
>>>>>>> 1cf74a4c204a145ed64b21e282601a5d5b79fa19
      .insert([
        {
          title,
          content,
<<<<<<< HEAD
          published: published || false,
          slug,
          excerpt,
          tags: tags || [],
          author_id: session.user.id
=======
          description,
          tags: tagsArray,
          date: new Date().toISOString(),
          reading_time: reading_time || 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          author_id: userId,
          published_at: isDraft ? null : new Date().toISOString()
>>>>>>> 1cf74a4c204a145ed64b21e282601a5d5b79fa19
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in POST /api/blog:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    // If user is not authenticated, only show published posts
    if (!session) {
      query = query.eq('published', true);
    } else {
      // If user is authenticated, show their unpublished posts too
      query = query.or(`published.eq.true,author_id.eq.${session.user.id}`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/blog:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 