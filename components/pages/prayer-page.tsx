"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast, useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Heart, Check } from "lucide-react"
import { TestimonySection } from "./testimony-section"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from 'date-fns'
import { Badge } from "@/components/ui/badge"
import { MainNav } from "@/components/layout/main-nav"

interface Prayer {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  is_private: boolean;
  status: 'pending' | 'answered';
  answered_at: string | null;
  tags: string[];
  prayer_count: number;
  supporting_verses: string[];
  verse_reference: string | null;
}

interface TestimonyFormData {
  title: string;
  content: string;
  isAnonymous: boolean;
}

const prayerSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Prayer request must be at least 10 characters"),
  category: z.string(),
  isPrivate: z.boolean().default(false),
  verseReference: z.string().optional(),
})

function PrayerCard({ prayer }: { prayer: Prayer }) {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  const [showTestimonyForm, setShowTestimonyForm] = useState(false)
  const [testimonyData, setTestimonyData] = useState<TestimonyFormData>({
    title: "",
    content: "",
    isAnonymous: false,
  })

  const markAsAnsweredMutation = useMutation({
    mutationFn: async (data: TestimonyFormData) => {
      if (!supabase) throw new Error("Supabase client not available");

      // In public site, only get public prayers
      let query = supabase
        .from('prayers')
        .select(`
          id,
          created_at,
          user_id,
          title,
          content,
          category,
          is_private,
          status,
          answered_at,
          tags,
          prayer_count,
          supporting_verses,
          verse_reference
        `)
        .eq('is_private', false)  // Only public prayers
        .order('created_at', { ascending: false });

      const { error: prayerError } = await supabase
        .from('prayers')
        .update({ status: 'answered', answered_at: new Date().toISOString() })
        .eq('id', prayer.id);

      if (prayerError) throw prayerError;

      const { error: testimonyError } = await supabase
        .from('testimonies')
        .insert({
          user_id: 'anonymous', // Anonymous user ID for public site
          prayer_id: prayer.id,
          title: data.title,
          content: data.content,
          is_anonymous: true, // Always anonymous in public site
        });

      if (testimonyError) throw testimonyError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayers'] });
      setShowTestimonyForm(false);
      setTestimonyData({ title: "", content: "", isAnonymous: false });
      toast({
        title: "Prayer marked as answered",
        description: "Your testimony has been shared.",
      })
    },
    onError: (error: any) => {
      console.error("Error marking prayer as answered:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to mark prayer as answered",
        variant: "destructive",
      });
    },
  });

  const supportPrayerMutation = useMutation({
    mutationFn: async () => {
      if (!supabase) throw new Error("Supabase client not available");

      // In a public site without authentication, support is tracked anonymously
      // For simplicity, we'll just increment the prayer_count directly
      
      // Create a new anonymous support record
      const { error } = await supabase
        .from('prayer_support')
        .insert({
          user_id: 'anonymous',
          prayer_id: prayer.id,
          created_at: new Date().toISOString()
        });
        
      if (error) throw error;

      // Update prayer count in prayers table
      const { error: updateError } = await supabase
        .from('prayers')
        .update({ prayer_count: prayer.prayer_count + 1 })
        .eq('id', prayer.id);
        
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayers'] });
      toast({
        title: "Prayer Supported",
        description: "Thank you for supporting this prayer."
      })
    },
    onError: (error: any) => {
      console.error("Error supporting prayer:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to support prayer",
        variant: "destructive",
      });
    },
  });

  const handleMarkAsAnswered = () => {
    if (!testimonyData.title || !testimonyData.content) {
      toast({ title: "Missing Information", description: "Please provide a title and content for your testimony.", variant: "destructive" });
      return;
    }
    markAsAnsweredMutation.mutate(testimonyData);
  }

  const handleSupportPrayer = () => {
    supportPrayerMutation.mutate();
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <h3 className="font-semibold">{prayer.title}</h3>
            <p className="text-sm text-muted-foreground">
              {format(new Date(prayer.created_at), "PPP")}
            </p>
          </div>
          <Badge
            variant={prayer.status === "answered" ? "default" : "outline"}
            className={`ml-2 ${
              prayer.status === "answered" && "bg-green-500 hover:bg-green-600"
            }`}
          >
            {prayer.status}
          </Badge>
        </div>

        <p className="text-sm mb-4">{prayer.content}</p>

        {prayer.supporting_verses?.length > 0 && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="text-sm italic">{prayer.supporting_verses.join(" • ")}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="space-x-2"
              onClick={handleSupportPrayer}
              disabled={supportPrayerMutation.isPending}
            >
              <Heart className="h-4 w-4" />
              <span>{prayer.prayer_count || 0}</span>
            </Button>
            {prayer.status !== "answered" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTestimonyForm(true)}
                className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
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

        {showTestimonyForm && (
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
                  id={`anonymous-${prayer.id}`}
                  checked={testimonyData.isAnonymous}
                  onCheckedChange={(checked) =>
                    setTestimonyData({ ...testimonyData, isAnonymous: checked })
                  }
                />
                <Label htmlFor={`anonymous-${prayer.id}`} className="text-sm">Share anonymously</Label>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleMarkAsAnswered}
                  disabled={markAsAnsweredMutation.isPending}
                >
                  {markAsAnsweredMutation.isPending ? "Sharing..." : "Share Testimony"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTestimonyForm(false)}
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
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("prayers")
  const [activeTab, setActiveTab] = useState("all")

  const form = useForm<z.infer<typeof prayerSchema>>({
    resolver: zodResolver(prayerSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "general",
      isPrivate: false,
      verseReference: "",
    },
  })

  const prayersQuery = useQuery({
    queryKey: ['prayers'],
    queryFn: async () => {
      if (!supabase) {
        console.log('Supabase client not available');
        return [];
      }

      const { data, error } = await supabase
        .from('prayers')
        .select(`
          id,
          created_at,
          user_id,
          title,
          content,
          category,
          is_private,
          status,
          answered_at,
          tags,
          prayer_count,
          supporting_verses,
          verse_reference
        `)
        .eq('is_private', false)  // Only public prayers
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching prayers:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!supabase,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const filteredPrayers = prayersQuery.data?.filter(prayer => {
    if (activeTab === "all") return true;
    return prayer.status === activeTab;
  }) || [];

  const submitPrayerMutation = useMutation({
    mutationFn: async (data: z.infer<typeof prayerSchema>) => {
      if (!supabase) {
        throw new Error("Supabase client not available");
      }

      const { error } = await supabase
        .from('prayers')
        .insert([
          {
            user_id: 'anonymous', // Anonymous user for public site
            title: data.title,
            content: data.content,
            category: data.category,
            is_private: false, // All prayers are public in public site
            verse_reference: data.verseReference,
            status: 'pending'
          }
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayers'] });
      form.reset();
      setTab('prayers');
      toast({
        title: "Prayer request submitted",
        description: "Your prayer request has been shared with the community.",
      });
    },
    onError: (error: any) => {
      console.error("Error submitting prayer:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit prayer request",
        variant: "destructive",
      });
    },
  });

  if (!isLoaded || isLoadingPrayers) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  const onSubmit = (data: z.infer<typeof prayerSchema>) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to submit prayer requests",
        variant: "destructive",
      });
      return;
    }
    submitPrayerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold mb-8 text-center">Prayer Network</h1>

        <Tabs defaultValue="submit" className="space-y-6">
          <TabsList>
            <TabsTrigger value="submit">Submit Prayer</TabsTrigger>
            <TabsTrigger value="prayers">Prayer Wall</TabsTrigger>
          </TabsList>

          <TabsContent value="submit">
            <Card>
              <CardHeader>
                <CardTitle>Submit Prayer Request</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prayer Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter a title for your prayer request" {...field} />
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
                              <option value="spiritual-growth">Spiritual Growth</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="verseReference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Supporting Bible Verse (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., John 3:16" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Private prayer option removed in public site */}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={submitPrayerMutation.isPending}
                    >
                      {submitPrayerMutation.isPending ? (
                        <>Submitting...</>
                      ) : (
                        'Submit Prayer Request'
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prayers">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
              <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All Prayers</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="answered">Answered</TabsTrigger>
                </TabsList>
              <TabsContent value={activeTab}>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                  {filteredPrayers.length > 0 ? (
                    filteredPrayers.map((prayer) => (
                      <PrayerCard key={prayer.id} prayer={prayer} />
                    ))
                  ) : (
                    <p className="text-center col-span-full text-muted-foreground">
                      No {activeTab !== 'all' ? activeTab : ''} prayers found.
                    </p>
                  )}
                    </div>
                </TabsContent>
              </Tabs>
          </TabsContent>
        </Tabs>

        <TestimonySection />

      </main>
    </div>
  )
}
