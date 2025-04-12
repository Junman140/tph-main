"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format, formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { useConvex, useQuery } from "convex/react"

export function TestimonySection() {
  const convex = useConvex()

  const testimonies = useQuery(api.prayers.getPublicTestimonies, {
    limit: 10,
  }) || [];

  if (!testimonies.length) {
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
            <Card key={testimony._id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {!testimony.isAnonymous && testimony.user && (
                      <>
                        <Avatar>
                          <AvatarImage src={testimony.user.image} />
                          <AvatarFallback>{testimony.user.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{testimony.user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(testimony.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </>
                    )}
                    {testimony.isAnonymous && (
                      <div>
                        <p className="font-medium">Anonymous</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(testimony.createdAt), { addSuffix: true })}
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

                  {testimony.verseReference && (
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm italic">"{testimony.verseReference}"</p>
                    </div>
                  )}

                  {testimony.prayer && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Category: </span>
                      <Badge variant="secondary">{testimony.prayer.category}</Badge>
                    </div>
                  )}

                  <div className="pt-4 border-t flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" className="space-x-2">
                        <Heart className="h-4 w-4" />
                        <span>{testimony.likes}</span>
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

                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Prayer answered after {testimony.prayerDuration} days</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
