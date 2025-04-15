"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, Users, Video, Heart, ChevronDown, Play, User, MapPin, Clock, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainNav } from "@/components/layout/main-nav"
import { format, formatDistanceToNow } from "date-fns"
import Image from "next/image"
import { Carousel } from "@/components/ui/carousel"
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useSupabase } from "@/app/providers/supabase-provider"
import { useQuery } from "@tanstack/react-query"

const carouselImages = [
  {
    src: "/gallery/fresh1.jpg",
    alt: "Sunday Worship Service",
    description: "Experience the power of worship together",
  },
  {
    src: "/gallery/fresh2.jpg",
    alt: "Community Fellowship",
    description: "Growing together in faith and love",
  },
  {
    src: "/gallery/fresh3.jpg",
    alt: "Youth Ministry",
    description: "Empowering the next generation",
  },
]

const BLOG_POSTS = [
  {
    title: "Finding Peace in Chaos",
    author: "Pastor James Wilson",
    date: "March 15, 2025",
    imageUrl: "/gallery/fresh10.jpg",
    excerpt: "Discover how to maintain inner peace during life's most challenging moments.",
  },
  {
    title: "The Power of Community",
    author: "Sarah Johnson",
    date: "March 10, 2025",
    imageUrl: "/gallery/fresh11.jpg",
    excerpt: "Why Christian fellowship is essential for spiritual growth and support.",
  },
  {
    title: "Walking in Faith",
    author: "David Thompson",
    date: "March 5, 2025",
    imageUrl: "/gallery/fresh12.jpg",
    excerpt: "Practical steps to strengthen your faith walk in everyday life.",
  },
]

const FEATURED_EVENTS = [
  {
    title: "Women Of Substance",
    type: "Confrence",
    date: "Sunday, 13th April 2025",
    time: "08:00 AM",
    location: "Main Sanctuary",
    imageUrl: "/events/woman of substance 2025B.jpg",
    description: "Join us for a powerful time of worship and the Word.",
  },
  {
    title: "Dominion 2025 System",
    type: "Conference",
    date: "Sunday, 13th May 2025",
    time: "08:00 AM",
    location: "Main Sanctuary",
    imageUrl: "/events/DOMINION 2025 SYSTEM.jpg",
    description: "Three days of inspiration, worship, and community for believers.",
  },
  {
    title: "Alive Music Experience",
    type: "Special Event",
    date: "Sunday, 21st March 2025",
    time: "08:00 AM",
    location: "Main Sanctuary",
    imageUrl: "/events/ALIVE MUSIC EXPIRIENCE COTH.jpg",
    description: "Celebrate the resurrection of Christ with special music and activities.",
  },
]

const TESTIMONIALS = [
  {
    quote: "TPH Global has transformed my spiritual journey and equipped me with leadership skills I never knew I had.",
    name: "Esther Jakes",
    role: "Music leader",
  },
  {
    quote:
      "The Anakazo training program provided me with practical tools to lead effectively in both spiritual and professional contexts.",
    name: "Pst Edima",
    role: "Chief editor",
  },
  {
    quote:
      "The community at TPH Global has become my spiritual family, supporting me through every step of my faith journey.",
    name: "Pst Peace Ekarika",
    role: "Campus president",
  },
]

const GALLERY_ITEMS = [
  {
    id: 1,
    src: "/gallery/aud3.jpg",
    alt: "Church Auditorium",
    description: "Our beautiful sanctuary where we gather to worship"
  },
  {
    id: 2,
    src: "/gallery/aud2.jpg",
    alt: "Church Service",
    description: "Experiencing God's presence together in worship"
  },
  {
    id: 3,
    src: "/gallery/BREAKFORTH.jpg",
    alt: "Break Forth",
    description: "Special moments from our Break Forth event"
  },
  {
    id: 4,
    src: "/gallery/dance.jpg",
    alt: "Praise Dance",
    description: "Expressing worship through dance ministry"
  },
  {
    id: 5,
    src: "/gallery/drama.jpg",
    alt: "Drama Ministry",
    description: "Creative expressions through our drama ministry"
  }
]

function CarouselDots({ selectedIndex, length, onClick }: { selectedIndex: number; length: number; onClick: (index: number) => void }) {
  return (
    <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
      {Array.from({ length }).map((_, i) => (
        <button
          key={i}
          className={`w-2 h-2 rounded-full transition-all ${
            i === selectedIndex 
              ? 'bg-primary w-4' 
              : 'bg-primary/50 hover:bg-primary/75'
          }`}
          onClick={() => onClick(i)}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  )
}

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  users?: {
    name: string;
  };
  created_at: string;
  published: boolean;
}

type PostResponse = {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  slug: string;
  created_at: string;
  published: boolean;
  users: {
    name: string;
  } | null;
}

const BlogSection = () => {
  const supabase = useSupabase();

  const { data: posts = [], isLoading: isLoadingPosts } = useQuery<Post[]>({
    queryKey: ['published_posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, excerpt, slug, created_at, published, users:users(name)')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching posts:", error);
        return [];
      }

      return (data || []).map((post: any): Post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || undefined,
        slug: post.slug,
        created_at: post.created_at,
        published: post.published,
        users: post.users || undefined
      }));
    },
  });

  if (isLoadingPosts) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Latest Blog Posts</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Latest Blog Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-0">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-muted-foreground line-clamp-2">
                      {post.excerpt || post.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center mt-4">
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground">
                          By {post.users?.name || 'Unknown Author'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi && emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.on("select", () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    })
  }, [emblaApi])

  const rootNode = useCallback((emblaRoot: any) => {
    if (emblaRoot) {
      emblaRef(emblaRoot)
    }
  }, [emblaRef])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/gallery/fresh1.jpg"
              alt="TPH Global"
              fill
              className="object-cover brightness-50"
              priority
            />
          </div>
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Step Into Your Destiny
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              The Birth Place of Generals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white hover:bg-white/90 text-primary hover:text-primary/90"
                asChild
              >
                <Link href="/about">Learn More About Us</Link>
              </Button>
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                asChild
              >
                <Link href="/sermons">Listen to Sermons</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Events Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Featured Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURED_EVENTS.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <div className="aspect-video relative">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge>{event.type}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {event.description}
                      </p>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {event.date}
                        </p>
                        <p className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {event.time}
                        </p>
                        <p className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {event.location}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section (Replacing Sermons) */}
        <section className="relative h-[600px] overflow-hidden">
          <div className="absolute inset-0 z-10 bg-black/50 flex flex-col items-center justify-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">Our Gallery</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl text-center px-4">
              Capturing moments of worship, fellowship, and community
            </p>
            <Link href="/gallery">
              <Button 
                variant="secondary" 
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                View Full Gallery
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="absolute inset-0">
            <div className="h-full" ref={emblaRef}>
              <div className="h-full flex">
                {GALLERY_ITEMS.map((item) => (
                  <div key={item.id} className="relative h-full flex-[0_0_100%]">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      priority
                      sizes="100vw"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                      <h3 className="text-2xl font-bold mb-2 text-white">{item.alt}</h3>
                      <p className="text-white/80">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <CarouselDots 
              selectedIndex={selectedIndex}
              length={GALLERY_ITEMS.length}
              onClick={scrollTo}
            />
          </div>
        </section>

        {/* Blog Posts Section */}
        <BlogSection />

        {/* Testimonials Section */}
        <section className="py-24 bg-muted/50 dark:bg-muted border-y border-border/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 border-primary/20 text-primary">
                Testimonials
              </Badge>
              <h2 className="text-4xl font-bold text-foreground">What Our Community Says</h2>
            </div>

            <div className="relative h-[300px] overflow-hidden">
              {TESTIMONIALS.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: currentTestimonial === index ? 1 : 0,
                    scale: currentTestimonial === index ? 1 : 0.9,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="max-w-3xl mx-auto border-border/50 bg-background shadow-lg">
                    <CardContent className="p-10 text-center">
                      <svg
                        className="h-12 w-12 text-primary/20 mx-auto mb-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                      <p className="text-xl mb-6 text-foreground">{testimonial.quote}</p>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground/80">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  className={`h-3 w-3 rounded-full mx-1 transition-colors ${
                    currentTestimonial === index ? "bg-primary" : "bg-primary/20 dark:bg-primary/10"
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary dark:bg-primary/90 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Join Our Community Today</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-10">
              Become part of a global community dedicated to spiritual growth, leadership development, and making a
              positive impact in the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/about">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-base px-8 w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
