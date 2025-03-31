
-- Add hackathon_details column to profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'hackathon_details'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN hackathon_details JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;
