import { Webhook } from "svix"
import { headers } from "next/headers"
import { WebhookEvent } from "@clerk/nextjs/server"
import { ConvexHttpClient } from "convex/browser"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(req: Request) {
  console.log("Received webhook from Clerk");
  
  try {
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("Missing svix headers:", { svix_id, svix_timestamp, svix_signature });
      return new Response(
        JSON.stringify({ 
          error: "Missing required webhook headers",
          details: { svix_id, svix_timestamp, svix_signature }
        }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!process.env.CLERK_WEBHOOK_SECRET) {
      console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);
    console.log("Webhook payload:", payload);

    // Create a new Svix instance with your secret
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response(
        JSON.stringify({ 
          error: "Invalid webhook signature",
          details: err instanceof Error ? err.message : "Unknown error"
        }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const eventType = evt.type;
    console.log("Event type:", eventType);

    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url, created_at } = evt.data;
      const primaryEmail = email_addresses?.[0]?.email_address;

      if (!id) {
        return new Response(
          JSON.stringify({ error: "Missing user ID in webhook payload" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      console.log("Processing user data:", {
        id,
        primaryEmail,
        first_name,
        last_name,
        image_url,
        created_at
      });

      try {
        const userData = {
          userId: id,
          email: primaryEmail || "",
          name: first_name && last_name ? `${first_name} ${last_name}` : undefined,
          image: image_url,
          createdAt: created_at,
          tokenIdentifier: `https://nearby-adder-51.clerk.accounts.dev|${id}`,
        };

        console.log("Sending to Convex:", userData);
        
        const result = await convex.mutation("users:upsertUser", userData);
        console.log("Convex response:", result);
        
        return new Response(JSON.stringify({ success: true, userId: result }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error syncing user to Convex:", error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Error syncing user to database",
            details: error instanceof Error ? error.message : "Unknown error"
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unexpected error in webhook handler:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
} 