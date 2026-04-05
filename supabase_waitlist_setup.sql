-- Run this in your Supabase Dashboard -> SQL Editor

-- 1. Create the Waitlist log table
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Allow anyone to insert into the waitlist (so customers can join)
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for anyone" ON public.waitlist
  FOR INSERT WITH CHECK (true);

-- 3. Only allow authenticated admins to view the waitlist
CREATE POLICY "Enable select for authenticated users only" ON public.waitlist
  FOR SELECT USING (auth.role() = 'authenticated');
