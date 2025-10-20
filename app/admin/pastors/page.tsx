"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MainNav } from '@/components/layout/main-nav'
import { Plus, Upload, Edit, Trash2, Save, RefreshCw } from 'lucide-react'
import Image from 'next/image'

interface Pastor {
  id: string
  name: string
  title: string
  bio: string
  imageUrl: string
  altText?: string | null
  order: number
  isSenior: boolean
  isActive: boolean
  slug: string
  socialInstagram?: string | null
}

export default function PastorsAdminPage() {
  const [pastors, setPastors] = useState<Pastor[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Pastor | null>(null)

  const [form, setForm] = useState({
    name: '',
    title: '',
    bio: '',
    imageUrl: '',
    altText: '',
    order: 0,
    isSenior: false,
    isActive: true,
    slug: '',
    socialInstagram: '',
  })

  const router = useRouter()

  useEffect(() => {
    const adminData = localStorage.getItem('admin')
    const adminToken = localStorage.getItem('adminToken')
    if (!adminData || !adminToken) {
      router.push('/admin/login')
      return
    }
    fetchPastors()
  }, [router])

  const fetchPastors = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/pastors')
      if (!res.ok) throw new Error('Failed to fetch pastors')
      const data = await res.json()
      setPastors(data)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

  const startCreate = () => {
    setEditing(null)
    setForm({
      name: '',
      title: '',
      bio: '',
      imageUrl: '',
      altText: '',
      order: 0,
      isSenior: false,
      isActive: true,
      slug: '',
      socialInstagram: '',
    })
    setShowForm(true)
  }

  const startEdit = (p: Pastor) => {
    setEditing(p)
    setForm({
      name: p.name,
      title: p.title,
      bio: p.bio,
      imageUrl: p.imageUrl,
      altText: p.altText || '',
      order: p.order,
      isSenior: p.isSenior,
      isActive: p.isActive,
      slug: p.slug,
      socialInstagram: p.socialInstagram || '',
    })
    setShowForm(true)
  }

  const uploadImage = async (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (!res.ok) throw new Error('Failed to upload image')
    const data = await res.json()
    return data.url as string
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const payload = {
        ...form,
        altText: form.altText || null,
        socialInstagram: form.socialInstagram || null,
        slug: form.slug || generateSlug(form.name),
        order: Number(form.order) || 0,
      }
      const res = await fetch(editing ? `/api/pastors/${editing.id}` : '/api/pastors', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const er = await res.json().catch(() => ({}))
        throw new Error(er.error || 'Failed to save pastor')
      }
      setSuccess('Saved successfully!')
      setShowForm(false)
      setEditing(null)
      await fetchPastors()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this pastor?')) return
    setError(null)
    try {
      const res = await fetch(`/api/pastors/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete pastor')
      await fetchPastors()
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <div className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Pastors</h1>
              <p className="text-muted-foreground">Manage pastors displayed on the site</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={fetchPastors}>
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh
              </Button>
              <Button onClick={startCreate}>
                <Plus className="h-4 w-4 mr-2" /> Add Pastor
              </Button>
            </div>
          </div>

          {error && (
            <Alert className="mb-4" variant="destructive">
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
                <CardTitle>{editing ? 'Edit Pastor' : 'Add Pastor'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio *</Label>
                    <Textarea id="bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} required rows={4} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL *</Label>
                    <div className="flex gap-2">
                      <Input id="imageUrl" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} required placeholder="/uploads/..." />
                      <label className="inline-flex items-center px-3 border rounded cursor-pointer" title="Upload pastor image">
                        <Upload className="h-4 w-4" aria-hidden="true" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          aria-label="Upload pastor image"
                          title="Upload pastor image"
                          placeholder="Choose an image file"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const url = await uploadImage(file);
                            setForm((f) => ({ ...f, imageUrl: url }))
                          } catch (er) {
                            setError((er as Error).message)
                          }
                        }} />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="altText">Alt text</Label>
                    <Input id="altText" value={form.altText} onChange={(e) => setForm({ ...form, altText: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order">Order</Label>
                    <Input id="order" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated from name if empty" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social">Instagram URL</Label>
                    <Input id="social" value={form.socialInstagram} onChange={(e) => setForm({ ...form, socialInstagram: e.target.value })} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="isSenior" checked={form.isSenior} onCheckedChange={(v) => setForm({ ...form, isSenior: v })} />
                    <Label htmlFor="isSenior">Senior Pastor</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="isActive" checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
                    <Label htmlFor="isActive">Active</Label>
                  </div>

                  <div className="md:col-span-2 flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditing(null) }}>Cancel</Button>
                    <Button type="submit" disabled={saving}>
                      <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save Pastor'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* List */}
          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <div className="flex items-center text-muted-foreground"><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Loading pastors...</div>
            ) : pastors.length === 0 ? (
              <div className="text-muted-foreground">No pastors found.</div>
            ) : (
              pastors.map((p) => (
                <Card key={p.id}>
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="relative w-24 h-24">
                      <Image src={p.imageUrl} alt={p.altText || p.name} fill className="object-cover rounded" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{p.name} <span className="text-sm text-muted-foreground">– {p.title}</span></h3>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => startEdit(p)}><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="destructive" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.bio}</p>
                      <div className="text-xs text-muted-foreground mt-2">Slug: {p.slug} • Order: {p.order} • {p.isSenior ? 'Senior' : 'Pastor'} • {p.isActive ? 'Active' : 'Inactive'}</div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


