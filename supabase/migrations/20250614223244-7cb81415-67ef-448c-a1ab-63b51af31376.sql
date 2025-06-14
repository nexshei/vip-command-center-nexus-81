
-- 1. bookings: for bookings/events and admin-created bookings
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid,
  client_name text,
  service_type text,
  status text,
  scheduled_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. quotes: for price or service quotes
CREATE TABLE public.quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid,
  requester_name text,
  requested_service text,
  quote_details text,
  status text,
  amount numeric,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. clients: for storing client info
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text,
  email text,
  phone text,
  company text,
  notes text,
  created_at timestamp with time zone DEFAULT now()
);

-- 4. inventory: for item management
CREATE TABLE public.inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name text,
  description text,
  quantity integer,
  location text,
  status text,
  created_at timestamp with time zone DEFAULT now()
);

-- 5. staff: protocol officers and other staff
CREATE TABLE public.staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text,
  email text,
  phone text,
  role text,
  status text,
  notes text,
  created_at timestamp with time zone DEFAULT now()
);

-- 6. subscriptions: VIP/VVIP subscription & payments
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid,
  tier text,
  start_date date,
  end_date date,
  active boolean,
  notes text,
  created_at timestamp with time zone DEFAULT now()
);

-- 7. jobs: posted in career portal
CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  department text,
  location text,
  description text,
  requirements text,
  status text,
  posted_at timestamp with time zone DEFAULT now()
);

-- 8. communications: admin comm history with clients/staff
CREATE TABLE public.communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid,
  receiver_id uuid,
  subject text,
  message text,
  channel text,
  created_at timestamp with time zone DEFAULT now()
);

-- 9. emails: admin email log
CREATE TABLE public.emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_email text,
  to_email text,
  subject text,
  body text,
  status text,
  sent_at timestamp with time zone DEFAULT now()
);

-- 10. analytics: dashboard metric records (general purpose)
CREATE TABLE public.analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text,
  metric_value numeric,
  record_date date,
  notes text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for all new tables for future security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
