import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/gallery - Fetch all gallery images
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const active = searchParams.get('active')

    const where: Record<string, unknown> = {}
    
    if (category) {
      where.category = category
    }
    
    if (active !== null) {
      where.isActive = active === 'true'
    }

    const images = await prisma.galleryImage.findMany({
      where,
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(images)
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    )
  }
}

// POST /api/gallery - Create new gallery image
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, imageUrl, altText, category, isActive, sortOrder, driveLink } = body

    // Validate required fields
    if (!title || !imageUrl || !driveLink) {
      return NextResponse.json(
        { error: 'Title, imageUrl, and driveLink are required' },
        { status: 400 }
      )
    }

    const image = await prisma.galleryImage.create({
      data: {
        title,
        description: description || null,
        imageUrl,
        altText: altText || null,
        category: category || null,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0,
        driveLink: driveLink || null
      }
    })

    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error('Error creating gallery image:', error)
    return NextResponse.json(
      { error: 'Failed to create gallery image' },
      { status: 500 }
    )
  }
}
