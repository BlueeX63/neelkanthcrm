-- MIGRATION 5: Strict Security Policies & Role-Based Access Control

-- 1. Fix Privilege Escalation Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, user_type, name, role, status, phone, password)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    COALESCE(
      CASE WHEN current_setting('role', true) = 'service_role' THEN new.raw_user_meta_data->>'user_type' ELSE NULL END, 
      'ORDER DEPARTMENT'
    ),
    COALESCE(new.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(new.raw_user_meta_data->>'last_name', ''),
    COALESCE(
      CASE WHEN current_setting('role', true) = 'service_role' THEN new.raw_user_meta_data->>'user_type' ELSE NULL END, 
      'ORDER DEPARTMENT'
    ),
    'Active',
    '',
    'encrypted_in_auth'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Re-enable RLS on order_karigar_history
ALTER TABLE public.order_karigar_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read for authenticated" ON public.order_karigar_history;
CREATE POLICY "Allow read for authenticated" ON public.order_karigar_history
FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow insert for auth" ON public.order_karigar_history;
CREATE POLICY "Allow insert for auth" ON public.order_karigar_history
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow update for auth" ON public.order_karigar_history;
CREATE POLICY "Allow update for auth" ON public.order_karigar_history
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL);

-- 3. Strict RLS for core tables (customers, items, karigars, orders)
-- Drop the insecure FOR ALL policies
DROP POLICY IF EXISTS "Allow operations for authenticated on customers" ON public.customers;
DROP POLICY IF EXISTS "Allow operations for authenticated on items" ON public.items;
DROP POLICY IF EXISTS "Allow operations for authenticated on karigars" ON public.karigars;
DROP POLICY IF EXISTS "Allow operations for authenticated on orders" ON public.orders;

-- CUSTOMERS
CREATE POLICY "Select customers" ON public.customers FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Insert customers" ON public.customers FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Update customers" ON public.customers FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Delete customers" ON public.customers FOR DELETE TO authenticated USING ((SELECT user_type FROM public.users WHERE id = auth.uid()) = 'ADMINISTRATOR');

-- ITEMS
CREATE POLICY "Select items" ON public.items FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Insert items" ON public.items FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Update items" ON public.items FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Delete items" ON public.items FOR DELETE TO authenticated USING ((SELECT user_type FROM public.users WHERE id = auth.uid()) = 'ADMINISTRATOR');

-- KARIGARS
CREATE POLICY "Select karigars" ON public.karigars FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Insert karigars" ON public.karigars FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Update karigars" ON public.karigars FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Delete karigars" ON public.karigars FOR DELETE TO authenticated USING ((SELECT user_type FROM public.users WHERE id = auth.uid()) = 'ADMINISTRATOR');

-- ORDERS
CREATE POLICY "Select orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Insert orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Update orders" ON public.orders FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Delete orders" ON public.orders FOR DELETE TO authenticated USING ((SELECT user_type FROM public.users WHERE id = auth.uid()) = 'ADMINISTRATOR');

-- 4. Storage Bucket Policies (if order_photos exists)
-- Assuming we want to secure it so only logged in users can upload/view
-- (Note: this executes on storage.objects which is Supabase specific)
-- We will ignore dropping existing to prevent errors, just add them:
-- (This might fail if storage bucket isn't standard, but it's safe DDL)
-- CREATE POLICY "Allow auth read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'order_photos');
-- CREATE POLICY "Allow auth insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'order_photos' AND auth.uid() IS NOT NULL);
