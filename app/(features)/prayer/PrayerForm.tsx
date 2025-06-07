"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
<<<<<<< HEAD
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
=======
import { useAuthenticatedSupabase } from "@/app/providers/supabase-provider"
import { useAuth } from "@clerk/nextjs"
>>>>>>> 1cf74a4c204a145ed64b21e282601a5d5b79fa19
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

const prayerFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(1, "Prayer request is required").max(1000),
  is_anonymous: z.boolean().default(false),
})

type PrayerFormValues = z.infer<typeof prayerFormSchema>

export function PrayerForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { supabase, isSignedIn } = useAuthenticatedSupabase()

  const form = useForm<PrayerFormValues>({
    resolver: zodResolver(prayerFormSchema),
    defaultValues: {
      title: "",
      content: "",
      is_anonymous: false,
    },
  })

  const onSubmit = async (data: PrayerFormValues) => {
<<<<<<< HEAD
=======
    if (!isSignedIn || !userId) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to submit a prayer request"
      })
      return
    }

>>>>>>> 1cf74a4c204a145ed64b21e282601a5d5b79fa19
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('prayers')
        .insert([
          {
            user_id: 'anonymous', // Anonymous user ID for public site
            title: data.title,
            content: data.content,
            is_anonymous: true, // Always anonymous in public site
            status: 'pending'
          }
        ])

      if (error) throw error

      toast({
        title: "Prayer request submitted",
        description: "Your prayer request has been shared with the community"
      })
      form.reset()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error submitting prayer",
        description: error instanceof Error ? error.message : "Failed to submit prayer request"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Prayer request title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prayer Request</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Share your prayer request..." 
                  className="min-h-[150px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_anonymous"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Submit anonymously</FormLabel>
                <FormDescription>
                  Your name will not be shown with the prayer request
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Prayer Request"}
        </Button>
      </form>
    </Form>
  )
} 