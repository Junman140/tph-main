"use client"

import { MainNav } from "@/components/layout/main-nav"
import { Footer } from "@/components/layout/footer"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistance } from "date-fns"
import { Video, Calendar, User, Headphones } from "lucide-react"
import Image from "next/image"

async function fetchSermons() {
  const response = await fetch('/api/spotify')
  if (!response.ok) {
    throw new Error('Failed to fetch sermons')
  }
  return response.json()
}

function SermonCard({ sermon }: { sermon: any }) {
  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader className="flex-1">
        <div className="relative h-48 w-full mb-4">
          {sermon.imageUrl ? (
            <Image
              src={sermon.imageUrl}
              alt={sermon.title}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <Headphones className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
        <CardTitle className="text-xl mb-2 line-clamp-2">{sermon.title}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground space-x-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDistance(new Date(sermon.date), new Date(), { addSuffix: true })}
          </div>
          {sermon.duration && (
            <div className="flex items-center">
              <Headphones className="h-4 w-4 mr-1" />
              {Math.floor(sermon.duration / 60000)} min
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-between">
        <p className="text-muted-foreground mb-4 line-clamp-3">{sermon.description}</p>
        <a
          href={sermon.audioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-primary hover:underline mt-auto"
        >
          Listen on Spotify
          <svg
            className="ml-2 h-4 w-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
        </a>
      </CardContent>
    </Card>
  )
}

function SermonSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-48 w-full mb-4" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-4/6" />
      </CardContent>
    </Card>
  )
}

export default function SermonsPage() {
  const { data: sermons, isLoading, error } = useQuery({
    queryKey: ['sermons'],
    queryFn: fetchSermons
  })

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">Sermons & Podcasts</h1>
            <Headphones className="h-8 w-8 text-primary" />
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md mb-8">
              Failed to load sermons. Please try again later.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <SermonSkeleton key={i} />
              ))
            ) : (
              sermons?.map((sermon: any) => (
                <SermonCard key={sermon.id} sermon={sermon} />
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

