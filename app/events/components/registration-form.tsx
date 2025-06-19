"use client"

import { useState } from 'react'
import { useSupabase } from '@/app/providers/supabase-provider'
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface RegistrationFormProps {
  eventId: string
  eventTitle: string
  isOpen: boolean
  onClose: () => void
}

export function RegistrationForm({ eventId, eventTitle, isOpen, onClose }: RegistrationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const { toast } = useToast()
  const supabase = useSupabase()

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      
      if (!fullName || !email) {
        toast({
          title: "Missing information",
          description: "Please provide your name and email",
          variant: "destructive"
        })
        return
      }

      // Check if already registered with this email
      const { data: existing } = await supabase
        .from('event_registrations')
        .select()
        .eq('event_id', eventId)
        .eq('email', email)
        .single()

      if (existing) {
        toast({
          title: "Already registered",
          description: "This email has already been registered for this event",
          variant: "destructive"
        })
        return
      }

      // Submit the registration
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          full_name: fullName,
          email: email,
          notes: notes.trim(),
          status: 'registered'
        })

      if (error) throw error

      toast({
        title: "Success!",
        description: "You have been registered for the event",
      })

      // Clear form and close dialog
      setFullName('')
      setEmail('')
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
            <label className="block text-sm font-medium mb-1">Full Name *</label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
            />
          </div>
          
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