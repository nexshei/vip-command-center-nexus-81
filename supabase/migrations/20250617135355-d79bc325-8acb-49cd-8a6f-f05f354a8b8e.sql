
-- Create a careers table for job postings
CREATE TABLE IF NOT EXISTS public.careers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT,
  location TEXT,
  description TEXT,
  requirements TEXT[],
  employment_type TEXT DEFAULT 'full-time',
  salary_range TEXT,
  application_deadline DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on careers table
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;

-- Create policy for public to view active jobs
CREATE POLICY "Anyone can view active jobs" 
  ON public.careers 
  FOR SELECT 
  USING (status = 'active');

-- Create policy for admins to manage all jobs (placeholder - you'll need proper role system)
CREATE POLICY "Admins can manage all jobs" 
  ON public.careers 
  FOR ALL 
  USING (true);

-- Add careers table to realtime
ALTER TABLE public.careers REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.careers;

-- Add career_applications table to realtime  
ALTER TABLE public.career_applications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.career_applications;
