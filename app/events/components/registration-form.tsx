"use client"

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface RegistrationFormProps {
  eventId: string
  eventTitle: string
  isOpen: boolean
  onClose: () => void
}

export function RegistrationForm({ eventId, eventTitle, isOpen, onClose }: RegistrationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [notes, setNotes] = useState('')
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to register for events",
          variant: "destructive"
        })
        return
      }

      // Check if already registered
      const { data: existing } = await supabase
        .from('event_registrations')
        .select()
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single()

      if (existing) {
        toast({
          title: "Already registered",
          description: "You have already registered for this event",
          variant: "destructive"
        })
        return
      }

      // Submit the registration
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: user.id,
          notes: notes.trim(),
          status: 'registered'
        })

      if (error) throw error

      toast({
        title: "Success!",
        description: "You have been registered for the event",
      })

      // Clear form and close dialog
      setNotes('')
      onClose()

    } catch (error) {
      console.error('Error registering for event:', error)
      toast({
        title: "Error",
        description: "Failed to register for the event. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register for {eventTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Fill out the form below to register for this event. We will contact you with further details.
          </p>
          
          <div>
            <label className="block text-sm font-medium mb-1">Additional Notes (Optional)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requirements or notes..."
              className="min-h-[100px]"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Registering..." : "Submit Registration"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 