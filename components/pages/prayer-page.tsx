"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { useAuth } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Heart } from "lucide-react"
import { Footer } from "@/components/layout/footer"
import { TestimonySection } from "./testimony-section"
import { api } from "@/convex/_generated/api"

const prayerSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Prayer request must be at least 10 characters"),
  category: z.string(),
  isPrivate: z.boolean().default(false),
  verseReference: z.string().optional(),
})

function PrayerCard({ prayer, onStatusChange }: { prayer: any; onStatusChange?: () => void }) {
  const { toast } = useToast()
  const [isSubmittingTestimony, setIsSubmittingTestimony] = useState(false)
  const [testimonyData, setTestimonyData] = useState({
    title: "",
    content: "",
    isAnonymous: false,
  })

  const markAsAnsweredMutation = useMutation(api.prayers.markPrayerAsAnswered);

  const supportPrayerMutation = useMutation(api.prayers.supportPrayer);

  const handleMarkAsAnswered = async () => {
    try {
      await markAsAnsweredMutation.mutate({
        prayerId: prayer._id,
        testimonyTitle: testimonyData.title,
        testimonyContent: testimonyData.content,
        isAnonymous: testimonyData.isAnonymous,
      })
      if (onStatusChange) onStatusChange()
      setIsSubmittingTestimony(false)
      toast({
        title: "Prayer marked as answered",
        description: "Your testimony has been shared with the community.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark prayer as answered",
        variant: "destructive",
      });
    }
  }

  const handleSupportPrayer = async () => {
    try {
      await supportPrayerMutation.mutate({
        prayerId: prayer._id,
        commitment: "once",
      })
      if (onStatusChange) onStatusChange()
      toast({
        title: "Prayer supported",
        description: "You are now supporting this prayer request.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to support prayer",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <h3 className="font-semibold">{prayer.title}</h3>
            <p className="text-sm text-muted-foreground">
              {format(new Date(prayer.createdAt), "PPP")}
            </p>
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

        <p className="text-sm mb-4">{prayer.content}</p>

        {prayer.supportingVerses?.length > 0 && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="text-sm italic">{prayer.supportingVerses.join(" • ")}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="space-x-2"
              onClick={handleSupportPrayer}
            >
              <Heart className="h-4 w-4" />
              <span>{prayer.prayerCount || 0}</span>
            </Button>
            {prayer.status !== "answered" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSubmittingTestimony(true)}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                <Check className="h-4 w-4 mr-2" />
                Mark as Answered
              </Button>
            )}
          </div>
          <Badge variant="outline" className="text-sm">
            {prayer.category}
          </Badge>
        </div>

        {isSubmittingTestimony && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium mb-3">Share Your Testimony</h4>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Testimony Title"
                className="w-full p-2 border rounded-md"
                value={testimonyData.title}
                onChange={(e) => setTestimonyData({ ...testimonyData, title: e.target.value })}
              />
              <textarea
                placeholder="Share how God answered your prayer..."
                className="w-full p-2 border rounded-md"
                rows={3}
                value={testimonyData.content}
                onChange={(e) => setTestimonyData({ ...testimonyData, content: e.target.value })}
              />
              <div className="flex items-center space-x-2">
                <Switch
                  checked={testimonyData.isAnonymous}
                  onCheckedChange={(checked) =>
                    setTestimonyData({ ...testimonyData, isAnonymous: checked })
                  }
                />
                <span className="text-sm">Share anonymously</span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleMarkAsAnswered}
                >
                  Share Testimony
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSubmittingTestimony(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function PrayerPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(prayerSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "general",
      isPrivate: false,
      verseReference: "",
    },
  })

  const allPrayers = useQuery(api.prayers.getUserPrayers) || [];
  const userPrayers = useQuery(api.prayers.getUserPrayers, { status: "pending" }) || [];
  const createPrayerMutation = useMutation(api.prayers.createPrayer);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-lg">Please sign in to access the Prayer Network</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (data: any) => {
    try {
      await createPrayerMutation.mutate(data);
      form.reset();
      toast({
        title: "Prayer request submitted",
        description: "Your prayer request has been shared with the community.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit prayer request",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = () => {}

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Prayer Network</h1>
        <Heart className="h-8 w-8 text-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Submit Prayer Request</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="w-full p-2 border rounded-md"
                          placeholder="Brief title for your prayer request"
                          {...field}
                        />
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
                      <FormLabel>Your Prayer Request</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share your prayer request..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded-md"
                          {...field}
                        >
                          <option value="general">General</option>
                          <option value="healing">Healing</option>
                          <option value="provision">Provision</option>
                          <option value="guidance">Guidance</option>
                          <option value="relationships">Relationships</option>
                          <option value="spiritual">Spiritual Growth</option>
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPrivate"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Private Prayer</FormLabel>
                        <FormDescription>
                          Only share with prayer team
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                >
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
              {!allPrayers.length ? (
                <Card className="p-6">
                  <p className="text-muted-foreground">
                    No prayer requests at this time.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {allPrayers.map((prayer: any) => (
                    <PrayerCard
                      key={prayer._id}
                      prayer={prayer}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="my">
              {!userPrayers.length ? (
                <Card className="p-6">
                  <p className="text-muted-foreground">
                    You haven't submitted any prayer requests yet.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {userPrayers.map((prayer: any) => (
                    <PrayerCard
                      key={prayer._id}
                      prayer={prayer}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <TestimonySection />
      <Footer />
    </div>
  )
}
