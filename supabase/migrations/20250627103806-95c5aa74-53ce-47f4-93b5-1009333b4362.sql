
-- Enable Row Level Security on the tables that are missing it
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;

-- Create permissive policies to allow all operations for now
-- These can be made more restrictive later if needed

-- Policies for clients table
CREATE POLICY "Allow all operations on clients" ON public.clients
FOR ALL 
USING (true)
WITH CHECK (true);

-- Policies for inventory_items table
CREATE POLICY "Allow all operations on inventory_items" ON public.inventory_items
FOR ALL 
USING (true)
WITH CHECK (true);

-- Policies for job_postings table
CREATE POLICY "Allow all operations on job_postings" ON public.job_postings
FOR ALL 
USING (true)
WITH CHECK (true);

-- Policies for staff_members table
CREATE POLICY "Allow all operations on staff_members" ON public.staff_members
FOR ALL 
USING (true)
WITH CHECK (true);
