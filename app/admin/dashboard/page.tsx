"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/layout/main-nav"
import { Plus, FileText, Image, Users, Mail, Calendar, ClipboardList } from "lucide-react"

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<{ name?: string } | null>(null)
  const [stats, setStats] = useState({
    posts: 0,
    galleryImages: 0,
    subscriptions: 0,
    events: 0,
    eventRegistrations: 0,
    attendanceRecords: 0
  })
  const router = useRouter()

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem('admin')
    const adminToken = localStorage.getItem('adminToken')

    if (!adminData || !adminToken) {
      router.push('/admin/login')
      return
    }

    setAdmin(JSON.parse(adminData))
    fetchStats()
  }, [router])

  const fetchStats = async () => {
    try {
      // Fetch counts from different endpoints
      const [postsRes, galleryRes, subscriptionsRes, eventsRes, eventRegistrationsRes, attendanceRes] = await Promise.all([
        fetch('/api/blog'),
        fetch('/api/gallery'),
        fetch('/api/subscribe'),
        fetch('/api/events'),
        fetch('/api/events/register'),
        fetch('/api/attendance')
      ])

      // Check if responses are ok before parsing JSON
      const posts = postsRes.ok ? await postsRes.json() : []
      const galleryImages = galleryRes.ok ? await galleryRes.json() : []
      const subscriptions = subscriptionsRes.ok ? await subscriptionsRes.json() : []
      const events = eventsRes.ok ? await eventsRes.json() : []
      const eventRegistrations = eventRegistrationsRes.ok ? await eventRegistrationsRes.json() : []
      const attendanceRecords = attendanceRes.ok ? await attendanceRes.json() : []

      setStats({
        posts: Array.isArray(posts) ? posts.length : 0,
        galleryImages: Array.isArray(galleryImages) ? galleryImages.length : 0,
        subscriptions: Array.isArray(subscriptions) ? subscriptions.length : 0,
        events: Array.isArray(events) ? events.length : 0,
        eventRegistrations: Array.isArray(eventRegistrations) ? eventRegistrations.length : 0,
        attendanceRecords: Array.isArray(attendanceRecords) ? attendanceRecords.length : (attendanceRecords.records ? attendanceRecords.records.length : 0)
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Set default stats if there's an error
      setStats({
        posts: 0,
        galleryImages: 0,
        subscriptions: 0,
        events: 0,
        eventRegistrations: 0,
        attendanceRecords: 0
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin')
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  if (!admin) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <div className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {admin.name}</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.posts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gallery Images</CardTitle>
                <Image className="h-4 w-4 text-muted-foreground" aria-label="Gallery images icon" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.galleryImages}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.subscriptions}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.events}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Event Registrations</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.eventRegistrations}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Records</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.attendanceRecords}</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Blog Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => router.push('/blog/admin')} 
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Post
                </Button>
                <Button 
                  onClick={() => router.push('/blog')} 
                  variant="outline" 
                  className="w-full"
                >
                  View All Posts
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pastors Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => router.push('/admin/pastors')} 
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Manage Pastors
                </Button>
                <Button 
                  onClick={() => router.push('/pastors')} 
                  variant="outline" 
                  className="w-full"
                >
                  View Public Pastors
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gallery Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => router.push('/admin/gallery')} 
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Manage Gallery
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Events Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => router.push('/admin/events')} 
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Manage Events
                </Button>
                <Button 
                  onClick={() => router.push('/events')} 
                  variant="outline" 
                  className="w-full"
                >
                  View Public Events
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Registry</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => router.push('/admin/attendance')} 
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Manage Attendance
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
