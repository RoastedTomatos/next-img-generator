-- Create generated_images table
CREATE TABLE IF NOT EXISTS generated_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  width INTEGER DEFAULT 1024,
  height INTEGER DEFAULT 1024,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_generated_images_created_at ON generated_images(created_at DESC);

-- Create index on user_id for user-specific queries (if you add auth later)
CREATE INDEX IF NOT EXISTS idx_generated_images_user_id ON generated_images(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (adjust as needed for your auth setup)
CREATE POLICY "Allow all operations" ON generated_images
  FOR ALL
  USING (true)
  WITH CHECK (true);

