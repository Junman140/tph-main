"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AdminNav } from "@/components/layout/admin-nav"
import { Plus, Edit, Trash2, Calendar, MapPin, Users, Eye, Download, Mail, Phone, Clock } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'
import { format } from 'date-fns'

interface EventRegistration {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  location: string
  notes?: string
  status: string
  createdAt: string
}

interface Event {
  id: string
  title: string
  description?: string
  date: string
  location?: string
  imageUrl?: string
  altText?: string
  isActive: boolean
  maxRegistrations?: number
  driveLink?: string
  registrations?: EventRegistration[]
}

export default function EventsManagementPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [uploading, setUploading] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showRegistrations, setShowRegistrations] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    imageUrl: '',
    altText: '',
    isActive: true,
    maxRegistrations: '',
    driveLink: ''
  })
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    // Use setTimeout to ensure this runs after hydration
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        // Check if admin is logged in
        const adminData = localStorage.getItem('admin')
        const adminToken = localStorage.getItem('adminToken')

        if (!adminData || !adminToken) {
          router.push('/admin/login')
          return
        }

        fetchEvents()
      }
    }, 0)

    return () => clearTimeout(timer)
  }, [router])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (!response.ok) throw new Error('Failed to fetch events')
      
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const url = editingEvent ? '/api/events' : '/api/events'
      const method = editingEvent ? 'PUT' : 'POST'
      
      const payload = {
        ...(editingEvent && { id: editingEvent.id }),
        title: formData.title,
        description: formData.description || null,
        date: formData.date,
        location: formData.location || null,
        imageUrl: formData.imageUrl || null,
        altText: formData.altText || null,
        isActive: formData.isActive,
        maxRegistrations: formData.maxRegistrations ? parseInt(formData.maxRegistrations) : null,
        driveLink: formData.driveLink || null,
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save event')
      }

      setSuccess(editingEvent ? 'Event updated successfully!' : 'Event created successfully!')
      setShowForm(false)
      setEditingEvent(null)
      resetForm()
      fetchEvents()
    } catch (error) {
      console.error('Form submission error:', error)
      setError((error as Error).message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const response = await fetch(`/api/events?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete event')

      setSuccess('Event deleted successfully!')
      fetchEvents()
    } catch (error) {
      setError((error as Error).message)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      imageUrl: '',
      altText: '',
      isActive: true,
      maxRegistrations: '',
      driveLink: ''
    })
  }

  const startEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description || '',
      date: new Date(event.date).toISOString().slice(0, 16),
      location: event.location || '',
      imageUrl: event.imageUrl || '',
      altText: event.altText || '',
      isActive: event.isActive,
      maxRegistrations: event.maxRegistrations?.toString() || '',
      driveLink: event.driveLink || ''
    })
    setShowForm(true)
  }

  const viewRegistrations = (event: Event) => {
    setSelectedEvent(event)
    setShowRegistrations(true)
  }

  const exportRegistrations = (event: Event) => {
    const registrations = event.registrations || []
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Location', 'Notes', 'Status', 'Registration Date'],
      ...registrations.map(reg => [
        reg.fullName,
        reg.email,
        reg.phoneNumber,
        reg.location,
        reg.notes || '',
        reg.status,
        format(new Date(reg.createdAt), 'yyyy-MM-dd HH:mm')
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_registrations.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const updateRegistrationStatus = async (registrationId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/events/register', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: registrationId, status: newStatus })
      })

      if (!response.ok) throw new Error('Failed to update registration status')

      setSuccess('Registration status updated successfully!')
      fetchEvents() // Refresh events to get updated registrations
    } catch (error) {
      setError((error as Error).message)
    }
  }

  if (!mounted) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            border: '2px solid #e5e7eb',
            borderTop: '2px solid #000',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading...</p>
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `
          }} />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AdminNav />
      <div className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Events Management</h1>
              <p className="text-muted-foreground">Manage church events and registrations</p>
            </div>
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setEditingEvent(null) }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingEvent ? 'Edit Event' : 'Create New Event'}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Event Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                        placeholder="Enter event title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Event Date *</Label>
                      <Input
                        id="date"
                        type="datetime-local"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter event description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Enter event location"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxRegistrations">Max Registrations</Label>
                      <Input
                        id="maxRegistrations"
                        type="number"
                        value={formData.maxRegistrations}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxRegistrations: e.target.value }))}
                        placeholder="Leave empty for unlimited"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Event Image</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="altText">Image Alt Text</Label>
                    <Input
                      id="altText"
                      value={formData.altText}
                      onChange={(e) => setFormData(prev => ({ ...prev, altText: e.target.value }))}
                      placeholder="Describe the image for accessibility"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="driveLink">Google Drive Link</Label>
                    <Input
                      id="driveLink"
                      value={formData.driveLink}
                      onChange={(e) => setFormData(prev => ({ ...prev, driveLink: e.target.value }))}
                      placeholder="https://drive.google.com/..."
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="isActive">Active Event</Label>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert>
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={uploading}>
                      {editingEvent ? 'Update Event' : 'Create Event'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Events List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => viewRegistrations(event)}
                        title="View Registrations"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => exportRegistrations(event)}
                        title="Export Registrations"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(event)}
                        title="Edit Event"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(event.id)}
                        title="Delete Event"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {event.imageUrl && (
                    <div className="relative w-full h-32">
                      <Image src={event.imageUrl} alt={event.altText || event.title} fill className="object-cover rounded" />
                    </div>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{event.registrations?.length || 0} registrations</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {event.isActive ? 'Active' : 'Inactive'}
                    </span>
                    
                    {event.driveLink && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={event.driveLink} target="_blank" rel="noopener noreferrer">
                          View Details
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {events.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No events yet</h3>
              <p className="text-muted-foreground">Create your first event to get started.</p>
            </div>
          )}

          {/* Registrations Dialog */}
          <Dialog open={showRegistrations} onOpenChange={setShowRegistrations}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedEvent?.title} - Registrations ({selectedEvent?.registrations?.length || 0})
                </DialogTitle>
              </DialogHeader>
              
              {selectedEvent && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Badge variant="outline">
                        Total: {selectedEvent.registrations?.length || 0}
                      </Badge>
                      <Badge variant="outline">
                        Pending: {(selectedEvent.registrations || []).filter(r => r.status === 'pending').length}
                      </Badge>
                      <Badge variant="outline">
                        Confirmed: {(selectedEvent.registrations || []).filter(r => r.status === 'confirmed').length}
                      </Badge>
                    </div>
                    <Button onClick={() => exportRegistrations(selectedEvent)}>
                      <Download className="mr-2 h-4 w-4" />
                      Export CSV
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {(selectedEvent.registrations || []).map((registration) => (
                      <Card key={registration.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium">{registration.fullName}</h4>
                                <Badge variant={
                                  registration.status === 'confirmed' ? 'default' :
                                  registration.status === 'pending' ? 'secondary' : 'destructive'
                                }>
                                  {registration.status}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-4 w-4" />
                                  <span>{registration.email}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4" />
                                  <span>{registration.phoneNumber}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{registration.location}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4" />
                                  <span>{format(new Date(registration.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                                </div>
                              </div>
                              
                              {registration.notes && (
                                <div className="text-sm text-muted-foreground">
                                  <strong>Notes:</strong> {registration.notes}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant={registration.status === 'confirmed' ? 'default' : 'outline'}
                                onClick={() => updateRegistrationStatus(registration.id, 'confirmed')}
                              >
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant={registration.status === 'pending' ? 'default' : 'outline'}
                                onClick={() => updateRegistrationStatus(registration.id, 'pending')}
                              >
                                Pending
                              </Button>
                              <Button
                                size="sm"
                                variant={registration.status === 'cancelled' ? 'destructive' : 'outline'}
                                onClick={() => updateRegistrationStatus(registration.id, 'cancelled')}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {(!selectedEvent.registrations || selectedEvent.registrations.length === 0) && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No registrations yet</h3>
                      <p className="text-muted-foreground">Registrations will appear here when people sign up for this event.</p>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
