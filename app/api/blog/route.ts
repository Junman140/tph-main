// import { cookies } from 'next/headers';
// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//   try {
//     const supabase = createRouteHandlerClient({ cookies });
    
//     // Parse request body
//     const { title, content, description, slug, tags, reading_time, isDraft } = await request.json();

//     // Convert comma-separated tags string to array if it's a string
//     const tagsArray = typeof tags === 'string' 
//       ? tags.split(",").map((tag: string) => tag.trim()).filter(Boolean)
//       : tags || [];

//     // Validate required fields
//     if (!title || !content || !slug) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       );
//     }

//     console.log('Creating blog post with data:', {
//       title,
//       slug,
//       content,
//       description,
//       tags: tagsArray,
//       reading_time
//     });

//     // Insert the post - use anonymous author_id for now
//     const { data, error } = await supabase
//       .from('posts')
//       .insert([
//         {
//           title,
//           content,
//           published: !isDraft,
//           slug,
//           excerpt: description, // Use description as excerpt for compatibility
//           tags: tagsArray,
//           author_id: '00000000-0000-0000-0000-000000000000', // Anonymous author ID
//           created_at: new Date().toISOString()
//         }
//       ])
//       .select()
//       .single();

//     if (error) {
//       console.error('Error creating post:', error);
//       return NextResponse.json(
//         { error: 'Failed to create post' },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Error in POST /api/blog:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(request: Request) {
//   try {
//     const supabase = createRouteHandlerClient({ cookies });
    
//     // Get the current session
//     const { data: { session } } = await supabase.getSession();
    
//     let query = supabase
//       .from('posts')
//       .select('*')
//       .order('created_at', { ascending: false });

//     // If user is not authenticated, only show published posts
//     if (!session) {
//       query = query.eq('published', true);
//     } else {
//       // If user is authenticated, show their unpublished posts too
//       query = query.or(`published.eq.true,author_id.eq.${session.user.id}`);
//     }

//     const { data, error } = await query;

//     if (error) {
//       console.error('Error fetching posts:', error);
//       return NextResponse.json(
//         { error: 'Failed to fetch posts' },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Error in GET /api/blog:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// } 

// function createRouteHandlerClient(arg0: { cookies: () => Promise<ReadonlyRequestCookies>; }) {
//   throw new Error('Function not implemented.');
// }
