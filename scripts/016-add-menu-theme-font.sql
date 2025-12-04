-- Add menu theme and font customization to restaurants table
-- This script adds columns for menu color theme and font selection

-- Add menu_theme column to restaurants table
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS menu_theme VARCHAR(50) DEFAULT 'default' CHECK (menu_theme IN ('default', 'dark', 'minimal', 'warm', 'cool', 'elegant', 'bold'));

-- Add menu_font column to restaurants table
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS menu_font VARCHAR(50) DEFAULT 'inter' CHECK (menu_font IN ('inter', 'roboto', 'playfair', 'montserrat', 'lora', 'opensans', 'raleway', 'fredoka', 'comfortaa', 'quicksand', 'nunito', 'poppins', 'dancingscript', 'pacifico', 'caveat', 'kalam', 'permanentmarker'));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_restaurants_menu_theme ON restaurants(menu_theme);
CREATE INDEX IF NOT EXISTS idx_restaurants_menu_font ON restaurants(menu_font);

-- Update existing restaurants to have default theme and font
UPDATE restaurants SET menu_theme = 'default' WHERE menu_theme IS NULL;
UPDATE restaurants SET menu_font = 'inter' WHERE menu_font IS NULL;

