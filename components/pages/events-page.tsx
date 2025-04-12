"use client"

import { MainNav } from "@/components/layout/main-nav"
import { Footer } from "@/components/layout/footer"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { RegistrationForm } from "@/components/events/registration-form"

const FEATURED_EVENTS = [
  {
    title: "Women Of Substance",
    type: "Confrence",
    date: "Sunday, 13th April 2025",
    time: "08:00 AM",
    location: "Main Sanctuary",
    imageUrl: "/events/woman of substance 2025B.jpg",
    description: "Join us for a powerful time of worship and the Word.",
  },
  {
    title: "Dominion 2025 System",
    type: "Conference",
    date: "Sunday, 13th May 2025",
    time: "08:00 AM",
    location: "Main Sanctuary",
    imageUrl: "/events/DOMINION 2025 SYSTEM.jpg",
    description: "Three days of inspiration, worship, and community for believers.",
  },
  {
    title: "Alive Music Experience",
    type: "Special Event",
    date: "Sunday, 21st March 2025",
    time: "08:00 AM",
    location: "Main Sanctuary",
    imageUrl: "/events/ALIVE MUSIC EXPIRIENCE COTH.jpg",
    description: "Celebrate the resurrection of Christ with special music and activities.",
  },
]

function EventCard({ event }: { event: any }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
      <div className="aspect-video relative">
        <div className="relative w-full h-full">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute top-4 right-4">
          <Badge className="bg-primary/90 hover:bg-primary text-white">{event.type}</Badge>
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="font-semibold text-xl mb-3">{event.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary/60" />
            {event.date}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-primary/60" />
            {event.location}
          </div>
        </div>
        <RegistrationForm eventTitle={event.title} />
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
  // Using the FEATURED_EVENTS data directly
  const events = FEATURED_EVENTS;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Upcoming Events</h1>
          <Calendar className="h-8 w-8 text-primary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}

