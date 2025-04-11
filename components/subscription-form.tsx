"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export function SubscriptionForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const subscribe = useMutation(api.subscribers.subscribe)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await subscribe({ email })
      
      if (result.status === "subscribed") {
        toast.success("Successfully subscribed to our newsletter!")
      } else if (result.status === "already_subscribed") {
        toast.info("You're already subscribed to our newsletter.")
      } else if (result.status === "resubscribed") {
        toast.success("Welcome back! You've been resubscribed to our newsletter.")
      }
      
      setEmail("")
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>
  )
} 