-- TEMPORARY: Disable RLS on storage.objects for testing
-- WARNING: This makes storage public - only use for testing!

-- Disable RLS temporarily
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS after testing (uncomment when done testing)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
