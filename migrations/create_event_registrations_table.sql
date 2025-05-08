-- Create event_registrations table if it doesn't exist
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
  
  -- Add unique constraint to prevent duplicate registrations
  CONSTRAINT unique_user_event UNIQUE (event_id, email)
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_email ON event_registrations(email);
