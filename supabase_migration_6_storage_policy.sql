-- MIGRATION 6: Secure Storage Bucket Policies for 'order-images'
-- This fixes Finding #3 from the Security Audit.

-- Note: In Supabase, the storage bucket 'order-images' needs its own RLS policies.
-- These execute on the 'storage.objects' table.

-- Drop any existing policies that might be insecure (optional but good practice)
DROP POLICY IF EXISTS "Allow auth read" ON storage.objects;
DROP POLICY IF EXISTS "Allow auth insert" ON storage.objects;
DROP POLICY IF EXISTS "Allow auth delete" ON storage.objects;
DROP POLICY IF EXISTS "Allow auth update" ON storage.objects;

-- 1. Allow authenticated users to view/download images
CREATE POLICY "Allow auth read" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (bucket_id = 'order-images');

-- 2. Allow authenticated users to upload new images
CREATE POLICY "Allow auth insert" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'order-images' 
  AND auth.uid() IS NOT NULL
);

-- 3. Allow authenticated users to delete images (or restrict to ADMIN only)
CREATE POLICY "Allow auth delete" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'order-images');

-- 4. Allow authenticated users to update existing images
CREATE POLICY "Allow auth update" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'order-images');
