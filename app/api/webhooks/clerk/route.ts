import { Webhook } from "svix"
import { headers } from "next/headers"
import type { WebhookEvent } from "@clerk/clerk-sdk-node"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client (use service role key for admin access)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Supabase URL or Service Role Key missing in environment variables.");
  // Potentially throw an error or handle this case appropriately
}

// Ensure the client is only created if vars exist
const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false } // No session persistence needed for server-side admin client
    })
  : null;

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

    if (!supabaseAdmin) {
      console.error("Supabase admin client failed to initialize.");
      return new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500 });
    }

    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url, created_at, primary_email_address_id, primary_phone_number_id, phone_numbers, last_sign_in_at } = evt.data;

      const primaryEmail = email_addresses.find((e: { id: string; email_address: string }) => e.id === primary_email_address_id)?.email_address;
      const primaryPhone = phone_numbers.find((p: { id: string; phone_number: string }) => p.id === primary_phone_number_id)?.phone_number;
      const isVerified = email_addresses.find((e: { id: string; verification?: { status: string } }) => e.id === primary_email_address_id)?.verification?.status === 'verified';

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
        created_at,
        primaryPhone,
        last_sign_in_at,
        isVerified
      });

      try {
        // Prepare data for Supabase upsert
        const upsertData = {
          token_identifier: id, // Use Clerk user ID as the unique identifier
          name: first_name && last_name ? `${first_name} ${last_name}` : (primaryEmail?.split('@')[0] || 'User'),
          email: primaryEmail || "",
          image: image_url,
          first_name: first_name,
          last_name: last_name,
          phone_number: primaryPhone,
          last_login_at: last_sign_in_at ? new Date(last_sign_in_at).toISOString() : null,
          is_email_verified: isVerified || false,
          // Keep other fields as default or null if not provided by Clerk
          // created_at is handled by Supabase default
          // role, metadata, preferences use Supabase defaults
        };

        console.log("Upserting user to Supabase:", upsertData);

        const { data, error } = await supabaseAdmin
          .from('users')
          .upsert(upsertData, { onConflict: 'token_identifier' })
          .select('id') // Select the Supabase ID
          .single();

        if (error) {
           console.error("Supabase upsert error:", error);
           throw error;
        }

        console.log("Supabase response (user ID):", data?.id);

        return new Response(JSON.stringify({ success: true, userId: data?.id }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error syncing user to Supabase:", error);
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

    // Handle user deletion
    if (eventType === 'user.deleted') {
       const { id } = evt.data;
       if (!id) {
          console.error("Missing user ID for deletion event");
          return new Response(JSON.stringify({ error: "Missing user ID" }), { status: 400 });
       }

       console.log("Deleting user from Supabase:", id);
       const { error } = await supabaseAdmin
         .from('users')
         .delete()
         .eq('token_identifier', id);

       if (error) {
          console.error("Supabase delete error:", error);
          // Don't necessarily throw, maybe just log, as the user is already deleted in Clerk
          return new Response(JSON.stringify({ success: false, error: "Failed to delete user from DB" }), { status: 500 });
       }

       console.log("User deleted from Supabase successfully.");
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