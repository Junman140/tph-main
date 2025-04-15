"use client"

import { useRouter } from "next/navigation"
import { MainNav } from "@/components/layout/main-nav"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function NewBlogPost() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: formData.get("content") as string,
      tags: formData.get("tags") as string,
      isDraft: false
    }

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!res.ok) {
        throw new Error("Failed to create post")
      }

      router.push("/admin/blog")
      router.refresh()
    } catch (error) {
      console.error(error)
      // You should show an error toast here
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
    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: formData.get("content") as string,
      tags: formData.get("tags") as string,
      isDraft: true
    }

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!res.ok) {
        throw new Error("Failed to save draft")
      }

      router.push("/admin/blog")
      router.refresh()
    } catch (error) {
      console.error(error)
      // You should show an error toast here
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
              <Label htmlFor="slug">URL Slug</Label>
              <Input id="slug" name="slug" required disabled={isLoading} />
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