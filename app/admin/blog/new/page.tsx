"use client"

import { useRouter } from "next/navigation"
import { MainNav } from "@/components/layout/main-nav"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { slugify } from "@/lib/utils"

export default function NewBlogPost() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const tags = formData.get("tags") as string
    const authorName = formData.get("author") as string
    const isDraft = false

    try {
      // Generate slug from title
      const slug = slugify(title)

      // Insert into Supabase
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title,
            content,
            slug,
            tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
            author_name: authorName,
            published: !isDraft,
            excerpt: content.substring(0, 150) + '...'
          }
        ])
        .select()
        .single()

      if (error) {
        throw error
      }

      toast({
        title: "Success",
        description: "Blog post created successfully"
      })

      router.push("/admin/blog")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error creating post",
        description: error instanceof Error ? error.message : "Failed to create post"
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function saveDraft(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    setIsLoading(true)

    const form = e.currentTarget.form
    if (!form) return

    const formData = new FormData(form)
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const tags = formData.get("tags") as string
    const authorName = formData.get("author") as string
    const isDraft = true

    try {
      // Generate slug from title
      const slug = slugify(title)

      // Insert into Supabase
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title,
            content,
            slug,
            tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
            author_name: authorName,
            published: !isDraft,
            excerpt: content.substring(0, 150) + '...'
          }
        ])
        .select()
        .single()

      if (error) {
        throw error
      }

      toast({
        title: "Success",
        description: "Draft saved successfully"
      })

      router.push("/admin/blog")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error saving draft",
        description: error instanceof Error ? error.message : "Failed to save draft"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-grow container mx-auto px-4 py-12 mt-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>
          
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required disabled={isLoading} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author">Author Name</Label>
              <Input id="author" name="author" required disabled={isLoading} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea 
                id="content" 
                name="content" 
                required 
                className="min-h-[400px]"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input 
                id="tags" 
                name="tags" 
                placeholder="news, updates, etc" 
                disabled={isLoading}
              />
            </div>
            
            <div className="flex justify-end gap-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={saveDraft}
                disabled={isLoading}
              >
                Save as Draft
              </Button>
              <Button type="submit" disabled={isLoading}>
                Publish Post
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
} 