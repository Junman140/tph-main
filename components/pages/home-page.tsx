"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, type Variants } from "framer-motion"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { ArrowRight, Calendar, MapPin, Clock, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainNav } from "@/components/layout/main-nav"
import { format, formatDistance } from "date-fns"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

// Animation variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } }
}

const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.04 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } }
}

// removed unused carouselImages

// Blog posts are loaded from the database

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
    name: "Pst Caleb George",
    role: "Theater Minister",
  },
]

// Sermon/Podcast type definition
interface Sermon {
  id: string
  title: string
  description: string
  date: string
  duration: number
  imageUrl: string
  audioUrl: string
}

// Function to fetch sermons from the API
async function fetchSermons() {
  const response = await fetch('/api/spotify')
  if (!response.ok) {
    throw new Error('Failed to fetch sermons')
  }
  return response.json() as Promise<Sermon[]>
}

// Sermon card component for homepage
function SermonCard({ sermon }: { sermon: Sermon }) {
  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader className="flex-1 p-4">
        <div className="relative h-40 w-full mb-3">
          {sermon.imageUrl ? (
            <Image
              src={sermon.imageUrl}
              alt={sermon.title}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <Headphones className="h-10 w-10 text-gray-400" />
            </div>
          )}
        </div>
        <CardTitle className="text-lg mb-2 line-clamp-1">{sermon.title}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground space-x-3 mb-2">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDistance(new Date(sermon.date), new Date(), { addSuffix: true })}
          </div>
          {sermon.duration && (
            <div className="flex items-center">
              <Headphones className="h-3 w-3 mr-1" />
              {Math.floor(sermon.duration / 60000)} min
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{sermon.description}</p>
        <a
          href={sermon.audioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-primary hover:underline mt-auto text-sm"
        >
          Listen on Spotify
          <svg
            className="ml-1 h-3 w-3"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
        </a>
      </CardContent>
    </Card>
  )
}

// Skeleton loader for sermons
function SermonSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-40 w-full mb-3" />
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
    </Card>
  )
}

// Home Pastors subsection
function HomePastors() {
  interface PastorItem {
    id: string
    imageUrl: string
    altText?: string | null
    name: string
    isSenior?: boolean
    title?: string
    bio?: string
  }

  const [pastors, setPastors] = useState<PastorItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPastors = async () => {
      try {
        const res = await fetch('/api/pastors?active=true')
        if (!res.ok) throw new Error('Failed to fetch pastors')
        const data = await res.json()
        setPastors(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch pastors')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPastors()
  }, [])

  if (isLoading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[0,1].map(i => (
        <Card key={i} className="overflow-hidden">
          <div className="relative aspect-[4/3]">
            <Skeleton className="w-full h-full" />
          </div>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      ))}
    </div>
  )

  if (error || !pastors) return null

  const items = pastors.slice(0, 4)

  return (
    <div className="space-y-12">
      {items.map((p, index) => (
        <div key={p.id} className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}>
          <div className="relative aspect-[4/3] w-full">
            <Image src={p.imageUrl} alt={p.altText || p.name} fill className="object-cover rounded-lg" />
          </div>
          <div>
            {p.isSenior && <Badge className="mb-2">Senior Pastor</Badge>}
            <h3 className="text-2xl font-semibold">{p.name}</h3>
            <p className="text-muted-foreground mb-3">{p.title}</p>
            <p className="leading-relaxed line-clamp-5">{p.bio}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// Component to fetch and display featured events from database
function FeaturedEvents() {
  interface EventItem {
    id: string
    title: string
    description?: string | null
    date: string
    imageUrl?: string | null
    altText?: string | null
    location?: string | null
    isActive?: boolean
    registrationFormFields?: { type?: string; time?: string } | null
  }

  const [events, setEvents] = useState<EventItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events')
        if (!response.ok) throw new Error('Failed to fetch events')
        const data = await response.json()
        setEvents(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="h-full">
            <div className="aspect-video">
              <Skeleton className="w-full h-full" />
            </div>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !events) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg text-red-600">
        <p>Unable to load events at this time. Please check back later.</p>
      </div>
    )
  }

  const featuredEvents = events
    .filter((event: EventItem) => event.isActive)
    .slice(0, 3) // Show only first 3 events

  if (featuredEvents.length === 0) {
    return (
      <div className="text-center p-8 bg-yellow-50 rounded-lg text-yellow-600">
        <p>No events scheduled at this time. Check back soon for upcoming events.</p>
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {featuredEvents.map((event: EventItem) => {
        const eventDate = new Date(event.date)
        const eventType = event.registrationFormFields?.type || 'Event'
        const eventTime = event.registrationFormFields?.time || ''

        return (
          <motion.div
            key={event.id}
            variants={fadeUp}
          >
            <Card className="h-full">
              <motion.div className="aspect-video relative" variants={imageReveal}>
                <Image src={event.imageUrl || '/events/bg.jpeg'} alt={event.altText || event.title} fill className="object-cover rounded-t-lg" />
                <div className="absolute top-4 right-4">
                  <Badge>{eventType}</Badge>
                </div>
              </motion.div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {event.description}
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(eventDate, 'EEEE, MMMM do, yyyy')}
                  </p>
                  {eventTime && (
                    <p className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {eventTime}
                    </p>
                  )}
                  {event.location && (
                    <p className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

// Component to fetch and display sermons on the homepage
function HomepageSermons() {
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSermonsData = async () => {
      try {
        const data = await fetchSermons()
        setSermons(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch sermons')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSermonsData()
  }, [])

  // Display loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <SermonSkeleton key={index} />
        ))}
      </div>
    )
  }

  // Display error state
  if (error || !sermons) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg text-red-600">
        <p>Unable to load sermons at this time. Please check back later.</p>
      </div>
    )
  }

  // If no sermons are available
  if (sermons.length === 0) {
    return (
      <div className="text-center p-8 bg-yellow-50 rounded-lg text-yellow-600">
        <p>No sermons available at this time. Check back soon for new content.</p>
      </div>
    )
  }

  // Display sermons (limit to 4 for homepage)
  const homepageSermons = sermons.slice(0, 4)

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {homepageSermons.map((sermon) => (
        <motion.div key={sermon.id} variants={fadeUp}>
          <SermonCard sermon={sermon} />
        </motion.div>
      ))}
    </motion.div>
  )
}



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

// removed unused Post and PostResponse types

const BlogSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Latest Blog Posts</h2>
          <Link href="/blog">
            <Button variant="outline" className="flex items-center gap-2">
              View All Posts <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="max-w-md space-y-4">
            <h3 className="text-xl font-medium">Explore Our Blog</h3>
            <p className="text-muted-foreground">
              Visit our blog page to discover inspiring articles, devotionals, and updates from The Peculiar House Global.
            </p>
            <Link href="/blog">
              <Button className="mt-4">
                Go to Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()])
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -40])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index)
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

  // removed unused helpers rootNode and scrollToSection

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <main className="flex-grow">
        {/* Hero Section with Video */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/tphh.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-start">
            <motion.div style={{ y: heroY }} className="max-w-2xl text-left text-white" initial="hidden" animate="show" variants={staggerContainer}>
              <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-bold mb-6">
                THE PECULIAR HOUSE GLOBAL
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg md:text-xl mb-8">
                The Birth Place of Generals
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-start">
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
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Sermons and Podcasts Section */}
        <section className="py-16 bg-muted/30 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 border-primary/20 text-primary">
                Latest Content
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Sermons & Podcasts</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Spiritual nourishment for your journey of faith
              </p>
            </div>
            
            {/* Fetch sermons from Spotify API */}
            <HomepageSermons />
            
            <div className="mt-10 text-center">
              <Link href="/sermons">
                <Button variant="outline" className="gap-2">
                  View All Sermons & Podcasts
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Events Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Featured Events</h2>
            <FeaturedEvents />
          </div>
        </section>


        {/* Our Pastors Section */}
        <section className="py-16 bg-muted/30 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 border-primary/20 text-primary">Our Pastors</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">Meet Our Pastors</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">With visionary leadership and a heart to serve, our pastors guide and equip the church.</p>
            </div>

            <HomePastors />

            <div className="text-center mt-10">
              <Link href="/pastors">
                <Button variant="outline" className="gap-2">
                  Meet all pastors
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>



        {/* Gallery Section  */}
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
