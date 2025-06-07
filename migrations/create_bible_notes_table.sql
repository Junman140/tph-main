-- Create Bible Notes Table
CREATE TABLE IF NOT EXISTS public.bible_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id TEXT NOT NULL,
  verse_reference TEXT NOT NULL,
  content TEXT NOT NULL
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS bible_notes_user_id_idx ON public.bible_notes (user_id);
CREATE INDEX IF NOT EXISTS bible_notes_verse_reference_idx ON public.bible_notes (verse_reference);

-- Add RLS policies
ALTER TABLE public.bible_notes ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read only their own notes
CREATE POLICY "Users can read their own notes" 
  ON public.bible_notes 
  FOR SELECT 
  USING (user_id = auth.uid());

-- Policy to allow users to insert their own notes
CREATE POLICY "Users can insert their own notes" 
  ON public.bible_notes 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- Policy to allow users to update their own notes
CREATE POLICY "Users can update their own notes" 
  ON public.bible_notes 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Policy to allow users to delete their own notes
CREATE POLICY "Users can delete their own notes" 
  ON public.bible_notes 
  FOR DELETE 
  USING (user_id = auth.uid());
