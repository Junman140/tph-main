import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
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
      .insert([
        {
          title,
          content,
          published: published || false,
          slug,
          excerpt,
          tags: tags || [],
          author_id: session.user.id
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