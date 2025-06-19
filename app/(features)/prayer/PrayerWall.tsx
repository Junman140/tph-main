"use client"

import { useEffect, useState } from "react"
import { useSupabase } from "@/app/providers/supabase-provider"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, Heart } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog"
import { DialogHeader } from "@/components/ui/dialog"
import { TestimonyForm } from "./TestimonyForm"

interface Prayer {
  id: string
  title: string
  content: string
  is_anonymous: boolean
  status: 'pending' | 'answered'
  created_at: string
  user: {
    id: string
    full_name: string
  }
  _count: {
    supports: number
  }
  has_supported: boolean
}

export function PrayerWall() {
  const [prayers, setPrayers] = useState<Prayer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPrayerId, setSelectedPrayerId] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = useSupabase()

  useEffect(() => {
    fetchPrayers()
  }, [])

  const fetchPrayers = async () => {
    try {
      // First, fetch prayers with user info
      const { data: prayers, error: prayersError } = await supabase
        .from('prayers')
        .select(`
          *,
          user:user_id (id, full_name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (prayersError) throw prayersError

      // Then, fetch support counts for each prayer
      const { data: supportCounts, error: supportsError } = await supabase
        .from('prayer_support')
        .select('prayer_id')
        .in('prayer_id', prayers?.map(p => p.id) || [])

      if (supportsError) throw supportsError

      // Combine the data
      const prayersWithSupport = prayers?.map(prayer => ({
        ...prayer,
        _count: {
          supports: supportCounts.filter(s => s.prayer_id === prayer.id).length
        },
        has_supported: false
      }))

      setPrayers(prayersWithSupport || [])
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading prayers",
        description: error instanceof Error ? error.message : "Failed to load prayers"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSupport = async (prayerId: string) => {

    try {
      const prayer = prayers.find(p => p.id === prayerId)
      if (!prayer) return

      // Simulate support count increment
      prayer._count.supports++
      setPrayers([...prayers])
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update prayer support"
      })
    }
  }

  const markAsAnswered = async (prayerId: string) => {

    try {
      const { error } = await supabase
        .from('prayers')
        .update({ status: 'answered' })
        .eq('id', prayerId)

      if (error) throw error

      setPrayers(prayers.filter(p => p.id !== prayerId))
      setSelectedPrayerId(prayerId)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update prayer status"
      })
    }
  }

  const handleTestimonySuccess = () => {
    setSelectedPrayerId(null)
    toast({
      title: "Testimony shared",
      description: "Thank you for sharing your testimony with the community!"
    })
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading prayers...</div>
  }

  return (
    <>
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="space-y-4 p-4">
          {prayers.map((prayer) => (
            <Card key={prayer.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{prayer.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {prayer.is_anonymous ? "Anonymous" : prayer.user.full_name} • {
                      new Date(prayer.created_at).toLocaleDateString()
                    }
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSupport(prayer.id)}
                    className={prayer.has_supported ? "text-primary" : ""}
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    {prayer._count.supports}
                  </Button>
                  {/* Admin controls removed for public site */}
                </div>
              </div>
              <p className="text-sm whitespace-pre-wrap">{prayer.content}</p>
            </Card>
          ))}
          {prayers.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No prayer requests yet. Share your prayer request with the community.
            </div>
          )}
        </div>
      </ScrollArea>

      <Dialog open={!!selectedPrayerId} onOpenChange={() => setSelectedPrayerId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Testimony</DialogTitle>
          </DialogHeader>
          <TestimonyForm 
            prayerId={selectedPrayerId || undefined}
            onSuccess={handleTestimonySuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  )
} 