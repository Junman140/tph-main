"use client"

import Image from "next/image"
import useEmblaCarousel from 'embla-carousel-react'
import { useEffect, useState, useCallback } from 'react'
import styles from './gallery.module.css'
import Autoplay from 'embla-carousel-autoplay'
import { MainNav } from "@/components/layout/main-nav"
import { 
  getAllGalleryItems, 
  getFeaturedItems, 
  getMinistryItems, 
  getCommunityItems, 
  getWorshipItems, 
  getLeadershipItems, 
  getEventItems,
  type GalleryItem 
} from "@/lib/gallery-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"

function ImageSection({ title, items, category }: { title: string; items: GalleryItem[]; category?: string }) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        {category && (
          <Badge variant="outline" className="text-sm">
            {items.length} photos
          </Badge>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <div 
            key={item.id}
            className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div className="aspect-[4/3] relative overflow-hidden">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-lg mb-1">{item.alt}</h3>
                <p className="text-white/80 text-sm line-clamp-2">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

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

export default function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  
  // Initialize autoplay plugin
  const autoplayOptions = {
    delay: 5000,
    stopOnInteraction: false,
    rootNode: (emblaRoot: any) => emblaRoot.parentElement,
  }
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'center',
      skipSnaps: false,
    }, 
    [Autoplay(autoplayOptions)]
  )

  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index)
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  const featuredItems = getFeaturedItems()
  const ministryItems = getMinistryItems()
  const communityItems = getCommunityItems()
  const worshipItems = getWorshipItems()
  const leadershipItems = getLeadershipItems()
  const eventItems = getEventItems()

  const categories = [
    { id: 'all', name: 'All Photos', count: getAllGalleryItems().length },
    { id: 'featured', name: 'Featured', count: featuredItems.length },
    { id: 'worship', name: 'Worship', count: worshipItems.length },
    { id: 'ministry', name: 'Ministry', count: ministryItems.length },
    { id: 'leadership', name: 'Leadership', count: leadershipItems.length },
    { id: 'community', name: 'Community', count: communityItems.length },
    { id: 'events', name: 'Events', count: eventItems.length },
  ]

  const getFilteredItems = () => {
    switch (activeCategory) {
      case 'featured': return featuredItems
      case 'worship': return worshipItems
      case 'ministry': return ministryItems
      case 'leadership': return leadershipItems
      case 'community': return communityItems
      case 'events': return eventItems
      default: return getAllGalleryItems()
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />
      <div className="flex-grow">
        {/* Hero Section with Carousel */}
        <div className="relative h-[70vh] w-full mb-12 overflow-hidden">
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-center text-foreground mb-4">Our Gallery</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Capturing moments of worship, fellowship, and community at The Peculiar House Global
              </p>
            </div>
          </div>
          
          <div className="absolute inset-0">
            <div className={styles.embla} ref={emblaRef}>
              <div className={styles.embla__container}>
                {featuredItems.slice(0, 5).map((item) => (
                  <div key={item.id} className={styles.embla__slide}>
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      priority
                      sizes="100vw"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background to-transparent">
                      <h2 className="text-2xl font-bold mb-2 text-foreground">{item.alt}</h2>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <CarouselDots 
                selectedIndex={selectedIndex}
                length={Math.min(featuredItems.length, 5)}
                onClick={scrollTo}
              />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="container mx-auto px-4 mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className="flex items-center gap-2"
              >
                {category.name}
                <Badge variant="secondary" className="ml-1">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="container mx-auto px-4 pb-12">
          {activeCategory === 'all' ? (
            <>
              <ImageSection title="Featured Moments" items={featuredItems} />
              <ImageSection title="Worship & Praise" items={worshipItems} />
              <ImageSection title="Ministry Teams" items={ministryItems} />
              <ImageSection title="Leadership" items={leadershipItems} />
              <ImageSection title="Community Life" items={communityItems} />
              <ImageSection title="Special Events" items={eventItems} />
            </>
          ) : (
            <ImageSection 
              title={categories.find(c => c.id === activeCategory)?.name || 'Gallery'} 
              items={getFilteredItems()} 
              category={activeCategory}
            />
          )}
        </div>
      </div>
    </div>
  )
} 