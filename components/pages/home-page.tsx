"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, Users, Video, Heart, ChevronDown, Play, User, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainNav } from "@/components/layout/main-nav"
import { format } from "date-fns"
import Image from "next/image"
import { Carousel } from "@/components/ui/carousel"

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
    title: "Sunday Worship Service",
    type: "Worship",
    date: "Every Sunday",
    time: "10:00 AM",
    location: "Main Sanctuary",
    imageUrl: "/gallery/fresh1.jpg",
    description: "Join us for a powerful time of worship and the Word.",
  },
  {
    title: "Youth Conference 2025",
    type: "Conference",
    date: "April 15-17, 2025",
    time: "6:00 PM",
    location: "Youth Center",
    imageUrl: "/gallery/fresh7.jpg",
    description: "Three days of inspiration, worship, and community for young believers.",
  },
  {
    title: "Easter Celebration",
    type: "Special Event",
    date: "April 21, 2025",
    time: "9:00 AM",
    location: "Main Sanctuary",
    imageUrl: "/gallery/fresh4.jpg",
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

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />

      <main className="flex-grow">
        {/* Hero Section with Carousel */}
        <section className="relative h-[90vh]">
          <Carousel 
            images={carouselImages}
            className="h-full"
            overlay={
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-3xl mx-auto text-center px-4"
                >
                  <Badge className="mb-6 text-lg py-2 px-4 bg-primary/20 text-primary border-primary/30">
                    Welcome to TPH Global
                  </Badge>
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Step Into Your Destiny: The House Where <span className="text-primary">Generals Are Forged</span>
                  </h1>
                  <p className="text-xl text-white/80 mb-10 leading-relaxed">
                    Join our community dedicated to raising Kingdom generals through principles of loyalty, holiness, and
                    Anakazo empowerment.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/about">
                      <Button size="lg" className="text-base px-8 py-6 w-full sm:w-auto">
                        Learn More About Us
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/sermons">
                      <Button
                        variant="outline"
                        size="lg"
                        className="text-base px-8 py-6 w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
                      >
                        <Play className="mr-2 h-5 w-5 fill-white" />
                        Watch Sermons
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            }
          />
        </section>

        {/* Quick Links Section */}
        <section id="quick-links" className="py-20 bg-muted/50 dark:bg-muted border-y border-border/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Discover Our Ministry</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore the various aspects of our ministry and find your place in our community
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div whileHover={{ y: -10, transition: { duration: 0.2 } }} className="group">
                <Link href="/sermons">
                  <Card className="h-full overflow-hidden border-border/50 bg-card shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <div className="h-40 bg-primary/10 flex items-center justify-center dark:bg-primary/5">
                      <Video className="h-16 w-16 text-primary" />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-xl mb-2 text-foreground group-hover:text-primary transition-colors">
                        Latest Sermons
                      </h3>
                      <p className="text-muted-foreground/80">
                        Access our latest teachings and spiritual resources for your growth
                      </p>
                      <div className="mt-4 flex items-center text-primary">
                        <span className="text-sm font-medium">Explore Sermons</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -10, transition: { duration: 0.2 } }} className="group">
                <Link href="/events">
                  <Card className="h-full overflow-hidden border-border/50 bg-card shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <div className="h-40 bg-primary/10 flex items-center justify-center dark:bg-primary/5">
                      <Calendar className="h-16 w-16 text-primary" />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-xl mb-2 text-foreground group-hover:text-primary transition-colors">
                        Upcoming Events
                      </h3>
                      <p className="text-muted-foreground/80">
                        Stay updated with our events and conferences
                      </p>
                      <div className="mt-4 flex items-center text-primary">
                        <span className="text-sm font-medium">View Events</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -10, transition: { duration: 0.2 } }} className="group">
                <Link href="/prayer">
                  <Card className="h-full overflow-hidden border-border/50 bg-card shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <div className="h-40 bg-primary/10 flex items-center justify-center dark:bg-primary/5">
                      <Heart className="h-16 w-16 text-primary" />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-xl mb-2 text-foreground group-hover:text-primary transition-colors">
                        Prayer Network
                      </h3>
                      <p className="text-muted-foreground/80">
                        Join our global prayer community
                      </p>
                      <div className="mt-4 flex items-center text-primary">
                        <span className="text-sm font-medium">Join Prayer</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -10, transition: { duration: 0.2 } }} className="group">
                <Link href="/about">
                  <Card className="h-full overflow-hidden border-border/50 bg-card shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <div className="h-40 bg-primary/10 flex items-center justify-center dark:bg-primary/5">
                      <Users className="h-16 w-16 text-primary" />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-xl mb-2 text-foreground group-hover:text-primary transition-colors">
                        Our Community
                      </h3>
                      <p className="text-muted-foreground/80">
                        Connect with fellow believers and grow together in faith
                      </p>
                      <div className="mt-4 flex items-center text-primary">
                        <span className="text-sm font-medium">Meet Our Community</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Events Section */}
        <section id="events" className="py-24 bg-background dark:bg-background/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
              <div>
                <Badge variant="outline" className="mb-4 border-primary/20 text-primary">
                  Upcoming
                </Badge>
                <h2 className="text-4xl font-bold text-foreground">Featured Events</h2>
              </div>
              <Link href="/events">
                <Button variant="outline" className="mt-4 md:mt-0 border-primary/20 text-primary hover:bg-primary/5">
                  View All Events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {FEATURED_EVENTS.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden border-border/50 bg-card shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                    <div className="aspect-video relative">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-primary/90 hover:bg-primary text-white border-0">{event.type}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-xl mb-3 text-foreground">{event.title}</h3>
                      <div className="space-y-2 text-sm text-muted-foreground/80 mb-4">
                        <p className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          {event.date}
                        </p>
                        <p className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-map-pin mr-2 text-primary"
                          >
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {event.location}
                        </p>
                      </div>
                      <Button variant="outline" className="w-full border-border/50 text-foreground hover:bg-primary/5 hover:text-primary">
                        Register Now
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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

        {/* Latest Sermons Section */}
        <section id="watch-sermons" className="py-24 bg-gray-900 dark:bg-background/95 text-white dark:text-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 border-white/20 dark:border-primary/20 text-white/80 dark:text-primary">
                Featured
              </Badge>
              <h2 className="text-4xl font-bold">Latest Sermons</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="aspect-video bg-black/40 rounded-lg overflow-hidden relative group">
                <Image
                  src="/gallery/fresh13.jpg"
                  alt="Latest Sermon"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Button className="rounded-full w-16 h-16 p-0 bg-primary/90 hover:bg-primary hover:scale-110 transition-all duration-300">
                    <Play className="h-6 w-6 fill-white ml-1" />
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <Badge className="bg-primary/20 text-primary border-primary/30">Latest Sermon</Badge>
                <h3 className="text-3xl font-bold text-white dark:text-foreground">The Power of Unwavering Faith</h3>
                <p className="text-white/70 dark:text-muted-foreground leading-relaxed">
                  In this powerful sermon, we explore how maintaining unwavering faith during challenging times can
                  transform your spiritual journey and open doors to divine breakthroughs.
                </p>
                <div className="flex items-center space-x-4 text-white/60 dark:text-muted-foreground">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>Pastor James Wilson</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>March 28, 2025</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Link href="/sermons">
                    <Button variant="outline" className="border-white/20 dark:border-primary/20 text-white dark:text-primary hover:bg-white/10 dark:hover:bg-primary/5">
                      View All Sermons
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-24 bg-background dark:bg-background/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 border-primary/20 text-primary">
                Insights
              </Badge>
              <h2 className="text-4xl font-bold text-foreground">Latest From Our Blog</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {BLOG_POSTS.map((post, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="overflow-hidden border-border/50 bg-card shadow-lg h-full">
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center text-sm text-muted-foreground/80 mb-3">
                        <Calendar className="h-4 w-4 mr-1" />
                        {post.date}
                      </div>
                      <h3 className="font-semibold text-xl mb-3 text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground/80 mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/10 dark:bg-primary/5 flex items-center justify-center text-primary font-medium">
                            {post.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span className="ml-2 text-sm text-foreground">{post.author}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
                          Read More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
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
              <Link href="/auth">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-base px-8 w-full sm:w-auto">
                  Sign Up Now
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10 text-base px-8 w-full sm:w-auto"
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

