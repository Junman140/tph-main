import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as z from 'zod'

const pastorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  bio: z.string().min(1, 'Bio is required'),
  imageUrl: z.string().min(1, 'Image URL is required'),
  altText: z.string().optional().nullable(),
  order: z.number().int().nonnegative().default(0).optional(),
  isSenior: z.boolean().default(false).optional(),
  isActive: z.boolean().default(true).optional(),
  slug: z.string().min(1, 'Slug is required'),
  socialInstagram: z.string().optional().nullable(),
})

// GET /api/pastors - list pastors (optionally only active)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const active = searchParams.get('active')

    const pastors = await prisma.pastor.findMany({
      where: active === 'true' ? { isActive: true } : undefined,
      orderBy: [
        { isSenior: 'desc' },
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
    })

    return NextResponse.json(pastors)
  } catch (error: unknown) {
    console.error('Error fetching pastors:', error)
    return NextResponse.json({ error: 'Failed to fetch pastors' }, { status: 500 })
  }
}

// POST /api/pastors - create pastor
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = pastorSchema.parse(body)

    const existing = await prisma.pastor.findUnique({ where: { slug: data.slug } })
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    const created = await prisma.pastor.create({
      data: {
        name: data.name,
        title: data.title,
        bio: data.bio,
        imageUrl: data.imageUrl,
        altText: data.altText ?? null,
        order: data.order ?? 0,
        isSenior: data.isSenior ?? false,
        isActive: data.isActive ?? true,
        slug: data.slug,
        socialInstagram: data.socialInstagram ?? null,
      },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    console.error('Error creating pastor:', error)
    return NextResponse.json({ error: 'Failed to create pastor' }, { status: 500 })
  }
}


