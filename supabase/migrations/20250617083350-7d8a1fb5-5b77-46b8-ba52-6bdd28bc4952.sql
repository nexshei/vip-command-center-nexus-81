
-- Disable RLS temporarily to allow data access for admin dashboard
-- Since this is an admin dashboard, we'll allow full access to authenticated users

-- Update RLS policies for bookings
DROP POLICY IF EXISTS "Enable read access for all users" ON public.bookings;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.bookings;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.bookings;

CREATE POLICY "Allow full access to bookings" ON public.bookings
FOR ALL USING (true);

-- Update RLS policies for clients
DROP POLICY IF EXISTS "Enable read access for all users" ON public.clients;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.clients;

CREATE POLICY "Allow full access to clients" ON public.clients
FOR ALL USING (true);

-- Update RLS policies for inventory
DROP POLICY IF EXISTS "Enable read access for all users" ON public.inventory;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.inventory;

CREATE POLICY "Allow full access to inventory" ON public.inventory
FOR ALL USING (true);

-- Update RLS policies for staff
DROP POLICY IF EXISTS "Enable read access for all users" ON public.staff;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.staff;

CREATE POLICY "Allow full access to staff" ON public.staff
FOR ALL USING (true);

-- Update RLS policies for contact_submissions
DROP POLICY IF EXISTS "Enable read access for all users" ON public.contact_submissions;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.contact_submissions;

CREATE POLICY "Allow full access to contact_submissions" ON public.contact_submissions
FOR ALL USING (true);

-- Update RLS policies for quotes
DROP POLICY IF EXISTS "Enable read access for all users" ON public.quotes;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.quotes;

CREATE POLICY "Allow full access to quotes" ON public.quotes
FOR ALL USING (true);

-- Update RLS policies for emails
DROP POLICY IF EXISTS "Enable read access for all users" ON public.emails;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.emails;

CREATE POLICY "Allow full access to emails" ON public.emails
FOR ALL USING (true);

-- Update RLS policies for subscriptions
DROP POLICY IF EXISTS "Enable read access for all users" ON public.subscriptions;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.subscriptions;

CREATE POLICY "Allow full access to subscriptions" ON public.subscriptions
FOR ALL USING (true);

-- Update RLS policies for subscribers
DROP POLICY IF EXISTS "Enable read access for all users" ON public.subscribers;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.subscribers;

CREATE POLICY "Allow full access to subscribers" ON public.subscribers
FOR ALL USING (true);

-- Update RLS policies for analytics
DROP POLICY IF EXISTS "Enable read access for all users" ON public.analytics;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.analytics;

CREATE POLICY "Allow full access to analytics" ON public.analytics
FOR ALL USING (true);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.clients;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE public.staff;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quotes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.emails;
ALTER PUBLICATION supabase_realtime ADD TABLE public.subscriptions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.subscribers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.analytics;

-- Set replica identity for realtime updates
ALTER TABLE public.bookings REPLICA IDENTITY FULL;
ALTER TABLE public.clients REPLICA IDENTITY FULL;
ALTER TABLE public.inventory REPLICA IDENTITY FULL;
ALTER TABLE public.staff REPLICA IDENTITY FULL;
ALTER TABLE public.contact_submissions REPLICA IDENTITY FULL;
ALTER TABLE public.quotes REPLICA IDENTITY FULL;
ALTER TABLE public.emails REPLICA IDENTITY FULL;
ALTER TABLE public.subscriptions REPLICA IDENTITY FULL;
ALTER TABLE public.subscribers REPLICA IDENTITY FULL;
ALTER TABLE public.analytics REPLICA IDENTITY FULL;
