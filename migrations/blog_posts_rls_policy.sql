-- Enable Row Level Security on blog_posts table
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy for selecting blog posts (anyone can read)
CREATE POLICY blog_posts_select_policy
  ON blog_posts
  FOR SELECT
  USING (true);

-- Create policy for inserting blog posts (only admin users can insert)
CREATE POLICY blog_posts_insert_policy
  ON blog_posts
  FOR INSERT
  WITH CHECK (
    -- Check if the user's email is in the admin list
    auth.jwt() ->> 'email' = 'godswillitina@gmail.com' OR
    auth.jwt() ->> 'email' = 'thepeculiarhouseglobal@gmail.com'
  );

-- Create policy for updating blog posts (only admin users can update)
CREATE POLICY blog_posts_update_policy
  ON blog_posts
  FOR UPDATE
  USING (
    -- Check if the user's email is in the admin list
    auth.jwt() ->> 'email' = 'godswillitina@gmail.com' OR
    auth.jwt() ->> 'email' = 'thepeculiarhouseglobal@gmail.com'
  );

-- Create policy for deleting blog posts (only admin users can delete)
CREATE POLICY blog_posts_delete_policy
  ON blog_posts
  FOR DELETE
  USING (
    -- Check if the user's email is in the admin list
    auth.jwt() ->> 'email' = 'godswillitina@gmail.com' OR
    auth.jwt() ->> 'email' = 'thepeculiarhouseglobal@gmail.com'
  );
