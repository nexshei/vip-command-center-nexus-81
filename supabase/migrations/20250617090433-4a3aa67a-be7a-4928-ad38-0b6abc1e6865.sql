
-- Add revenue column and approval status to bookings table
ALTER TABLE public.bookings 
ADD COLUMN revenue numeric DEFAULT 0,
ADD COLUMN approval_status text DEFAULT 'pending';

-- Update existing records to have a default approval status
UPDATE public.bookings 
SET approval_status = 'approved' 
WHERE approval_status IS NULL;
