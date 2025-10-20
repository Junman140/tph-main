"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MainNav } from "@/components/layout/main-nav"
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react"
import Image from "next/image"

interface GalleryImage {
  id: string
  title: string
  description?: string
  imageUrl: string
  altText?: string
  category?: string
  isActive: boolean
  sortOrder: number
  driveLink?: string
  createdAt: string
}

export default function GalleryManagementPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    altText: '',
    category: '',
    isActive: true,
    sortOrder: 0,
    driveLink: ''
  })
  const router = useRouter()

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const result = await response.json()
      setFormData(prev => ({ ...prev, imageUrl: result.url }))
      setSuccess('Image uploaded successfully!')
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem('admin')
    const adminToken = localStorage.getItem('adminToken')

    if (!adminData || !adminToken) {
      router.push('/admin/login')
      return
    }

    fetchImages()
  }, [router])

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/gallery')
      if (!response.ok) throw new Error('Failed to fetch images')
      
      const data = await response.json()
      setImages(data)
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const url = editingImage ? `/api/gallery/${editingImage.id}` : '/api/gallery'
      const method = editingImage ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save image')
      }

      setSuccess(editingImage ? 'Image updated successfully!' : 'Image added successfully!')
      setShowForm(false)
      setEditingImage(null)
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        altText: '',
        category: '',
        isActive: true,
        sortOrder: 0,
        driveLink: ''
      })
      fetchImages()
    } catch (error) {
      setError((error as Error).message)
    }
  }

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image)
    setFormData({
      title: image.title,
      description: image.description || '',
      imageUrl: image.imageUrl,
      altText: image.altText || '',
      category: image.category || '',
      isActive: image.isActive,
      sortOrder: image.sortOrder,
      driveLink: image.driveLink || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete image')
      }

      setSuccess('Image deleted successfully!')
      fetchImages()
    } catch (error) {
      setError((error as Error).message)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      altText: '',
      category: '',
      isActive: true,
      sortOrder: 0,
      driveLink: ''
    })
    setEditingImage(null)
    setShowForm(false)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <div className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Gallery Management</h1>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          {showForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingImage ? 'Edit Image' : 'Add New Image'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Image Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        placeholder="Enter image title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g., Events, Worship, Community"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image">Upload Image</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(file)
                        }}
                        disabled={uploading}
                      />
                      {uploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
                    </div>
                    {formData.imageUrl && (
                      <div className="mt-2 relative w-32 h-20">
                        <Image src={formData.imageUrl} alt="Preview" fill className="object-cover rounded" />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="imageUrl">Or Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the image..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="altText">Alt Text</Label>
                    <Input
                      id="altText"
                      value={formData.altText}
                      onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                      placeholder="Alternative text for accessibility"
                    />
                  </div>

                  <div>
                    <Label htmlFor="driveLink">Google Drive Link *</Label>
                    <Input
                      id="driveLink"
                      value={formData.driveLink}
                      onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
                      placeholder="https://drive.google.com/drive/folders/..."
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This link will be used for the &quot;View&quot; button to redirect users to the full album
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        aria-label="Mark image as active"
                      />
                      <Label htmlFor="isActive">Active</Label>
                    </div>
                    <div>
                      <Label htmlFor="sortOrder">Sort Order</Label>
                      <Input
                        id="sortOrder"
                        type="number"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                        className="w-20"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit">
                      {editingImage ? 'Update Image' : 'Add Image'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Images Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <Image
                      src={image.imageUrl}
                      alt={image.altText || image.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-1 right-1">
                      <span className={`text-xs px-1 py-0.5 rounded-full ${
                        image.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {image.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {image.category && (
                      <div className="absolute top-1 left-1">
                        <span className="text-xs px-1 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {image.category}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2 md:p-3 space-y-2">
                    <div>
                      <h3 className="font-semibold text-xs md:text-sm line-clamp-1">{image.title}</h3>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        {image.driveLink && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            asChild
                            title="View in Google Drive"
                            className="h-6 w-6 p-0"
                          >
                            <a href={image.driveLink} target="_blank" rel="noopener noreferrer" aria-label="View album in Google Drive" title="View album in Google Drive">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEdit(image)}
                          title="Edit Image"
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDelete(image.id)}
                          title="Delete Image"
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {images.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No images found. Add your first image to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
