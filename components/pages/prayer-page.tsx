"use client"

import { useState } from "react"
import { MainNav } from "@/components/layout/main-nav"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { Heart, Check, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Footer } from "@/components/layout/footer"

// Mock schema for preview
const prayerSchema = z.object({
  request: z.string().min(5, "Prayer request must be at least 5 characters"),
  isAnonymous: z.boolean().default(false),
  status: z.string().default("pending"),
  createdAt: z.date(),
})

// Mock data for preview
const MOCK_PRAYERS = [
  {
    id: 1,
    userId: 1,
    request: "Please pray for my upcoming surgery next week. I'm feeling anxious and need peace.",
    isAnonymous: false,
    status: "pending",
    createdAt: new Date("2025-03-28").toISOString(),
  },
  {
    id: 2,
    userId: 2,
    request: "Praying for my son who is struggling with depression. Please join me in prayer for his healing and joy.",
    isAnonymous: true,
    status: "praying",
    createdAt: new Date("2025-03-25").toISOString(),
  },
  {
    id: 3,
    userId: 1,
    request: "I need wisdom for a major career decision. Seeking God's direction.",
    isAnonymous: false,
    status: "pending",
    createdAt: new Date("2025-03-22").toISOString(),
  },
  {
    id: 4,
    userId: 3,
    request: "Please pray for my marriage. We're going through a difficult season and need God's intervention.",
    isAnonymous: true,
    status: "answered",
    createdAt: new Date("2025-03-15").toISOString(),
  },
  {
    id: 5,
    userId: 1,
    request: "Praying for financial breakthrough. I've been unemployed for 3 months now.",
    isAnonymous: false,
    status: "praying",
    createdAt: new Date("2025-03-10").toISOString(),
  },
]

function PrayerCard({ prayer }: { prayer: any }) {
  const { toast } = useToast()

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      // Mock mutation for preview
      return { ...prayer, status }
    },
    onSuccess: () => {
      toast({
        title: "Prayer status updated",
        description: "The prayer request status has been updated successfully.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{format(new Date(prayer.createdAt), "PPP")}</p>
            {prayer.isAnonymous ? (
              <p className="text-sm font-medium">Anonymous</p>
            ) : (
              <p className="text-sm font-medium">Prayer ID: {prayer.id}</p>
            )}
          </div>
          <Badge
            variant={prayer.status === "answered" ? "default" : "outline"}
            className={`ml-2 ${
              prayer.status === "answered"
                ? "bg-green-500 hover:bg-green-600"
                : prayer.status === "praying"
                  ? "text-blue-500 border-blue-500"
                  : ""
            }`}
          >
            {prayer.status}
          </Badge>
        </div>
        <p className="text-sm mb-4">{prayer.request}</p>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateStatusMutation.mutate("praying")}
            disabled={updateStatusMutation.isPending}
            className="text-blue-500 border-blue-500 hover:bg-blue-50"
          >
            <Clock className="h-4 w-4 mr-1" />
            Praying
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateStatusMutation.mutate("answered")}
            disabled={updateStatusMutation.isPending}
            className="text-green-500 border-green-500 hover:bg-green-50"
          >
            <Check className="h-4 w-4 mr-1" />
            Answered
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PrayerPage() {
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  // For preview, we'll use the mock data instead of real queries
  const { data: allPrayers } = useQuery({
    queryKey: ["/api/prayers"],
    queryFn: () => Promise.resolve(MOCK_PRAYERS),
    initialData: MOCK_PRAYERS,
  })

  const { data: userPrayers } = useQuery({
    queryKey: ["/api/prayers/user"],
    queryFn: () => Promise.resolve(MOCK_PRAYERS.filter((p) => p.userId === 1)),
    initialData: MOCK_PRAYERS.filter((p) => p.userId === 1),
  })

  const form = useForm({
    resolver: zodResolver(prayerSchema),
    defaultValues: {
      request: "",
      isAnonymous: false,
      status: "pending",
      createdAt: new Date(),
    },
  })

  const createPrayerMutation = useMutation({
    mutationFn: async (data: any) => {
      // Mock mutation for preview
      return { ...data, id: Math.floor(Math.random() * 1000), userId: 1 }
    },
    onSuccess: () => {
      form.reset()
      toast({
        title: "Prayer request submitted",
        description: "Your prayer request has been submitted successfully.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Prayer Network</h1>
          <Heart className="h-8 w-8 text-primary" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Submit Prayer Request</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => createPrayerMutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="request"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Prayer Request</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Share your prayer request..." className="min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isAnonymous"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Submit Anonymously</FormLabel>
                          <FormDescription>Hide your identity from other users</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={createPrayerMutation.isPending}>
                    Submit Prayer Request
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="all">All Prayers</TabsTrigger>
                <TabsTrigger value="my">My Prayers</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {!allPrayers?.length ? (
                  <Card className="p-6">
                    <p className="text-muted-foreground">No prayer requests at this time.</p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {allPrayers.map((prayer) => (
                      <PrayerCard key={prayer.id} prayer={prayer} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="my">
                {!userPrayers?.length ? (
                  <Card className="p-6">
                    <p className="text-muted-foreground">You haven't submitted any prayer requests yet.</p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {userPrayers.map((prayer) => (
                      <PrayerCard key={prayer.id} prayer={prayer} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

