import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
// import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { MainNav } from '@/components/layout/main-nav'
import { prisma } from '@/lib/prisma'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // Fetch the post using Prisma
  const post = await prisma.post.findUnique({
    where: {
      slug: params.slug,
    },
  });

  if (!post) {
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
              <time dateTime={post.createdAt.toISOString()}>
                {format(post.createdAt, 'MMMM d, yyyy')}
              </time>
              <div className="text-sm">{post.readingTime} min read</div>
            </div>
            {post.authorName && (
              <div className="flex items-center space-x-4">
                {post.authorImage && (
                  <div className="relative h-8 w-8">
                    <Image src={post.authorImage} alt={post.authorName} fill className="rounded-full object-cover" />
                  </div>
                )}
                <div className="text-sm font-medium">{post.authorName}</div>
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