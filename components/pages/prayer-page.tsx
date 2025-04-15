"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
import { Heart, Check } from "lucide-react"
import { TestimonySection } from "./testimony-section"
import { useSupabase } from "@/app/providers/supabase-provider"
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
  const { toast } = useToast()
  const { user } = useUser();
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
      if (!user || !supabase) throw new Error("User or Supabase client not available");

      const { error: prayerError } = await supabase
        .from('prayers')
        .update({ status: 'answered', answered_at: new Date().toISOString() })
        .eq('id', prayer.id);

      if (prayerError) throw prayerError;

      const { error: testimonyError } = await supabase
        .from('testimonies')
        .insert({
          user_id: user.id,
          prayer_id: prayer.id,
          title: data.title,
          content: data.content,
          is_anonymous: data.isAnonymous,
        });

      if (testimonyError) throw testimonyError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayers', user?.id] });
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
      if (!user || !supabase) throw new Error("User or Supabase client not available");

      const { data: existingSupport, error: checkError } = await supabase
        .from('prayer_support')
        .select('id')
        .eq('user_id', user.id)
        .eq('prayer_id', prayer.id)
        .maybeSingle();

      if (checkError) throw checkError;
      if (existingSupport) {
        toast({ title: "Already Supported", description: "You are already supporting this prayer.", variant: "default" });
        return;
      }

      const { error: supportError } = await supabase
        .from('prayer_support')
        .insert({ user_id: user.id, prayer_id: prayer.id, commitment: 'once' });

      if (supportError) throw supportError;

      const { error: rpcError } = await supabase.rpc('increment_prayer_count', {
        prayer_id_param: prayer.id
      });

      if (rpcError) {
        console.error("Failed to increment prayer count:", rpcError);
        throw new Error("Failed to update prayer count.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayers', user?.id] });
      toast({
        title: "Prayer supported",
        description: "Thank you for supporting this prayer request.",
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
  const { user, isLoaded } = useUser()
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

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

  const { data: prayersData, isLoading: isLoadingPrayers } = useQuery<Prayer[]>({
    queryKey: ['prayers', user?.id],
    queryFn: async () => {
      if (!user || !supabase) {
        console.log('User or Supabase client not available');
        return [];
      }

      try {
        console.log('Fetching prayers for user:', user.id);
        // First check if we have any prayers for this user
        const { data: existingPrayers, error: checkError } = await supabase
          .from('prayers')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (checkError) {
          // If there's an error, it might be because we need to create a mapping first
          console.log('Initial fetch error:', checkError);
          
          // Create user mapping if it doesn't exist
          const { error: mappingError } = await supabase
            .from('user_mappings')
            .upsert({
              clerk_id: user.id,
              email: user.emailAddresses[0]?.emailAddress || '',
              last_seen: new Date().toISOString()
            }, {
              onConflict: 'clerk_id'
            });

          if (mappingError) {
            console.error('Error creating user mapping:', mappingError);
            throw mappingError;
          }

          // Try fetching prayers again after mapping is created
          const { data: retryData, error: retryError } = await supabase
            .from('prayers')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (retryError) {
            console.error('Error fetching prayers after mapping:', retryError);
            throw retryError;
          }

          return retryData || [];
        }

        return existingPrayers || [];
      } catch (error: any) {
        console.error('Detailed error:', {
          error,
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        toast({
          title: 'Error fetching prayers',
          description: error.message || 'Failed to load prayers. Please try again.',
          variant: 'destructive',
        });
        throw error;
      }
    },
    enabled: !!user && !!supabase,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const filteredPrayers = prayersData?.filter(prayer => {
    if (activeTab === "all") return true;
    return prayer.status === activeTab;
  }) || [];

  const submitPrayerMutation = useMutation({
    mutationFn: async (data: z.infer<typeof prayerSchema>) => {
      if (!user || !supabase) throw new Error("User or Supabase client not available");

      const { error } = await supabase.from('prayers').insert({
        user_id: user.id,
        title: data.title,
        content: data.content,
        category: data.category,
        is_private: data.isPrivate,
        verse_reference: data.verseReference || null,
        status: 'pending',
        prayer_count: 0,
        tags: [],
        supporting_verses: data.verseReference ? [data.verseReference] : [],
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayers'] });
      form.reset();
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
                    <FormField
                      control={form.control}
                      name="isPrivate"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-0.5">
                            <FormLabel>Private Prayer</FormLabel>
                            <FormDescription>
                              Only you will be able to see this prayer request
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
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
