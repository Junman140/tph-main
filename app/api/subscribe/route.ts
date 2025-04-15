import { NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";
import * as z from 'zod';

// Initialize Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("API Route Error: Supabase URL or Service Role Key missing.");
}

const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false }
    })
  : null;

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address."),
  name: z.string().optional(),
});

export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  try {
    const json = await req.json();
    const { email, name } = subscribeSchema.parse(json);

    // Upsert subscriber (adds if not exists, updates status if exists)
    const { data, error } = await supabaseAdmin
      .from('subscribers')
      .upsert(
        {
          email: email,
          name: name,
          status: 'subscribed',
          subscription_date: new Date().toISOString(), // Use subscription_date as created/updated timestamp
        },
        { onConflict: 'email' } // Use email as the conflict target
      )
      .select('id')
      .single();

    if (error) {
      console.error("Supabase subscribe error:", error);
      // Check for specific errors if needed
      return NextResponse.json({ error: "Failed to subscribe.", details: error.message }, { status: 500 });
    }

    console.log("Subscription successful:", data?.id);
    return NextResponse.json({ success: true, message: "Successfully subscribed!" });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input.", details: error.errors }, { status: 400 });
    }
    console.error("Subscribe API error:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

// Optional: Implement PUT/PATCH for unsubscribe or GET for admin fetching
// Example Unsubscribe (using PUT with email in body)
export async function PUT(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  try {
    const json = await req.json();
    // Simple email validation for unsubscribe
    const { email } = z.object({ email: z.string().email() }).parse(json);

    const { error } = await supabaseAdmin
      .from('subscribers')
      .update({ status: 'unsubscribed' })
      .eq('email', email);

    if (error) {
      console.error("Supabase unsubscribe error:", error);
      // Handle 'not found' differently? PGRST116 means 0 rows updated.
      if (error.code === 'PGRST116') {
         return NextResponse.json({ success: true, message: "Email not found or already unsubscribed." });
      }
      return NextResponse.json({ error: "Failed to unsubscribe.", details: error.message }, { status: 500 });
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