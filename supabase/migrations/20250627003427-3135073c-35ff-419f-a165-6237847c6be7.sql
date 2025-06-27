
-- First, let's create the missing tables for job postings
CREATE TABLE public.job_postings (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create gallery table for gallery management
CREATE TABLE public.gallery_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create staff table for staff management
CREATE TABLE public.staff_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  position TEXT NOT NULL,
  department TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  hire_date DATE,
  salary NUMERIC,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
  bio TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  client_type TEXT DEFAULT 'individual' CHECK (client_type IN ('individual', 'corporate', 'government', 'diplomatic')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create inventory items table
CREATE TABLE public.inventory_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER DEFAULT 0,
  unit_price NUMERIC,
  supplier TEXT,
  location TEXT,
  condition TEXT DEFAULT 'excellent' CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  last_checked DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add updated_at trigger for job_postings
CREATE TRIGGER update_job_postings_updated_at
  BEFORE UPDATE ON public.job_postings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add updated_at trigger for gallery_items
CREATE TRIGGER update_gallery_items_updated_at
  BEFORE UPDATE ON public.gallery_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add updated_at trigger for staff_members
CREATE TRIGGER update_staff_members_updated_at
  BEFORE UPDATE ON public.staff_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add updated_at trigger for clients
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add updated_at trigger for inventory_items
CREATE TRIGGER update_inventory_items_updated_at
  BEFORE UPDATE ON public.inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO public.job_postings (title, department, location, description, requirements, employment_type, salary_range, application_deadline, status) VALUES
('Senior Protocol Officer', 'Protocol Services', 'Washington, DC', 'Lead diplomatic protocol activities for high-level VIP events and state visits.', ARRAY['Bachelor''s degree in International Relations', '5+ years protocol experience', 'Fluent in multiple languages'], 'full-time', '$80,000 - $120,000', '2024-02-15', 'active'),
('Event Coordinator', 'Event Management', 'New York, NY', 'Coordinate luxury events and VIP experiences for high-profile clients.', ARRAY['Event management experience', 'Strong organizational skills', 'Attention to detail'], 'full-time', '$60,000 - $80,000', '2024-02-20', 'active');

INSERT INTO public.staff_members (full_name, position, department, email, phone, hire_date, status) VALUES
('John Smith', 'Senior Protocol Officer', 'Protocol Services', 'john.smith@sirolevvipprotocolltd.co.ke', '+254-700-123-456', '2023-01-15', 'active'),
('Sarah Johnson', 'Event Coordinator', 'Event Management', 'sarah.johnson@sirolevvipprotocolltd.co.ke', '+254-700-234-567', '2023-03-20', 'active'),
('Michael Brown', 'Security Specialist', 'Security', 'michael.brown@sirolevvipprotocolltd.co.ke', '+254-700-345-678', '2023-02-10', 'active');

INSERT INTO public.clients (full_name, company, email, phone, client_type, status) VALUES
('Ambassador Williams', 'US Embassy', 'ambassador.williams@embassy.gov', '+254-700-111-222', 'diplomatic', 'active'),
('Dr. Jane Miller', 'MegaCorp International', 'jane.miller@megacorp.com', '+254-700-333-444', 'corporate', 'active'),
('Minister Chen', 'Ministry of Foreign Affairs', 'minister.chen@gov.example', '+254-700-555-666', 'government', 'active');

INSERT INTO public.inventory_items (name, category, quantity, unit_price, supplier, location, condition) VALUES
('Premium Sound System', 'Audio Equipment', 5, 2500.00, 'Audio Pro Ltd', 'Equipment Room A', 'excellent'),
('VIP Lounge Chairs', 'Furniture', 20, 450.00, 'Luxury Furniture Co', 'Storage Room B', 'excellent'),
('Security Radios', 'Security Equipment', 12, 120.00, 'SecureTech', 'Security Office', 'good'),
('Event Decorations Set', 'Decorations', 8, 300.00, 'Event Decor Plus', 'Storage Room C', 'excellent');
