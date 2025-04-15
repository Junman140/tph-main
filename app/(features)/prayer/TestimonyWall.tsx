"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useAuth } from "@clerk/nextjs"
import { useToast } from "@/components/ui/use-toast"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Testimony {
  id: string
  title: string
  content: string
  created_at: string
  prayer: {
    title: string
  } | null
  user: {
    full_name: string
  }
}

export function TestimonyWall() {
  const [testimonies, setTestimonies] = useState<Testimony[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { userId } = useAuth()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchTestimonies()
  }, [])

  const fetchTestimonies = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonies')
        .select(`
          *,
          prayer:prayer_id (title),
          user:user_id (full_name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setTestimonies(data || [])
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading testimonies",
        description: error instanceof Error ? error.message : "Failed to load testimonies"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading testimonies...</div>
  }

  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="space-y-4 p-4">
        {testimonies.map((testimony) => (
          <Card key={testimony.id} className="p-4">
            <div className="space-y-2">
              <div>
                <h3 className="font-semibold">{testimony.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {testimony.user.full_name} • {new Date(testimony.created_at).toLocaleDateString()}
                </p>
                {testimony.prayer && (
                  <p className="text-sm text-muted-foreground mt-1">
                    In response to prayer: {testimony.prayer.title}
                  </p>
                )}
              </div>
              <p className="text-sm whitespace-pre-wrap">{testimony.content}</p>
            </div>
          </Card>
        ))}
        {testimonies.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No testimonies shared yet. Be the first to share your testimony!
          </div>
        )}
      </div>
    </ScrollArea>
  )
} 