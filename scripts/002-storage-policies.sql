-- Storage policies for restaurant-assets bucket
-- Allow authenticated users to upload their own restaurant logos
CREATE POLICY "Users can upload their own restaurant logos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'restaurant-assets' 
    AND auth.uid()::text = (storage.foldername(name))[1]
    AND (storage.foldername(name))[2] = 'logo'
  );

-- Allow users to view their own restaurant logos
CREATE POLICY "Users can view their own restaurant logos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'restaurant-assets' 
    AND auth.uid()::text = (storage.foldername(name))[1]
    AND (storage.foldername(name))[2] = 'logo'
  );

-- Allow public access to restaurant logos (for public menu display)
CREATE POLICY "Public can view restaurant logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'restaurant-assets');

-- Allow users to update their own restaurant logos
CREATE POLICY "Users can update their own restaurant logos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'restaurant-assets' 
    AND auth.uid()::text = (storage.foldername(name))[1]
    AND (storage.foldername(name))[2] = 'logo'
  );

-- Allow users to delete their own restaurant logos
CREATE POLICY "Users can delete their own restaurant logos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'restaurant-assets' 
    AND auth.uid()::text = (storage.foldername(name))[1]
    AND (storage.foldername(name))[2] = 'logo'
  );

-- Storage policies for menu-assets bucket
-- Allow restaurant owners to upload menu item images
CREATE POLICY "Restaurant owners can upload menu item images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'menu-assets' 
    AND EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id::text = (storage.foldername(name))[1]
      AND restaurants.user_id = auth.uid()
    )
    AND (storage.foldername(name))[2] = 'menu-item'
  );

-- Allow restaurant owners to view their menu item images
CREATE POLICY "Restaurant owners can view their menu item images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'menu-assets' 
    AND EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id::text = (storage.foldername(name))[1]
      AND restaurants.user_id = auth.uid()
    )
  );

-- Allow public access to menu item images (for public menu display)
CREATE POLICY "Public can view menu item images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-assets');

-- Allow restaurant owners to update their menu item images
CREATE POLICY "Restaurant owners can update their menu item images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'menu-assets' 
    AND EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id::text = (storage.foldername(name))[1]
      AND restaurants.user_id = auth.uid()
    )
  );

-- Allow restaurant owners to delete their menu item images
CREATE POLICY "Restaurant owners can delete their menu item images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'menu-assets' 
    AND EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id::text = (storage.foldername(name))[1]
      AND restaurants.user_id = auth.uid()
    )
  );
