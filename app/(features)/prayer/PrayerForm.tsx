"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useSupabase } from "@/app/providers/supabase-provider"
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
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  is_anonymous: z.boolean().default(false),
})

type PrayerFormValues = z.infer<typeof prayerFormSchema>

export function PrayerForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const supabase = useSupabase()

  const form = useForm<PrayerFormValues>({
    resolver: zodResolver(prayerFormSchema),
    defaultValues: {
      title: "",
      content: "",
      name: "",
      email: "",
      is_anonymous: false,
    },
  })

  const onSubmit = async (data: PrayerFormValues) => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('prayers')
        .insert([
          {
            name: data.is_anonymous ? 'Anonymous' : data.name,
            email: data.is_anonymous ? null : data.email,
            title: data.title,
            content: data.content,
            is_anonymous: data.is_anonymous,
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

        {!form.watch('is_anonymous') && (
          <>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
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
                  <FormLabel>Your Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Your email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Prayer Request"}
        </Button>
      </form>
    </Form>
  )
}