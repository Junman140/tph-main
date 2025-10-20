import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET endpoint to fetch all event registrations (for admin dashboard)
export async function GET() {
  try {
    const registrations = await prisma.eventRegistration.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(registrations);
  } catch (error) {
    console.error("Get event registrations error:", error);
    return NextResponse.json({ error: "Failed to fetch event registrations" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('Received registration request');
    
    // Parse the request body
    const body = await req.json();
    console.log('Request body:', body);
    
    const { 
      eventId, 
      fullName, 
      email, 
      phoneNumber, 
      location, 
      notes 
    } = body;

    // Validate required fields
    if (!eventId || !fullName || !email || !phoneNumber || !location) {
      console.error('Missing required fields:', { eventId, fullName, email, phoneNumber, location });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if email is already registered for this event
    const existingRegistration = await prisma.eventRegistration.findFirst({
      where: {
        eventId,
        email,
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'You have already registered for this event' },
        { status: 409 }
      );
    }

    console.log('Attempting to insert registration into database');
    
    // Insert the registration using Prisma
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        fullName,
        email,
        phoneNumber,
        location,
        notes: notes || undefined,
        status: 'pending'
      },
    });
    
    console.log('Registration successful:', registration.id);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Error processing registration:', error);
    
    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'You have already registered for this event' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// PUT endpoint to update registration status
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Registration ID and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be pending, confirmed, or cancelled' },
        { status: 400 }
      );
    }

    const updatedRegistration = await prisma.eventRegistration.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      message: 'Registration status updated successfully',
      registration: updatedRegistration
    });
  } catch (error) {
    console.error('Error updating registration status:', error);
    return NextResponse.json(
      { error: 'Failed to update registration status' },
      { status: 500 }
    );
  }
}
