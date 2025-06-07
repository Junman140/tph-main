import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/client';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    console.log('Received registration request');
    
    // Parse the request body
    const body = await req.json();
    console.log('Request body:', body);
    
    const { 
      eventId, 
      userId, 
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
    
    // Try to create the table if it doesn't exist
    try {
      await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS event_registrations (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            event_id TEXT NOT NULL,
            user_id TEXT,
            full_name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone_number TEXT NOT NULL,
            location TEXT NOT NULL,
            notes TEXT,
            status TEXT DEFAULT 'registered',
            CONSTRAINT unique_event_email UNIQUE(event_id, email)
          );
        `
      });
      console.log('Table check/creation completed');
    } catch (tableError) {
      console.log('Note: Table creation attempted but may require admin rights', tableError);
      // Continue anyway as the table might already exist
    }

    // Check if email is already registered for this event
    const { data: existingRegistration, error: checkError } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId)
      .eq('email', email)
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking existing registration:', checkError);
    }

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'You have already registered for this event' },
        { status: 409 }
      );
    }

    console.log('Attempting to insert registration into database');
    
    try {
      // Insert the registration into the database
      const { data, error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: userId || null,
          full_name: fullName,
          email: email,
          phone_number: phoneNumber,
          location: location,
          notes: notes || null,
          status: 'registered'
        });

      if (error) {
        // Check for duplicate registration error (unique constraint violation)
        if (error.code === '23505') {
          console.log('Duplicate registration attempt:', { email, eventId });
          return NextResponse.json(
            { error: 'You have already registered for this event' },
            { status: 409 }
          );
        }
        
        console.error('Supabase error registering for event:', error);
        return NextResponse.json(
          { error: `Database error: ${error.message || 'Failed to register for event'}` },
          { status: 500 }
        );
      }
      
      console.log('Registration successful');
    } catch (dbError: any) {
      console.error('Exception during database operation:', dbError);
      return NextResponse.json(
        { error: `Database exception: ${dbError.message || 'Unknown database error'}` },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Error processing registration:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
