import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MainNav } from '@/components/layout/main-nav'

interface BlogPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  excerpt: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  author_id: string;
  tags: string[];
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // Initialize Supabase client directly
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Fetch the post
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (error || !post) {
    notFound();
  }

  // Only check if post is published, no auth check
  if (!post.published) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <article className="container max-w-3xl py-6 lg:py-12">
          <div className="space-y-4">
            <h1 className="inline-block font-heading text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <time dateTime={post.created_at}>
                {format(new Date(post.created_at), 'MMMM d, yyyy')}
              </time>
              <div className="text-sm">{post.reading_time} min read</div>
            </div>
            {post.author_name && (
              <div className="flex items-center space-x-4">
                {post.author_image && (
                  <img
                    src={post.author_image}
                    alt={post.author_name}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <div className="text-sm font-medium">{post.author_name}</div>
              </div>
            )}
          </div>
          <div
            className="prose prose-slate dark:prose-invert mt-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          {post.tags && (
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Button key={tag} variant="secondary" size="sm">
                  {tag}
                </Button>
              ))}
            </div>
          )}
        </article>
      </main>
    </div>
  )
} 