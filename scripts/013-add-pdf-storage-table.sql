-- Create a table to store PDF data as blobs
CREATE TABLE IF NOT EXISTS pdf_menus (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  pdf_data BYTEA NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT DEFAULT 'application/pdf',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_pdf_menus_restaurant_id ON pdf_menus(restaurant_id);

-- Add RLS policies
ALTER TABLE pdf_menus ENABLE ROW LEVEL SECURITY;

-- Allow restaurant owners to insert their own PDF menus
CREATE POLICY "Restaurant owners can insert PDF menus"
  ON pdf_menus FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = restaurant_id 
      AND restaurants.user_id = auth.uid()
    )
  );

-- Allow restaurant owners to view their own PDF menus
CREATE POLICY "Restaurant owners can view their PDF menus"
  ON pdf_menus FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = restaurant_id 
      AND restaurants.user_id = auth.uid()
    )
  );

-- Allow public access to PDF menus (for public menu display)
CREATE POLICY "Public can view PDF menus"
  ON pdf_menus FOR SELECT
  USING (true);

-- Allow restaurant owners to update their PDF menus
CREATE POLICY "Restaurant owners can update their PDF menus"
  ON pdf_menus FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = restaurant_id 
      AND restaurants.user_id = auth.uid()
    )
  );

-- Allow restaurant owners to delete their PDF menus
CREATE POLICY "Restaurant owners can delete their PDF menus"
  ON pdf_menus FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = restaurant_id 
      AND restaurants.user_id = auth.uid()
    )
  );

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pdf_menus_updated_at 
  BEFORE UPDATE ON pdf_menus 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
