"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PrayerForm } from "./PrayerForm"
import { PrayerWall } from "./PrayerWall"
import { TestimonyWall } from "./TestimonyWall"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAuthenticatedSupabase } from '@/app/providers/supabase-provider'
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"

export default function PrayerPage() {
  const [showPrayerForm, setShowPrayerForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [request, setRequest] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const { toast } = useToast()
  const { supabase, isSignedIn } = useAuthenticatedSupabase()
  const [userId, setUserId] = useState<string | null>(null)
  
  // Get the user ID when signed in
  useEffect(() => {
    if (isSignedIn) {
      const getUserId = async () => {
        const { data } = await supabase.auth.getUser()
        if (data?.user) {
          setUserId(data.user.id)
        }
      }
      getUserId()
    }
  }, [isSignedIn, supabase.auth])

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      
      if (!isSignedIn) {
        toast({
          title: "Authentication required",
          description: "Please sign in to submit prayer requests",
          variant: "destructive"
        })
        return
      }

      // Validate inputs
      if (!title.trim() || !request.trim()) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive"
        })
        return
      }

      if (!userId) {
        toast({
          title: "User ID not found",
          description: "Please try signing in again",
          variant: "destructive"
        })
        return
      }
      
      // Submit the prayer request
      const { error } = await supabase
        .from('prayer_requests')
        .insert({
          user_id: userId,
          title: title.trim(),
          request: request.trim(),
          is_anonymous: isAnonymous
        })

      if (error) throw error

      toast({
        title: "Success!",
        description: "Your prayer request has been submitted",
      })

      // Clear the form
      setTitle('')
      setRequest('')
      setIsAnonymous(false)

    } catch (error) {
      console.error('Error submitting prayer request:', error)
      toast({
        title: "Error",
        description: "Failed to submit your prayer request. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-6 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Prayer Wall</h1>
        <Button onClick={() => setShowPrayerForm(!showPrayerForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Prayer Request
        </Button>
      </div>

      {showPrayerForm && (
        <div className="mb-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">New Prayer Request</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Prayer request title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Prayer Request</label>
                <Textarea
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  placeholder="Share your prayer request..."
                  className="min-h-[150px]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                />
                <label
                  htmlFor="anonymous"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Submit anonymously
                </label>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isLoading || !title.trim() || !request.trim()}
                className="w-full"
              >
                {isLoading ? "Submitting..." : "Submit Prayer Request"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      <Tabs defaultValue="prayers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="prayers">Prayer Requests</TabsTrigger>
          <TabsTrigger value="testimonies">Testimonies</TabsTrigger>
        </TabsList>
        <TabsContent value="prayers" className="space-y-4">
          <PrayerWall />
        </TabsContent>
        <TabsContent value="testimonies" className="space-y-4">
          <TestimonyWall />
        </TabsContent>
      </Tabs>
    </div>
  )
}

