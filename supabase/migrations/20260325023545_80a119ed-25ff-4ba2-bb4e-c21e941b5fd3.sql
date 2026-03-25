-- Create estimate_requests table
CREATE TABLE public.estimate_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  contact_method TEXT DEFAULT 'phone',
  project_type TEXT[] DEFAULT '{}',
  property_type TEXT,
  sqft TEXT,
  stories TEXT,
  occupied TEXT,
  hoa TEXT,
  scope TEXT[] DEFAULT '{}',
  conditions TEXT[] DEFAULT '{}',
  timeline TEXT,
  date_flexibility TEXT,
  budget TEXT,
  other_bids TEXT,
  notes TEXT,
  photo_urls TEXT[] DEFAULT '{}',
  consent BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'New',
  admin_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.estimate_requests ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public form, no auth required)
CREATE POLICY "Allow anonymous inserts"
ON public.estimate_requests
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anonymous selects for admin dashboard (temporary - will add auth later)
CREATE POLICY "Allow anonymous selects"
ON public.estimate_requests
FOR SELECT
TO anon
USING (true);

-- Allow anonymous updates for status changes (temporary)
CREATE POLICY "Allow anonymous updates"
ON public.estimate_requests
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);