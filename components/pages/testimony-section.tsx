"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format, formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useQuery } from "@tanstack/react-query"

// Define types for Supabase data
interface Testimony {
  id: string;
  created_at: string;
  user_id: string;
  prayer_id: string;
  title: string;
  content: string;
  prayer_duration_days: number | null;
  tags: string[];
  likes: number;
  is_anonymous: boolean;
  verse_reference: string | null;
  media_urls: string[];
  // Joined data (adjust based on actual query)
  users: {
    name: string | null;
    image: string | null;
  } | null;
  prayers: {
    category: string;
  } | null;
}

export function TestimonySection() {
  const supabase = useSupabaseClient();

  // Fetch testimonies using Tanstack Query
  const { data: testimonies, isLoading: isLoadingTestimonies } = useQuery<Testimony[]>({ // Specify type
     queryKey: ['public_testimonies'], // Query key for public testimonies
     queryFn: async () => {
       if (!supabase) return [];
       // Query needs to join users and prayers table for details
       // Note: Adjust the SELECT statement based on desired fields and RLS policies
       const { data, error } = await supabase
         .from('testimonies')
         .select(`
           *,
           users ( name, image ),
           prayers ( category )
         `)
         .eq('is_anonymous', false) // Example: Only show non-anonymous or adjust based on RLS
         .order('created_at', { ascending: false })
         .limit(10);

       if (error) {
         console.error("Error fetching testimonies:", error);
         throw new Error(error.message);
       }
       return data || [];
     },
     enabled: !!supabase, // Only run query when supabase is available
  });

  if (isLoadingTestimonies) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-muted">
            <CardContent className="h-48" />
          </Card>
        ))}
      </div>
    )
  }

  if (!testimonies || testimonies.length === 0) {
     return (
       <section className="py-12">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <h2 className="text-3xl font-bold mb-4">Testimonies of Answered Prayers</h2>
             <p className="text-muted-foreground">
               No public testimonies available yet. Be the first to share!
             </p>
         </div>
       </section>
    )
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Testimonies of Answered Prayers</h2>
          <p className="text-muted-foreground">
            Celebrating God's faithfulness through answered prayers in our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonies.map((testimony) => (
            <Card key={testimony.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {!testimony.is_anonymous && testimony.users && (
                      <>
                        <Avatar>
                          <AvatarImage src={testimony.users.image ?? undefined} />
                          <AvatarFallback>{testimony.users.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{testimony.users.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(testimony.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </>
                    )}
                    {testimony.is_anonymous && (
                      <div>
                        <p className="font-medium">Anonymous</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(testimony.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    )}
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Answered Prayer
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">{testimony.title}</h3>
                    <p className="text-sm text-muted-foreground">{testimony.content}</p>
                  </div>

                  {testimony.verse_reference && (
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm italic">"{testimony.verse_reference}"</p>
                    </div>
                  )}

                  {testimony.prayers && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Category: </span>
                      <Badge variant="secondary">{testimony.prayers.category}</Badge>
                    </div>
                  )}

                  <div className="pt-4 border-t flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" className="space-x-2">
                        <Heart className="h-4 w-4" />
                        <span>{testimony.likes || 0}</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Share Your Prayer
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {testimony.prayer_duration_days !== null && (
                <div className="mt-4 text-sm text-muted-foreground">
                     <p>Prayer answered after {testimony.prayer_duration_days} days</p>
                </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
