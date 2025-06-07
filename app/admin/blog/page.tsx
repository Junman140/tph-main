"use client"

import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/layout/main-nav"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  created_at: string
  author_name: string
  published: boolean
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()
  
  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        setPosts(data || [])
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <Button asChild>
            <Link href="/admin/blog/new">Create New Post</Link>
          </Button>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <Card className="p-6">
              <p>Loading posts...</p>
            </Card>
          ) : posts.length > 0 ? (
            posts.map(post => (
              <Card key={post.id} className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  <span className={`text-sm px-2 py-1 rounded ${post.published ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">By {post.author_name} • {new Date(post.created_at).toLocaleDateString()}</p>
                <p className="mb-4">{post.excerpt}</p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/blog/${post.slug}`}>View</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/blog/edit/${post.slug}`}>Edit</Link>
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-6">
              <p className="text-muted-foreground">
                No blog posts yet. Click "Create New Post" to add one.
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}