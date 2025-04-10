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

// Add event type to image mapping
const eventTypeImages: { [key: string]: string } = {
  "Conference": "/gallery/aud3.jpg",
  "Workshop": "/gallery/media.jpg",
  "Worship": "/gallery/fresh13.jpg",
  "Retreat": "/gallery/smile.jpg",
  "Training": "/gallery/drama.jpg",
}

// Mock data for preview
const MOCK_EVENTS = [
  {
    id: 1,
    title: "Global Leadership Summit 2025",
    description:
      "Join us for our annual leadership conference featuring renowned speakers and practical workshops designed to equip you with the tools needed to lead effectively in today's world.",
    date: new Date("2025-06-15").toISOString(),
    location: "TPH Global Center",
    type: "Conference",
  },
  {
    id: 2,
    title: "Anakazo Training Workshop",
    description:
      "An intensive training program focused on spiritual empowerment and leadership development through the principles of Anakazo.",
    date: new Date("2025-05-20").toISOString(),
    location: "Virtual Event",
    type: "Workshop",
  },
  {
    id: 3,
    title: "Youth Ministry Conference",
    description:
      "A specialized conference for youth leaders and workers, providing strategies and resources for effective youth ministry in the digital age.",
    date: new Date("2025-04-10").toISOString(),
    location: "TPH Youth Center",
    type: "Conference",
  },
  {
    id: 4,
    title: "Prayer & Worship Night",
    description:
      "An evening dedicated to corporate prayer and worship, focusing on intercession for global revival and spiritual awakening.",
    date: new Date("2025-04-25").toISOString(),
    location: "TPH Global Center",
    type: "Worship",
  },
  {
    id: 5,
    title: "Family Life Retreat",
    description:
      "A weekend retreat for families to strengthen bonds, learn biblical principles for healthy family dynamics, and enjoy fellowship together.",
    date: new Date("2025-07-18").toISOString(),
    location: "Mountain Retreat Center",
    type: "Retreat",
  },
  {
    id: 6,
    title: "Missions Outreach Training",
    description:
      "Practical training for those interested in local and global missions, covering cultural sensitivity, evangelism strategies, and team dynamics.",
    date: new Date("2025-05-05").toISOString(),
    location: "TPH Global Center",
    type: "Training",
  },
]

function EventCard({ event }: { event: any }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
      <div className="aspect-video relative">
        <div className="relative w-full h-full">
          <Image
            src={eventTypeImages[event.type] || "/gallery/aud2.jpg"} // fallback to aud2.jpg if type not found
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
            {format(new Date(event.date), "PPP")}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-primary/60" />
            {event.location}
          </div>
        </div>
        <Button variant="outline" className="w-full">
          Register Now
        </Button>
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
  // For preview, we'll use the mock data instead of a real query
  const {
    data: events,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/events"],
    queryFn: () => Promise.resolve(MOCK_EVENTS),
    initialData: MOCK_EVENTS,
  })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Upcoming Events</h1>
          <Calendar className="h-8 w-8 text-primary" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <EventSkeleton />
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="p-6">
            <p className="text-destructive">Error loading events: {(error as Error).message}</p>
          </Card>
        ) : !events?.length ? (
          <Card className="p-6">
            <p className="text-muted-foreground">No upcoming events at this time.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

