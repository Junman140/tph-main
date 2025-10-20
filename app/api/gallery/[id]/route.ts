import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT /api/gallery/[id] - Update gallery image
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, description, imageUrl, altText, category, isActive, sortOrder, driveLink } = body

    // Validate required fields
    if (!title || !imageUrl || !driveLink) {
      return NextResponse.json(
        { error: 'Title, imageUrl, and driveLink are required' },
        { status: 400 }
      )
    }

    const image = await prisma.galleryImage.update({
      where: { id },
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

    return NextResponse.json(image)
  } catch (error) {
    console.error('Error updating gallery image:', error)
    return NextResponse.json(
      { error: 'Failed to update gallery image' },
      { status: 500 }
    )
  }
}

// DELETE /api/gallery/[id] - Delete gallery image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.galleryImage.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Gallery image deleted successfully' })
  } catch (error) {
    console.error('Error deleting gallery image:', error)
    return NextResponse.json(
      { error: 'Failed to delete gallery image' },
      { status: 500 }
    )
  }
}