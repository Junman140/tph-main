"use client"

import { compareDesc } from 'date-fns'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import Link from "next/link"
import { Search } from "lucide-react"
import { MainNav } from "@/components/layout/main-nav"
import { useSupabase } from "@/app/providers/supabase-provider"
import { useState, useEffect } from 'react'

type Post = {
  id: string
  title: string
  date: string
  reading_time: number
  description: string
  tags: string[]
  slug: string
}

export default function BlogPage() {
  const supabase = useSupabase()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, slug, description, date, reading_time, tags')
          .order('date', { ascending: false })

        if (error) {
          setFetchError(error.message || 'Unknown error')
          console.error('Supabase error fetching posts:', error)
          return
        }

        if (!data) {
          setFetchError('No data returned from Supabase')
          return
        }

        setPosts(data)
      } catch (err) {
        setFetchError((err as Error).message)
        console.error('Unexpected error fetching posts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <MainNav />
        <div className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <p>Loading posts...</p>
          </div>
        </div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex flex-col">
        <MainNav />
        <div className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <p className="text-red-500 font-bold">Error loading posts: {fetchError}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <div className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-4">
              <h1 className="text-4xl font-bold">Blog</h1>
              <p className="text-muted-foreground">
                Read our latest articles and updates
              </p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription>
                        {format(new Date(post.date), "MMMM d, yyyy")} • {post.reading_time} min read
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{post.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-secondary rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}