-- Create Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT,
  user_type TEXT NOT NULL,
  status TEXT DEFAULT 'Active',
  name TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_code TEXT,
  mobile_no TEXT NOT NULL,
  address TEXT,
  city TEXT,
  gst_no TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Items table
CREATE TABLE IF NOT EXISTS public.items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_name TEXT NOT NULL,
  short_name TEXT,
  group_name TEXT,
  group_type TEXT,
  touch TEXT,
  status TEXT DEFAULT 'Active',
  added_by TEXT,
  date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Karigars table
CREATE TABLE IF NOT EXISTS public.karigars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  karigar_name TEXT NOT NULL,
  karigar_code TEXT,
  mobile_no TEXT NOT NULL,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_no TEXT NOT NULL,
  date TEXT NOT NULL,
  photo TEXT,
  name TEXT,
  status TEXT DEFAULT 'Assign Karigar',
  cad TEXT,
  casting TEXT,
  filling TEXT,
  stone TEXT,
  polish TEXT,
  customer_id UUID REFERENCES public.customers(id),
  color_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) configuration
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.karigars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Read access for all authenticated users
DROP POLICY IF EXISTS "Allow read for authenticated on users" ON public.users;
CREATE POLICY "Allow read for authenticated on users" ON public.users FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

-- Write/Update/Delete access ONLY for Administrators
DROP POLICY IF EXISTS "Allow write for administrators on users" ON public.users;
CREATE POLICY "Allow write for administrators on users" ON public.users FOR INSERT TO authenticated WITH CHECK ((SELECT user_type FROM public.users WHERE id = auth.uid()) = 'ADMINISTRATOR');

DROP POLICY IF EXISTS "Allow update for administrators on users" ON public.users;
CREATE POLICY "Allow update for administrators on users" ON public.users FOR UPDATE TO authenticated USING ((SELECT user_type FROM public.users WHERE id = auth.uid()) = 'ADMINISTRATOR') WITH CHECK ((SELECT user_type FROM public.users WHERE id = auth.uid()) = 'ADMINISTRATOR');

DROP POLICY IF EXISTS "Allow delete for administrators on users" ON public.users;
CREATE POLICY "Allow delete for administrators on users" ON public.users FOR DELETE TO authenticated USING ((SELECT user_type FROM public.users WHERE id = auth.uid()) = 'ADMINISTRATOR');

DROP POLICY IF EXISTS "Allow operations for authenticated on customers" ON public.customers;
CREATE POLICY "Allow operations for authenticated on customers" ON public.customers FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow operations for authenticated on items" ON public.items;
CREATE POLICY "Allow operations for authenticated on items" ON public.items FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow operations for authenticated on karigars" ON public.karigars;
CREATE POLICY "Allow operations for authenticated on karigars" ON public.karigars FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow operations for authenticated on orders" ON public.orders;
CREATE POLICY "Allow operations for authenticated on orders" ON public.orders FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
