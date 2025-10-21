"use client"

import { useState, useEffect } from "react"
import { MainNav } from "@/components/layout/main-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock } from "lucide-react"
import { format } from "date-fns"
import Image from "next/image"
import { RegistrationForm } from "@/components/events/registration-form"

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
  registrationFormFields?: {
    type?: string
    time?: string
  }
}

function EventCard({ event }: { event: Event }) {
  const eventDate = new Date(event.date)
  const eventType = event.registrationFormFields?.type || 'Event'
  const eventTime = event.registrationFormFields?.time || ''

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
      <div className="aspect-video relative">
        <div className="relative w-full h-full">
          <Image
            src={event.imageUrl || '/events/bg.jpeg'}
            alt={event.altText || event.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute top-4 right-4">
          <Badge className="bg-primary/90 hover:bg-primary text-white">{eventType}</Badge>
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="font-semibold text-xl mb-3">{event.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary/60" />
            {format(eventDate, 'EEEE, MMMM do, yyyy')}
          </div>
          {eventTime && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-primary/60" />
              {eventTime}
            </div>
          )}
          {event.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary/60" />
              {event.location}
            </div>
          )}
        </div>
        <RegistrationForm eventTitle={event.title} eventId={event.id} />
      </CardContent>
    </Card>
  )
}

function EventSkeleton() {
  return (
    <div className="space-y-3">
      <div className="aspect-video">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="flex justify-between px-4">
        <Skeleton className="h-[28px] w-[200px]" />
        <Skeleton className="h-[28px] w-[100px]" />
      </div>
      <Skeleton className="h-[60px] w-full mx-4" />
      <div className="space-y-2 px-4">
        <Skeleton className="h-[20px] w-[150px]" />
        <Skeleton className="h-[20px] w-[150px]" />
      </div>
      <div className="px-4 pb-4">
        <Skeleton className="h-[40px] w-full" />
      </div>
    </div>
  )
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events')
        if (!response.ok) throw new Error('Failed to fetch events')
        const data = await response.json()
        setEvents(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <MainNav />
        <main className="flex-grow container mx-auto px-4 py-8 mt-16">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">All Events</h1>
            <Calendar className="h-8 w-8 text-primary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <EventSkeleton key={index} />
            ))}
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <MainNav />
        <main className="flex-grow container mx-auto px-4 py-8 mt-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Events</h1>
            <p className="text-muted-foreground">Failed to load events. Please try again later.</p>
          </div>
        </main>
      </div>
    )
  }

  const activeEvents = events?.filter((event: Event) => event.isActive) || []

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">All Events</h1>
          <Calendar className="h-8 w-8 text-primary" />
        </div>

        {activeEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No events scheduled</h3>
            <p className="text-muted-foreground">Check back later for upcoming events.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeEvents.map((event: Event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}