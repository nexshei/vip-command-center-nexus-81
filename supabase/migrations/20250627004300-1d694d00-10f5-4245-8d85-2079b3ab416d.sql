
-- Enable real-time updates for the specified tables
ALTER TABLE public.clients REPLICA IDENTITY FULL;
ALTER TABLE public.inventory_items REPLICA IDENTITY FULL;
ALTER TABLE public.job_postings REPLICA IDENTITY FULL;
ALTER TABLE public.staff_members REPLICA IDENTITY FULL;

-- Add tables to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.clients;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.job_postings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.staff_members;

-- Remove the gallery_items table since it's not needed
DROP TABLE IF EXISTS public.gallery_items CASCADE;
