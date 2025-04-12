import { NextResponse } from "next/server"
import { Webhook } from "svix"
import { WebhookEvent } from "@clerk/nextjs/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { eventType, userData } = body

    if (!eventType || !userData) {
      return NextResponse.json(
        { error: "Missing required fields: eventType and userData" },
        { status: 400 }
      )
    }

    // Create a mock webhook event
    const mockEvent: WebhookEvent = {
      type: eventType,
      data: {
        id: userData.id || "test_user_id",
        email_addresses: [
          {
            email_address: userData.email || "test@example.com",
            id: "test_email_id",
            verification: { status: "verified" },
          },
        ],
        first_name: userData.firstName || "Test",
        last_name: userData.lastName || "User",
        image_url: userData.imageUrl || null,
        created_at: new Date().toISOString(),
      },
      object: "event",
    }

    // Forward to the actual webhook handler
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/clerk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "svix-id": "test_svix_id",
        "svix-timestamp": new Date().toISOString(),
        "svix-signature": "test_signature", // This will fail verification, but that's okay for testing
      },
      body: JSON.stringify(mockEvent),
    })

    const result = await response.json()
    return NextResponse.json(result, { status: response.status })
  } catch (error) {
    console.error("Error in test webhook:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 