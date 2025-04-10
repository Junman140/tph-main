"use client"

import { MainNav } from "@/components/layout/main-nav"
import { Footer } from "@/components/layout/footer"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistance } from "date-fns"
import { Video, Calendar, User } from "lucide-react"

// Mock data for preview
const MOCK_SERMONS = [
  {
    id: 1,
    title: "The Power of Unwavering Faith",
    description:
      "In this powerful sermon, we explore how maintaining unwavering faith during challenging times can transform your spiritual journey and open doors to divine breakthroughs.",
    videoUrl: "https://example.com/sermon1",
    preacherId: 1,
    date: new Date("2025-03-28").toISOString(),
    tags: ["faith", "challenges", "breakthrough"],
  },
  {
    id: 2,
    title: "Walking in Divine Purpose",
    description:
      "Discover how to identify and fulfill your God-given purpose in this inspiring message about destiny and calling.",
    videoUrl: "https://example.com/sermon2",
    preacherId: 2,
    date: new Date("2025-03-21").toISOString(),
    tags: ["purpose", "destiny", "calling"],
  },
  {
    id: 3,
    title: "The Heart of Worship",
    description:
      "Learn what true worship means beyond just singing songs, and how it can transform your relationship with God.",
    videoUrl: "https://example.com/sermon3",
    preacherId: 1,
    date: new Date("2025-03-14").toISOString(),
    tags: ["worship", "relationship", "transformation"],
  },
  {
    id: 4,
    title: "Kingdom Principles for Leadership",
    description:
      "Explore biblical principles that can help you become an effective leader in both spiritual and secular contexts.",
    videoUrl: "https://example.com/sermon4",
    preacherId: 3,
    date: new Date("2025-03-07").toISOString(),
    tags: ["leadership", "principles", "kingdom"],
  },
  {
    id: 5,
    title: "Overcoming Spiritual Warfare",
    description: "Practical strategies for recognizing and overcoming spiritual battles in your daily life.",
    videoUrl: "https://example.com/sermon5",
    preacherId: 2,
    date: new Date("2025-02-28").toISOString(),
    tags: ["warfare", "spiritual", "victory"],
  },
  {
    id: 6,
    title: "The Grace of Giving",
    description:
      "Understanding the biblical principles of generosity and how giving transforms both the giver and receiver.",
    videoUrl: "https://example.com/sermon6",
    preacherId: 1,
    date: new Date("2025-02-21").toISOString(),
    tags: ["giving", "generosity", "stewardship"],
  },
]

function SermonCard({ sermon }: { sermon: any }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video bg-primary/10 relative flex items-center justify-center">
        <Video className="h-12 w-12 text-primary/40" />
      </div>
      <CardHeader className="space-y-0 p-4">
        <CardTitle className="line-clamp-1 text-lg">{sermon.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{sermon.description}</p>
        <div className="flex items-center text-sm text-muted-foreground space-x-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-primary/60" />
            {formatDistance(new Date(sermon.date), new Date(), { addSuffix: true })}
          </div>
          {sermon.preacherId && (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1 text-primary/60" />
              Preacher ID: {sermon.preacherId}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function SermonSkeleton() {
  return (
    <div className="space-y-3">
      <div className="aspect-video bg-muted rounded-t-lg" />
      <Skeleton className="h-[40px] w-[250px] mx-4" />
      <Skeleton className="h-[60px] w-full mx-4" />
      <div className="flex space-x-4 mx-4 mb-4">
        <Skeleton className="h-[20px] w-[100px]" />
        <Skeleton className="h-[20px] w-[100px]" />
      </div>
    </div>
  )
}

export default function SermonsPage() {
  // For preview, we'll use the mock data instead of a real query
  const {
    data: sermons,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/sermons"],
    queryFn: () => Promise.resolve(MOCK_SERMONS),
    initialData: MOCK_SERMONS,
  })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Sermon Library</h1>
          <Video className="h-8 w-8 text-primary" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-4">
                <SermonSkeleton />
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="p-6">
            <p className="text-destructive">Error loading sermons: {(error as Error).message}</p>
          </Card>
        ) : !sermons?.length ? (
          <Card className="p-6">
            <p className="text-muted-foreground">No sermons available yet.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermons.map((sermon) => (
              <SermonCard key={sermon.id} sermon={sermon} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

