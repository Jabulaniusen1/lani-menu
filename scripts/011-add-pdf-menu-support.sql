-- Add PDF menu support to restaurants table
-- This script adds fields to support PDF menu uploads and display

-- Add PDF menu fields to restaurants table
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS pdf_menu_url TEXT,
ADD COLUMN IF NOT EXISTS menu_type VARCHAR(20) DEFAULT 'items' CHECK (menu_type IN ('items', 'pdf'));

-- Create index for menu_type for better query performance
CREATE INDEX IF NOT EXISTS idx_restaurants_menu_type ON restaurants(menu_type);

-- Update existing restaurants to have menu_type 'items' by default
UPDATE restaurants SET menu_type = 'items' WHERE menu_type IS NULL;
