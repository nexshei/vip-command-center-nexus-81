
-- Enable RLS on meeting_requests table (if not already enabled)
ALTER TABLE public.meeting_requests ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for now (you can make these more restrictive later)
CREATE POLICY "Allow all operations on meeting_requests" ON public.meeting_requests
FOR ALL 
USING (true)
WITH CHECK (true);

-- Enable RLS on vvip_service_requests table (if not already enabled)
ALTER TABLE public.vvip_service_requests ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations on vvip_service_requests
CREATE POLICY "Allow all operations on vvip_service_requests" ON public.vvip_service_requests
FOR ALL 
USING (true)
WITH CHECK (true);

-- Also ensure contact_submissions and career_applications have proper policies
CREATE POLICY "Allow all operations on contact_submissions" ON public.contact_submissions
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on career_applications" ON public.career_applications
FOR ALL 
USING (true)
WITH CHECK (true);
