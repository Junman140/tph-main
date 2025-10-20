"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { MainNav } from '@/components/layout/main-nav'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Pastor {
  id: string
  name: string
  title: string
  bio: string
  imageUrl: string
  altText?: string | null
  order: number
  isSenior: boolean
  isActive: boolean
  slug: string
  socialInstagram?: string | null
}

export default function PastorsPage() {
  const [pastors, setPastors] = useState<Pastor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/pastors?active=true')
        if (!res.ok) throw new Error('Failed to load pastors')
        const data = await res.json()
        setPastors(data)
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <div className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-3">Our Leadership</Badge>
            <h1 className="text-4xl font-bold">Our Pastors</h1>
            <p className="text-muted-foreground mt-2">Meet the leaders serving our church community</p>
          </div>

          {loading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="space-y-12">
            {pastors.map((p, index) => (
              <div key={p.id} className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}>
                <div className="relative aspect-[4/3] w-full">
                  <Image src={p.imageUrl} alt={p.altText || p.name} fill className="object-cover rounded-lg" />
                </div>
                <div>
                  {p.isSenior && <Badge className="mb-2">Senior Pastor</Badge>}
                  <h2 className="text-2xl font-semibold">{p.name}</h2>
                  <p className="text-muted-foreground mb-3">{p.title}</p>
                  <p className="leading-relaxed">{p.bio}</p>
                  {p.socialInstagram && (
                    <a href={p.socialInstagram} target="_blank" rel="noopener noreferrer" className="inline-block mt-4">
                      <Button variant="outline">Follow on Instagram</Button>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


