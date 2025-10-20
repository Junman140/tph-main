"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
// import { format } from "date-fns"
import { MainNav } from "@/components/layout/main-nav"
import { Upload, Save, Eye } from "lucide-react"
import Image from "next/image"

export default function BlogAdminPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [tags, setTags] = useState("")
  const [slug, setSlug] = useState("")
  const [customSlug, setCustomSlug] = useState(false)
  const [featuredImage, setFeaturedImage] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [authorImage, setAuthorImage] = useState("")
  const [isDraft, setIsDraft] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Auto-generate slug from title when title changes (if not using custom slug)
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim()
  }

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    if (!customSlug) {
      setSlug(generateSlug(newTitle))
    }
  }

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true)
    setErrorMsg(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      setFeaturedImage(data.url)
      setSuccessMsg('Image uploaded successfully!')
    } catch (error) {
      setErrorMsg((error as Error).message)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      // Convert tags string to array
      const tagsArray = typeof tags === 'string' 
        ? tags.split(",").map(tag => tag.trim()).filter(Boolean)
        : tags || [];
      
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          excerpt: excerpt || null,
          slug: slug || generateSlug(title),
          tags: tagsArray,
          published: !isDraft,
          featuredImage: featuredImage || null,
          metaDescription: metaDescription || null,
          authorName: authorName || null,
          authorImage: authorImage || null,
          readingTime: Math.ceil(content.split(' ').length / 200) // Rough estimate of reading time
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }
      
      const data = await response.json();
      console.log('Post created successfully:', data);
      
      // Reset form
      setTitle("")
      setContent("")
      setExcerpt("")
      setTags("")
      setSlug("")
      setCustomSlug(false)
      setFeaturedImage("")
      setMetaDescription("")
      setAuthorName("")
      setAuthorImage("")
      setIsDraft(false)
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Save className="mr-2 h-5 w-5" />
                Create New Blog Post
              </CardTitle>
            </CardHeader>
            <CardContent>
              {errorMsg && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{errorMsg}</AlertDescription>
                </Alert>
              )}
              {successMsg && (
                <Alert className="mb-4">
                  <AlertDescription>{successMsg}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                    placeholder="Enter post title"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="customSlug"
                      checked={customSlug}
                      onCheckedChange={setCustomSlug}
                    />
                    <Label htmlFor="customSlug">Use custom slug</Label>
                  </div>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder={customSlug ? "Enter custom slug" : "Auto-generated slug"}
                    disabled={!customSlug}
                  />
                  <p className="text-xs text-muted-foreground">
                    {customSlug 
                      ? "Enter a custom URL slug for this post" 
                      : "Slug will be auto-generated from the title"
                    }
                  </p>
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief description of the post (optional)"
                    rows={3}
                  />
                </div>

                {/* Meta Description */}
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="SEO meta description (optional)"
                    rows={2}
                  />
                </div>

                {/* Featured Image */}
                <div className="space-y-2">
                  <Label htmlFor="featuredImage">Featured Image</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="featuredImage"
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      placeholder="Image URL or upload a file"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      title="Upload featured image"
                      aria-label="Upload featured image"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file)
                      }}
                      className="hidden"
                      id="imageUpload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('imageUpload')?.click()}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? (
                        <Upload className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {featuredImage && (
                    <div className="mt-2 relative w-32 h-20">
                      <Image src={featuredImage} alt="Featured image preview" fill className="object-cover rounded border" />
                    </div>
                  )}
                </div>

                {/* Author Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="authorName">Author Name</Label>
                    <Input
                      id="authorName"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Author name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="authorImage">Author Image URL</Label>
                    <Input
                      id="authorImage"
                      value={authorImage}
                      onChange={(e) => setAuthorImage(e.target.value)}
                      placeholder="Author image URL"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    placeholder="Write your post content here..."
                    className="min-h-[300px]"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. prayer, faith, community (comma-separated)"
                  />
                </div>

                {/* Draft Toggle */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isDraft"
                    checked={isDraft}
                    onCheckedChange={setIsDraft}
                  />
                  <Label htmlFor="isDraft">Save as draft (unpublished)</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Post"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
