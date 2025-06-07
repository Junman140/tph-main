-- Begin transaction
BEGIN;

-- Drop existing table if it exists (be careful with this in production!)
DROP TABLE IF EXISTS public.posts CASCADE;

-- Create posts table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID NOT NULL,
    published BOOLEAN DEFAULT false,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    tags TEXT[] DEFAULT '{}',
    CONSTRAINT fk_author FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public posts are viewable by everyone" ON public.posts;
DROP POLICY IF EXISTS "Users can view their own unpublished posts" ON public.posts;
DROP POLICY IF EXISTS "Users can create their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;

-- Create policies
CREATE POLICY "Public posts are viewable by everyone"
    ON public.posts FOR SELECT
    USING (published = true);

CREATE POLICY "Users can view their own unpublished posts"
    ON public.posts FOR SELECT
    USING (auth.uid() = author_id);

CREATE POLICY "Users can create their own posts"
    ON public.posts FOR INSERT
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts"
    ON public.posts FOR UPDATE
    USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts"
    ON public.posts FOR DELETE
    USING (auth.uid() = author_id);

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS posts_author_id_idx;
DROP INDEX IF EXISTS posts_published_idx;
DROP INDEX IF EXISTS posts_created_at_idx;

-- Create indexes
CREATE INDEX posts_author_id_idx ON public.posts(author_id);
CREATE INDEX posts_published_idx ON public.posts(published);
CREATE INDEX posts_created_at_idx ON public.posts(created_at DESC);

-- Commit transaction
COMMIT; 