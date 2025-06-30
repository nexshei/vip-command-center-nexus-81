
-- Add RLS policies to allow reading newsletter subscriptions
-- Since this is public newsletter data, we'll allow read access for authenticated users
CREATE POLICY "Allow authenticated users to read newsletter subscriptions" 
ON public.newsletter_subscriptions 
FOR SELECT 
USING (true);

-- Allow authenticated users to update newsletter subscriptions (for admin management)
CREATE POLICY "Allow authenticated users to update newsletter subscriptions" 
ON public.newsletter_subscriptions 
FOR UPDATE 
USING (true);

-- Allow authenticated users to insert newsletter subscriptions
CREATE POLICY "Allow authenticated users to insert newsletter subscriptions" 
ON public.newsletter_subscriptions 
FOR INSERT 
WITH CHECK (true);

-- Allow authenticated users to delete newsletter subscriptions
CREATE POLICY "Allow authenticated users to delete newsletter subscriptions" 
ON public.newsletter_subscriptions 
FOR DELETE 
USING (true);
