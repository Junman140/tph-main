"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { MainNav } from "@/components/layout/main-nav"
import { useSupabase } from "@/app/providers/supabase-provider"

export default function BlogAdminPage() {
  const supabase = useSupabase()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [isDraft, setIsDraft] = useState(false)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      // Generate slug from title
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      
      console.log('Attempting to create blog post with data:', {
        title,
        slug,
        description,
        isDraft
      });
      
      // Try direct Supabase insertion if the API fails
      try {
        // First try the API endpoint
        const response = await fetch('/api/blog', {
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
            isDraft,
            reading_time: Math.ceil(content.split(' ').length / 200) // Rough estimate of reading time
          }),
        });
        
        if (!response.ok) {
          // Parse error response
          let errorDetail = 'Unknown error';
          try {
            const errorJson = await response.json();
            errorDetail = errorJson.error || JSON.stringify(errorJson);
          } catch (e) {
            // If can't parse as JSON, try as text
            try {
              errorDetail = await response.text();
            } catch (textError) {
              // If all else fails, use status code
              errorDetail = `HTTP ${response.status}`;
            }
          }
          
          console.error('API error:', response.status, errorDetail);
          console.log('API failed, trying direct Supabase insertion as fallback');
          
          // Fallback to direct Supabase insertion
          const tagsArray = typeof tags === 'string' 
            ? tags.split(",").map(tag => tag.trim()).filter(Boolean)
            : tags || [];
            
          const { data: directData, error: directError } = await supabase
            .from('posts')
            .insert([
              {
                title,
                content,
                published: !isDraft,
                slug,
                excerpt: description, // Use description as excerpt for compatibility
                tags: tagsArray,
                author_id: '00000000-0000-0000-0000-000000000000', // Anonymous author ID
                created_at: new Date().toISOString()
              }
            ])
            .select()
            .single();
          
          if (directError) {
            console.error('Direct Supabase insertion error:', directError);
            throw new Error(`Failed to create post: ${directError.message}`);
          }
          
          console.log('Post created successfully via direct Supabase:', directData);
          
          // Reset form
          setTitle("")
          setContent("")
          setDescription("")
          setTags("")
          setIsDraft(false)
          setSuccessMsg('Post created successfully via direct database insertion!')
          return;
        }
        
        const data = await response.json();
        console.log('Post created successfully via API:', data);
        
        // Reset form
        setTitle("")
        setContent("")
        setDescription("")
        setTags("")
        setIsDraft(false)
        setSuccessMsg('Post created successfully!')
      } catch (apiError) {
        console.error('API method failed:', apiError);
        throw apiError; // Re-throw to be caught by the outer catch
      }
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

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDraft"
                    checked={isDraft}
                    onChange={(e) => setIsDraft(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="isDraft" className="text-sm font-medium text-gray-700">
                    Save as draft (unpublished)
                  </label>
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
