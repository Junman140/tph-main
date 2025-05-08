"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuthenticatedSupabase } from "@/app/providers/supabase-provider"
import { useAuth } from "@clerk/nextjs"
import { useToast } from "@/components/ui/use-toast"
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

const testimonyFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(1, "Testimony is required").max(2000),
})

type TestimonyFormValues = z.infer<typeof testimonyFormSchema>

interface TestimonyFormProps {
  prayerId?: string
  onSuccess?: () => void
}

export function TestimonyForm({ prayerId, onSuccess }: TestimonyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { userId } = useAuth()
  const { toast } = useToast()
  const { supabase, isSignedIn } = useAuthenticatedSupabase()

  const form = useForm<TestimonyFormValues>({
    resolver: zodResolver(testimonyFormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  })

  const onSubmit = async (data: TestimonyFormValues) => {
    if (!isSignedIn || !userId) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to share your testimony"
      })
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('testimonies')
        .insert([
          {
            user_id: userId,
            prayer_id: prayerId,
            title: data.title,
            content: data.content,
          }
        ])

      if (error) throw error

      toast({
        title: "Testimony shared",
        description: "Thank you for sharing your testimony!"
      })
      form.reset()
      onSuccess?.()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error sharing testimony",
        description: error instanceof Error ? error.message : "Failed to share testimony"
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
                <Input placeholder="Title of your testimony" {...field} />
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
              <FormLabel>Your Testimony</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Share how God answered your prayer..." 
                  className="min-h-[200px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sharing..." : "Share Testimony"}
        </Button>
      </form>
    </Form>
  )
} 