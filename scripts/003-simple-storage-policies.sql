-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own restaurant logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own restaurant logos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view restaurant logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own restaurant logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own restaurant logos" ON storage.objects;
DROP POLICY IF EXISTS "Restaurant owners can upload menu item images" ON storage.objects;
DROP POLICY IF EXISTS "Restaurant owners can view their menu item images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view menu item images" ON storage.objects;
DROP POLICY IF EXISTS "Restaurant owners can update their menu item images" ON storage.objects;
DROP POLICY IF EXISTS "Restaurant owners can delete their menu item images" ON storage.objects;

-- Simple policies for restaurant-assets bucket
-- Allow authenticated users to upload to restaurant-assets bucket
CREATE POLICY "Authenticated users can upload restaurant assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'restaurant-assets' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to view restaurant assets
CREATE POLICY "Authenticated users can view restaurant assets"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'restaurant-assets' 
    AND auth.role() = 'authenticated'
  );

-- Allow public access to restaurant assets (for public menu display)
CREATE POLICY "Public can view restaurant assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'restaurant-assets');

-- Allow authenticated users to update restaurant assets
CREATE POLICY "Authenticated users can update restaurant assets"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'restaurant-assets' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete restaurant assets
CREATE POLICY "Authenticated users can delete restaurant assets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'restaurant-assets' 
    AND auth.role() = 'authenticated'
  );

-- Simple policies for menu-assets bucket
-- Allow authenticated users to upload to menu-assets bucket
CREATE POLICY "Authenticated users can upload menu assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'menu-assets' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to view menu assets
CREATE POLICY "Authenticated users can view menu assets"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'menu-assets' 
    AND auth.role() = 'authenticated'
  );

-- Allow public access to menu assets (for public menu display)
CREATE POLICY "Public can view menu assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-assets');

-- Allow authenticated users to update menu assets
CREATE POLICY "Authenticated users can update menu assets"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'menu-assets' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete menu assets
CREATE POLICY "Authenticated users can delete menu assets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'menu-assets' 
    AND auth.role() = 'authenticated'
  );
