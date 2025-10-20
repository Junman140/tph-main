import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as z from 'zod';

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address."),
  name: z.string().optional(),
});

// GET endpoint to fetch all subscriptions (for admin dashboard)
export async function GET() {
  try {
    const subscriptions = await prisma.subscription.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Get subscriptions error:", error);
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { email, name } = subscribeSchema.parse(json);

    // Upsert subscriber using Prisma
    const subscription = await prisma.subscription.upsert({
      where: { email },
      update: {
        isActive: true,
        name: name || undefined,
      },
      create: {
        email,
        name: name || undefined,
        isActive: true,
      },
    });

    console.log("Subscription successful:", subscription.id);
    return NextResponse.json({ success: true, message: "Successfully subscribed!" });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input.", details: error.errors }, { status: 400 });
    }
    console.error("Subscribe API error:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

// Unsubscribe endpoint
export async function PUT(req: Request) {
  try {
    const json = await req.json();
    const { email } = z.object({ email: z.string().email() }).parse(json);

    const subscription = await prisma.subscription.updateMany({
      where: { email },
      data: { isActive: false },
    });

    if (subscription.count === 0) {
      return NextResponse.json({ success: true, message: "Email not found or already unsubscribed." });
    }

    return NextResponse.json({ success: true, message: "Successfully unsubscribed." });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input.", details: error.errors }, { status: 400 });
    }
    console.error("Unsubscribe API error:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
} 