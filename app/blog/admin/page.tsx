"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { MainNav } from "@/components/layout/main-nav"
import { useAuthenticatedSupabase } from "@/app/providers/supabase-provider"

export default function BlogAdminPage() {
  const { supabase, isSignedIn, isAdmin } = useAuthenticatedSupabase()
  const [authChecked, setAuthChecked] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  
  // Check authentication status when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        console.log('Auth session check:', data)
        setAuthChecked(true)
      } catch (error) {
        console.error('Error checking auth session:', error)
        setAuthChecked(true)
      }
    }
    
    checkAuth()
  }, [supabase.auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)
    
    if (!isSignedIn) {
      setErrorMsg('You must be signed in to create blog posts')
      setLoading(false)
      return
    }
    
    if (!isAdmin) {
      setErrorMsg('Only administrators can create blog posts. Your email is not authorized.')
      setLoading(false)
      return
    }

    try {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      
      // Log attempt to create post
      console.log('Attempting to create blog post via API endpoint');
      
      // Use the server API endpoint instead of direct Supabase client
      const response = await fetch('/api/blog', {
        credentials: 'same-origin', // Include cookies for authentication
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          description,
          slug,
          tags,
          reading_time: Math.ceil(content.split(' ').length / 200) // Rough estimate of reading time
        }),
      });
      
      if (!response.ok) {
        // Handle HTTP error
        const errorText = await response.text();
        console.error('API error:', response.status, errorText);
        setErrorMsg(`Error creating post: ${response.status} ${errorText || 'Unknown error'}`);
        return;
      }
      
      const data = await response.json();
      console.log('Post created successfully:', data);

      // Reset form
      setTitle("")
      setContent("")
      setDescription("")
      setTags("")
      setSuccessMsg('Post created successfully!')
    } catch (error) {
      setErrorMsg((error as Error).message)
      console.error('Error creating post:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <div className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {!authChecked && (
            <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
              Checking authentication status...
            </div>
          )}
          {!isSignedIn && (
            <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
              You must be signed in to access this page.
            </div>
          )}
          
          {isSignedIn && !isAdmin && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              Access denied. Only administrators can create blog posts.
            </div>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Create New Blog Post</CardTitle>
            </CardHeader>
            <CardContent>
              {errorMsg && (
                <div className="mb-4 text-red-500 font-bold">Error: {errorMsg}</div>
              )}
              {successMsg && (
                <div className="mb-4 text-green-600 font-bold">{successMsg}</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Enter post title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Enter post description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    placeholder="Write your post content here..."
                    className="min-h-[200px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                  <Input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. prayer, faith, community"
                  />
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Post"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
