-- Add menu layout customization to restaurants table
-- This script adds a menu_layout column to allow users to choose different menu display layouts

-- Add menu_layout column to restaurants table
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS menu_layout VARCHAR(20) DEFAULT 'grid' CHECK (menu_layout IN ('grid', 'list'));

-- Create index for menu_layout for better query performance
CREATE INDEX IF NOT EXISTS idx_restaurants_menu_layout ON restaurants(menu_layout);

-- Update existing restaurants to have 'grid' layout by default
UPDATE restaurants SET menu_layout = 'grid' WHERE menu_layout IS NULL;

-- Update any existing restaurants with 'compact' or 'masonry' to 'grid'
UPDATE restaurants SET menu_layout = 'grid' WHERE menu_layout IN ('compact', 'masonry');

