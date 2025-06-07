"use client"

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useUser } from "@clerk/nextjs"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
<<<<<<< HEAD
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
=======
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phoneNumber: z.string().min(10, { message: "Valid phone number is required" }),
  location: z.string().min(2, { message: "Location is required" }),
>>>>>>> 1cf74a4c204a145ed64b21e282601a5d5b79fa19
  notes: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface RegistrationFormProps {
  eventId: string
  eventTitle: string
}

export function RegistrationForm({ eventId, eventTitle }: RegistrationFormProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
<<<<<<< HEAD
  const supabase = useSupabaseClient()
  const { toast } = useToast()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      notes: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from("event_registrations").insert({
        event_id: eventId,
        user_id: 'anonymous', // Anonymous user for public site
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        notes: data.notes,
        status: 'registered'
      })

      if (error) throw error

      toast({
        title: "Registration successful",
        description: "You have been registered for the event. Check your email for confirmation.",
      })
      setOpen(false)
      form.reset()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to register for the event",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

=======
  const { user } = useUser()
  const { toast } = useToast()

  // Initialize form with default values
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      location: "",
      notes: "",
    },
  })
  
  // Update form values when user data is available
  React.useEffect(() => {
    if (user) {
      form.setValue('fullName', user.fullName || "");
      form.setValue('email', user.primaryEmailAddress?.emailAddress || "");
    }
  }, [user, form])

  // Simple form submission handler
  const onSubmit = (values: FormData) => {
    console.log('Form submitted with values:', values);
    setIsSubmitting(true);
    
    // Show success message
    toast({
      title: "Registration successful",
      description: "You have been registered for the event. We will contact you with further details.",
    });
    
    // Close the form and reset
    setOpen(false);
    form.reset();
    setIsSubmitting(false);
  }

  // No pre-checks needed, form will handle everything

>>>>>>> 1cf74a4c204a145ed64b21e282601a5d5b79fa19
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Register Now</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register for {eventTitle}</DialogTitle>
          <DialogDescription>
            Fill out the form below to register for this event. We will contact you with further details.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
<<<<<<< HEAD
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
=======
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
>>>>>>> 1cf74a4c204a145ed64b21e282601a5d5b79fa19
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
<<<<<<< HEAD
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (Optional)</FormLabel>
=======
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
>>>>>>> 1cf74a4c204a145ed64b21e282601a5d5b79fa19
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
<<<<<<< HEAD
=======
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
>>>>>>> 1cf74a4c204a145ed64b21e282601a5d5b79fa19
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Registration'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 