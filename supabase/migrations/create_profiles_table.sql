
-- Create a profiles table for storing user profile information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users (id) PRIMARY KEY,
  full_name TEXT,
  college_name TEXT,
  course TEXT,
  degree TEXT,
  address TEXT,
  hackathon_participation INTEGER DEFAULT 0,
  hackathon_wins INTEGER DEFAULT 0,
  cgpa NUMERIC(4,2) DEFAULT 0,
  degree_completed BOOLEAN DEFAULT false,
  certifications JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  research_papers JSONB DEFAULT '[]'::jsonb,
  profile_image TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to view any profile
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Create a policy that allows users to update only their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Create a policy that allows users to insert only their own profile
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create storage bucket for profile images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT DO NOTHING;

-- Allow authenticated users to upload to the profile-images bucket
CREATE POLICY "Users can upload their own profile images"
ON storage.objects
FOR INSERT
WITH CHECK (auth.uid()::text = (storage.foldername(name))[1] AND bucket_id = 'profile-images');

-- Allow public access to profile images
CREATE POLICY "Profile images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'profile-images');
