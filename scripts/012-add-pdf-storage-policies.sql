-- Storage policies for PDF menus in restaurant-assets bucket
-- Allow restaurant owners to upload PDF menus
CREATE POLICY "Restaurant owners can upload PDF menus"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'restaurant-assets' 
    AND EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id::text = (storage.foldername(name))[1]
      AND restaurants.user_id = auth.uid()
    )
    AND (storage.foldername(name))[2] = 'pdf-menu'
  );

-- Allow restaurant owners to view their PDF menus
CREATE POLICY "Restaurant owners can view their PDF menus"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'restaurant-assets' 
    AND EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id::text = (storage.foldername(name))[1]
      AND restaurants.user_id = auth.uid()
    )
    AND (storage.foldername(name))[2] = 'pdf-menu'
  );

-- Allow public access to PDF menus (for public menu display)
CREATE POLICY "Public can view PDF menus"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'restaurant-assets' 
    AND (storage.foldername(name))[2] = 'pdf-menu'
  );

-- Allow restaurant owners to update their PDF menus
CREATE POLICY "Restaurant owners can update their PDF menus"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'restaurant-assets' 
    AND EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id::text = (storage.foldername(name))[1]
      AND restaurants.user_id = auth.uid()
    )
    AND (storage.foldername(name))[2] = 'pdf-menu'
  );

-- Allow restaurant owners to delete their PDF menus
CREATE POLICY "Restaurant owners can delete their PDF menus"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'restaurant-assets' 
    AND EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id::text = (storage.foldername(name))[1]
      AND restaurants.user_id = auth.uid()
    )
    AND (storage.foldername(name))[2] = 'pdf-menu'
  );
