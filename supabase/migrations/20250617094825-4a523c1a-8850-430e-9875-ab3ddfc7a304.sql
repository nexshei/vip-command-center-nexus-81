
-- Add status column to meeting_requests table
ALTER TABLE public.meeting_requests 
ADD COLUMN status text DEFAULT 'pending';

-- Add a check constraint to ensure only valid status values
ALTER TABLE public.meeting_requests 
ADD CONSTRAINT meeting_requests_status_check 
CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'));
