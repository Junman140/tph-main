"use client" 
import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, Filter, Users, Handshake, Heart } from 'lucide-react'
import Image from "next/image"
import { MainNav } from "@/components/layout/main-nav"

interface GalleryItem {
  id: string
  title: string
  description?: string
  imageUrl: string
  altText?: string
  category?: string
  isActive: boolean
  sortOrder: number
  driveLink?: string
  createdAt: string
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await fetch('/api/gallery?active=true')
        if (!response.ok) throw new Error('Failed to fetch gallery items')
        
        const data = await response.json()
        setGalleryItems(data)
      } catch (error) {
        setError((error as Error).message)
        console.error('Error fetching gallery items:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGalleryItems()
  }, [])

  const involvementItems = [
      { icon: Users, title: "Service pictures", description: "Welcome to TPH gallery, where everything beautiful is found", buttonText: "Fellowship with us today", href: "/#" },
      { icon: Handshake, title: "Partner with us", description: "Collaborate to expand our reach.", buttonText: "Partner with us", href: "https://tph-global.com/donate" },
      { icon: Heart, title: "Donate", description: "Support welfare, and reaching the unreached", buttonText: "Donate", href: "https://tph-global.com//donate" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      {/* Video Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
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
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="search"
                placeholder="Search gallery..."
                className="bg-background border-none pl-10 w-full rounded-full"
              />
            </div>
            <Button variant="outline" className="bg-background border-none rounded-full">
              <Filter size={16} className="mr-2" />
              Filter
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="bg-[#1E1E1E] border border-gray-800 rounded-lg overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-700"></div>
                  <div className="p-2 md:p-3">
                    <div className="h-3 bg-gray-700 rounded mb-1"></div>
                    <div className="h-2 bg-gray-700 rounded w-2/3"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading gallery: {error}</p>
            </div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No gallery items found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {galleryItems.map((item) => (
                <Card key={item.id} className="bg-[#1E1E1E] border border-gray-800 rounded-lg overflow-hidden group flex flex-col hover:shadow-lg transition-all duration-300">
                  <div className="aspect-square relative">
                    <Image 
                      src={item.imageUrl} 
                      alt={item.altText || item.title} 
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                    {item.driveLink && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <a href={item.driveLink} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                            View Album
                          </Button>
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="p-2 md:p-3 mt-auto">
                    <h3 className="font-semibold text-sm md:text-base line-clamp-1">{item.title}</h3>
                    <p className="text-gray-400 text-xs md:text-sm">
                      {new Date(item.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <section className="mt-16 mb-8 bg-[#06010ed8] border border-gray-800 rounded-2xl p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Get Involved</h2>
                <p className="text-gray-400 mb-6 md:mb-8">You can be part of this life-changing Community!</p>
                <div className="space-y-4 md:space-y-6">
                  {involvementItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 md:gap-4">
                      <div className="bg-[#1676e49a] p-2 rounded-full text-black flex-shrink-0">
                        <item.icon size={16} className="md:w-5 md:h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm md:text-base">{item.title}</h3>
                        <p className="text-gray-400 text-xs md:text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-md aspect-[4/3]">
                  <Image src="/gallery/aud.jpg" alt="Get Involved" fill className="object-cover rounded-lg" />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 md:gap-4 mt-6 md:mt-8 justify-center md:justify-start">
              {involvementItems.map((item, index) => (
                <a href={item.href} key={index}>
                  <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
                    {item.buttonText}
                  </Button>
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
