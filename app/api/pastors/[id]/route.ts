import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as z from 'zod'

const updateSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  bio: z.string().optional(),
  imageUrl: z.string().optional(),
  altText: z.string().optional().nullable(),
  order: z.number().int().nonnegative().optional(),
  isSenior: z.boolean().optional(),
  isActive: z.boolean().optional(),
  slug: z.string().optional(),
  socialInstagram: z.string().optional().nullable(),
})

// GET /api/pastors/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pastor = await prisma.pastor.findUnique({ where: { id: params.id } })
    if (!pastor) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(pastor)
  } catch (error) {
    console.error('Fetch pastor error:', error)
    return NextResponse.json({ error: 'Failed to fetch pastor' }, { status: 500 })
  }
}

// PUT /api/pastors/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const data = updateSchema.parse(body)

    if (data.slug) {
      const existing = await prisma.pastor.findUnique({ where: { slug: data.slug } })
      if (existing && existing.id !== params.id) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
      }
    }

    const updated = await prisma.pastor.update({
      where: { id: params.id },
      data: {
        ...data,
        altText: data.altText === '' ? null : data.altText,
        socialInstagram: data.socialInstagram === '' ? null : data.socialInstagram,
      },
    })
    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    console.error('Update pastor error:', error)
    return NextResponse.json({ error: 'Failed to update pastor' }, { status: 500 })
  }
}

// DELETE /api/pastors/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.pastor.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Deleted' })
  } catch (error) {
    console.error('Delete pastor error:', error)
    return NextResponse.json({ error: 'Failed to delete pastor' }, { status: 500 })
  }
}


