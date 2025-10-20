import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as z from 'zod';

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  date: z.string().min(1, "Date is required"),
  location: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  altText: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  maxRegistrations: z.number().int().positive().optional().nullable(),
  registrationFormFields: z.any().optional().nullable(),
  driveLink: z.string().optional().nullable(),
});

// GET /api/events - Fetch all events
export async function GET() {
  try {
    console.log('Events API called')
    console.log('prisma.event exists:', !!prisma.event)
    
    // Simple query first to test
    const events = await prisma.event.findMany({
      orderBy: { date: 'desc' },
      include: {
        registrations: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            location: true,
            notes: true,
            status: true,
            createdAt: true,
          }
        }
      }
    });
    
    console.log('Events found:', events.length)
    return NextResponse.json(events);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? error.stack : undefined
    console.error("Get events error:", message)
    return NextResponse.json({ 
      error: "Failed to fetch events", 
      details: message,
      stack 
    }, { status: 500 });
  }
}

// POST /api/events - Create new event
export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/events called')
    const body = await req.json();
    console.log('Request body:', body)
    
    // More flexible validation
    const validatedData = eventSchema.parse(body);
    console.log('Validated data:', validatedData)

    const event = await prisma.event.create({
      data: {
        title: validatedData.title,
        description: validatedData.description || null,
        date: new Date(validatedData.date),
        location: validatedData.location || null,
        imageUrl: validatedData.imageUrl && validatedData.imageUrl !== '' ? validatedData.imageUrl : null,
        altText: validatedData.altText || null,
        isActive: validatedData.isActive,
        maxRegistrations: validatedData.maxRegistrations || null,
        registrationFormFields: validatedData.registrationFormFields || null,
        driveLink: validatedData.driveLink && validatedData.driveLink !== '' ? validatedData.driveLink : null,
      },
    });

    console.log('Event created successfully:', event.id)
    return NextResponse.json(event, { status: 201 });
  } catch (error: unknown) {
    console.error("Create event error:", error);
    if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.errors);
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: "Failed to create event", details: message }, { status: 500 });
  }
}

// PUT /api/events - Update event
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    const validatedData = eventSchema.parse(updateData);

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
        imageUrl: validatedData.imageUrl || null,
        driveLink: validatedData.driveLink || null,
      },
    });

    return NextResponse.json(event);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : String(error)
    console.error("Update event error:", message);
    return NextResponse.json({ error: "Failed to update event", details: message }, { status: 500 });
  }
}

// DELETE /api/events - Delete event
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("Delete event error:", message);
    return NextResponse.json({ error: "Failed to delete event", details: message }, { status: 500 });
  }
}
