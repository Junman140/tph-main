"use client"

import Image from "next/image"
import useEmblaCarousel from 'embla-carousel-react'
import { useEffect, useState, useCallback } from 'react'
import styles from './gallery.module.css'
import Autoplay from 'embla-carousel-autoplay'
import { MainNav } from "@/components/layout/main-nav"

interface GalleryItem {
  id: number
  src: string
  alt: string
  description: string
}

const featuredItems = [
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
  }
]

const ministryItems = [
  {
    id: 1,
    src: "/gallery/dance.jpg",
    alt: "Praise Dance",
    description: "Expressing worship through dance ministry"
  },
  {
    id: 2,
    src: "/gallery/drama.jpg",
    alt: "Drama Ministry",
    description: "Creative expressions through our drama ministry"
  },
  {
    id: 3,
    src: "/gallery/media.jpg",
    alt: "Media Team",
    description: "Our dedicated media team in action"
  }
]

const communityItems = [
  {
    id: 1,
    src: "/gallery/smile.jpg",
    alt: "Community",
    description: "Sharing joy and fellowship together"
  },
  {
    id: 2,
    src: "/gallery/pst-isiah.jpg",
    alt: "Pastor Isaiah",
    description: "Words of wisdom from Pastor Isaiah"
  },
  {
    id: 3,
    src: "/gallery/fresh13.jpg",
    alt: "Worship Moment",
    description: "Powerful worship experience"
  }
]

function ImageSection({ title, items }: { title: string; items: GalleryItem[] }) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-4 text-foreground">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div 
            key={item.id}
            className="relative group cursor-pointer"
          >
            <div className="aspect-[16/9] relative overflow-hidden rounded-md">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-foreground font-medium">{item.alt}</p>
              <p className="text-muted-foreground text-sm">{item.description}</p>
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />
      <div className="flex-grow">
        <div className="relative h-[70vh] w-full mb-12 overflow-hidden">
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
            <h1 className="text-6xl font-bold text-center text-foreground">Our Gallery</h1>
          </div>
          
          <div className="absolute inset-0">
            <div className={styles.embla} ref={emblaRef}>
              <div className={styles.embla__container}>
                {featuredItems.map((item) => (
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
                length={featuredItems.length}
                onClick={scrollTo}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-12">
          <ImageSection title="Ministry Moments" items={ministryItems} />
          <ImageSection title="Community Life" items={communityItems} />
        </div>
      </div>
    </div>
  )
} 