-- Test script to verify storage buckets and policies
-- Run this to check if everything is set up correctly

-- Check if buckets exist
SELECT name, public FROM storage.buckets WHERE name IN ('restaurant-assets', 'menu-assets');

-- Check storage policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%restaurant%' OR policyname LIKE '%menu%';

-- Test if we can insert into storage (this will show any RLS errors)
-- Note: This is just for testing - don't run in production
-- SELECT storage.from('restaurant-assets').upload('test.txt', 'test content');
